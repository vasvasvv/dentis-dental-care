import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";

type RelatedServiceSlug =
  | "likuvannya-kariesu"
  | "implantaciya"
  | "diagnostika-zubiv"
  | "estetychna-stomatolohiya"
  | "profesijne-ochischennya"
  | "protezuvannya";

type RelatedServicesProps = {
  currentService: RelatedServiceSlug;
};

const relatedMap: Record<RelatedServiceSlug, RelatedServiceSlug[]> = {
  "likuvannya-kariesu": ["implantaciya", "estetychna-stomatolohiya", "profesijne-ochischennya"],
  implantaciya: ["protezuvannya", "estetychna-stomatolohiya", "likuvannya-kariesu"],
  "diagnostika-zubiv": ["likuvannya-kariesu", "implantaciya", "profesijne-ochischennya"],
  "estetychna-stomatolohiya": ["likuvannya-kariesu", "implantaciya", "protezuvannya"],
  "profesijne-ochischennya": ["likuvannya-kariesu", "diagnostika-zubiv", "implantaciya"],
  protezuvannya: ["implantaciya", "estetychna-stomatolohiya", "likuvannya-kariesu"],
};

const labels = {
  uk: {
    "likuvannya-kariesu": "Лікування карієсу у Кропивницькому",
    implantaciya: "Імплантація зубів у Кропивницькому",
    "diagnostika-zubiv": "Діагностика зубів та цифровий рентген",
    "estetychna-stomatolohiya": "Естетична стоматологія та дизайн посмішки",
    "profesijne-ochischennya": "Професійне чищення зубів Air Flow",
    protezuvannya: "Протезування зубів коронками та мостами",
    heading: "Суміжні стоматологічні послуги",
  },
  en: {
    "likuvannya-kariesu": "Caries treatment in Kropyvnytskyi",
    implantaciya: "Dental implants in Kropyvnytskyi",
    "diagnostika-zubiv": "Dental diagnostics and digital X-ray",
    "estetychna-stomatolohiya": "Cosmetic dentistry and smile design",
    "profesijne-ochischennya": "Professional teeth cleaning with Air Flow",
    protezuvannya: "Dental prosthetics with crowns and bridges",
    heading: "Related dental services",
  },
} as const;

export default function RelatedServices({ currentService }: RelatedServicesProps) {
  const { lang, localizePath } = useLang();
  const copy = labels[lang];
  const services = relatedMap[currentService];

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl rounded-3xl border border-gold/20 bg-cream-dark p-8">
          <h2 className="mb-8 text-center font-display text-3xl font-bold text-navy">{copy.heading}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service}
                to={localizePath(`/${service}`)}
                className="rounded-2xl border border-border bg-card p-5 font-body text-sm font-medium text-custom-dark transition-all duration-200 hover:-translate-y-1 hover:border-gold/40 hover:shadow-card-custom"
              >
                {copy[service]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
