import { Hotel } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
          <Hotel className="size-6" />
        </div>
        <span className="text-xl font-semibold tracking-tight">LibertyGest</span>
        <span className="text-sm text-muted-foreground">Hotel Management System</span>
      </div>
      {children}
    </div>
  );
}
