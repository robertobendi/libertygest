import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BedDouble,
  TrendingUp,
} from "lucide-react";

const statsCards = [
  {
    title: "Check-in Oggi",
    value: "12",
    description: "Arrivi previsti",
    icon: ArrowDownToLine,
    trend: "+2 rispetto a ieri",
  },
  {
    title: "Check-out Oggi",
    value: "8",
    description: "Partenze previste",
    icon: ArrowUpFromLine,
    trend: "Stesso di ieri",
  },
  {
    title: "Occupazione",
    value: "78%",
    description: "42 su 54 camere",
    icon: BedDouble,
    trend: "+5% rispetto alla settimana scorsa",
  },
  {
    title: "Ricavi Oggi",
    value: "€ 4.320",
    description: "Revenue giornaliero",
    icon: TrendingUp,
    trend: "+12% rispetto a ieri",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Buongiorno</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Ecco il riepilogo della giornata di oggi.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardDescription>{card.title}</CardDescription>
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                </div>
                <CardTitle className="text-2xl">{card.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Placeholder content */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Arrivi di Oggi</CardTitle>
            <CardDescription>Prenotazioni con check-in previsto oggi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {[
                { name: "Rossi Mario", room: "101", time: "14:00" },
                { name: "Bianchi Laura", room: "205", time: "15:30" },
                { name: "Ferrari Giuseppe", room: "312", time: "16:00" },
              ].map((guest) => (
                <div
                  key={guest.name}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{guest.name}</p>
                    <p className="text-muted-foreground">Camera {guest.room}</p>
                  </div>
                  <span className="text-muted-foreground">{guest.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partenze di Oggi</CardTitle>
            <CardDescription>Prenotazioni con check-out previsto oggi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {[
                { name: "Verdi Anna", room: "103", time: "10:00" },
                { name: "Esposito Carlo", room: "214", time: "11:00" },
                { name: "Romano Lucia", room: "307", time: "12:00" },
              ].map((guest) => (
                <div
                  key={guest.name}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{guest.name}</p>
                    <p className="text-muted-foreground">Camera {guest.room}</p>
                  </div>
                  <span className="text-muted-foreground">{guest.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
