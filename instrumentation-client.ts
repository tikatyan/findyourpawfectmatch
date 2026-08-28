import posthog from "posthog-js"

// Next.js (15.3+) automatically loads this file on the client.
// PostHog only initializes when a public key is configured, so local/dev
// runs without a key are a no-op rather than an error.
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    // Enables autocapture plus automatic pageview/pageleave tracking on
    // client-side (SPA) route changes — correct for the Next.js App Router.
    defaults: "2025-05-24",
  })
}
