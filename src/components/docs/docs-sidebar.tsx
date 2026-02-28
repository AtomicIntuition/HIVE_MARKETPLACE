"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { DOCS_NAV } from "./docs-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {DOCS_NAV.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              isActive
                ? "bg-violet-500/10 text-violet-400 font-medium"
                : "text-muted-foreground hover:bg-gray-800/50 hover:text-foreground"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-violet-400")} />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export function DocsSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <div className="mb-6 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Menu className="h-4 w-4" />
              Documentation
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b border-border/50 px-4 py-4">
              <SheetTitle>Documentation</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Documentation
          </h3>
          <NavLinks />
        </div>
      </aside>
    </>
  );
}
