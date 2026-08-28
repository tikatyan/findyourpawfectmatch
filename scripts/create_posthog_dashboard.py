#!/usr/bin/env python3
"""
Create the "Quiz & Shelter Analytics" dashboard in PostHog.

Run this from your own machine (PostHog's API must be reachable, which it
isn't from the Claude Code cloud sandbox). It creates one dashboard with six
tiles covering every metric we instrumented.

Usage:
    export POSTHOG_API_KEY=phx_your_personal_api_key   # NOT the phc_ project key
    # optional overrides:
    export POSTHOG_HOST=https://us.posthog.com          # EU: https://eu.posthog.com
    export POSTHOG_PROJECT_ID=12345                     # auto-detected if omitted
    python3 scripts/create_posthog_dashboard.py

The personal API key needs write scope for insights and dashboards. Create one
at PostHog -> Settings -> Personal API keys (scope it to this project).
"""
import json
import os
import sys
import urllib.error
import urllib.request

HOST = os.environ.get("POSTHOG_HOST", "https://us.posthog.com").rstrip("/")
API_KEY = os.environ.get("POSTHOG_API_KEY", "")
PROJECT_ID = os.environ.get("POSTHOG_PROJECT_ID", "")
DATE_FROM = "-30d"
NUM_QUESTIONS = 10  # quiz.ts has 10 questions per language

if not API_KEY:
    sys.exit("ERROR: set POSTHOG_API_KEY to a personal API key (phx_...).")
if not API_KEY.startswith("phx_"):
    print("WARNING: expected a personal API key starting with 'phx_'. "
          "The phc_ project key will NOT work for the API.", file=sys.stderr)


def api(method, path, body=None):
    url = f"{HOST}{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {API_KEY}")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        sys.exit(f"ERROR {e.code} on {method} {path}: {e.read().decode()[:500]}")
    except urllib.error.URLError as e:
        sys.exit(f"ERROR reaching {url}: {e}")


# Resolve the current project id from the key if not provided.
if not PROJECT_ID:
    me = api("GET", "/api/users/@me/")
    PROJECT_ID = str(me.get("team", {}).get("id") or "")
    if not PROJECT_ID:
        sys.exit("Could not auto-detect project id; set POSTHOG_PROJECT_ID.")
print(f"Using project {PROJECT_ID} on {HOST}")

BASE = f"/api/projects/{PROJECT_ID}"


def event(event_id, order=0, math="total", properties=None):
    e = {"id": event_id, "name": event_id, "type": "events", "order": order, "math": math}
    if properties:
        e["properties"] = properties
    return e


# --- Funnel steps: quiz_question_viewed (q=1..N) -> quiz_completed ---
funnel_events = [
    event(
        "quiz_question_viewed",
        order=i,
        properties=[{"key": "question_number", "value": i + 1, "operator": "exact", "type": "event"}],
    )
    for i in range(NUM_QUESTIONS)
]
funnel_events.append(event("quiz_completed", order=NUM_QUESTIONS))

INSIGHTS = [
    {
        "name": "Quiz completion funnel (Q1 -> last -> result)",
        "filters": {
            "insight": "FUNNELS",
            "events": funnel_events,
            "funnel_viz_type": "steps",
            "date_from": DATE_FROM,
        },
    },
    {
        "name": "Results by type",
        "filters": {
            "insight": "TRENDS",
            "events": [event("quiz_completed")],
            "breakdown": "result",
            "breakdown_type": "event",
            "display": "ActionsBarValue",
            "date_from": DATE_FROM,
        },
    },
    {
        "name": "Language split (EN vs ID)",
        "filters": {
            "insight": "TRENDS",
            "events": [event("$pageview", math="dau")],
            "breakdown": "language",
            "breakdown_type": "event",
            "display": "ActionsPie",
            "date_from": DATE_FROM,
        },
    },
    {
        "name": "Retake quiz clicks",
        "filters": {
            "insight": "TRENDS",
            "events": [event("quiz_retake_clicked")],
            "display": "BoldNumber",
            "date_from": DATE_FROM,
        },
    },
    {
        "name": "Visitors by country",
        "filters": {
            "insight": "TRENDS",
            "events": [event("$pageview", math="dau")],
            "breakdown": "$geoip_country_code",
            "breakdown_type": "event",
            "display": "WorldMap",
            "date_from": DATE_FROM,
        },
    },
    {
        "name": "Shelter Instagram clicks (top shelters)",
        "filters": {
            "insight": "TRENDS",
            "events": [event("shelter_instagram_click")],
            "breakdown": "shelter",
            "breakdown_type": "event",
            "display": "ActionsTable",
            "date_from": DATE_FROM,
        },
    },
]

# --- Create the dashboard, then attach each insight to it ---
dashboard = api("POST", f"{BASE}/dashboards/", {
    "name": "Quiz & Shelter Analytics",
    "description": "Quiz funnel, results, language, retakes, geography and shelter clicks.",
})
dash_id = dashboard["id"]
print(f"Created dashboard #{dash_id}")

for spec in INSIGHTS:
    insight = api("POST", f"{BASE}/insights/", {
        "name": spec["name"],
        "filters": spec["filters"],
        "dashboards": [dash_id],
    })
    print(f"  + tile: {spec['name']} (insight #{insight['id']})")

print(f"\nDone. Open it at: {HOST}/project/{PROJECT_ID}/dashboard/{dash_id}")
