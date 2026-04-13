"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export function HeroSearchBar() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkin", format(checkIn, "yyyy-MM-dd"));
    if (checkOut) params.set("checkout", format(checkOut, "yyyy-MM-dd"));
    params.set("adults", String(adults));
    params.set("children", String(children));
    router.push(`/prenota?${params.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-5 border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Check-in */}
          <Popover>
            <PopoverTrigger className="flex flex-col items-start gap-1 px-4 py-3 rounded-xl border border-gray-200 hover:border-[#1e3a5f] transition-colors text-left w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30">
              <span className="text-[10px] font-semibold text-[#c9a96e] tracking-widest uppercase">
                Check-in
              </span>
              <span className={`text-sm font-medium ${checkIn ? "text-[#1e3a5f]" : "text-gray-400"}`}>
                {checkIn ? format(checkIn, "d MMM yyyy", { locale: it }) : "Seleziona data"}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" side="bottom" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={(date) => date < new Date()}
                locale={it}
              />
            </PopoverContent>
          </Popover>

          {/* Check-out */}
          <Popover>
            <PopoverTrigger className="flex flex-col items-start gap-1 px-4 py-3 rounded-xl border border-gray-200 hover:border-[#1e3a5f] transition-colors text-left w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30">
              <span className="text-[10px] font-semibold text-[#c9a96e] tracking-widest uppercase">
                Check-out
              </span>
              <span className={`text-sm font-medium ${checkOut ? "text-[#1e3a5f]" : "text-gray-400"}`}>
                {checkOut ? format(checkOut, "d MMM yyyy", { locale: it }) : "Seleziona data"}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" side="bottom" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => date < (checkIn ?? new Date())}
                locale={it}
              />
            </PopoverContent>
          </Popover>

          {/* Guests */}
          <Popover>
            <PopoverTrigger className="flex flex-col items-start gap-1 px-4 py-3 rounded-xl border border-gray-200 hover:border-[#1e3a5f] transition-colors text-left w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30">
              <span className="text-[10px] font-semibold text-[#c9a96e] tracking-widest uppercase">
                Ospiti
              </span>
              <span className="text-sm font-medium text-[#1e3a5f]">
                {adults} adul{adults === 1 ? "to" : "ti"}
                {children > 0 && `, ${children} bambin${children === 1 ? "o" : "i"}`}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" side="bottom" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1e3a5f] text-sm">Adulti</p>
                    <p className="text-xs text-gray-400">Età 13+</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#1e3a5f] transition-colors text-[#1e3a5f] font-medium"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-semibold text-[#1e3a5f]">
                      {adults}
                    </span>
                    <button
                      onClick={() => setAdults(Math.min(10, adults + 1))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#1e3a5f] transition-colors text-[#1e3a5f] font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1e3a5f] text-sm">Bambini</p>
                    <p className="text-xs text-gray-400">Età 0–12</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#1e3a5f] transition-colors text-[#1e3a5f] font-medium"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-semibold text-[#1e3a5f]">
                      {children}
                    </span>
                    <button
                      onClick={() => setChildren(Math.min(10, children + 1))}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#1e3a5f] transition-colors text-[#1e3a5f] font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Search button */}
          <Button
            onClick={handleSearch}
            className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold h-full min-h-[64px] rounded-xl text-sm tracking-wide shadow-md hover:shadow-lg transition-all"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
            </svg>
            Cerca Disponibilità
          </Button>
        </div>
      </div>
    </div>
  );
}
