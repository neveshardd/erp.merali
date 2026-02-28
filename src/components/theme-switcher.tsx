"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch — only render after mount
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;

  const _isDark = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-10 h-10 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all active:scale-90"
          title="Tema"
        >
          <Sun className="w-5 h-5 text-neutral-600 dark:text-neutral-400 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-5 h-5 text-neutral-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Trocar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 rounded-xl border-neutral-200 dark:border-neutral-800 p-1 shadow-xl"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`gap-2.5 font-bold uppercase tracking-widest text-[10px] cursor-pointer rounded-lg p-3 ${theme === "light" ? "bg-neutral-100 dark:bg-neutral-800" : ""}`}
        >
          <Sun className="w-3.5 h-3.5" />
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`gap-2.5 font-bold uppercase tracking-widest text-[10px] cursor-pointer rounded-lg p-3 ${theme === "dark" ? "bg-neutral-100 dark:bg-neutral-800" : ""}`}
        >
          <Moon className="w-3.5 h-3.5" />
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`gap-2.5 font-bold uppercase tracking-widest text-[10px] cursor-pointer rounded-lg p-3 ${theme === "system" ? "bg-neutral-100 dark:bg-neutral-800" : ""}`}
        >
          <Monitor className="w-3.5 h-3.5" />
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
