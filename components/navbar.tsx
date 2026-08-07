"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Users, LayoutDashboard, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/students", label: "Students List", icon: Users },
    { href: "/students/new", label: "Add Student", icon: UserPlus },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-primary">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline-block tracking-tight text-foreground">
            Student Master <span className="text-primary font-normal">& Academic Profile</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && item.href !== "/students/new");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
