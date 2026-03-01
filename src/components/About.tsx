import { Award, Users, Clock, Shield } from "lucide-react";

const values = [
  { icon: Award, title: "Висока якість", desc: "Використовуємо лише сертифіковані матеріали та сучасне обладнання від провідних виробників." },
  { icon: Users, title: "Індивідуальний підхід", desc: "Кожен пацієнт отримує персоналізований план лікування та увагу досвідченого фахівця." },
  { icon: Clock, title: "Зручний час", desc: "Прийом без черг у зручний для вас час. Цінуємо ваш час так само, як і своє." },
  { icon: Shield, title: "Повна безпека", desc: "Суворе дотримання санітарних норм, стерилізація інструментів та безпечна анестезія." },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <div>
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-4">Про нас</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy leading-tight mb-6 gold-line">
              Довіра пацієнтів —<br />
              <em className="not-italic text-navy">наша найвища нагорода</em>
            </h2>
            <p className="font-body text-navy leading-relaxed mb-5">
              Стоматологічна клініка <strong className="text-custom-dark">«Дентіс»</strong> — це місце, де сучасна медицина поєднується з турботою та теплом. Ми надаємо стоматологічну допомогу найвищого рівня.
            </p>
            <p className="font-body text-navy leading-relaxed mb-8">
              Наша клініка оснащена передовим цифровим обладнанням. Ми постійно навчаємося та впроваджуємо найновіші методики лікування, щоб ви отримували найкращий результат.
            </p>

            <a
              href="tel:+380504800825"
              className="inline-flex items-center gap-2 gradient-gold text-accent-foreground px-7 py-3.5 rounded-full font-body font-semibold text-sm shadow-gold-custom hover:opacity-90 transition-opacity"
            >
              Зателефонувати
            </a>
          </div>

          {/* Right — values grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-xl p-6 shadow-card-custom hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-gold" />
                </div>
                <h3 className="font-display font-semibold text-custom-dark text-lg mb-2">{title}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
