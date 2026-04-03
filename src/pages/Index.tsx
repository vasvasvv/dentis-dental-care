import { Phone } from "lucide-react";
import About from "@/components/About";
import AwardsSection from "@/components/AwardsSection";
import ContactsSection from "@/components/Contacts";
import Doctors from "@/components/Doctors";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewsSection from "@/components/NewsSection";
import PremiumDetails from "@/components/PremiumDetails";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import MultiStepBookingForm from "@/components/MultiStepBookingForm";
import PageSeo from "@/components/SEO/PageSeo";
import Schema from "@/components/SEO/Schema";
import { useLang } from "@/contexts/LanguageContext";
import { buildCanonical } from "@/utils/seo";

const ENABLE_EXPERIMENTAL_BLOCKS = false;

const Index = () => {
  const { lang } = useLang();

  return (
    <div className="min-h-screen">
      <PageSeo
        lang={lang}
        path="/"
        title={{
          uk: "Стоматологія у Кропивницькому | Імплантація, лікування зубів — Дентіс",
          en: "Dentistry in Kropyvnytskyi | Implants, dental treatment — Dentis",
        }}
        description={{
          uk: "Стоматологія Дентіс у Кропивницькому: лікування зубів, імплантація, протезування, професійна гігієна та консультації без черг.",
          en: "Dentis dental clinic in Kropyvnytskyi: dental treatment, implants, prosthetics, professional hygiene and consultations without long waits.",
        }}
      />
      <Schema
        type="MedicalWebPage"
        lang={lang}
        data={{
          name: lang === "uk" ? "Стоматологія Дентіс у Кропивницькому" : "Dentis dental clinic in Kropyvnytskyi",
          description:
            lang === "uk"
              ? "Приватна стоматологія у Кропивницькому з лікуванням карієсу, імплантацією, протезуванням і професійною гігієною."
              : "Private dental clinic in Kropyvnytskyi offering caries treatment, implants, prosthetics and professional hygiene.",
          url: buildCanonical("/", lang),
        }}
      />

      <Header />

      <main>
        <Hero />
        <About />
        <Services />
        <Doctors />
        <NewsSection />
        <Reviews />
        <Faq />
        <ContactsSection />
        <AwardsSection />

        {ENABLE_EXPERIMENTAL_BLOCKS && (
          <>
            <MultiStepBookingForm />
            <PremiumDetails />
          </>
        )}
      </main>

      <section className="bg-primary">
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
};

export default Index;
