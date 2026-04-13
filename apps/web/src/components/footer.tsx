import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Camere", href: "/camere" },
  { label: "Prenota", href: "/prenota" },
  { label: "Servizi", href: "/#servizi" },
  { label: "Come raggiungerci", href: "/#posizione" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "TripAdvisor",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-8a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer id="footer" className="bg-[#1e3a5f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#c9a96e] flex items-center justify-center">
                <span className="text-[#1e3a5f] font-bold">HB</span>
              </div>
              <div>
                <p className="text-white font-semibold text-lg leading-tight">
                  Hotel Belvedere
                </p>
                <p className="text-[#c9a96e] text-xs tracking-widest uppercase">
                  Lugano, Svizzera
                </p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Immerso nel verde del Ticino, Hotel Belvedere offre un&apos;esperienza
              esclusiva di ospitalità sulle rive del Lago di Lugano. Eleganza,
              comfort e cura nei dettagli per un soggiorno indimenticabile.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#c9a96e] flex items-center justify-center transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#c9a96e] font-semibold text-sm tracking-widest uppercase mb-5">
              Link Rapidi
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#c9a96e] text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#c9a96e] font-semibold text-sm tracking-widest uppercase mb-5">
              Contatti
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <svg
                  className="w-4 h-4 text-[#c9a96e] mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white/60 text-sm leading-relaxed">
                  Via Cassarate 12<br />
                  6900 Lugano, Svizzera
                </span>
              </li>
              <li className="flex gap-3">
                <svg
                  className="w-4 h-4 text-[#c9a96e] mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a
                  href="tel:+41919230000"
                  className="text-white/60 hover:text-[#c9a96e] text-sm transition-colors"
                >
                  +41 91 923 00 00
                </a>
              </li>
              <li className="flex gap-3">
                <svg
                  className="w-4 h-4 text-[#c9a96e] mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a
                  href="mailto:info@hotelbelvedere.ch"
                  className="text-white/60 hover:text-[#c9a96e] text-sm transition-colors"
                >
                  info@hotelbelvedere.ch
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-xs">
          <p>
            &copy; {new Date().getFullYear()} Hotel Belvedere Lugano SA. Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white/70 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              Termini e Condizioni
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
