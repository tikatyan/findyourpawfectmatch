import { getDictionary } from "@/app/[lang]/dictionaries"
import { ShelterListWrapper } from "@/components/shelter-list-wrapper"

export default async function FindShelterPage({ params }: { params: Promise<{ lang: "en" | "id" }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return <ShelterListWrapper dict={dict} lang={lang} />
}
