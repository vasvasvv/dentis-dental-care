import { useLocation } from "react-router-dom";
import PageSeo from "@/components/SEO/PageSeo";
import { useLang } from "@/contexts/LanguageContext";
import { stripLangFromPath } from "@/utils/seo";

const routeSeoMap: Record<
  string,
  {
    title: { uk: string; en: string };
    description: { uk: string; en: string };
    type?: "website" | "article";
  }
> = {
  "/": {
    title: {
      uk: "Стоматологія у Кропивницькому | Імплантація, лікування зубів — Дентіс",
      en: "Dentistry in Kropyvnytskyi | Implants, dental treatment — Dentis",
    },
    description: {
      uk: "Стоматологія Дентіс у Кропивницькому: лікування зубів, імплантація, протезування, професійна гігієна та консультації без черг.",
      en: "Dentis dental clinic in Kropyvnytskyi: dental treatment, implants, prosthetics, professional hygiene and consultations without long waits.",
    },
  },
  "/implantaciya": {
    title: {
      uk: "Імплантація зубів у Кропивницькому | Ціни, відгуки — Дентіс",
      en: "Dental implants in Kropyvnytskyi | Prices, reviews — Dentis",
    },
    description: {
      uk: "Імплантація зубів у Кропивницькому в клініці Дентіс: план лікування, сучасні імпланти, цифрова діагностика та супровід після операції.",
      en: "Dental implants in Kropyvnytskyi at Dentis: treatment planning, modern implant systems, digital diagnostics and follow-up care.",
    },
  },
  "/protezuvannya": {
    title: {
      uk: "Протезування зубів у Кропивницькому | Коронки, мости — Дентіс",
      en: "Dental prosthetics in Kropyvnytskyi | Crowns, bridges — Dentis",
    },
    description: {
      uk: "Протезування зубів у Кропивницькому: коронки, мости, протези на імплантах та підбір матеріалів у стоматології Дентіс.",
      en: "Dental prosthetics in Kropyvnytskyi: crowns, bridges, implant-supported restorations and material selection at Dentis.",
    },
  },
  "/likuvannya-kariesu": {
    title: {
      uk: "Лікування карієсу у Кропивницькому | Ціни, пломбування — Дентіс",
      en: "Caries treatment in Kropyvnytskyi | Fillings, prices — Dentis",
    },
    description: {
      uk: "Лікування карієсу у Кропивницькому в стоматології Дентіс: безболісне пломбування зубів, фотополімерні матеріали та точна діагностика.",
      en: "Caries treatment in Kropyvnytskyi at Dentis: comfortable fillings, photopolymer restorations and precise diagnostics.",
    },
  },
  "/profesijne-ochischennya": {
    title: {
      uk: "Професійна чистка зубів у Кропивницькому | Air Flow — Дентіс",
      en: "Professional teeth cleaning in Kropyvnytskyi | Air Flow — Dentis",
    },
    description: {
      uk: "Професійна гігієна зубів у Кропивницькому: ультразвук, Air Flow, полірування та профілактика карієсу в стоматології Дентіс.",
      en: "Professional dental hygiene in Kropyvnytskyi: ultrasound cleaning, Air Flow, polishing and caries prevention at Dentis.",
    },
  },
  "/estetychna-stomatolohiya": {
    title: {
      uk: "Естетична стоматологія у Кропивницькому | Вініри, відбілювання — Дентіс",
      en: "Cosmetic dentistry in Kropyvnytskyi | Veneers, whitening — Dentis",
    },
    description: {
      uk: "Естетична стоматологія у Кропивницькому: вініри, відбілювання зубів, художня реставрація та digital smile design у Дентіс.",
      en: "Cosmetic dentistry in Kropyvnytskyi: veneers, teeth whitening, aesthetic restorations and digital smile design at Dentis.",
    },
  },
  "/diagnostika-zubiv": {
    title: {
      uk: "Діагностика зубів у Кропивницькому | Рентген, консультація — Дентіс",
      en: "Dental diagnostics in Kropyvnytskyi | X-ray, consultation — Dentis",
    },
    description: {
      uk: "Діагностика зубів у Кропивницькому: цифровий рентген, консультація стоматолога та точний план лікування у клініці Дентіс.",
      en: "Dental diagnostics in Kropyvnytskyi: digital X-ray, dentist consultation and accurate treatment planning at Dentis.",
    },
  },
  "/contacts": {
    title: {
      uk: "Контакти стоматології у Кропивницькому | Адреса, телефон — Дентіс",
      en: "Dentist contacts in Kropyvnytskyi | Address, phone — Dentis",
    },
    description: {
      uk: "Контакти стоматології Дентіс у Кропивницькому: адреса, телефон для запису, графік роботи та карта проїзду до клініки.",
      en: "Dentis dental clinic contacts in Kropyvnytskyi: address, booking phone number, opening hours and map directions.",
    },
  },
  "/blog": {
    title: {
      uk: "Блог стоматології у Кропивницькому | Поради, акції — Дентіс",
      en: "Dental blog in Kropyvnytskyi | Tips, offers — Dentis",
    },
    description: {
      uk: "Блог стоматології Дентіс: поради стоматолога, новини клініки, акції на лікування зубів та професійну гігієну у Кропивницькому.",
      en: "Dentis blog with dentist tips, clinic updates and offers for dental treatment and hygiene in Kropyvnytskyi.",
    },
    type: "article",
  },
};

export default function RouteSeo() {
  const location = useLocation();
  const { lang } = useLang();
  const neutralPath = stripLangFromPath(location.pathname);
  const seo = routeSeoMap[neutralPath];

  if (!seo) {
    return (
      <PageSeo
        lang={lang}
        path={location.pathname}
        noindex
        title={{
          uk: "Сторінку не знайдено | Дентіс",
          en: "Page not found | Dentis",
        }}
        description={{
          uk: "Запитану сторінку не знайдено.",
          en: "The requested page was not found.",
        }}
      />
    );
  }

  return <PageSeo lang={lang} path={neutralPath} title={seo.title} description={seo.description} type={seo.type} />;
}
