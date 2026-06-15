export type DoctorProfile = {
  slug: string;
  name: {
    uk: string;
    en: string;
  };
  specialty: {
    uk: string;
    en: string;
  };
  experience: {
    uk: string;
    en: string;
  };
  education: {
    uk: string[];
    en: string[];
  };
  certificates: {
    uk: string[];
    en: string[];
  };
  reviews: {
    uk: string[];
    en: string[];
  };
  services: string[];
  photo: string;
};

export const doctorProfiles: DoctorProfile[] = [
  {
    slug: "roman-verhovskyi",
    name: {
      uk: "Роман Верховський",
      en: "Roman Verkhovskyi",
    },
    specialty: {
      uk: "Лікар-стоматолог, імплантолог",
      en: "Dentist, implantologist",
    },
    experience: {
      uk: "19+ років досвіду. PLACEHOLDER: підтвердити точний стаж перед публікацією.",
      en: "19+ years of experience. PLACEHOLDER: confirm exact experience before publishing.",
    },
    education: {
      uk: [
        "PLACEHOLDER: диплом лікаря-стоматолога",
        "PLACEHOLDER: спеціалізація з хірургічної стоматології",
      ],
      en: [
        "PLACEHOLDER: dental degree",
        "PLACEHOLDER: oral surgery specialization",
      ],
    },
    certificates: {
      uk: [
        "PLACEHOLDER: сертифікат з дентальної імплантації",
        "PLACEHOLDER: сертифікат з цифрового планування лікування",
      ],
      en: [
        "PLACEHOLDER: dental implantology certificate",
        "PLACEHOLDER: digital treatment planning certificate",
      ],
    },
    reviews: {
      uk: [
        "PLACEHOLDER: відгук пацієнта про імплантацію зубів у Кропивницькому.",
      ],
      en: [
        "PLACEHOLDER: patient review about dental implants in Kropyvnytskyi.",
      ],
    },
    services: ["implantaciya", "protezuvannya", "diagnostika-zubiv"],
    photo: "/og-images/implantaciya.jpg",
  },
  {
    slug: "dentis-team-doctor",
    name: {
      uk: "Лікар Dentis",
      en: "Dentis doctor",
    },
    specialty: {
      uk: "Стоматолог-терапевт",
      en: "Restorative dentist",
    },
    experience: {
      uk: "PLACEHOLDER: додати точний досвід лікаря.",
      en: "PLACEHOLDER: add exact doctor experience.",
    },
    education: {
      uk: [
        "PLACEHOLDER: диплом лікаря-стоматолога",
        "PLACEHOLDER: курси з лікування карієсу під мікроскопом",
      ],
      en: [
        "PLACEHOLDER: dental degree",
        "PLACEHOLDER: microscope-assisted caries treatment training",
      ],
    },
    certificates: {
      uk: [
        "PLACEHOLDER: сертифікат з естетичної реставрації",
        "PLACEHOLDER: сертифікат з ендодонтичного лікування",
      ],
      en: [
        "PLACEHOLDER: aesthetic restoration certificate",
        "PLACEHOLDER: endodontic treatment certificate",
      ],
    },
    reviews: {
      uk: [
        "PLACEHOLDER: відгук пацієнта про лікування зубів у Кропивницькому.",
      ],
      en: [
        "PLACEHOLDER: patient review about dental treatment in Kropyvnytskyi.",
      ],
    },
    services: ["likuvannya-kariesu", "estetychna-stomatolohiya", "profesijne-ochischennya"],
    photo: "/og-image.jpg",
  },
];
