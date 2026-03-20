import { Star } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

const reviewsUk = [
  { name: "Ольга К.", rating: 5, text: "Неймовірно задоволена! Нарешті знайшла клініку, де до тебе ставляться як до людини. Олександр Олександрович — справжній професіонал. Рекомендую всім!", service: "Протезування" },
  { name: "Михайло Д.", rating: 5, text: "Робив імплантацію — все пройшло чудово, без болю та ускладнень. Зуб встановлено ідеально. Персонал доброзичливий та уважний. Спасибі команді!", service: "Імплантація" },
  { name: "Тетяна В.", rating: 5, text: "Привела дитину вперше до стоматолога — боялася жахливого стресу. Але лікар знайшла підхід миттєво! Дочка вийшла задоволена і вже сама хоче приходити. Дякую!", service: "Дитяча стоматологія" },
  { name: "Андрій С.", rating: 5, text: "Зробив відбілювання — результат вражаючий! Зуби стали набагато світлішими, посмішка ідеальна. Сучасне обладнання, комфортна обстановка. Все чітко та якісно.", service: "Відбілювання" },
  { name: "Інна М.", rating: 5, text: "Завжди боялася стоматологів, але тут все інакше. Заспокоїли, пояснили кожен крок. Лікування пройшло швидко та без болю. Тепер це моя постійна клініка.", service: "Лікування карієсу" },
  { name: "Василь П.", rating: 5, text: "Відмінна клініка з чудовим персоналом! Ціни адекватні, якість на висоті. Головний лікар — справжній майстер своєї справи. Щиро рекомендую!", service: "Терапія" },
];

const reviewsEn = [
  { name: "Olga K.", rating: 5, text: "Incredibly pleased! I finally found a clinic where you're treated like a person. Dr Oleksandr is a true professional. Highly recommend!", service: "Prosthetics" },
  { name: "Mykhailo D.", rating: 5, text: "Had an implant placed — everything went smoothly, no pain or complications. The tooth is set perfectly. Staff is friendly and attentive. Thanks to the team!", service: "Implantation" },
  { name: "Tetyana V.", rating: 5, text: "Brought my child to the dentist for the first time — I was dreading a meltdown. But the doctor connected with her instantly! My daughter left happy and wants to come back.", service: "Children's dentistry" },
  { name: "Andriy S.", rating: 5, text: "Had whitening done — the result is stunning! Teeth are much brighter, smile is perfect. Modern equipment, comfortable atmosphere. Clean and professional.", service: "Whitening" },
  { name: "Inna M.", rating: 5, text: "I've always been afraid of dentists, but here it's completely different. They calmed me down and explained every step. Treatment was fast and painless. My permanent clinic now.", service: "Caries treatment" },
  { name: "Vasyl P.", rating: 5, text: "Excellent clinic with wonderful staff! Fair prices, top quality. The chief doctor is a true master of his craft. Sincerely recommend!", service: "Therapy" },
];

export default function Reviews() {
  const { lang, t } = useLang();
  const reviews = lang === "uk" ? reviewsUk : reviewsEn;

  return (
    <section id="reviews" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">
            {t("reviews.label")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy gold-line-center">
            {t("reviews.h2")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="bg-card border border-border rounded-2xl p-6 shadow-card-custom hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="font-body text-foreground/80 text-sm leading-relaxed mb-5 italic">
                «{rev.text}»
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <div className="font-display font-semibold text-custom-dark text-sm">{rev.name}</div>
                  <div className="font-body text-xs text-muted-foreground mt-0.5">{rev.service}</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-navy/8 flex items-center justify-center font-display font-bold text-custom-dark text-sm">
                  {rev.name[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
