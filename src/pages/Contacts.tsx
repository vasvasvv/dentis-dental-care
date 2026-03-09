import Header from "@/components/Header";
import ContactsSection from "@/components/Contacts";
import Footer from "@/components/Footer";
import { Phone } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function ContactsPage() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Контакти — Дентіс Кропивницький</title>
        <meta name="description" content="Адреса, телефон та графік роботи клініки Дентіс. вул. Героїв-рятувальників, 9/2, Кропивницький. Пн–Пт 9:00–19:00, Сб 9:00–15:00." />
        <link rel="canonical" href="https://dentis.pp.ua/contacts" />
        <meta property="og:title" content="Контакти — Дентіс Кропивницький" />
        <meta property="og:description" content="Знайдіть нас за адресою: вул. Героїв-рятувальників, 9/2, Кропивницький. Телефон: +38 050 480 0825." />
        <meta property="og:url" content="https://dentis.pp.ua/contacts" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://dentis.pp.ua/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Helmet>
      <Header />
      <main className="pt-28">
        <ContactsSection />
      </main>
      <section className="bg-navy">
      <Footer />
</section>
      <a
        href="tel:+380504800825"
        className="fixed bottom-6 right-6 z-50 gradient-gold text-accent-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-gold-custom hover:scale-110 transition-transform duration-200 md:hidden"
        aria-label="Зателефонувати"
      >
        <Phone size={22} />
      </a>
    </div>
  );
}