import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Phone, Tag, CalendarDays, Download, BookOpen, CheckCircle } from "lucide-react";
import heroVideo from "@/assets/hero-video.mp4";

const API = import.meta.env.VITE_API_URL ?? "https://dentis-site-api.nesterenkovasil9.workers.dev";

type NewsItem = {
  id: number;
  type: string;
  badge: string;
  title: string;
  desc: string;
  date: string;
  hot: number;
};

const STATIC_PROMOS = [
  { id: -1, type: "promo", badge: "Акція", title: "Знижка 20% на професійну чистку", desc: "Запишіться на комплексну гігієну (ультразвук + полірування) та отримайте знижку 20% на процедуру.", date: "До 31 березня 2026", hot: 1 },
  { id: -2, type: "promo", badge: "Акція", title: "Відбілювання зубів — 20% знижка", desc: "Отримайте сяючу посмішку зі знижкою 20% на процедуру відбілювання Zoom4 у березні–квітні.", date: "Березень — Квітень 2026", hot: 0 },
];

const hygieneSteps = [
  { icon: "🪥", title: "Чистіть зуби двічі на день", desc: "Мінімум 2 хвилини — вранці після сніданку та ввечері перед сном. М'яка щітина, рухи від ясен до краю зуба." },
  { icon: "🦷", title: "Використовуйте зубну нитку", desc: "Щодня, бажано ввечері. Очищає міжзубні проміжки, де щітка не дістається." },
  { icon: "💧", title: "Іригатор — щодня", desc: "Чудово доповнює нитку. Незамінний при брекетах, коронках та імплантах." },
  { icon: "🍎", title: "Харчування", desc: "Обмежуйте цукор і кислі напої. Після їжі — ополоскуйте рот водою." },
  { icon: "🚫", title: "Без куріння", desc: "Нікотин руйнує ясна, фарбує зуби і знижує приживлюваність імплантів." },
  { icon: "📅", title: "Огляд кожні 6 місяців", desc: "Регулярна профілактика — найефективніший спосіб уникнути серйозного лікування." },
];

function BlogCard({ item, isPromo = false }: { item: NewsItem; isPromo?: boolean }) {
  const isHot = item.hot === 1 || item.hot as unknown as boolean === true;
  return (
    <div className={`bg-card rounded-2xl border overflow-hidden shadow-card-custom hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${isHot ? "border-gold/40" : "border-border"}`}>
      {isHot && (
        <div className="gradient-gold px-5 py-2 flex items-center gap-2 flex-shrink-0">
          <Tag size={13} className="text-accent-foreground" />
          <span className="font-body text-xs text-accent-foreground font-semibold tracking-widest uppercase">Гаряча пропозиція</span>
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

  useEffect(() => {
    const video = videoRef.current;
    if (video) { video.play().catch(() => {}); video.playbackRate = 0.6; }
  }, []);

  useEffect(() => {
    fetch(`${API}/api/news`)
      .then(r => r.json())
      .then((data: NewsItem[]) => { setAllItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Promos from API (newest first), fallback to static
  const apiPromos = allItems.filter(i => i.type === "promo");
  const displayPromos: NewsItem[] = apiPromos.length > 0 ? apiPromos : STATIC_PROMOS as NewsItem[];

  // News only (not promo), newest first, all of them
  const newsOnly = allItems.filter(i => i.type !== "promo");

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Блог та новини — Дентіс Кропивницький</title>
        <meta name="description" content="Корисні статті про стоматологію, акції та новини клініки Дентіс у Кропивницькому. Поради щодо догляду за зубами від наших лікарів." />
        <link rel="canonical" href="https://dentis.kr.ua/blog" />
        <meta property="og:title" content="Блог та новини — Дентіс Кропивницький" />
        <meta property="og:description" content="Корисні статті, акції та новини стоматологічної клініки Дентіс." />
        <meta property="og:url" content="https://dentis.kr.ua/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://dentis.kr.ua/og-image.jpg" />
      </Helmet>

      <Header />

      {/* ── Hero ── */}
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
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-4">Дентіс</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-secondary leading-tight mb-6 max-w-2xl">
            Блог та новини
          </h1>
          <p className="font-body text-primary-foreground/70 text-lg leading-relaxed max-w-xl">
            Корисні статті про стоматологію, актуальні акції та новини клініки. Дбаємо про ваше здоров'я і інформуємо про найкраще.
          </p>
        </div>
      </section>

      {/* ── Promos ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Зараз</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary gold-line-center">
              Акції та пропозиції
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {displayPromos.map(item => (
              <BlogCard key={item.id} item={item} isPromo />
            ))}
          </div>
        </div>
      </section>

      {/* ── News (no promo, all, 3 columns, grows) ── */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Актуальне</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary gold-line-center">
              Новини клініки
            </h2>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card rounded-2xl border border-border h-56 animate-pulse" />
              ))}
            </div>
          ) : newsOnly.length === 0 ? (
            <p className="text-center text-muted-foreground font-body py-12">Новин поки немає</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {newsOnly.map(item => (
                <BlogCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Oral Care Guide ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-14">
              <div>
                <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Корисно знати</p>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-5 leading-tight">
                  Пам'ятка з догляду за порожниною рота
                </h2>
                <p className="font-body text-muted-foreground text-base leading-relaxed mb-8">
                  Прості правила щоденної гігієни, які допоможуть зберегти здоров'я зубів і ясен на роки. Складено лікарями клініки Дентіс.
                </p>
                <a
                  href="/oral-care-guide.pdf"
                  download="Dentis-oral-care-guide.pdf"
                  className="inline-flex items-center gap-3 gradient-gold text-accent-foreground px-7 py-3.5 rounded-full font-body font-medium text-sm shadow-gold-custom hover:scale-105 transition-all duration-200"
                >
                  <Download size={16} />
                  Завантажити PDF-пам'ятку
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
                      <p className="font-display font-bold text-secondary text-base">Пам'ятка</p>
                      <p className="font-body text-primary-foreground/50 text-xs">1 сторінка · PDF</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {["Щоденна гігієна порожнини рота", "Харчування та шкідливі звички", "Графік профілактичних оглядів"].map(point => (
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
