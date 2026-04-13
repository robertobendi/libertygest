import { Construction } from "lucide-react";

export default function StatsMarketingPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <Construction className="size-7 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-xl font-semibold">Marketing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Questa sezione è in fase di sviluppo.
        </p>
      </div>
    </div>
  );
}
