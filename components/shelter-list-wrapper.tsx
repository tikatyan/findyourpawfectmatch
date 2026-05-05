"use client"

import { useEffect, useState } from "react"
import { ShelterList } from "./shelter-list"

interface Dictionary {
  find_shelter_page: {
    back_to_quiz: string
    hero_title: string
    hero_description: string
    submit_shelter_text_part1: string
    submit_shelter_text_link: string
    search_placeholder: string
    filter_by_region: string
    all_regions: string
    no_shelters_found: string
  }
}

interface Shelter {
  shelter: string
  instagram: string
  region: string
  specialty: string
}

interface ShelterListWrapperProps {
  dict: Dictionary
  lang: "en" | "id"
}

export function ShelterListWrapper({ dict, lang }: ShelterListWrapperProps) {
  const [sheltersData, setSheltersData] = useState<Shelter[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadShelters = async () => {
      try {
        const response = await fetch("/api/shelters")
        const data = await response.json()
        setSheltersData(data)
      } catch (error) {
        console.error("Failed to load shelters:", error)
        setSheltersData([])
      } finally {
        setIsLoading(false)
      }
    }

    loadShelters()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50 flex items-center justify-center">
        <p className="text-gray-600">Loading shelters...</p>
      </div>
    )
  }

  return <ShelterList sheltersData={sheltersData} dict={dict} lang={lang} />
}
