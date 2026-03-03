import { Tag, CalendarDays } from "lucide-react";

const news = [
     {
    type: "promo",
    badge: "Акція",
    title: "Знижка 15% на професійну чистку",
    desc: "Запишіться на комплексну гігієну (ультразвук + полірування) та отримайте знижку 20% на процедуру.",
    date: "До 31 березня 2026",
    hot: true,
  },
  {
    type: "promo",
    badge: "Акція",
    title: "Відбілювання зубів — 20% знижка",
    desc: "Отримайте сяючу посмішку зі знижкою 20% на процедуру відбілювання Zoom4 у березні–квітні.",
    date: "Березень — Квітень 2026",
    hot: false,
  },

  {
    type: "news",
    badge: "Новини",
    title: "Нові імплантаційні системи преміум-класу",
    desc: "У клініці зʼявилися нові імплантаційні системи від провідних світових виробників. Вони забезпечують високу приживлюваність, надійність та природний естетичний результат навіть у складних клінічних випадках.",
    date: "Січень 2025",
    hot: false,
  },
];

export default function NewsSection() {
  return (
    <section id="news" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Актуальне</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary gold-line-center">
            Новини та пропозиції
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {news.map((item) => (
            <div
              key={item.title}
              className={`bg-card rounded-2xl border overflow-hidden shadow-card-custom hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${
                item.hot ? "border-gold/40" : "border-border"
              }`}
            >
              {item.hot && (
                <div className="gradient-gold px-5 py-2 flex items-center gap-2">
                  <Tag size={13} className="text-accent-foreground" />
                  <span className="font-body text-xs text-accent-foreground font-semibold tracking-widest uppercase">Гаряча пропозиція</span>
                </div>
              )}
              <div className="p-6">
                <span
                  className={`inline-block font-body text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded-full mb-4 ${
                    item.type === "promo"
                      ? "bg-gold/15 text-gold"
                        : "bg-navy/8 text-custom-dark"
                  }`}
                >
                  {item.badge}
                </span>
                  <h3 className="font-display font-bold text-custom-dark text-xl mb-3">{item.title}</h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">{item.desc}</p>
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-body">
                  <CalendarDays size={13} />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
