"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  Building2,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/": "Piano Camere",
  "/calendar": "Calendario",
  "/reservations/new": "Nuova Prenotazione",
  "/reservations": "Elenco Prenotazioni",
  "/orders": "Ordini",
  "/guests": "Ospiti",
  "/pricing/rate-plans": "Piani Tariffari",
  "/pricing/management": "Gestione Prezzi",
  "/pricing/algorithm": "Algoritmo Prezzi",
  "/pricing/extras": "Supplementi",
  "/pricing/taxes": "Tasse",
  "/promotions": "Promozioni",
  "/vouchers": "Voucher",
  "/housekeeping": "Gestione Stanze",
  "/housekeeping/forecast": "Previsioni",
  "/housekeeping/staff": "Staff",
  "/stats/kpi": "KPI Dashboard",
  "/stats/overnights": "Pernottamenti",
  "/stats/revenue": "Ricavi",
  "/stats/marketing": "Marketing",
  "/stats/clients": "Clienti",
  "/reports/checkin": "Report Check-in",
  "/reports/revenue": "Report Ricavi",
  "/reports/touristic": "Report Turistico",
  "/settings/hotel": "Impostazioni Hotel",
  "/settings/room-types": "Tipologie Stanze",
  "/settings/rooms": "Camere",
  "/settings/users": "Utenti",
  "/settings/content": "Contenuti",
};

export function AppHeader() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  const pageTitle = routeLabels[pathname] ?? "LibertyGest";

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />

        {/* Breadcrumb / page title */}
        <div className="flex-1">
          <span className="text-sm font-medium">{pageTitle}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-2 text-muted-foreground w-44"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-3.5" />
            <span className="text-xs">Cerca...</span>
            <kbd className="ml-auto pointer-events-none hidden select-none items-center gap-1 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" />
          </Button>

          {/* Property selector */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1.5" />
              }
            >
              <Building2 className="size-3.5" />
              <span className="text-xs max-w-24 truncate">Hotel Liberty</span>
              <ChevronDown className="size-3 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Strutture</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Building2 className="size-4" />
                Hotel Liberty
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<button className="outline-none" />}>
              <Avatar size="sm">
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">Admin</span>
                  <span className="text-xs text-muted-foreground font-normal">admin@hotel.it</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="size-4" />
                Profilo
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4" />
                Impostazioni
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut className="size-4" />
                Esci
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Search dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen} title="Ricerca">
        <CommandInput placeholder="Cerca prenotazioni, ospiti, camere..." />
        <CommandList>
          <CommandEmpty>Nessun risultato trovato.</CommandEmpty>
          <CommandGroup heading="Sezioni">
            <CommandItem onSelect={() => setSearchOpen(false)}>
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => setSearchOpen(false)}>
              <span>Prenotazioni</span>
            </CommandItem>
            <CommandItem onSelect={() => setSearchOpen(false)}>
              <span>Ospiti</span>
            </CommandItem>
            <CommandItem onSelect={() => setSearchOpen(false)}>
              <span>Tariffe</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
