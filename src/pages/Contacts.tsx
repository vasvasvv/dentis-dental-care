import { Phone } from "lucide-react";
import ContactsSection from "@/components/Contacts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageSeo from "@/components/SEO/PageSeo";
import Schema from "@/components/SEO/Schema";
import { useLang } from "@/contexts/LanguageContext";
import { buildCanonical } from "@/utils/seo";

export default function ContactsPage() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path="/contacts"
        title={{
          uk: "Контакти стоматології у Кропивницькому | Адреса, телефон — Дентіс",
          en: "Dentist contacts in Kropyvnytskyi | Address, phone — Dentis",
        }}
        description={{
          uk: "Контакти стоматології Дентіс у Кропивницькому: адреса, телефон для запису, графік роботи та карта проїзду до клініки.",
          en: "Dentis dental clinic contacts in Kropyvnytskyi: address, booking phone number, opening hours and map directions.",
        }}
      />
      <Schema
        type="MedicalWebPage"
        lang={lang}
        data={{
          name: lang === "uk" ? "Контакти стоматології Дентіс" : "Dentis contacts",
          description:
            lang === "uk"
              ? "Контакти стоматологічної клініки Дентіс у Кропивницькому."
              : "Contact details for Dentis dental clinic in Kropyvnytskyi.",
          url: buildCanonical("/contacts", lang),
        }}
      />

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
