"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";


const NavLinks = [
  { href: "/", label: "Home" },
  { href: "/textextract", label: "Text Extraction" },
  { href: "/flashcards", label: "Flashcard Generator" },
  { href: "/chatai", label: "Chat AI" },
  { href: "/sumrize", label: "Text Summarization" },

]

export function NavigationMenuDemo() {
  const pathname = usePathname();
  return (
    <div><nav className="hidden md:flex ml-10 space-x-6">
      {NavLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === link.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav></div>
  )
}
