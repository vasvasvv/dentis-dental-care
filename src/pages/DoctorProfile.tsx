import { Navigate, useParams } from "react-router-dom";
import { Award, CheckCircle, Phone, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageSeo from "@/components/SEO/PageSeo";
import JsonLdScript from "@/components/SEO/JsonLdScript";
import { useLang } from "@/contexts/LanguageContext";
import { doctorProfiles } from "@/data/doctorProfiles";
import { buildCanonical, toAbsoluteUrl } from "@/utils/seo";

export default function DoctorProfile() {
  const { slug } = useParams();
  const { lang, localizePath } = useLang();
  const doctor = doctorProfiles.find((item) => item.slug === slug);

  if (!doctor) {
    return <Navigate to={localizePath("/doctors")} replace />;
  }

  const path = `/doctors/${doctor.slug}`;
  const title =
    lang === "uk"
      ? `${doctor.name.uk} — ${doctor.specialty.uk} | Дентіс`
      : `${doctor.name.en} — ${doctor.specialty.en} | Dentis`;
  const description =
    lang === "uk"
      ? `Профіль лікаря ${doctor.name.uk}: досвід, сертифікати, напрямки роботи та відгуки пацієнтів стоматології Dentis у Кропивницькому.`
      : `${doctor.name.en} profile: experience, certificates, treatment areas and patient reviews at Dentis in Kropyvnytskyi.`;

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path={path}
        ogImage={doctor.photo}
        title={{
          uk: title,
          en: title,
        }}
        description={{
          uk: description,
          en: description,
        }}
      />
      <JsonLdScript
        id={`${doctor.slug}-person-schema`}
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: doctor.name[lang],
          jobTitle: doctor.specialty[lang],
          image: toAbsoluteUrl(doctor.photo),
          url: buildCanonical(path, lang),
          worksFor: {
            "@type": "Dentist",
            name: "Dentis",
            url: "https://dentis.kr.ua",
          },
        }}
      />

      <Header />
      <section className="relative overflow-hidden bg-navy pb-24 pt-36">
        <div className="container relative z-10 mx-auto grid gap-10 px-4 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <img src={doctor.photo} alt={doctor.name[lang]} className="h-80 w-full rounded-2xl object-cover shadow-card-custom" />
          <div>
            <p className="mb-4 font-body text-sm font-medium uppercase tracking-[0.3em] text-gold">{lang === "uk" ? "Лікар Dentis" : "Dentis doctor"}</p>
            <h1 className="mb-4 font-display text-5xl font-bold leading-tight text-secondary md:text-6xl">{doctor.name[lang]}</h1>
            <p className="mb-6 font-body text-lg text-primary-foreground/80">{doctor.specialty[lang]}</p>
            <p className="mb-8 max-w-2xl font-body leading-7 text-primary-foreground/70">{doctor.experience[lang]}</p>
            <a href={localizePath("/contacts")} className="btn-primary">
              <Phone size={18} />
              {lang === "uk" ? "Записатися до лікаря" : "Book with doctor"}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-card p-6 shadow-card-custom">
            <div className="mb-5 flex items-center gap-3">
              <Award size={22} className="text-gold" />
              <h2 className="font-display text-2xl font-bold text-custom-dark">{lang === "uk" ? "Освіта та сертифікати" : "Education and certificates"}</h2>
            </div>
            <div className="space-y-3">
              {[...doctor.education[lang], ...doctor.certificates[lang]].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle size={18} className="mt-0.5 shrink-0 text-gold" />
                  <span className="font-body text-sm leading-7 text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-card p-6 shadow-card-custom">
            <div className="mb-5 flex items-center gap-3">
              <Star size={22} className="text-gold" />
              <h2 className="font-display text-2xl font-bold text-custom-dark">{lang === "uk" ? "Відгуки пацієнтів" : "Patient reviews"}</h2>
            </div>
            <div className="space-y-4">
              {doctor.reviews[lang].map((review) => (
                <blockquote key={review} className="rounded-xl border border-gold/20 bg-gold/5 p-4 font-body text-sm leading-7 text-foreground/80">
                  {review}
                </blockquote>
              ))}
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
}
