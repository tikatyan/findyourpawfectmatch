"use client"

import { usePathname, useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const onLanguageChange = (newLocale: string) => {
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/"))
  }

  return (
    <Select value={currentLang} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-[100px] h-8 text-sm">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="en">English 🌐</SelectItem>
        <SelectItem value="id">Bahasa Indonesia 🇮🇩</SelectItem>
      </SelectContent>
    </Select>
  )
}
