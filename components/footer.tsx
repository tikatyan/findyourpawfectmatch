"use client"

import { quizContent, type Language } from "@/data/quiz"

interface FooterProps {
  currentLang: Language
}

export function Footer({ currentLang }: FooterProps) {
  const dict = quizContent[currentLang].ui

  return (
    <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
      <p>{dict.copyright}</p>
    </footer>
  )
}
