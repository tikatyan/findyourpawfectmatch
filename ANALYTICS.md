# Analytics (PostHog)

PostHog is initialized in `instrumentation-client.ts` (autocapture + SPA
pageviews/pageleaves). The `language` super property (`en`/`id`) is attached to
every event via `components/posthog-language.tsx`, and visitor country is added
automatically by PostHog GeoIP (`$geoip_country_code` / `$geoip_country_name`).

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
Instagram click, total visitors, where people abandon the quiz, answers chosen,
result CTA clicks by button, shelter contact clicks, and bounce rate.

Re-running the script is safe: it reuses the dashboard of the same name and
skips tiles that already exist, so it only adds what's missing.
