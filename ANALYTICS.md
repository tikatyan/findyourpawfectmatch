# Analytics (PostHog)

PostHog is initialized in `instrumentation-client.ts` (autocapture + SPA
pageviews/pageleaves). Visitor country is added automatically by PostHog GeoIP
(`$geoip_country_code` / `$geoip_country_name`).

### `language` (en/id)

Attached to **every** event by the `before_send` hook in
`instrumentation-client.ts`, which reads the locale from the URL path.

This deliberately does *not* use a React effect / `posthog.register()`.
`posthog.init()` captures the session's first `$pageview` immediately, before
any component mounts, so an effect-based approach set the property too late and
that first pageview arrived with no `language` — which PostHog then displayed
as **"Other (no value)"** in breakdowns. Reading from the URL at send time also
keeps the value correct when a user switches locale mid-session.

## Custom events

| Event | Where | Properties |
|-------|-------|-----------|
| `quiz_question_viewed` | `app/[lang]/page.tsx` (per question shown) | `question_number` (1–10), `total_questions`, `language` |
| `quiz_answer_selected` | `app/[lang]/page.tsx` (on advancing past a question) | `question_number`, `answer` (label), `answer_value`, `language` |
| `quiz_abandoned` | `app/[lang]/page.tsx` (`beforeunload`/`pagehide`) | `last_question_seen`, `total_questions`, `language` |
| `quiz_completed` | `app/[lang]/page.tsx` (on result) | `result` (highEnergy/mediumEnergy/lowEnergy/notReady), `language` |
| `quiz_retake_clicked` | `app/[lang]/page.tsx` (retake button) | `from_result`, `language` |
| `result_cta_clicked` | `app/[lang]/page.tsx` (result-page buttons) | `result`, `cta` (`find_shelter` \| `retake`), `language` |
| `shelter_instagram_click` | `components/shelter-list.tsx` (IG link) | `shelter`, `region` |
| `shelter_contact_clicked` | `components/shelter-list.tsx` (IG link) | `shelter_name`, `contact_method` (`instagram`), `region` |

Notes:
- `quiz_answer_selected` fires when the user advances, not on every click, so
  changing a selection before pressing Next isn't double-counted.
- `quiz_abandoned` uses `sendBeacon`; `pagehide` is registered alongside
  `beforeunload` because mobile Safari frequently skips `beforeunload`.
- `shelter_contact_clicked` currently always reports `instagram` — that's the
  only contact channel present in `data/shelters.json`. Add `whatsapp`/`email`
  to the data first if you want that breakdown to be meaningful.
- There is no per-shelter detail page, so no `shelter_profile_viewed` event
  exists. See below.

## Not implemented: `shelter_profile_viewed`

The shelter directory renders every shelter as a card in one list — there is no
individual profile/detail route to "view". Firing this on card render would
emit ~74 events per page load and make the metric meaningless. If per-shelter
detail pages are added later, fire it there on mount.

## Dashboard: "Quiz & Shelter Analytics"

The PostHog API is not reachable from the Claude Code cloud sandbox, so the
dashboard is created by a script you run locally:

```bash
export POSTHOG_API_KEY=phx_your_personal_api_key   # Settings -> Personal API keys
python3 scripts/create_posthog_dashboard.py
```

Tiles created (12): quiz completion funnel (Q1→last→result), results by type,
language split, retake clicks, visitors by country (world map), top shelters by
Instagram click, total visitors, where people abandon the quiz, answers chosen
per question, result CTA clicks by button, shelter contact clicks, and bounce
rate.

Re-running the script is safe and is how you apply changes: it reuses the
dashboard of the same name, **updates** existing tiles in place, adds missing
ones, and deletes tiles listed in `RETIRED_TILES`.

### Breakdown cardinality

PostHog Trends breakdowns only show the top 25 values and bucket the rest into
"Other". Two places exceed that:

- **Shelter tiles** (74 shelters) — raised via `breakdown_limit=100`.
- **Quiz answers** (~10 questions × ~4 options × 2 languages) — a Trends
  breakdown is the wrong tool here, so that tile uses a HogQL query returning
  the full distribution grouped by question. An "Other" bucket on that tile
  never meant free-text answers; the quiz is entirely multiple-choice.
