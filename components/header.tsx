"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { quizContent, type Language } from "@/data/quiz"

interface HeaderProps {
  currentLang: Language
  onLanguageChange: (lang: Language) => void
}

export function Header({ currentLang, onLanguageChange }: HeaderProps) {
  const dict = quizContent[currentLang].ui

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/adopt-logo.png" alt="Adopt Logo" width={40} height={40} />
          <span className="inline-block font-bold text-lg text-gray-800">Adopt Indonesian Dogs</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => onLanguageChange("en")}
            className={currentLang === "en" ? "font-bold text-orange-500" : "text-gray-600"}
          >
            EN
          </Button>
          <Button
            variant="ghost"
            onClick={() => onLanguageChange("id")}
            className={currentLang === "id" ? "font-bold text-orange-500" : "text-gray-600"}
          >
            ID
          </Button>
        </nav>
      </div>
    </header>
  )
}
