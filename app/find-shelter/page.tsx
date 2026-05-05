"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { MapPin, Instagram, Search, ExternalLink, ArrowLeft, Megaphone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import sheltersData from "@/data/shelters.json" // Import the local JSON data

// Function to get a unique emoji based on shelter name (simple hash for variety)
const getShelterEmoji = (shelterName: string) => {
  const emojis = ["🐾", "🐶", "🏡", "❤️", "🐕", "🌟", "✨", "🤝", "🌈", "💖", "🐕‍🦺", "🦴", "😊", "😇", "🌻"]
  let hash = 0
  for (let i = 0; i < shelterName.length; i++) {
    hash = shelterName.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash % emojis.length)
  return emojis[index]
}

export default function FindShelterPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")

  // Extract unique main regions for the dropdown
  const uniqueRegions = useMemo(() => {
    const regions = new Set<string>()
    sheltersData.forEach((shelter) => {
      const mainRegion = shelter.region.split(" - ")[0].trim()
      regions.add(mainRegion)
    })
    return ["all", ...Array.from(regions).sort()]
  }, [])

  // Filter shelters based on search term and selected region
  const filteredShelters = useMemo(() => {
    return sheltersData.filter((shelter) => {
      const matchesSearchTerm =
        shelter.shelter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shelter.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shelter.specialty.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRegion = selectedRegion === "all" || shelter.region.startsWith(selectedRegion)

      return matchesSearchTerm && matchesRegion
    })
  }, [searchTerm, selectedRegion])

  // Group and sort filtered shelters by main region
  const groupedAndSortedShelters = useMemo(() => {
    const groups: Record<string, (typeof sheltersData)[0][]> = {}
    filteredShelters.forEach((shelter) => {
      const mainRegion = shelter.region.split(" - ")[0].trim()
      if (!groups[mainRegion]) {
        groups[mainRegion] = []
      }
      groups[mainRegion].push(shelter)
    })

    // Sort shelters within each group alphabetically by name
    for (const region in groups) {
      groups[region].sort((a, b) => a.shelter.localeCompare(b.shelter))
    }

    // Sort regions alphabetically
    const sortedRegions = Object.keys(groups).sort()

    return sortedRegions.map((region) => ({
      regionName: region,
      shelters: groups[region],
    }))
  }, [filteredShelters])

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50 flex flex-col">
      {/* Header is now handled by app/layout.tsx */}

      {/* ---------- Main ---------- */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Back button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-orange-500 hover:text-orange-600 hover:bg-orange-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quiz
          </Button>
        </Link>

        {/* Hero */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{"Visit Your Local Heroes! 🏠"}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            These amazing shelters and rescues across Indonesia work tirelessly to save pups every day. Whenever you
            can, consider to visit or volunteer.
          </p>
        </section>

        {/* Submit New Shelter Section (Moved to Top) */}
        <section className="w-full max-w-3xl mx-auto p-4 md:p-5 shadow-md flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-12 bg-neutral-50 opacity-100 rounded-3xl">
          <Megaphone className="h-8 w-8 text-orange-500 flex-shrink-0" />
          <p className="text-lg text-gray-700 leading-relaxed md:text-left text-center flex-grow">
            Know a shelter that should be featured? Help us expand our list by{" "}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdyhusZgdZDMsFdy78EY-S_Q41X9bkroN51x82IyA8d6207hQ/viewform?usp=sharing&ouid=111197092728238406889"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold transition-colors whitespace-nowrap"
            >
              filling this Google Form
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
            .
          </p>
        </section>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, region, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-4 py-2 rounded-full border border-gray-300 focus:ring-orange-500 focus:border-orange-500 shadow-sm pl-10"
            />
          </div>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-full border border-gray-300 shadow-sm">
              <SelectValue placeholder="Filter by Region" />
            </SelectTrigger>
            <SelectContent>
              {uniqueRegions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region === "all" ? "All Regions" : region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Shelter list grouped by region */}
        <section className="space-y-12">
          {groupedAndSortedShelters.length > 0 ? (
            groupedAndSortedShelters.map((group) => (
              <div key={group.regionName}>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
                  <MapPin className="h-6 w-6 text-orange-500 mr-2" />
                  {group.regionName}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.shelters.map((shelter, index) => (
                    <Card
                      key={index}
                      className="border-0 shadow-lg hover:shadow-xl transition-shadow rounded-2xl bg-white"
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        {/* Emoji representation */}
                        <span className="text-5xl mb-4">{getShelterEmoji(shelter.shelter)}</span>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{shelter.shelter}</h3>

                        <p className="flex items-center text-gray-600 text-sm mb-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          {shelter.region}
                        </p>

                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">{shelter.specialty}</p>

                        {shelter.instagram && (
                          <a
                            href={shelter.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-pink-600 hover:text-pink-700 text-sm font-medium mt-auto"
                          >
                            <Instagram className="h-4 w-4 mr-2" />
                            Instagram
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-600">
              <p className="text-lg">No shelters found matching your criteria. Try adjusting your search or filters.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
