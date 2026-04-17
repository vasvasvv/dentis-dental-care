import { Phone } from "lucide-react";
import ContactsSection from "@/components/Contacts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageSeo from "@/components/SEO/PageSeo";
import JsonLdScript from "@/components/SEO/JsonLdScript";
import { useLang } from "@/contexts/LanguageContext";
import { buildCanonical } from "@/utils/seo";

export default function ContactsPage() {
  const { lang } = useLang();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: lang === "uk" ? "Контакти стоматології Dentis" : "Dentis contacts",
    description:
      lang === "uk"
        ? "Контакти стоматологічної клініки Dentis у Кропивницькому."
        : "Contact details for Dentis dental clinic in Kropyvnytskyi.",
    url: buildCanonical("/contacts", lang),
  };

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path="/contacts"
        ogImage="/og-image-contacts.jpg"
        title={{
          uk: "Контакти Дентіс — стоматологія у Кропивницькому",
          en: "Contact Dentis — Dental Clinic in Kropyvnytskyi",
        }}
        description={{
          uk: "Адреса: вул. Героїв-рятувальників, 9, корп. 2, Кропивницький. Телефон: +38 050 480 0825. Режим роботи: пн-пт 9:00-20:00, сб 10:00-17:00",
          en: "Address: Heroiv-Ryatuvalnykiv St, 9, Building 2, Kropyvnytskyi. Phone: +38 050 480 0825. Hours: Mon-Fri 9:00-20:00, Sat 10:00-17:00",
        }}
      />
      <JsonLdScript id="contacts-medical-webpage" data={webPageSchema} />

      <Header />
      <div className="h-28 bg-navy opacity-95" />

      <main>
        <ContactsSection />
      </main>

      <section className="bg-navy">
        <Footer />
      </section>

      <a
        href="tel:+380504800825"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-gold text-accent-foreground shadow-gold-custom transition-transform duration-200 hover:scale-110 md:hidden"
        aria-label="Call Dentis"
      >
        <Phone size={22} />
      </a>
    </div>
  );
}
