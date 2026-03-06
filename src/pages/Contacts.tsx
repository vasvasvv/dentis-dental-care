import Header from "@/components/Header";
import ContactsSection from "@/components/Contacts";
import Footer from "@/components/Footer";
import { Phone } from "lucide-react";

export default function ContactsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28">
        <ContactsSection />
      </main>
      <Footer />

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