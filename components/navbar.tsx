import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { NavLinks } from "@/components/tutorial/nav-links";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Navbar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex items-center p-3 px-5 text-sm">
        <div className="flex-1 flex justify-start min-w-0">
          <Link href={"/"} className="font-semibold text-lg">
            Newsletter App
          </Link>
        </div>
        <div className="flex-shrink-0 flex items-center justify-center px-4">
          <Suspense>
            <NavLinks />
          </Suspense>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4 min-w-0">
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton />
            </Suspense>
          )}
        </div>
        <div className="pl-5">
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
