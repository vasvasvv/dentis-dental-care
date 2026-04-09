import { useEffect, useState } from "react";
import { Tag, CalendarDays, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPublicNews, type PublicNewsItem } from "@/lib/publicApi";
import { useLang } from "@/contexts/LanguageContext";
import SectionReveal from "@/components/SectionReveal";
import { Badge } from "@/components/ui/badge";

type NewsItem = {
  id: number;
  type: "promo" | "news";
  badge: string;
  title: string;
  desc: string;
  date: string;
  hot: number;
};

const FALLBACK_PROMOS_UK: NewsItem[] = [
  { id: -1, type: "promo", badge: "Акція", title: "Знижка 20% на професійну чистку", desc: "Запишіться на комплексну гігієну (ультразвук + полірування) та отримайте знижку 20% на процедуру.", date: "До 31 березня 2026", hot: 1 },
  { id: -2, type: "promo", badge: "Акція", title: "Відбілювання зубів — 20% знижка", desc: "Отримайте сяючу посмішку зі знижкою 20% на процедуру відбілювання Zoom4 у березні–квітні.", date: "Березень — квітень 2026", hot: 0 },
];

const FALLBACK_PROMOS_EN: NewsItem[] = [
  { id: -1, type: "promo", badge: "Deal", title: "20% off professional cleaning", desc: "Book a comprehensive hygiene appointment (ultrasound + polishing) and get 20% off the procedure.", date: "Until 31 March 2026", hot: 1 },
  { id: -2, type: "promo", badge: "Deal", title: "Teeth whitening — 20% off", desc: "Get a radiant smile with 20% off the Zoom4 whitening procedure in March–April.", date: "March — April 2026", hot: 0 },
];

const FALLBACK_NEWS_UK: NewsItem[] = [
  { id: -3, type: "news", badge: "Новини", title: "Нові імплантаційні системи преміум-класу", desc: "У клініці з'явилися нові імплантаційні системи від провідних світових виробників з приживлюваністю 98%.", date: "Січень 2026", hot: 0 },
  { id: -4, type: "news", badge: "Інформація", title: "Чому важливо регулярно відвідувати стоматолога", desc: "Регулярні профілактичні огляди допомагають уникнути серйозних стоматологічних проблем.", date: "Січень 2026", hot: 0 },
];

const FALLBACK_NEWS_EN: NewsItem[] = [
  { id: -3, type: "news", badge: "News", title: "New premium-class implant systems", desc: "The clinic now offers new implant systems from world-leading manufacturers with a 98% osseointegration rate.", date: "January 2026", hot: 0 },
  { id: -4, type: "news", badge: "Info", title: "Why regular dental check-ups matter", desc: "Regular preventive check-ups help you avoid serious dental problems before they start.", date: "January 2026", hot: 0 },
];

function formatApiDate(value: string | null, locale: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatPublicDate(item: PublicNewsItem, lang: "uk" | "en") {
  const locale = lang === "uk" ? "uk-UA" : "en-US";
  return formatApiDate(item.expires_on ?? item.published_at, locale);
}

function toNewsItem(item: PublicNewsItem, lang: "uk" | "en"): NewsItem {
  const fallbackBadge =
    item.kind === "promo"
      ? lang === "uk"
        ? "Акція"
        : "Deal"
      : lang === "uk"
        ? "Новини"
        : "News";

  return {
    id: item.id,
    type: item.kind,
    badge: item.label?.trim() || fallbackBadge,
    title: item.title.trim(),
    desc: item.description.trim(),
    date: formatPublicDate(item, lang),
    hot: Number(item.is_hot),
  };
}

function fillWithFallback(items: NewsItem[], fallback: NewsItem[], limit: number) {
  const normalized = items.slice(0, limit);

  if (normalized.length >= limit) {
    return normalized;
  }

  const usedIds = new Set(normalized.map((item) => item.id));
  const missing = fallback.filter((item) => !usedIds.has(item.id)).slice(0, limit - normalized.length);
  return [...normalized, ...missing];
}

function normalizeNews(items: PublicNewsItem[], lang: "uk" | "en") {
  return items.map((item) => toNewsItem(item, lang));
}

function NewsCard({
  item,
  isOpen,
  onToggle,
}: {
  item: NewsItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const isHot = item.hot === 1;
  const isPromo = item.type === "promo";
  const { t } = useLang();

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-card-custom transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isHot ? "border-gold/40" : "border-border"
      }`}
    >
      {isHot && (
        <div className="gradient-gold flex items-center gap-2 px-5 py-2">
          <Tag size={13} className="text-accent-foreground" />
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-accent-foreground">
            {t("news.hot")}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <Badge
          variant="outline"
          className={`mb-4 w-fit rounded-full px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.2em] shadow-none ${
            isPromo ? "border-gold bg-gold/10 text-gold" : "border-navy/20 bg-secondary text-navy"
          }`}
        >
          {item.badge}
        </Badge>

        <h3 className="mb-3 font-display text-xl font-bold text-custom-dark">{item.title}</h3>

        <p
          className="font-body text-sm leading-relaxed text-muted-foreground"
          style={
            isOpen
              ? undefined
              : {
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                  overflow: "hidden",
                }
          }
        >
          {item.desc}
        </p>

        {item.desc.length > 140 && (
          <button
            type="button"
            onClick={onToggle}
            className="mt-3 w-fit font-body text-xs font-semibold text-gold transition-colors hover:text-gold-dark hover:underline"
          >
            {isOpen ? t("news.collapse") : t("news.readmore")}
          </button>
        )}

        <div className="mt-auto flex items-center gap-2 pt-4 font-body text-xs text-muted-foreground">
          <CalendarDays size={13} />
          <span>{item.date}</span>
        </div>
      </div>
    </article>
  );
}

export default function NewsSection() {
  const navigate = useNavigate();
  const { lang, localizePath, t } = useLang();
  const [allItems, setAllItems] = useState<NewsItem[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    getPublicNews()
      .then((data) => {
        if (cancelled) return;
        setAllItems(normalizeNews(data, lang));
      })
      .catch(() => {
        if (cancelled) return;
        setAllItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  const fallbackPromos = lang === "uk" ? FALLBACK_PROMOS_UK : FALLBACK_PROMOS_EN;
  const fallbackNews = lang === "uk" ? FALLBACK_NEWS_UK : FALLBACK_NEWS_EN;

  const promos = allItems.filter((item) => item.type === "promo");
  const news = allItems.filter((item) => item.type === "news");
  const displayPromos = fillWithFallback(promos, fallbackPromos, 2);
  const displayNews = fillWithFallback(news, fallbackNews, 2);

  const handleToggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="news" className="section-block site-section">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <p className="mb-3 font-body text-sm tracking-[0.3em] uppercase text-gold">{t("news.label")}</p>
          <h2 className="font-display text-4xl font-bold text-secondary gold-line-center md:text-5xl">
            {t("news.h2")}
          </h2>
        </div>

        <div className="mx-auto max-w-5xl space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {displayPromos.map((item) => (
              <SectionReveal key={item.id}>
                <NewsCard
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => handleToggle(item.id)}
                />
              </SectionReveal>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {displayNews.map((item) => (
              <SectionReveal key={item.id}>
                <NewsCard
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => handleToggle(item.id)}
                />
              </SectionReveal>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => navigate(localizePath("/blog"))}
            className="group inline-flex items-center gap-2 rounded-full border-gold-light/80 bg-gold px-8 py-4 font-body text-secondary transition-all duration-200 hover:border hover:border-navy"
          >
            <span>{t("news.allblog")}</span>
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
