import { useEffect, useState } from "react";
import doctorVerhovsky from "@/assets/doctor-verhovsky.webp";
import doctorFemale from "@/assets/galch.webp";
import { getPublicDoctors, type PublicDoctor } from "@/lib/publicApi";
import { generateImageUrl } from "@/lib/imageOptimization";
import { useLang } from "@/contexts/LanguageContext";

type DoctorCard = {
  img: string;
  name: string;
  title: string;
  speciality: string;
  experience: string;
  desc: string;
};

const fallbackDoctorsUk: DoctorCard[] = [
  {
    img: doctorVerhovsky,
    name: "Верховський Олександр Олександрович",
    title: "Головний лікар",
    speciality: "Лікар-стоматолог, імплантолог",
    experience: "19",
    desc: "Спеціаліст вищої категорії. Регулярно проходить навчання в провідних клініках. Автор індивідуальних планів реабілітації.",
  },
  {
    img: doctorFemale,
    name: "Гальченко Антон Євгенович",
    title: "Лікар-стоматолог",
    speciality: "Терапевт, естетична стоматологія",
    experience: "8",
    desc: "Досвідчений терапевт та фахівець з естетичного відновлення зубів. Майстер художньої реставрації.",
  },
];

const fallbackDoctorsEn: DoctorCard[] = [
  {
    img: doctorVerhovsky,
    name: "Oleksandr Verkhovskyi",
    title: "Chief doctor",
    speciality: "Dentist, implantologist",
    experience: "19",
    desc: "Senior-category specialist. Regularly trains at leading clinics and creates individual rehabilitation plans.",
  },
  {
    img: doctorFemale,
    name: "Anton Halchenko",
    title: "Dentist",
    speciality: "Therapist, aesthetic dentistry",
    experience: "8",
    desc: "Experienced therapist and specialist in aesthetic tooth restoration. Skilled in artistic restorations.",
  },
];

function resolveDoctorImage(photoUrl: string | null, index: number) {
  if (!photoUrl) return index === 0 ? doctorVerhovsky : doctorFemale;
  if (photoUrl.includes("doctor-verhovsky")) return doctorVerhovsky;
  if (photoUrl.includes("doctor-female")) return doctorFemale;
  return photoUrl;
}

function toDoctorCard(doctor: PublicDoctor, index: number): DoctorCard {
  return {
    img: resolveDoctorImage(doctor.photo_url, index),
    name: doctor.full_name,
    title: doctor.position,
    speciality: doctor.specialization ?? "",
    experience: String(doctor.experience_years),
    desc: doctor.description ?? "",
  };
}

export default function Doctors() {
  const { t, lang } = useLang();
  const [publicDoctors, setPublicDoctors] = useState<DoctorCard[]>([]);
  const doctors = lang === "uk" ? (publicDoctors.length > 0 ? publicDoctors : fallbackDoctorsUk) : fallbackDoctorsEn;

  useEffect(() => {
    if (lang === "en") return;

    getPublicDoctors()
      .then((items) => {
        if (items.length > 0) setPublicDoctors(items.map(toDoctorCard));
      })
      .catch(() => {});
  }, [lang]);

  return (
    <section id="doctors" className="section-block site-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">{t("doctors.label")}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy mb-2 gold-line-center">{t("doctors.h2")}</h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto mt-5">{t("doctors.desc")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {doctors.map((doctor) => (
            <div
              key={doctor.name}
              className="glass-card border rounded-2xl overflow-hidden shadow-card-custom hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
                <picture>
                  <source srcSet={generateImageUrl(doctor.img, { width: 640, height: 480, quality: 82 })} type="image/webp" />
                  <img
                    src={generateImageUrl(doctor.img, { width: 640, height: 480, quality: 85 })}
                    alt={lang === "uk" ? `${doctor.name} стоматолог Dentis у Кропивницькому` : `${doctor.name}, Dentis dentist in Kropyvnytskyi`}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={480}
                  />
                </picture>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 via-navy/55 to-transparent p-6 pt-24">
                  <h3 className="font-display font-bold text-secondary text-xl leading-tight">{doctor.name}</h3>
                  <p className="font-body text-gold text-sm font-medium mt-1">{doctor.title}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="font-body text-muted-foreground text-sm mb-1">{doctor.speciality}</p>
                <p className="font-body text-navy/60 text-xs mb-4">
                  {doctor.experience}+ {t("doctors.exp")}
                </p>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{doctor.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
