import { useEffect, useRef, useState } from "react";
import { BookOpen, CalendarDays, CheckCircle, Download, Phone, Tag } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageSeo from "@/components/SEO/PageSeo";
import Schema from "@/components/SEO/Schema";
import { useLang } from "@/contexts/LanguageContext";
import heroVideo from "@/assets/hero-video.mp4";
import { getPublicNews, type PublicNewsItem } from "@/lib/publicApi";
import { buildCanonical } from "@/utils/seo";

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

const STATIC_PROMOS_UK: NewsItem[] = [
  {
    id: -1,
    type: "promo",
    badge: "Акція",
    title: "Знижка 20% на професійну чистку зубів",
    desc: "Комплексна професійна гігієна у Кропивницькому зі зняттям каменю, Air Flow та поліруванням за акційною ціною.",
    date: "До 31 травня 2026",
    hot: 1,
  },
  {
    id: -2,
    type: "promo",
    badge: "Акція",
    title: "Відбілювання зубів Zoom зі знижкою",
    desc: "Безпечне клінічне відбілювання зубів у Кропивницькому з підбором відтінку та рекомендаціями по догляду.",
    date: "Квітень 2026",
    hot: 0,
  },
];

const STATIC_PROMOS_EN: NewsItem[] = [
  {
    id: -1,
    type: "promo",
    badge: "Deal",
    title: "20% off professional dental cleaning",
    desc: "Comprehensive hygiene in Kropyvnytskyi with tartar removal, Air Flow and polishing at a promotional price.",
    date: "Until 31 May 2026",
    hot: 1,
  },
  {
    id: -2,
    type: "promo",
    badge: "Deal",
    title: "Zoom teeth whitening special",
    desc: "Safe in-clinic whitening in Kropyvnytskyi with shade matching and aftercare recommendations.",
    date: "April 2026",
    hot: 0,
  },
];

const HYGIENE_GUIDE = {
  uk: {
    headline: "Як доглядати за зубами щодня: поради стоматолога у Кропивницькому",
    description:
      "Короткий гід від стоматології Дентіс: як чистити зуби, коли використовувати нитку та як часто проходити професійну гігієну.",
    bullets: [
      "Чистіть зуби двічі на день по 2 хвилини м’якою щіткою.",
      "Використовуйте зубну нитку або іригатор щодня.",
      "Записуйтесь на професійну гігієну раз на 6 місяців.",
    ],
  },
  en: {
    headline: "How to care for your teeth every day: dentist tips in Kropyvnytskyi",
    description:
      "A concise Dentis guide on brushing, flossing and scheduling professional hygiene to keep your smile healthy.",
    bullets: [
      "Brush twice daily for 2 minutes with a soft toothbrush.",
      "Use floss or a water flosser every day.",
      "Book professional hygiene every 6 months.",
    ],
  },
};

function BlogCard({ item }: { item: NewsItem }) {
  const { t } = useLang();
  const isPromo = item.type === "promo";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card-custom">
      {item.hot === 1 && (
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
          <Tag size={12} />
          {t("news.hot")}
        </div>
      )}

      <span className={`mb-4 inline-block w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${isPromo ? "bg-gold/15 text-gold" : "bg-navy/8 text-custom-dark"}`}>
        {item.badge}
      </span>
      <h3 className="mb-3 font-display text-xl font-bold text-custom-dark">{item.title}</h3>
      <p className="mb-5 flex-1 font-body text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
      <div className="mt-auto flex items-center gap-2 font-body text-xs text-muted-foreground">
        <CalendarDays size={13} />
        <span>{item.date}</span>
      </div>
    </article>
  );
}

export default function Blog() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allItems, setAllItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang, localizePath, t } = useLang();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});
    video.playbackRate = 0.6;
  }, []);

  useEffect(() => {
    getPublicNews()
      .then((data) => {
        setAllItems(data.map(mapPublicNewsItem));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const copy = HYGIENE_GUIDE[lang];
  const staticPromos = lang === "uk" ? STATIC_PROMOS_UK : STATIC_PROMOS_EN;
  const promos = allItems.filter((item) => item.type === "promo");
  const news = allItems.filter((item) => item.type !== "promo");
  const displayPromos = promos.length > 0 ? promos : staticPromos;

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path="/blog"
        title={{
          uk: "Блог стоматології у Кропивницькому | Поради, акції — Дентіс",
          en: "Dental blog in Kropyvnytskyi | Tips, offers — Dentis",
        }}
        description={{
          uk: "Блог стоматології Дентіс: поради стоматолога, новини клініки, акції на лікування зубів та професійну гігієну у Кропивницькому.",
          en: "Dentis blog with dentist tips, clinic updates and offers for dental treatment and hygiene in Kropyvnytskyi.",
        }}
        type="article"
      />
      <Schema
        type="Article"
        lang={lang}
        data={{
          headline: copy.headline,
          description: copy.description,
          url: buildCanonical("/blog", lang),
          datePublished: "2026-04-03",
          dateModified: "2026-04-03",
          authorName: lang === "uk" ? "Команда Dentis" : "Dentis team",
        }}
      />

      <Header />

      <section className="relative overflow-hidden pb-24 pt-36">
        <div className="fixed inset-0 -z-10">
          <video ref={videoRef} src={heroVideo} autoPlay muted loop playsInline preload="none" poster="/hero-poster.webp" className="h-full w-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-70" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <p className="mb-4 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{t("blog.hero.label")}</p>
          <h1 className="mb-6 max-w-3xl font-display text-5xl font-bold leading-tight text-secondary md:text-6xl">{t("blog.hero.h1")}</h1>
          <p className="max-w-2xl font-body text-lg leading-relaxed text-primary-foreground/70">{t("blog.hero.desc")}</p>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{t("news.label")}</p>
            <h2 className="font-display text-4xl font-bold text-navy gold-line-center md:text-5xl">{t("blog.promos.h2")}</h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {displayPromos.map((item) => (
              <BlogCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{t("news.label")}</p>
            <h2 className="font-display text-4xl font-bold text-secondary gold-line-center md:text-5xl">{t("blog.news.h2")}</h2>
          </div>

          {loading ? (
            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-56 rounded-2xl border border-border bg-card animate-pulse" />
              ))}
            </div>
          ) : news.length === 0 ? (
            <p className="py-12 text-center font-body text-muted-foreground">{t("blog.no_news")}</p>
          ) : (
            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <BlogCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
            <div>
              <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{t("blog.hygiene.h2")}</p>
              <h2 className="mb-5 font-display text-4xl font-bold text-navy md:text-5xl">{copy.headline}</h2>
              <p className="mb-8 font-body text-base leading-relaxed text-muted-foreground">{copy.description}</p>
              <div className="space-y-3">
                {copy.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3">
                    <CheckCircle size={18} className="mt-0.5 shrink-0 text-gold" />
                    <p className="font-body text-sm leading-7 text-foreground/80">{bullet}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/oral-care-guide.pdf"
                  download="Dentis-oral-care-guide.pdf"
                  className="inline-flex items-center gap-3 rounded-full gradient-gold px-7 py-3.5 font-body text-sm font-medium text-accent-foreground shadow-gold-custom transition-all duration-200 hover:scale-105"
                >
                  <Download size={16} />
                  {t("blog.hygiene.download")}
                </a>
                <a
                  href={localizePath("/contacts")}
                  className="inline-flex items-center gap-3 rounded-full border border-gold/50 px-7 py-3.5 font-body text-sm font-medium text-gold transition-all duration-200 hover:bg-gold/10"
                >
                  <BookOpen size={16} />
                  {lang === "uk" ? "Записатися на гігієну" : "Book hygiene visit"}
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-navy p-8 shadow-card-custom">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gold/10 blur-2xl" />
              <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-gold/10 blur-2xl" />
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-gold">
                    <BookOpen size={18} className="text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-display text-base font-bold text-secondary">{t("blog.hygiene.h2")}</p>
                    <p className="font-body text-xs text-primary-foreground/50">PDF</p>
                  </div>
                </div>
                <p className="mb-6 font-body text-sm leading-7 text-primary-foreground/80">{copy.description}</p>
                <a href="tel:+380504800825" className="inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 font-body text-sm font-semibold text-navy transition-opacity hover:opacity-90">
                  <Phone size={16} />
                  +38 050 480 08 25
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary">
        <Footer />
      </section>

      <a
        href="tel:+380504800825"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-gold text-accent-foreground shadow-gold-custom transition-transform duration-200 hover:scale-110 md:hidden"
        aria-label="Call Dentis"
      >
        <Phone size={22} />
      </a>
    </div>
  );
}
