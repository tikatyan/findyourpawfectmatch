# Analytics (PostHog)

PostHog is initialized in `instrumentation-client.ts` (autocapture + SPA
pageviews/pageleaves). The `language` super property (`en`/`id`) is attached to
every event via `components/posthog-language.tsx`, and visitor country is added
automatically by PostHog GeoIP (`$geoip_country_code` / `$geoip_country_name`).

## Custom events

| Event | Where | Properties |
|-------|-------|-----------|
| `quiz_question_viewed` | `app/[lang]/page.tsx` (per question shown) | `question_number` (1–10), `total_questions`, `language` |
| `quiz_completed` | `app/[lang]/page.tsx` (on result) | `result` (highEnergy/mediumEnergy/lowEnergy/notReady), `language` |
| `quiz_retake_clicked` | `app/[lang]/page.tsx` (retake button) | `from_result`, `language` |
| `shelter_instagram_click` | `components/shelter-list.tsx` (IG link) | `shelter`, `region` |

## Dashboard: "Quiz & Shelter Analytics"

The PostHog API is not reachable from the Claude Code cloud sandbox, so the
dashboard is created by a script you run locally:

```bash
export POSTHOG_API_KEY=phx_your_personal_api_key   # Settings -> Personal API keys
python3 scripts/create_posthog_dashboard.py
```

Tiles created: quiz completion funnel (Q1→last→result), results by type,
language split, retake clicks, visitors by country (world map), and top
shelters by Instagram click.
