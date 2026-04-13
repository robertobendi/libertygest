import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BookingFlow } from "@/components/booking-flow";

export const metadata: Metadata = {
  title: "Prenota — Hotel Belvedere Lugano",
  description:
    "Prenota la tua camera all'Hotel Belvedere di Lugano. Processo di prenotazione semplice e sicuro.",
};

export default function PrenotaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5186] py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#c9a96e] text-sm tracking-[0.3em] uppercase font-medium mb-3">
            Prenotazione
          </p>
          <h1 className="text-3xl md:text-4xl font-light text-white">
            Prenota il tuo{" "}
            <span className="font-semibold">Soggiorno</span>
          </h1>
        </div>
      </section>

      {/* Booking flow */}
      <section className="flex-1 py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingFlow />
        </div>
      </section>

      <Footer />
    </div>
  );
}
