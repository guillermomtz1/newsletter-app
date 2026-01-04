import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/lib/utils";
import { NavLinks } from "./nav-links";
import { ThemeSwitcher } from "../theme-switcher";

const Navbar = () => {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background shadow-sm text-lg">
      <div className="w-full max-w-7xl flex items-center p-3 px-5">
        <div className="flex-1 flex justify-start min-w-0">
          <Link
            href="/"
            className="text-xl font-semibold hover:opacity-80 transition-opacity"
          >
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
          <ThemeSwitcher />
          <Button variant="ghost" size="icon" aria-label="Menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
