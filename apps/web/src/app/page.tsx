import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSearchBar } from "@/components/hero-search-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const rooms = [
  {
    id: "doppia-standard",
    name: "Doppia Standard",
    description:
      "Camera accogliente con letto matrimoniale, arredata con gusto e dotata di ogni comfort moderno.",
    price: "da CHF 130/notte",
    gradient: "from-slate-400 to-slate-600",
    tag: "Più richiesta",
  },
  {
    id: "doppia-superiore",
    name: "Doppia Superiore",
    description:
      "Spaziosa camera superior con vista lago, balcone privato e arredi eleganti in stile ticinese.",
    price: "da CHF 180/notte",
    gradient: "from-blue-400 to-blue-700",
    tag: "Vista lago",
  },
  {
    id: "junior-suite",
    name: "Junior Suite",
    description:
      "Lussuosa suite con area soggiorno separata, vasca idromassaggio e servizio di concierge dedicato.",
    price: "da CHF 280/notte",
    gradient: "from-amber-400 to-amber-700",
    tag: "Lusso",
  },
  {
    id: "suite",
    name: "Suite Belvedere",
    description:
      "La nostra suite di punta: panorama mozzafiato sul Lago di Lugano, terrazza privata e butler service.",
    price: "da CHF 450/notte",
    gradient: "from-purple-400 to-purple-800",
    tag: "Suite",
  },
];

const services = [
  {
    label: "Wi-Fi Gratuito",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
      </svg>
    ),
  },
  {
    label: "Colazione Inclusa",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    label: "Piscina",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    ),
  },
  {
    label: "Parcheggio",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    label: "Ristorante",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 20.488l-.023.14a1.508 1.508 0 01-1.504 1.372h-2.946a1.508 1.508 0 01-1.504-1.372L9 20.488m5.5-5.244v1.244m-5.5-1.244v1.244m0 0H9m5.5 0H15M9 14.244c0 .276.224.5.5.5h5c.276 0 .5-.224.5-.5v-3.004A7.503 7.503 0 0012 9.74a7.503 7.503 0 00-3 1.5v3.004z" />
      </svg>
    ),
  },
  {
    label: "Spa & Benessere",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    label: "Concierge 24h",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    label: "Sala Conferenze",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f35] via-[#1e3a5f] to-[#0e4d4d]" />

        {/* Decorative overlay pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(201,169,110,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)`,
          }}
        />

        {/* Decorative lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full border border-[#c9a96e]/20" />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-[#c9a96e]/10" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full border border-white/10" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-[#c9a96e] text-sm tracking-[0.3em] uppercase font-medium mb-6">
            Lugano, Svizzera
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-none tracking-tight mb-6">
            Hotel{" "}
            <span className="font-semibold text-[#c9a96e]">Belvedere</span>
          </h1>
          <p className="text-white/70 text-lg sm:text-xl md:text-2xl font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Nel cuore di Lugano, tra lago e montagne
          </p>
          <Link href="/prenota">
            <Button className="bg-[#c9a96e] hover:bg-[#b8954d] text-[#1e3a5f] font-semibold text-lg px-10 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
              Prenota Ora
            </Button>
          </Link>
        </div>

        {/* Floating search bar */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-20 px-4">
          <HeroSearchBar />
        </div>
      </section>

      {/* Spacer for search bar overflow */}
      <div className="h-24 md:h-20 bg-white" />

      {/* Rooms Section */}
      <section id="camere" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#c9a96e] text-sm tracking-[0.3em] uppercase font-medium mb-3">
              Alloggi
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-[#1e3a5f] mb-4">
              Le Nostre <span className="font-semibold">Camere</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Ogni camera è stata progettata per offrire il massimo comfort e
              un&apos;atmosfera unica, armonizzando eleganza ticinese e modernità.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100"
              >
                {/* Image placeholder */}
                <div
                  className={`h-48 bg-gradient-to-br ${room.gradient} relative`}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-[#c9a96e] text-[#1e3a5f] font-semibold text-xs border-0">
                      {room.tag}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#1e3a5f] text-lg mb-2">
                    {room.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                    {room.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-[#c9a96e] font-semibold text-sm">
                      {room.price}
                    </p>
                    <Link href="/camere">
                      <Button
                        variant="outline"
                        className="h-8 px-4 text-xs border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white transition-colors rounded-full"
                      >
                        Scopri
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/camere">
              <Button
                variant="outline"
                className="border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white px-10 h-12 rounded-full font-semibold transition-all duration-200"
              >
                Vedi Tutte le Camere
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Services Section */}
      <section id="servizi" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#c9a96e] text-sm tracking-[0.3em] uppercase font-medium mb-3">
              Cosa Offriamo
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-[#1e3a5f] mb-4">
              I Nostri <span className="font-semibold">Servizi</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Un&apos;ospitalità completa per rendere il vostro soggiorno
              indimenticabile sotto ogni aspetto.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
            {services.map((service) => (
              <div
                key={service.label}
                className="flex flex-col items-center text-center group p-6 rounded-2xl bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-gray-100"
              >
                <div className="w-14 h-14 rounded-full bg-[#1e3a5f]/5 group-hover:bg-[#1e3a5f] flex items-center justify-center mb-4 transition-colors duration-200 text-[#1e3a5f] group-hover:text-white">
                  {service.icon}
                </div>
                <p className="text-[#1e3a5f] font-medium text-sm">
                  {service.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="posizione" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#c9a96e] text-sm tracking-[0.3em] uppercase font-medium mb-3">
                Dove Siamo
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-[#1e3a5f] mb-6">
                Come <span className="font-semibold">Raggiungerci</span>
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Hotel Belvedere si trova nel cuore di Lugano, a pochi passi dal
                lungolago e dal centro storico. Facilmente raggiungibile sia in
                auto che con i mezzi pubblici.
              </p>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#1e3a5f]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#1e3a5f] text-sm">Indirizzo</p>
                    <p className="text-gray-500 text-sm">Via Cassarate 12, 6900 Lugano, Svizzera</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#1e3a5f]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#1e3a5f] text-sm">In auto</p>
                    <p className="text-gray-500 text-sm">Autostrada A2, uscita Lugano Sud — 5 minuti</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#1e3a5f]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#1e3a5f] text-sm">In treno</p>
                    <p className="text-gray-500 text-sm">Stazione di Lugano — 10 minuti a piedi</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#1e3a5f]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#1e3a5f] text-sm">Aeroporto</p>
                    <p className="text-gray-500 text-sm">Aeroporto di Lugano-Agno — 15 minuti in taxi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="relative">
              <div className="w-full h-80 lg:h-96 rounded-2xl bg-gradient-to-br from-blue-100 to-teal-100 overflow-hidden shadow-lg relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-[#1e3a5f] flex items-center justify-center mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <p className="text-[#1e3a5f] font-semibold text-lg">Hotel Belvedere</p>
                  <p className="text-[#1e3a5f]/60 text-sm mt-1">Via Cassarate 12, Lugano</p>
                  <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xs">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className={`h-2 rounded-full ${i % 3 === 0 ? "bg-[#1e3a5f]/20" : i % 2 === 0 ? "bg-[#1e3a5f]/10" : "bg-[#c9a96e]/30"}`} />
                    ))}
                  </div>
                  <p className="text-[#1e3a5f]/40 text-xs mt-6">
                    Mappa interattiva — disponibile presto
                  </p>
                </div>

                {/* Decorative grid lines */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: "linear-gradient(to right, #1e3a5f 1px, transparent 1px), linear-gradient(to bottom, #1e3a5f 1px, transparent 1px)",
                  backgroundSize: "40px 40px"
                }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-[#1e3a5f] to-[#2d5186]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Pronti per un soggiorno{" "}
            <span className="text-[#c9a96e] font-semibold">indimenticabile</span>?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Prenota direttamente con noi e ottieni la tariffa migliore garantita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/prenota">
              <Button className="bg-[#c9a96e] hover:bg-[#b8954d] text-[#1e3a5f] font-semibold px-10 h-12 rounded-full shadow-lg hover:shadow-xl transition-all">
                Prenota Ora
              </Button>
            </Link>
            <a href="tel:+41919230000">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-10 h-12 rounded-full transition-all"
              >
                Chiamaci: +41 91 923 00 00
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
