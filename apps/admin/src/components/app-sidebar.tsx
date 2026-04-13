"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  BookOpen,
  Users,
  BadgeEuro,
  Tag,
  Sparkles,
  BarChart3,
  FileText,
  Settings,
  ChevronRight,
  Hotel,
} from "lucide-react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: { title: string; href: string }[];
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Piano Camere",
    icon: BedDouble,
    href: "/",
  },
  {
    title: "Calendario",
    icon: CalendarDays,
    href: "/calendar",
  },
  {
    title: "Prenotazioni",
    icon: BookOpen,
    children: [
      { title: "Nuova prenotazione", href: "/reservations/new" },
      { title: "Elenco prenotazioni", href: "/reservations" },
      { title: "Ordini", href: "/orders" },
    ],
  },
  {
    title: "Ospiti",
    icon: Users,
    href: "/guests",
  },
  {
    title: "Tariffe",
    icon: BadgeEuro,
    children: [
      { title: "Piani tariffari", href: "/pricing/rate-plans" },
      { title: "Gestione prezzi", href: "/pricing/management" },
      { title: "Algoritmo prezzi", href: "/pricing/algorithm" },
      { title: "Supplementi", href: "/pricing/extras" },
      { title: "Tasse", href: "/pricing/taxes" },
    ],
  },
  {
    title: "Promozioni",
    icon: Tag,
    children: [
      { title: "Promozioni", href: "/promotions" },
      { title: "Voucher", href: "/vouchers" },
    ],
  },
  {
    title: "Housekeeping",
    icon: Sparkles,
    children: [
      { title: "Gestione stanze", href: "/housekeeping" },
      { title: "Previsioni", href: "/housekeeping/forecast" },
      { title: "Staff", href: "/housekeeping/staff" },
    ],
  },
  {
    title: "Statistiche",
    icon: BarChart3,
    children: [
      { title: "KPI Dashboard", href: "/stats/kpi" },
      { title: "Pernottamenti", href: "/stats/overnights" },
      { title: "Ricavi", href: "/stats/revenue" },
      { title: "Marketing", href: "/stats/marketing" },
      { title: "Clienti", href: "/stats/clients" },
    ],
  },
  {
    title: "Report",
    icon: FileText,
    children: [
      { title: "Check-in", href: "/reports/checkin" },
      { title: "Ricavi", href: "/reports/revenue" },
      { title: "Turistico", href: "/reports/touristic" },
    ],
  },
  {
    title: "Impostazioni",
    icon: Settings,
    children: [
      { title: "Hotel", href: "/settings/hotel" },
      { title: "Tipologie stanze", href: "/settings/room-types" },
      { title: "Camere", href: "/settings/rooms" },
      { title: "Utenti", href: "/settings/users" },
      { title: "Contenuti", href: "/settings/content" },
    ],
  },
];

function CollapsibleNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isAnyChildActive = item.children?.some((c) => pathname === c.href) ?? false;
  const [open, setOpen] = useState(isAnyChildActive);
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setOpen((v) => !v)}
        isActive={isAnyChildActive}
        tooltip={item.title}
        className="cursor-pointer"
      >
        <Icon />
        <span>{item.title}</span>
        <ChevronRight
          className={cn(
            "ml-auto size-4 shrink-0 transition-transform duration-200",
            open && "rotate-90"
          )}
        />
      </SidebarMenuButton>
      {open && (
        <SidebarMenuSub>
          {item.children!.map((child) => (
            <SidebarMenuSubItem key={child.href}>
              <SidebarMenuSubButton
                render={<Link href={child.href} />}
                isActive={pathname === child.href}
                size="md"
              >
                <span>{child.title}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Hotel className="size-4" />
          </div>
          <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm">LibertyGest</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                if (item.children) {
                  return <CollapsibleNavItem key={item.title} item={item} />;
                }
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.href!} />}
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="cursor-default">
              <Avatar size="sm">
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
                <span className="font-medium text-sm">Admin</span>
                <span className="text-xs text-muted-foreground">Amministratore</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
