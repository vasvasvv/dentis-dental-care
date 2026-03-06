import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Doctors from "@/components/Doctors";
import NewsSection from "@/components/NewsSection";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import ContactsSection from "@/components/Contacts";
import Footer from "@/components/Footer";
import { Phone } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Дентіс — Стоматологічна клініка у Кропивницькому</title>
        <meta name="description" content="Сучасна стоматологія з індивідуальним підходом. Імплантація, протезування, лікування карієсу, професійна гігієна. Кропивницький." />
        <link rel="canonical" href="https://dentis.pp.ua/" />
        <meta property="og:title" content="Дентіс — Стоматологічна клініка у Кропивницькому" />
        <meta property="og:description" content="Сучасна стоматологія з індивідуальним підходом. Комфорт, безпека та бездоганний результат." />
        <meta property="og:url" content="https://dentis.pp.ua/" />
        <meta property="og:type" content="website" />
      </Helmet>
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
      </main>
      <Footer />

      {/* Floating phone CTA */}
      <a
        href="tel:+380504800825"
        className="fixed bottom-6 right-6 z-50 gradient-gold text-accent-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-gold-custom hover:scale-110 transition-transform duration-200 md:hidden"
        aria-label="Зателефонувати"
      >
        <Phone size={22} />
      </a>
    </div>
  );
};

export default Index;