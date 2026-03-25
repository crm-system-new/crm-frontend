"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  TrendingUp,
  Megaphone,
  Ticket,
  Settings,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: UserPlus },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/opportunities", label: "Opportunities", icon: TrendingUp },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/tickets", label: "Tickets", icon: Ticket },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 p-4">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:bg-card">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/dashboard" className="text-lg font-bold">
            CRM
          </Link>
        </div>
        <NavLinks />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden absolute left-4 top-3 z-40"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-14 items-center border-b px-6">
            <Link
              href="/dashboard"
              className="text-lg font-bold"
              onClick={() => setOpen(false)}
            >
              CRM
            </Link>
          </div>
          <div onClick={() => setOpen(false)}>
            <NavLinks />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
