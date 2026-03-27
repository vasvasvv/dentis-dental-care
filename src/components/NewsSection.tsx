import { useState, useEffect, useRef } from "react";
import { Tag, CalendarDays, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPublicNews, type PublicNewsItem } from "@/lib/publicApi";
import { useLang } from "@/contexts/LanguageContext";

type NewsItem = {
  id: number;
  type: string;
  badge: string;
  title: string;
  desc: string;
  date: string;
  hot: number;
};

const FALLBACK_PROMOS_UK: NewsItem[] = [
  { id: -1, type: "promo", badge: "Акція", title: "Знижка 20% на професійну чистку", desc: "Запишіться на комплексну гігієну (ультразвук + полірування) та отримайте знижку 20% на процедуру.", date: "До 31 березня 2026", hot: 1 },
  { id: -2, type: "promo", badge: "Акція", title: "Відбілювання зубів — 20% знижка", desc: "Отримайте сяючу посмішку зі знижкою 20% на процедуру відбілювання Zoom4 у березні–квітні.", date: "Березень — Квітень 2026", hot: 0 },
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

function formatPublicDate(item: PublicNewsItem) {
  if (item.expires_on) return item.expires_on;
  if (item.published_at) return item.published_at.slice(0, 10);
  return "";
}

function toNewsItem(item: PublicNewsItem): NewsItem {
  const fallbackBadge = item.kind === "promo" ? "Deal" : "News";
  return {
    id: item.id,
    type: item.kind,
    badge: item.label?.trim() || fallbackBadge,
    title: item.title,
    desc: item.description,
    date: formatPublicDate(item),
    hot: Number(item.is_hot),
  };
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

  const contentRef = useRef<HTMLParagraphElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (!contentRef.current) return;
    const element = contentRef.current;
    const style = window.getComputedStyle(element);
    const lineHeight = parseFloat(style.lineHeight);
    const collapsedHeight = lineHeight * 3;
    setHeight(isOpen ? element.scrollHeight + "px" : collapsedHeight + "px");
  }, [isOpen, item.desc]);

  return (
    <div
      className={`bg-card rounded-2xl border overflow-hidden shadow-card-custom transition-all duration-300 flex flex-col ${
        isHot ? "border-gold/40" : "border-border"
      }`}
    >
      {isHot && (
        <div className="gradient-gold px-5 py-2 flex items-center gap-2">
          <Tag size={13} className="text-accent-foreground" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            {t("news.hot")}
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <span
          className={`inline-block text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full mb-4 ${
            isPromo ? "bg-gold/15 text-gold" : "bg-navy/8 text-custom-dark"
          }`}
        >
          {item.badge}
        </span>

        <h3 className="font-bold text-xl mb-3">{item.title}</h3>

        <div style={{ height }} className="overflow-hidden transition-all duration-300 ease-in-out">
          <p ref={contentRef} className="text-sm text-muted-foreground leading-relaxed">
            {item.desc}
          </p>
        </div>

        <button onClick={onToggle} className="mt-3 text-xs text-gold font-semibold text-left hover:underline">
          {isOpen ? t("news.collapse") : t("news.readmore")}
        </button>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-4">
          <CalendarDays size={13} />
          <span>{item.date}</span>
        </div>
      </div>
    </div>
  );
}

export default function NewsSection() {
  const navigate = useNavigate();
  const { lang, t } = useLang();
  const [allItems, setAllItems] = useState<NewsItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    getPublicNews()
      .then((data) => {
        setAllItems(data.map(toNewsItem));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const FALLBACK_PROMOS = lang === "uk" ? FALLBACK_PROMOS_UK : FALLBACK_PROMOS_EN;
  const FALLBACK_NEWS = lang === "uk" ? FALLBACK_NEWS_UK : FALLBACK_NEWS_EN;

  const promos = allItems.filter((item) => item.type === "promo").slice(0, 2);
  const displayPromos = promos.length >= 2 ? promos : FALLBACK_PROMOS;

  const news = allItems.filter((item) => item.type !== "promo").slice(0, 2);
  const displayNews = news.length >= 2 ? news : news.length === 1 ? [news[0], FALLBACK_NEWS[1]] : FALLBACK_NEWS;

  const SkeletonCard = () => (
    <div className="bg-card rounded-2xl border border-border h-52 animate-pulse" />
  );

  const handleToggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="news" className="section-block site-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">{t("news.label")}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary gold-line-center">
            {t("news.h2")}
          </h2>
        </div>

        {!loaded ? (
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {displayPromos.map((item) => (
                <NewsCard key={item.id} item={item} isOpen={openId === item.id} onToggle={() => handleToggle(item.id)} />
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {displayNews.map((item) => (
                <NewsCard key={item.id} item={item} isOpen={openId === item.id} onToggle={() => handleToggle(item.id)} />
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 bg-gold border-gold-light/80 text-secondary hover:border hover:border-navy px-8 py-4 rounded-full transition-all duration-200 group"
          >
            <span>{t("news.allblog")}</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </section>
  );
}
