import { useEffect, useState } from "react";
import doctorVerhovsky from "@/assets/doctor-verhovsky.webp";
import doctorFemale from "@/assets/doctor-female.webp";
import { getPublicDoctors, type PublicDoctor } from "@/lib/publicApi";

type DoctorCard = {
  img: string;
  name: string;
  title: string;
  speciality: string;
  experience: string;
  desc: string;
};

const fallbackDoctors: DoctorCard[] = [
  {
    img: doctorVerhovsky,
    name: "Верховський Олександр Олександрович",
    title: "Головний лікар",
    speciality: "Лікар-стоматолог, імплантолог",
    experience: "19+ років досвіду",
    desc: "Спеціаліст вищої категорії. Регулярно проходить навчання в провідних клініках. Автор індивідуальних планів реабілітації.",
  },
  {
    img: doctorFemale,
    name: "Гальченко Антон Євгенович",
    title: "Лікар-стоматолог",
    speciality: "Терапевт, естетична стоматологія",
    experience: "8 років досвіду",
    desc: "Досвідчений терапевт та фахівець з естетичного відновлення зубів. Майстер художньої реставрації.",
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
    experience: `${doctor.experience_years}+ років досвіду`,
    desc: doctor.description ?? "",
  };
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<DoctorCard[]>(fallbackDoctors);

  useEffect(() => {
    getPublicDoctors()
      .then((items) => {
        if (items.length > 0) {
          setDoctors(items.map(toDoctorCard));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="doctors" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium mb-3">Команда</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy mb-2 gold-line-center">
            Наші лікарі
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto mt-5">
            Ваше здоров'я в руках досвідчених спеціалістів, які постійно вдосконалюють свою майстерність
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {doctors.map((doctor) => (
            <div
              key={doctor.name}
              className="bg-card rounded-2xl overflow-hidden border border-border shadow-card-custom hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-81 overflow-hidden bg-secondary">
                <img
                  src={doctor.img}
                  alt={doctor.name}
                  width={800}
                  height={843}
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent" />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-display font-bold text-custom-dark text-lg leading-snug">{doctor.name}</h3>
                    <p className="text-gold font-body font-semibold text-sm mt-1">{doctor.title}</p>
                  </div>
                  <span className="shrink-0 text-[10px] tracking-wider uppercase font-body font-semibold bg-navy/8 text-navy px-2.5 py-1 rounded-full">
                    {doctor.experience}
                  </span>
                </div>

                <p className="font-body text-sm text-muted-foreground mb-1">
                  <span className="text-custom-dark font-medium">Спеціалізація:</span> {doctor.speciality}
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mt-3">{doctor.desc}</p>

                <a
                  href="tel:+380504800825"
                  className="mt-5 inline-flex items-center gap-2 gradient-gold text-accent-foreground px-5 py-2.5 rounded-full font-body font-semibold text-sm shadow-gold-custom hover:opacity-90 transition-opacity"
                >
                  Записатися
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
