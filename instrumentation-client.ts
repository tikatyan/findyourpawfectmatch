import posthog from "posthog-js"

// Next.js (15.3+) automatically loads this file on the client.
// The project key is public (ingest-only, safe to ship in the client bundle),
// so it's baked in as a default; NEXT_PUBLIC_POSTHOG_KEY overrides it if set.
const posthogKey =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "phc_vqfyi2jbKudzj9nm4UdoWAaRPaEbHkDbf34PHcCybH5W"

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    // Enables autocapture plus automatic pageview/pageleave tracking on
    // client-side (SPA) route changes — correct for the Next.js App Router.
    defaults: "2025-05-24",
    // Explicit: $pageleave powers bounce-rate analysis. (Already implied by the
    // defaults above, but pinned here so it survives a defaults change.)
    capture_pageleave: true,
  })
}
