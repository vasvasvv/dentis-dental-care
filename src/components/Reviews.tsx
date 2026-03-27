import { Star } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

type Review = { name: string; rating: number; text: string; service: string; photo: string };

const photos = [
  "https://i.pravatar.cc/120?img=12",
  "https://i.pravatar.cc/120?img=33",
  "https://i.pravatar.cc/120?img=45",
  "https://i.pravatar.cc/120?img=51",
  "https://i.pravatar.cc/120?img=24",
  "https://i.pravatar.cc/120?img=18",
];

const reviewsUk: Omit<Review, "photo">[] = [
  { name: "Ольга К.", rating: 5, text: "Неймовірно задоволена! Нарешті знайшла клініку, де до тебе ставляться як до людини. Олександр Олександрович — справжній професіонал. Рекомендую всім!", service: "Протезування" },
  { name: "Михайло Д.", rating: 5, text: "Робив імплантацію — все пройшло чудово, без болю та ускладнень. Зуб встановлено ідеально. Персонал доброзичливий та уважний. Спасибі команді!", service: "Імплантація" },
  { name: "Тетяна В.", rating: 5, text: "Привела дитину вперше до стоматолога — боялася жахливого стресу. Але лікар знайшла підхід миттєво! Дочка вийшла задоволена і вже сама хоче приходити.", service: "Дитяча стоматологія" },
  { name: "Андрій С.", rating: 5, text: "Зробив відбілювання — результат вражаючий! Зуби стали набагато світлішими, посмішка ідеальна. Сучасне обладнання, комфортна обстановка.", service: "Відбілювання" },
  { name: "Інна М.", rating: 5, text: "Завжди боялася стоматологів, але тут все інакше. Заспокоїли, пояснили кожен крок. Лікування пройшло швидко та без болю.", service: "Лікування карієсу" },
  { name: "Василь П.", rating: 5, text: "Відмінна клініка з чудовим персоналом! Ціни адекватні, якість на висоті. Головний лікар — справжній майстер своєї справи.", service: "Терапія" },
];

const reviewsEn: Omit<Review, "photo">[] = [
  { name: "Olga K.", rating: 5, text: "Incredibly pleased! I finally found a clinic where you're treated like a person. Dr Oleksandr is a true professional.", service: "Prosthetics" },
  { name: "Mykhailo D.", rating: 5, text: "Had an implant placed — everything went smoothly, no pain or complications. Staff is friendly and attentive.", service: "Implantation" },
  { name: "Tetyana V.", rating: 5, text: "Brought my child to the dentist for the first time. The doctor connected instantly; my daughter left happy.", service: "Children's dentistry" },
  { name: "Andriy S.", rating: 5, text: "Had whitening done — the result is stunning! Modern equipment and a comfortable atmosphere.", service: "Whitening" },
  { name: "Inna M.", rating: 5, text: "I've always been afraid of dentists, but here it's completely different. Treatment was fast and painless.", service: "Caries treatment" },
  { name: "Vasyl P.", rating: 5, text: "Excellent clinic with wonderful staff! Fair prices and top quality.", service: "Therapy" },
];

export default function Reviews() {
  const { lang, t } = useLang();
  const base = lang === "uk" ? reviewsUk : reviewsEn;
  const reviews: Review[] = base.map((item, index) => ({ ...item, photo: photos[index % photos.length] }));

  return (
    <section id="reviews" className="section-block bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">{t("reviews.label")}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy gold-line-center">{t("reviews.h2")}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div key={rev.name} className="bg-card border border-border rounded-2xl p-6 shadow-card-custom hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <img src={rev.photo} alt={rev.name} className="w-12 h-12 rounded-full object-cover border border-gold/30" loading="lazy" />
                <div>
                  <div className="font-display font-semibold text-custom-dark text-sm">{rev.name}</div>
                  <div className="font-body text-xs text-muted-foreground">{rev.service}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < rev.rating ? "fill-gold text-gold" : "text-muted"} />
                ))}
              </div>
              <p className="font-body text-foreground/80 text-sm leading-relaxed italic">«{rev.text}»</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
