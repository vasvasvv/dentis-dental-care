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
      uk: "19+ років досвіду. Практикуючий лікар-імплантолог.",
      en: "19+ years of experience. Practicing implantologist.",
    },
    education: {
      uk: [
        "Диплом лікаря-стоматолога",
        "Спеціалізація з хірургічної стоматології",
      ],
      en: [
        "Dental degree",
        "Oral surgery specialization",
      ],
    },
    certificates: {
      uk: [
        "Сертифікат з дентальної імплантації",
        "Сертифікат з цифрового планування лікування",
      ],
      en: [
        "Dental implantology certificate",
        "Digital treatment planning certificate",
      ],
    },
    reviews: {
      uk: [
        "Відгук пацієнта про імплантацію зубів у Кропивницькому.",
      ],
      en: [
        "Patient review about dental implants in Kropyvnytskyi.",
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
      uk: "Багаторічний досвід роботи.",
      en: "Many years of experience.",
    },
    education: {
      uk: [
        "Диплом лікаря-стоматолога",
        "Курси з лікування карієсу під мікроскопом",
      ],
      en: [
        "Dental degree",
        "Microscope-assisted caries treatment training",
      ],
    },
    certificates: {
      uk: [
        "Сертифікат з естетичної реставрації",
        "Сертифікат з ендодонтичного лікування",
      ],
      en: [
        "Aesthetic restoration certificate",
        "Endodontic treatment certificate",
      ],
    },
    reviews: {
      uk: [
        "Відгук пацієнта про лікування зубів у Кропивницькому.",
      ],
      en: [
        "Patient review about dental treatment in Kropyvnytskyi.",
      ],
    },
    services: ["likuvannya-kariesu", "estetychna-stomatolohiya", "profesijne-ochischennya"],
    photo: "/og-image.jpg",
  },
];
