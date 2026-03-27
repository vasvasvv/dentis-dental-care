import { useMemo, useState } from "react";
import { Check, ChevronRight } from "lucide-react";

const steps = ["Контакти", "Дата й час", "Підтвердження"];

export default function MultiStepBookingForm() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const isStepValid = useMemo(() => {
    if (step === 0) return name.trim().length > 1 && phone.trim().length >= 10;
    if (step === 1) return Boolean(date && time);
    return true;
  }, [step, name, phone, date, time]);

  return (
    <section className="section-block bg-background" aria-hidden="true">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">Конверсія (підготовлено)</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy">Multi-step запис (поки вимкнено)</h2>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-card-custom">
          <div className="grid md:grid-cols-3 gap-3 mb-8">
            {steps.map((label, index) => {
              const done = index < step;
              const active = index === step;
              return (
                <div
                  key={label}
                  className={`rounded-xl border p-3 text-sm transition-all ${
                    active ? "border-gold bg-gold/10" : done ? "border-success/40 bg-success/10" : "border-border"
                  }`}
                >
                  <span className="inline-flex items-center gap-2 font-medium text-navy">
                    {done ? <Check size={14} className="text-success" /> : <span>{index + 1}.</span>}
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {step === 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше ім'я" className="h-12 rounded-xl border border-border bg-background px-4" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" className="h-12 rounded-xl border border-border bg-background px-4" />
            </div>
          )}

          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-4">
              <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="h-12 rounded-xl border border-border bg-background px-4" />
              <input value={time} onChange={(e) => setTime(e.target.value)} type="time" className="h-12 rounded-xl border border-border bg-background px-4" />
            </div>
          )}

          {step === 2 && (
            <div className="rounded-xl border border-success/40 bg-success/10 p-4 text-sm text-navy">
              Миттєве підтвердження: дякуємо, {name || "пацієнте"}! Попередній запис на {date || "обрану дату"} о {time || "обраний час"}.
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="px-4 py-2 rounded-full border border-border text-sm"
              disabled={step === 0}
            >
              Назад
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(2, s + 1))}
              className="px-5 py-2.5 rounded-full gradient-gold text-accent-foreground text-sm inline-flex items-center gap-1 disabled:opacity-40"
              disabled={!isStepValid || step === 2}
            >
              Далі <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
