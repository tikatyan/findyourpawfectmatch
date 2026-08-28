"use client"

import { useEffect } from "react"
import posthog from "posthog-js"

// Registers the active locale as a PostHog super property so every event
// (pageviews, quiz steps, shelter clicks, etc.) is tagged with `language`.
export function PostHogLanguage({ lang }: { lang: "en" | "id" }) {
  useEffect(() => {
    posthog.register({ language: lang })
  }, [lang])

  return null
}
