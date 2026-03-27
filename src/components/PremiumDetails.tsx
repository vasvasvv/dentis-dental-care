import { useEffect, useState } from "react";

const certificates = ["ISO Dental Quality", "Nobel Biocare", "Digital Smile Design", "Endo Excellence"];

export default function PremiumDetails() {
  const [before, setBefore] = useState(55);
  const [count, setCount] = useState({ years: 0, patients: 0 });

  useEffect(() => {
    let frame = 0;
    const total = 60;
    const timer = setInterval(() => {
      frame += 1;
      setCount({
        years: Math.min(19, Math.round((19 * frame) / total)),
        patients: Math.min(3000, Math.round((3000 * frame) / total)),
      });
      if (frame >= total) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-block bg-cream" aria-hidden="true">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">Преміум-деталі (підготовлено)</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy">Нові блоки (поки вимкнено)</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-display text-2xl mb-4">Before / After slider</h3>
            <input type="range" min={0} max={100} value={before} onChange={(e) => setBefore(Number(e.target.value))} className="w-full" />
            <div className="mt-4 text-sm text-muted-foreground">Позиція слайдера: {before}%</div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-display text-2xl mb-4">3D-тур та відеовідгуки</h3>
            <div className="aspect-video rounded-xl bg-muted flex items-center justify-center text-sm text-muted-foreground">Місце для embedded 3D-туру</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-muted p-3">Відеовідгук #1</div>
              <div className="rounded-lg bg-muted p-3">Відеовідгук #2</div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="rounded-2xl bg-card border border-border p-5 text-center"><p className="text-3xl font-display text-navy">{count.years}+</p><p className="text-sm text-muted-foreground">років досвіду</p></div>
          <div className="rounded-2xl bg-card border border-border p-5 text-center"><p className="text-3xl font-display text-navy">{count.patients}+</p><p className="text-sm text-muted-foreground">пацієнтів</p></div>
          <div className="rounded-2xl bg-card border border-border p-5 text-center"><p className="text-3xl font-display text-navy">24/7</p><p className="text-sm text-muted-foreground">супровід</p></div>
          <div className="rounded-2xl bg-card border border-border p-5 text-center"><p className="text-3xl font-display text-navy">4.9</p><p className="text-sm text-muted-foreground">рейтинг</p></div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            {certificates.map((item) => (
              <div key={item} className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-medium text-navy">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
