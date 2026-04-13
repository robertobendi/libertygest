"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, differenceInCalendarDays } from "date-fns";
import { it } from "date-fns/locale";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookingData {
  checkIn?: Date;
  checkOut?: Date;
  adults: number;
  children: number;
  selectedRoom?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  requests: string;
}

function parseBookingSearchParams(searchParams: {
  get(name: string): string | null;
}): Partial<BookingData> {
  const updates: Partial<BookingData> = {};
  const checkin = searchParams.get("checkin");
  const checkout = searchParams.get("checkout");
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");
  const camera = searchParams.get("camera");
  if (checkin) updates.checkIn = new Date(checkin);
  if (checkout) updates.checkOut = new Date(checkout);
  if (adults) updates.adults = parseInt(adults, 10);
  if (children) updates.children = parseInt(children, 10);
  if (camera) updates.selectedRoom = camera;
  return updates;
}

const availableRooms = [
  {
    id: "doppia-standard",
    name: "Doppia Standard",
    pricePerNight: 130,
    gradient: "from-slate-400 to-slate-600",
    capacity: "2 persone",
    size: "25 m²",
    amenities: ["Wi-Fi", "TV LCD", "Minibar", "Bagno privato"],
  },
  {
    id: "doppia-superiore",
    name: "Doppia Superiore",
    pricePerNight: 180,
    gradient: "from-blue-400 to-blue-700",
    capacity: "2 persone",
    size: "32 m²",
    amenities: ["Wi-Fi", "Vista lago", "Balcone", "Vasca"],
  },
  {
    id: "tripla-standard",
    name: "Tripla Standard",
    pricePerNight: 170,
    gradient: "from-emerald-400 to-emerald-700",
    capacity: "3 persone",
    size: "30 m²",
    amenities: ["Wi-Fi", "TV LCD", "Minibar", "Bagno privato"],
  },
  {
    id: "junior-suite",
    name: "Junior Suite",
    pricePerNight: 280,
    gradient: "from-amber-400 to-amber-700",
    capacity: "2 persone",
    size: "50 m²",
    amenities: ["Wi-Fi", "Vista lago", "Vasca idromassaggio", "Soggiorno"],
  },
  {
    id: "suite",
    name: "Suite Belvedere",
    pricePerNight: 450,
    gradient: "from-purple-400 to-purple-800",
    capacity: "2–4 persone",
    size: "85 m²",
    amenities: ["Butler service", "Terrazza privata", "Home theatre", "Bar"],
  },
];

const nationalities = [
  "Italiana",
  "Svizzera",
  "Tedesca",
  "Francese",
  "Inglese",
  "Americana",
  "Spagnola",
  "Portoghese",
  "Olandese",
  "Belga",
  "Austriaca",
  "Altra",
];

const nights = (checkIn?: Date, checkOut?: Date) => {
  if (!checkIn || !checkOut) return 0;
  return Math.max(1, differenceInCalendarDays(checkOut, checkIn));
};

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const steps = [
    { n: 1, label: "Date" },
    { n: 2, label: "Camera" },
    { n: 3, label: "Dati" },
    { n: 4, label: "Conferma" },
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 ${
                step === s.n
                  ? "bg-[#1e3a5f] border-[#1e3a5f] text-white shadow-lg scale-110"
                  : step > s.n
                  ? "bg-[#c9a96e] border-[#c9a96e] text-[#1e3a5f]"
                  : "bg-white border-gray-200 text-gray-400"
              }`}
            >
              {step > s.n ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                s.n
              )}
            </div>
            <span
              className={`text-xs mt-1.5 font-medium ${
                step >= s.n ? "text-[#1e3a5f]" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-12 sm:w-20 h-0.5 mb-4 mx-2 transition-colors duration-300 ${
                step > s.n ? "bg-[#c9a96e]" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({
  data,
  onChange,
  onNext,
}: {
  data: BookingData;
  onChange: (updates: Partial<BookingData>) => void;
  onNext: () => void;
}) {
  const canProceed = data.checkIn && data.checkOut && data.adults >= 1;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#1e3a5f] mb-2">Seleziona le Date</h2>
      <p className="text-gray-500 text-sm mb-8">Inserisci le date di check-in e check-out e il numero di ospiti.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {/* Check-in */}
        <div>
          <Label className="text-[#1e3a5f] font-medium mb-2 block">Data Check-in</Label>
          <Popover>
            <PopoverTrigger className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-[#1e3a5f] transition-colors text-left bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30">
              <svg className="w-4 h-4 text-[#c9a96e] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className={`text-sm ${data.checkIn ? "text-[#1e3a5f] font-medium" : "text-gray-400"}`}>
                {data.checkIn ? format(data.checkIn, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" side="bottom" align="start">
              <Calendar
                mode="single"
                selected={data.checkIn}
                onSelect={(date) => onChange({ checkIn: date })}
                disabled={(date) => date < new Date()}
                locale={it}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out */}
        <div>
          <Label className="text-[#1e3a5f] font-medium mb-2 block">Data Check-out</Label>
          <Popover>
            <PopoverTrigger className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-[#1e3a5f] transition-colors text-left bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30">
              <svg className="w-4 h-4 text-[#c9a96e] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className={`text-sm ${data.checkOut ? "text-[#1e3a5f] font-medium" : "text-gray-400"}`}>
                {data.checkOut ? format(data.checkOut, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" side="bottom" align="start">
              <Calendar
                mode="single"
                selected={data.checkOut}
                onSelect={(date) => onChange({ checkOut: date })}
                disabled={(date) => date <= (data.checkIn ?? new Date())}
                locale={it}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-8">
        {/* Adults */}
        <div>
          <Label className="text-[#1e3a5f] font-medium mb-2 block">Adulti (13+)</Label>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 bg-white">
            <button
              onClick={() => onChange({ adults: Math.max(1, data.adults - 1) })}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#1e3a5f] transition-colors text-[#1e3a5f] font-bold text-lg leading-none"
            >
              −
            </button>
            <span className="flex-1 text-center font-semibold text-[#1e3a5f]">{data.adults}</span>
            <button
              onClick={() => onChange({ adults: Math.min(10, data.adults + 1) })}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#1e3a5f] transition-colors text-[#1e3a5f] font-bold text-lg leading-none"
            >
              +
            </button>
          </div>
        </div>

        {/* Children */}
        <div>
          <Label className="text-[#1e3a5f] font-medium mb-2 block">Bambini (0–12)</Label>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 bg-white">
            <button
              onClick={() => onChange({ children: Math.max(0, data.children - 1) })}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#1e3a5f] transition-colors text-[#1e3a5f] font-bold text-lg leading-none"
            >
              −
            </button>
            <span className="flex-1 text-center font-semibold text-[#1e3a5f]">{data.children}</span>
            <button
              onClick={() => onChange({ children: Math.min(10, data.children + 1) })}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#1e3a5f] transition-colors text-[#1e3a5f] font-bold text-lg leading-none"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.checkIn && data.checkOut && (
        <div className="bg-[#1e3a5f]/5 rounded-xl p-4 mb-8 flex flex-wrap gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Notti</p>
            <p className="text-[#1e3a5f] font-semibold">{nights(data.checkIn, data.checkOut)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Check-in</p>
            <p className="text-[#1e3a5f] font-semibold">{format(data.checkIn, "d MMM", { locale: it })}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Check-out</p>
            <p className="text-[#1e3a5f] font-semibold">{format(data.checkOut, "d MMM", { locale: it })}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Ospiti</p>
            <p className="text-[#1e3a5f] font-semibold">{data.adults + data.children} persone</p>
          </div>
        </div>
      )}

      <Button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold h-12 rounded-full disabled:opacity-40 transition-all"
      >
        Continua — Seleziona Camera
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: BookingData;
  onChange: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const numNights = nights(data.checkIn, data.checkOut);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#1e3a5f] mb-2">Scegli la Camera</h2>
      <p className="text-gray-500 text-sm mb-8">
        Camere disponibili per {numNights} nott{numNights === 1 ? "e" : "i"},{" "}
        {data.adults} adult{data.adults === 1 ? "o" : "i"}
        {data.children > 0 ? ` e ${data.children} bambin${data.children === 1 ? "o" : "i"}` : ""}
      </p>

      <div className="space-y-4 mb-8">
        {availableRooms.map((room) => {
          const selected = data.selectedRoom === room.id;
          const total = room.pricePerNight * numNights;
          return (
            <div
              key={room.id}
              onClick={() => onChange({ selectedRoom: room.id })}
              className={`flex gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                selected
                  ? "border-[#1e3a5f] bg-[#1e3a5f]/5 shadow-md"
                  : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              {/* Image */}
              <div
                className={`w-24 h-20 rounded-xl bg-gradient-to-br ${room.gradient} flex-shrink-0 relative overflow-hidden`}
              >
                {selected && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#1e3a5f]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className={`font-semibold text-base ${selected ? "text-[#1e3a5f]" : "text-gray-800"}`}>
                    {room.name}
                  </h3>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#c9a96e] font-bold">
                      CHF {room.pricePerNight}
                      <span className="text-xs font-normal text-gray-400">/notte</span>
                    </p>
                    {numNights > 0 && (
                      <p className="text-xs text-gray-400">Totale: CHF {total}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  {room.capacity} · {room.size}
                </p>
                <div className="flex flex-wrap gap-1">
                  {room.amenities.map((a) => (
                    <Badge
                      key={a}
                      variant="secondary"
                      className="text-[10px] font-normal text-gray-500 bg-gray-100 border-0 py-0"
                    >
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 border-gray-200 text-gray-600 h-12 rounded-full hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Indietro
        </Button>
        <Button
          onClick={onNext}
          disabled={!data.selectedRoom}
          className="flex-1 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold h-12 rounded-full disabled:opacity-40"
        >
          Continua
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: BookingData;
  onChange: (updates: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canProceed = data.firstName && data.lastName && data.email && data.phone;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#1e3a5f] mb-2">I Tuoi Dati</h2>
      <p className="text-gray-500 text-sm mb-8">
        Inserisci i dati del titolare della prenotazione.
      </p>

      <div className="space-y-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="firstName" className="text-[#1e3a5f] font-medium mb-2 block">
              Nome *
            </Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              placeholder="Mario"
              className="h-11 rounded-xl border-gray-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-[#1e3a5f] font-medium mb-2 block">
              Cognome *
            </Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              placeholder="Rossi"
              className="h-11 rounded-xl border-gray-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-[#1e3a5f] font-medium mb-2 block">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="mario.rossi@email.com"
            className="h-11 rounded-xl border-gray-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-[#1e3a5f] font-medium mb-2 block">
            Telefono *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+41 79 123 45 67"
            className="h-11 rounded-xl border-gray-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20"
          />
        </div>

        <div>
          <Label className="text-[#1e3a5f] font-medium mb-2 block">Nazionalità</Label>
          <Select
            value={data.nationality}
            onValueChange={(val) => onChange({ nationality: val ?? "" })}
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-gray-200">
              <SelectValue placeholder="Seleziona nazionalità" />
            </SelectTrigger>
            <SelectContent>
              {nationalities.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="requests" className="text-[#1e3a5f] font-medium mb-2 block">
            Richieste Speciali
            <span className="text-gray-400 font-normal ml-1">(opzionale)</span>
          </Label>
          <textarea
            id="requests"
            value={data.requests}
            onChange={(e) => onChange({ requests: e.target.value })}
            placeholder="Camera silenziosaa, letto extra, allergie alimentari per la colazione..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 text-sm resize-none outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 border-gray-200 text-gray-600 h-12 rounded-full hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Indietro
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold h-12 rounded-full disabled:opacity-40"
        >
          Rivedi Prenotazione
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────

function Step4({
  data,
  onBack,
  onConfirm,
  confirmed,
  confirmationCode,
}: {
  data: BookingData;
  onBack: () => void;
  onConfirm: () => void;
  confirmed: boolean;
  confirmationCode: string | null;
}) {
  const room = availableRooms.find((r) => r.id === data.selectedRoom);
  const numNights = nights(data.checkIn, data.checkOut);
  const total = (room?.pricePerNight ?? 0) * numNights;

  if (confirmed) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-semibold text-[#1e3a5f] mb-3">Prenotazione Confermata!</h2>
        <p className="text-gray-500 mb-2">
          Grazie, <strong>{data.firstName} {data.lastName}</strong>!
        </p>
        <p className="text-gray-500 mb-8">
          Ti abbiamo inviato una conferma all&apos;indirizzo{" "}
          <strong className="text-[#1e3a5f]">{data.email}</strong>.
        </p>

        <div className="bg-[#1e3a5f]/5 rounded-2xl p-6 text-left max-w-md mx-auto mb-8">
          <div className="text-center mb-4">
            <p className="text-[#c9a96e] text-xs tracking-widest uppercase font-semibold">
              Numero Prenotazione
            </p>
            <p className="text-2xl font-bold text-[#1e3a5f] mt-1">
              {confirmationCode ?? "—"}
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Camera</span>
              <span className="font-medium text-[#1e3a5f]">{room?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Check-in</span>
              <span className="font-medium text-[#1e3a5f]">
                {data.checkIn ? format(data.checkIn, "d MMMM yyyy", { locale: it }) : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Check-out</span>
              <span className="font-medium text-[#1e3a5f]">
                {data.checkOut ? format(data.checkOut, "d MMMM yyyy", { locale: it }) : "—"}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="text-gray-400">Totale</span>
              <span className="font-bold text-[#c9a96e] text-base">CHF {total}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm">
          Per assistenza:{" "}
          <a href="mailto:info@hotelbelvedere.ch" className="text-[#1e3a5f] underline">
            info@hotelbelvedere.ch
          </a>{" "}
          o{" "}
          <a href="tel:+41919230000" className="text-[#1e3a5f] underline">
            +41 91 923 00 00
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#1e3a5f] mb-2">Riepilogo Prenotazione</h2>
      <p className="text-gray-500 text-sm mb-8">Controlla i dettagli e conferma.</p>

      <div className="space-y-5 mb-8">
        {/* Room card */}
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          <div className={`h-28 bg-gradient-to-br ${room?.gradient}`} />
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-[#1e3a5f] text-lg">{room?.name}</h3>
                <p className="text-gray-500 text-sm">{room?.capacity} · {room?.size}</p>
              </div>
              <div className="text-right">
                <p className="text-[#c9a96e] font-bold text-lg">CHF {total}</p>
                <p className="text-xs text-gray-400">{numNights} nott{numNights === 1 ? "e" : "i"} × CHF {room?.pricePerNight}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Check-in</p>
            <p className="font-semibold text-[#1e3a5f] text-sm">
              {data.checkIn ? format(data.checkIn, "EEEE d MMM", { locale: it }) : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">dalle ore 14:00</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Check-out</p>
            <p className="font-semibold text-[#1e3a5f] text-sm">
              {data.checkOut ? format(data.checkOut, "EEEE d MMM", { locale: it }) : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">entro le ore 11:00</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Ospiti</p>
            <p className="font-semibold text-[#1e3a5f] text-sm">
              {data.adults} adult{data.adults === 1 ? "o" : "i"}
              {data.children > 0 ? `, ${data.children} bambin${data.children === 1 ? "o" : "i"}` : ""}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Intestatario</p>
            <p className="font-semibold text-[#1e3a5f] text-sm">
              {data.firstName} {data.lastName}
            </p>
          </div>
        </div>

        {/* Guest info */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Dati di Contatto</p>
          <div className="flex gap-2 text-sm">
            <span className="text-gray-400 w-20">Email</span>
            <span className="text-[#1e3a5f] font-medium">{data.email}</span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-gray-400 w-20">Telefono</span>
            <span className="text-[#1e3a5f] font-medium">{data.phone}</span>
          </div>
          {data.nationality && (
            <div className="flex gap-2 text-sm">
              <span className="text-gray-400 w-20">Nazionalità</span>
              <span className="text-[#1e3a5f] font-medium">{data.nationality}</span>
            </div>
          )}
          {data.requests && (
            <div className="flex gap-2 text-sm">
              <span className="text-gray-400 w-20">Richieste</span>
              <span className="text-[#1e3a5f] font-medium">{data.requests}</span>
            </div>
          )}
        </div>

        {/* Price summary */}
        <div className="rounded-xl border-2 border-[#c9a96e]/30 bg-[#c9a96e]/5 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">
              CHF {room?.pricePerNight} × {numNights} nott{numNights === 1 ? "e" : "i"}
            </span>
            <span className="text-gray-700 font-medium">CHF {total}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Colazione</span>
            <span className="text-green-600 font-medium">Inclusa</span>
          </div>
          <div className="flex justify-between text-sm border-t border-[#c9a96e]/20 pt-2 mt-2">
            <span className="font-semibold text-[#1e3a5f]">Totale</span>
            <span className="font-bold text-[#c9a96e] text-lg">CHF {total}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Pagamento alla struttura. Cancellazione gratuita fino a 48h prima.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 border-gray-200 text-gray-600 h-12 rounded-full hover:border-[#1e3a5f] hover:text-[#1e3a5f]"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Indietro
        </Button>
        <Button
          onClick={onConfirm}
          className="flex-1 bg-[#c9a96e] hover:bg-[#b8954d] text-[#1e3a5f] font-bold h-12 rounded-full shadow-md hover:shadow-lg transition-all"
        >
          Conferma Prenotazione
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function BookingFlowInner() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  const [data, setData] = useState<BookingData>(() => ({
    adults: 2,
    children: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    requests: "",
    ...parseBookingSearchParams(searchParams),
  }));

  const update = (updates: Partial<BookingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
      {!confirmed && <StepIndicator step={step} />}

      {step === 1 && (
        <Step1
          data={data}
          onChange={update}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <Step2
          data={data}
          onChange={update}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Step3
          data={data}
          onChange={update}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <Step4
          data={data}
          onBack={() => setStep(3)}
          onConfirm={() => {
            setConfirmationCode(
              `HB-${Math.floor(100000 + Math.random() * 900000)}`
            );
            setConfirmed(true);
          }}
          confirmed={confirmed}
          confirmationCode={confirmationCode}
        />
      )}
    </div>
  );
}

function BookingFlowKeyed() {
  const searchParams = useSearchParams();
  return <BookingFlowInner key={searchParams.toString()} />;
}

export function BookingFlow() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
        <div className="text-gray-400">Caricamento...</div>
      </div>
    }>
      <BookingFlowKeyed />
    </Suspense>
  );
}
