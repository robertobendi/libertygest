import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader>
        <CardTitle>Password dimenticata</CardTitle>
        <CardDescription>
          Il ripristino password non è ancora attivo. Contatta l&apos;amministratore
          di sistema per reimpostare l&apos;accesso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href="/login"
          className={cn(buttonVariants({ size: "lg" }), "inline-flex w-full")}
        >
          Torna al login
        </Link>
      </CardContent>
    </Card>
  );
}
