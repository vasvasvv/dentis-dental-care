import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Phone, Tag, CalendarDays, Download, BookOpen, CheckCircle } from "lucide-react";
import heroVideo from "@/assets/hero-video.mp4";
import { useLang } from "@/contexts/LanguageContext";
import { getPublicNews, type PublicNewsItem } from "@/lib/publicApi";

type NewsItem = {
  id: number;
  type: string;
  badge: string;
  title: string;
  desc: string;
  date: string;
  hot: number;
};

function mapPublicNewsItem(item: PublicNewsItem): NewsItem {
  return {
    id: item.id,
    type: item.kind,
    badge: item.label?.trim() || (item.kind === "promo" ? "Deal" : "News"),
    title: item.title,
    desc: item.description,
    date: item.expires_on || item.published_at?.slice(0, 10) || "",
    hot: Number(item.is_hot),
  };
}

const STATIC_PROMOS_UK = [
  { id: -1, type: "promo", badge: "Акція", title: "Знижка 20% на професійну чистку", desc: "Запишіться на комплексну гігієну (ультразвук + полірування) та отримайте знижку 20% на процедуру.", date: "До 31 березня 2026", hot: 1 },
  { id: -2, type: "promo", badge: "Акція", title: "Відбілювання зубів — 20% знижка", desc: "Отримайте сяючу посмішку зі знижкою 20% на процедуру відбілювання Zoom4 у березні–квітні.", date: "Березень — Квітень 2026", hot: 0 },
];
const STATIC_PROMOS_EN = [
  { id: -1, type: "promo", badge: "Deal", title: "20% off professional cleaning", desc: "Book a comprehensive hygiene appointment (ultrasound + polishing) and get 20% off the procedure.", date: "Until 31 March 2026", hot: 1 },
  { id: -2, type: "promo", badge: "Deal", title: "Teeth whitening — 20% off", desc: "Get a radiant smile with 20% off the Zoom4 whitening procedure in March–April.", date: "March — April 2026", hot: 0 },
];

const hygieneStepsUk = [
  { icon: "🪥", title: "Чистіть зуби двічі на день", desc: "Мінімум 2 хвилини — вранці після сніданку та ввечері перед сном. М'яка щітина, рухи від ясен до краю зуба." },
  { icon: "🦷", title: "Використовуйте зубну нитку", desc: "Щодня, бажано ввечері. Очищає міжзубні проміжки, де щітка не дістається." },
  { icon: "💧", title: "Іригатор — щодня", desc: "Чудово доповнює нитку. Незамінний при брекетах, коронках та імплантах." },
  { icon: "🍎", title: "Харчування", desc: "Обмежуйте цукор і кислі напої. Після їжі — ополоскуйте рот водою." },
  { icon: "🚫", title: "Без куріння", desc: "Нікотин руйнує ясна, фарбує зуби і знижує приживлюваність імплантів." },
  { icon: "📅", title: "Огляд кожні 6 місяців", desc: "Регулярна профілактика — найефективніший спосіб уникнути серйозного лікування." },
];
const hygieneStepsEn = [
  { icon: "🪥", title: "Brush twice a day", desc: "At least 2 minutes — morning after breakfast and evening before bed. Soft bristles, brush from gum to tooth edge." },
  { icon: "🦷", title: "Floss daily", desc: "Preferably in the evening. Cleans between teeth where a brush can't reach." },
  { icon: "💧", title: "Use a water flosser daily", desc: "A great complement to floss. Essential with braces, crowns and implants." },
  { icon: "🍎", title: "Diet", desc: "Limit sugar and acidic drinks. After eating — rinse your mouth with water." },
  { icon: "🚫", title: "No smoking", desc: "Nicotine damages gums, stains teeth and reduces implant osseointegration rates." },
  { icon: "📅", title: "Check-up every 6 months", desc: "Regular prevention is the most effective way to avoid serious dental treatment." },
];

function BlogCard({ item, isPromo = false }: { item: NewsItem; isPromo?: boolean }) {
  const isHot = item.hot === 1 || (item.hot as unknown as boolean) === true;
  const { t } = useLang();
  return (
    <div className={`bg-card rounded-2xl border overflow-hidden shadow-card-custom hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${isHot ? "border-gold/40" : "border-border"}`}>
      {isHot && (
        <div className="gradient-gold px-5 py-2 flex items-center gap-2 flex-shrink-0">
          <Tag size={13} className="text-accent-foreground" />
          <span className="font-body text-xs text-accent-foreground font-semibold tracking-widest uppercase">{t("news.hot")}</span>
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <span className={`inline-block font-body text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded-full mb-4 ${isPromo ? "bg-gold/15 text-gold" : "bg-navy/8 text-custom-dark"}`}>
          {item.badge}
        </span>
        <h3 className="font-display font-bold text-custom-dark text-xl mb-3">{item.title}</h3>
        <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{item.desc}</p>
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-body mt-auto">
          <CalendarDays size={13} />
          <span>{item.date}</span>
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allItems, setAllItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLang();

  useEffect(() => {
    const video = videoRef.current;
    if (video) { video.play().catch(() => {}); video.playbackRate = 0.6; }
  }, []);

  useEffect(() => {
    getPublicNews()
      .then((data) => { setAllItems(data.map(mapPublicNewsItem)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const STATIC_PROMOS = lang === "uk" ? STATIC_PROMOS_UK : STATIC_PROMOS_EN;

  const apiPromos = allItems.filter(i => i.type === "promo");
  const displayPromos: NewsItem[] = apiPromos.length > 0 ? apiPromos : STATIC_PROMOS as NewsItem[];
  const newsOnly = allItems.filter(i => i.type !== "promo");
  const hygieneSteps = lang === "uk" ? hygieneStepsUk : hygieneStepsEn;

  const guidePoints = lang === "uk"
    ? ["Щоденна гігієна порожнини рота", "Харчування та шкідливі звички", "Графік профілактичних оглядів"]
    : ["Daily oral hygiene", "Diet and bad habits", "Preventive check-up schedule"];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{lang === "uk" ? "Блог та новини — Дентіс Кропивницький" : "Blog & News — Dentis Kropyvnytskyi"}</title>
        <meta name="description" content={lang === "uk" ? "Корисні статті про стоматологію, акції та новини клініки Дентіс у Кропивницькому." : "Useful dental articles, deals and news from Dentis clinic in Kropyvnytskyi."} />
        <link rel="canonical" href="https://dentis.kr.ua/blog" />
        <meta property="og:title" content={lang === "uk" ? "Блог та новини — Дентіс Кропивницький" : "Blog & News — Dentis Kropyvnytskyi"} />
        <meta property="og:url" content="https://dentis.kr.ua/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://dentis.kr.ua/og-image.jpg" />
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <video ref={videoRef} src={heroVideo} autoPlay muted loop playsInline preload="none" poster="/hero-poster.webp" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-70" />
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-4">{t("blog.hero.label")}</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-secondary leading-tight mb-6 max-w-2xl">
            {t("blog.hero.h1")}
          </h1>
          <p className="font-body text-primary-foreground/70 text-lg leading-relaxed max-w-xl">
            {t("blog.hero.desc")}
          </p>
        </div>
      </section>

      {/* Promos */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">{t("news.label")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy gold-line-center">
              {t("blog.promos.h2")}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {displayPromos.map(item => (
              <BlogCard key={item.id} item={item} isPromo />
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">{t("news.label")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary gold-line-center">
              {t("blog.news.h2")}
            </h2>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card rounded-2xl border border-border h-56 animate-pulse" />
              ))}
            </div>
          ) : newsOnly.length === 0 ? (
            <p className="text-center text-muted-foreground font-body py-12">{t("blog.no_news")}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {newsOnly.map(item => (
                <BlogCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Oral care guide */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-14">
              <div>
                <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">{t("blog.hygiene.desc")}</p>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-navy mb-5 leading-tight">
                  {t("blog.hygiene.h2")}
                </h2>
                <p className="font-body text-muted-foreground text-base leading-relaxed mb-8">
                  {t("blog.hygiene.desc")}
                </p>
                <a
                  href="/oral-care-guide.pdf"
                  download="Dentis-oral-care-guide.pdf"
                  className="inline-flex items-center gap-3 gradient-gold text-accent-foreground px-7 py-3.5 rounded-full font-body font-medium text-sm shadow-gold-custom hover:scale-105 transition-all duration-200"
                >
                  <Download size={16} />
                  {t("blog.hygiene.download")}
                </a>
              </div>

              <div className="bg-navy rounded-2xl p-8 shadow-card-custom relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gold/10 blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gold/10 blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                      <BookOpen size={18} className="text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-secondary text-base">{t("blog.hygiene.h2")}</p>
                      <p className="font-body text-primary-foreground/50 text-xs">1 {lang === "uk" ? "сторінка" : "page"} · PDF</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {guidePoints.map(point => (
                      <li key={point} className="flex items-center gap-3">
                        <CheckCircle size={15} className="text-gold flex-shrink-0" />
                        <span className="font-body text-primary-foreground/80 text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {hygieneSteps.map(step => (
                <div key={step.title} className="bg-card rounded-xl border border-border p-5 hover:border-gold/30 hover:shadow-sm transition-all duration-200">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl mb-4">
                    {step.icon}
                  </div>
                  <h3 className="font-display font-bold text-custom-dark text-base mb-2">{step.title}</h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary">
        <Footer />
      </section>

      <a href="tel:+380504800825" className="fixed bottom-6 right-6 z-50 gradient-gold text-accent-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-gold-custom hover:scale-110 transition-transform duration-200 md:hidden" aria-label="Зателефонувати">
        <Phone size={22} />
      </a>
    </div>
  );
}
