import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export async function NavLinks() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="default">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <Button asChild variant="ghost" size="default">
        <Link href="/preferences">Preferences</Link>
      </Button>
    </div>
  );
}
