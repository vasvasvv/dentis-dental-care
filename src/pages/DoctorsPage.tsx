import { Award, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageSeo from "@/components/SEO/PageSeo";
import { useLang } from "@/contexts/LanguageContext";
import { doctorProfiles } from "@/data/doctorProfiles";

export default function DoctorsPage() {
  const { lang, localizePath } = useLang();

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path="/doctors"
        title={{
          uk: "Лікарі стоматології Дентіс у Кропивницькому",
          en: "Dentis Doctors in Kropyvnytskyi",
        }}
        description={{
          uk: "Профілі лікарів Dentis: досвід, сертифікати, напрямки роботи та відгуки пацієнтів. PLACEHOLDER: підтвердити дані перед публікацією.",
          en: "Dentis doctor profiles: experience, certificates, treatment areas and patient reviews. PLACEHOLDER: confirm details before publishing.",
        }}
      />

      <Header />
      <section className="relative overflow-hidden bg-navy pb-24 pt-36">
        <div className="container relative z-10 mx-auto px-4">
          <p className="mb-4 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{lang === "uk" ? "Команда" : "Team"}</p>
          <h1 className="mb-6 max-w-3xl font-display text-5xl font-bold leading-tight text-secondary md:text-6xl">{lang === "uk" ? "Лікарі Dentis" : "Dentis doctors"}</h1>
          <p className="max-w-2xl font-body text-lg leading-relaxed text-primary-foreground/70">
            {lang === "uk"
              ? "Досвід, сертифікати, напрямки роботи та відгуки пацієнтів. PLACEHOLDER: замінити демонстраційні дані на підтверджені профілі."
              : "Experience, certificates, treatment areas and patient reviews. PLACEHOLDER: replace demo data with confirmed profiles."}
          </p>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto grid max-w-5xl gap-6 px-4 md:grid-cols-2">
          {doctorProfiles.map((doctor) => (
            <article key={doctor.slug} className="rounded-2xl border border-border bg-card p-6 shadow-card-custom">
              <img src={doctor.photo} alt={doctor.name[lang]} className="mb-6 h-56 w-full rounded-xl object-cover" loading="lazy" />
              <div className="mb-4 flex items-start gap-3">
                <Award size={22} className="mt-1 shrink-0 text-gold" />
                <div>
                  <h2 className="font-display text-2xl font-bold text-custom-dark">{doctor.name[lang]}</h2>
                  <p className="font-body text-sm text-muted-foreground">{doctor.specialty[lang]}</p>
                </div>
              </div>
              <p className="mb-5 font-body text-sm leading-7 text-foreground/80">{doctor.experience[lang]}</p>
              <div className="mb-6 space-y-2">
                {doctor.certificates[lang].slice(0, 2).map((certificate) => (
                  <div key={certificate} className="flex items-start gap-2">
                    <CheckCircle size={16} className="mt-1 shrink-0 text-gold" />
                    <span className="font-body text-sm text-muted-foreground">{certificate}</span>
                  </div>
                ))}
              </div>
              <a href={localizePath(`/doctors/${doctor.slug}`)} className="btn-secondary text-sm">
                {lang === "uk" ? "Переглянути профіль" : "View profile"}
              </a>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
