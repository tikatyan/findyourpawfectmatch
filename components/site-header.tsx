"use client"

import Link from "next/link"
import { LanguageSwitcher } from "./language-switcher"
import { useState } from "react"

interface SiteHeaderProps {
  lang: "en" | "id"
  dict: {
    header: {
      find_perfect_match: string
      find_local_shelter: string
    }
  }
}

export function SiteHeader({ lang, dict }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-orange-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={`/${lang}`} className="flex items-center space-x-2">
            <img src="/images/adopt-logo.png" alt="Adopt Indonesian Dogs Logo" className="h-8 md:h-10 w-auto" />
            <h1 className="text-lg md:text-2xl font-bold text-gray-800">Adopt Indonesian Dogs</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href={`/${lang}`} className="text-gray-600 hover:text-orange-500 transition-colors">
              {dict.header.find_perfect_match}
            </Link>
            <Link href={`/${lang}/find-shelter`} className="text-gray-600 hover:text-orange-500 transition-colors">
              {dict.header.find_local_shelter}
            </Link>
            <LanguageSwitcher currentLang={lang} />
          </nav>
          
          {/* Mobile Menu Button & Language Switcher */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-orange-500 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2 pb-4">
            <Link 
              href={`/${lang}`} 
              className="block text-gray-600 hover:text-orange-500 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {dict.header.find_perfect_match}
            </Link>
            <Link 
              href={`/${lang}/find-shelter`} 
              className="block text-gray-600 hover:text-orange-500 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {dict.header.find_local_shelter}
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
