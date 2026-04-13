import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Camere — Hotel Belvedere Lugano",
  description:
    "Scopri tutte le tipologie di camere dell'Hotel Belvedere: dalla singola alla suite, comfort elegante nel cuore di Lugano.",
};

const rooms = [
  {
    id: "singola",
    name: "Singola",
    description:
      "Camera accogliente e funzionale, ideale per viaggiatori d'affari o soggiorni brevi. Letto singolo, scrivania, bagno privato con doccia.",
    capacity: "1 persona",
    size: "18 m²",
    price: "da CHF 90",
    priceNote: "per notte",
    gradient: "from-gray-300 to-gray-500",
    tag: "Economy",
    tagColor: "bg-gray-500",
    amenities: [
      "Letto singolo",
      "Wi-Fi",
      "TV LCD",
      "Bagno privato",
      "Scrivania",
      "Aria condizionata",
    ],
    highlights: ["Check-in flessibile", "Colazione inclusa"],
  },
  {
    id: "doppia-standard",
    name: "Doppia Standard",
    description:
      "La nostra camera più richiesta. Letto matrimoniale o due letti singoli, decorata in stile ticinese con tocchi moderni. Bagno con doccia o vasca.",
    capacity: "2 persone",
    size: "25 m²",
    price: "da CHF 130",
    priceNote: "per notte",
    gradient: "from-slate-400 to-slate-600",
    tag: "Standard",
    tagColor: "bg-slate-500",
    amenities: [
      "Letto matrimoniale",
      "Wi-Fi",
      "TV LCD 42\"",
      "Minibar",
      "Cassaforte",
      "Bagno privato",
      "Aria condizionata",
      "Asciugacapelli",
    ],
    highlights: ["Colazione inclusa", "Pulizia giornaliera"],
  },
  {
    id: "doppia-superiore",
    name: "Doppia Superiore",
    description:
      "Spaziosa camera superior con vista parziale o completa sul Lago di Lugano. Balcone privato, arredi di pregio e servizi premium.",
    capacity: "2 persone",
    size: "32 m²",
    price: "da CHF 180",
    priceNote: "per notte",
    gradient: "from-blue-400 to-blue-700",
    tag: "Superiore",
    tagColor: "bg-blue-600",
    amenities: [
      "Letto king size",
      "Balcone privato",
      "Vista lago",
      "Wi-Fi",
      "TV LCD 50\"",
      "Minibar premium",
      "Cassaforte",
      "Bagno con vasca",
      "Accappatoi",
      "Aria condizionata",
    ],
    highlights: ["Vista lago", "Balcone privato", "Colazione inclusa"],
  },
  {
    id: "tripla-standard",
    name: "Tripla Standard",
    description:
      "Perfetta per famiglie o gruppi di tre, con letto matrimoniale e letto singolo aggiuntivo. Spazio generoso e dotazioni complete.",
    capacity: "3 persone",
    size: "30 m²",
    price: "da CHF 170",
    priceNote: "per notte",
    gradient: "from-emerald-400 to-emerald-700",
    tag: "Famiglia",
    tagColor: "bg-emerald-600",
    amenities: [
      "Letto matrimoniale + singolo",
      "Wi-Fi",
      "TV LCD",
      "Minibar",
      "Bagno privato",
      "Aria condizionata",
    ],
    highlights: ["Ideale per famiglie", "Colazione inclusa"],
  },
  {
    id: "quadrupla-standard",
    name: "Quadrupla Standard",
    description:
      "Camera spaziosa per 4 persone, con configurazione flessibile dei letti. Ottima scelta per famiglie numerose o gruppi di amici.",
    capacity: "4 persone",
    size: "38 m²",
    price: "da CHF 210",
    priceNote: "per notte",
    gradient: "from-teal-400 to-teal-700",
    tag: "Famiglia Plus",
    tagColor: "bg-teal-600",
    amenities: [
      "2 letti matrimoniali",
      "Wi-Fi",
      "TV LCD",
      "Minibar",
      "Bagno privato",
      "Area relax",
      "Aria condizionata",
    ],
    highlights: ["Famiglie numerose", "Colazione inclusa"],
  },
  {
    id: "twin",
    name: "Twin",
    description:
      "Camera con due letti singoli separati, ideale per colleghi di lavoro o amici. Arredata con gusto, dotata di tutti i comfort.",
    capacity: "2 persone",
    size: "26 m²",
    price: "da CHF 140",
    priceNote: "per notte",
    gradient: "from-indigo-300 to-indigo-500",
    tag: "Twin",
    tagColor: "bg-indigo-500",
    amenities: [
      "2 letti singoli",
      "Wi-Fi",
      "TV LCD",
      "Minibar",
      "Bagno privato",
      "Scrivania doppia",
      "Aria condizionata",
    ],
    highlights: ["Business friendly", "Colazione inclusa"],
  },
  {
    id: "junior-suite",
    name: "Junior Suite",
    description:
      "Lussuosa suite con area soggiorno separata, vista panoramica sul lago e dotazioni di alta gamma. Un'esperienza di soggiorno esclusiva.",
    capacity: "2 persone",
    size: "50 m²",
    price: "da CHF 280",
    priceNote: "per notte",
    gradient: "from-amber-400 to-amber-700",
    tag: "Lusso",
    tagColor: "bg-amber-600",
    amenities: [
      "Letto king size",
      "Area soggiorno",
      "Vista lago panoramica",
      "Balcone privato",
      "Wi-Fi",
      "TV LCD 55\"",
      "Minibar premium",
      "Bagno con vasca idromassaggio",
      "Accappatoi di lusso",
      "Amenities premium",
      "Aria condizionata",
    ],
    highlights: [
      "Vista panoramica",
      "Vasca idromassaggio",
      "Colazione inclusa",
      "Late checkout",
    ],
  },
  {
    id: "suite",
    name: "Suite Belvedere",
    description:
      "La nostra suite di eccellenza. Panorama mozzafiato a 180° sul Lago di Lugano, terrazza privata arredata, butler service dedicato e ogni lusso immaginabile.",
    capacity: "2–4 persone",
    size: "85 m²",
    price: "da CHF 450",
    priceNote: "per notte",
    gradient: "from-purple-400 to-purple-800",
    tag: "Suite Esclusiva",
    tagColor: "bg-purple-700",
    amenities: [
      "Letto king size",
      "Area living con divano",
      "Terrazza privata arredata",
      "Vista lago 180°",
      "Wi-Fi",
      "Home theatre 65\"",
      "Bar privato",
      "Bagno di lusso con vasca",
      "Doccia walk-in",
      "Accappatoi e pantofole",
      "Amenities di lusso",
      "Butler service",
      "Aria condizionata",
      "Cassaforte digitale",
    ],
    highlights: [
      "Terrazza privata",
      "Butler service",
      "Late checkout incluso",
      "Benvenuto con champagne",
      "Transfer aeroporto incluso",
    ],
  },
];

export default function CamerePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Page header */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5186] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#c9a96e] text-sm tracking-[0.3em] uppercase font-medium mb-4">
            Alloggi
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4">
            Le Nostre <span className="font-semibold">Camere</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Dalla camera singola alla suite esclusiva, ogni ambiente è stato
            curato nei minimi dettagli per garantire il massimo comfort.
          </p>
        </div>
      </section>

      {/* Rooms list */}
      <section className="py-16 md:py-24 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {rooms.map((room, index) => (
              <div key={room.id}>
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg group ${
                      index % 2 === 1 ? "lg:col-start-2" : ""
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${room.gradient} transition-transform duration-500 group-hover:scale-105`}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    {/* Room info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-semibold text-white px-3 py-1 rounded-full ${room.tagColor}`}
                        >
                          {room.tag}
                        </span>
                        <span className="text-white/70 text-sm">
                          {room.size} · {room.capacity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                    <h2 className="text-3xl md:text-4xl font-light text-[#1e3a5f] mb-2">
                      {room.name}
                    </h2>
                    <p className="text-[#c9a96e] font-semibold text-xl mb-4">
                      {room.price}{" "}
                      <span className="text-sm font-normal text-gray-400">
                        {room.priceNote}
                      </span>
                    </p>
                    <p className="text-gray-500 leading-relaxed mb-6">
                      {room.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {room.highlights.map((h) => (
                        <span
                          key={h}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#1e3a5f] bg-[#1e3a5f]/5 px-3 py-1.5 rounded-full"
                        >
                          <svg
                            className="w-3 h-3 text-[#c9a96e]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* Amenities */}
                    <div className="mb-8">
                      <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">
                        Dotazioni
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity) => (
                          <Badge
                            key={amenity}
                            variant="secondary"
                            className="text-xs text-gray-600 bg-gray-100 border-0 font-normal"
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Link href={`/prenota?camera=${room.id}`}>
                      <Button className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold px-8 h-11 rounded-full transition-all shadow-md hover:shadow-lg">
                        Prenota questa camera
                      </Button>
                    </Link>
                  </div>
                </div>

                {index < rooms.length - 1 && (
                  <Separator className="mt-12 bg-gray-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
