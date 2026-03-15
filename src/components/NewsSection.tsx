import { useState, useEffect } from "react";
import { Tag, CalendarDays, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

// Fallback static data shown while loading or on error
const FALLBACK_PROMOS: NewsItem[] = [
  { id: -1, type: "promo", badge: "Акція", title: "Знижка 20% на професійну чистку", desc: "Запишіться на комплексну гігієну (ультразвук + полірування) та отримайте знижку 20% на процедуру.", date: "До 31 березня 2026", hot: 1 },
  { id: -2, type: "promo", badge: "Акція", title: "Відбілювання зубів — 20% знижка", desc: "Отримайте сяючу посмішку зі знижкою 20% на процедуру відбілювання Zoom4 у березні–квітні.", date: "Березень — Квітень 2026", hot: 0 },
];

const FALLBACK_NEWS: NewsItem[] = [
  { id: -3, type: "news", badge: "Новини", title: "Нові імплантаційні системи преміум-класу", desc: "У клініці з'явилися нові імплантаційні системи від провідних світових виробників з приживлюваністю 98%.", date: "Січень 2026", hot: 0 },
  { id: -4, type: "news", badge: "Інформація", title: "Чому важливо регулярно відвідувати стоматолога", desc: "Регулярні профілактичні огляди допомагають уникнути серйозних стоматологічних проблем.", date: "Січень 2026", hot: 0 },
];

function NewsCard({ item }: { item: NewsItem }) {
  const isHot = item.hot === 1;
  const isPromo = item.type === "promo";
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

export default function NewsSection() {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState<NewsItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/news`)
      .then(r => r.json())
      .then((data: NewsItem[]) => { setAllItems(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  // Latest 2 promos: newest = left (index 0), second newest = right (index 1)
  const promos = allItems.filter(i => i.type === "promo").slice(0, 2);
  const displayPromos = promos.length >= 2 ? promos : FALLBACK_PROMOS;

  // Latest 2 non-promo news: newest = left, second newest = right
  const news = allItems.filter(i => i.type !== "promo").slice(0, 2);
  const displayNews = news.length >= 2 ? news : news.length === 1 ? [news[0], FALLBACK_NEWS[1]] : FALLBACK_NEWS;

  const SkeletonCard = () => (
    <div className="bg-card rounded-2xl border border-border h-52 animate-pulse" />
  );

  return (
    <section id="news" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Актуальне</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary gold-line-center">
            Новини та пропозиції
          </h2>
        </div>

        {!loaded ? (
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Row 1: 2 latest promos */}
            <div className="grid sm:grid-cols-2 gap-6">
              {displayPromos.map(item => <NewsCard key={item.id} item={item} />)}
            </div>
            {/* Row 2: 2 latest news */}
            <div className="grid sm:grid-cols-2 gap-6">
              {displayNews.map(item => <NewsCard key={item.id} item={item} />)}
            </div>
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-navy hover:text-gold transition-colors duration-200 group"
          >
            <span>Всі новини та статті</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </section>
  );
}
