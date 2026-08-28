#!/usr/bin/env python3
"""
Create the "Quiz & Shelter Analytics" dashboard in PostHog.

Run this from your own machine (PostHog's API must be reachable, which it
isn't from the Claude Code cloud sandbox). It creates one dashboard with six
tiles covering every metric we instrumented. Re-running reuses the dashboard
of the same name instead of creating a duplicate.

Usage:
    export POSTHOG_API_KEY=phx_your_personal_api_key   # NOT the phc_ project key
    # optional overrides:
    export POSTHOG_HOST=https://us.posthog.com          # EU: https://eu.posthog.com
    export POSTHOG_PROJECT_ID=12345                     # auto-detected if omitted
    python3 scripts/create_posthog_dashboard.py

The personal API key needs write scope for insights and dashboards (and read
for user, if you let it auto-detect the project id).

macOS SSL note: if you hit CERTIFICATE_VERIFY_FAILED, run:
    pip3 install certifi && export SSL_CERT_FILE=$(python3 -m certifi)
"""
import json
import os
import ssl
import sys
import urllib.error
import urllib.request

HOST = os.environ.get("POSTHOG_HOST", "https://us.posthog.com").rstrip("/")
API_KEY = os.environ.get("POSTHOG_API_KEY", "")
PROJECT_ID = os.environ.get("POSTHOG_PROJECT_ID", "")
DATE_FROM = "-30d"
NUM_QUESTIONS = 10  # quiz.ts has 10 questions per language
DASH_NAME = "Quiz & Shelter Analytics"

if not API_KEY:
    sys.exit("ERROR: set POSTHOG_API_KEY to a personal API key (phx_...).")

# Use certifi's CA bundle when available (fixes macOS cert issues).
try:
    import certifi
    _CTX = ssl.create_default_context(cafile=certifi.where())
except Exception:
    _CTX = ssl.create_default_context()


def api(method, path, body=None):
    url = f"{HOST}{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {API_KEY}")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, context=_CTX) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        sys.exit(f"ERROR {e.code} on {method} {path}: {e.read().decode()[:500]}")
    except urllib.error.URLError as e:
        sys.exit(f"ERROR reaching {url}: {e}")


if not PROJECT_ID:
    me = api("GET", "/api/users/@me/")
    PROJECT_ID = str(me.get("team", {}).get("id") or "")
    if not PROJECT_ID:
        sys.exit("Could not auto-detect project id; set POSTHOG_PROJECT_ID.")
print(f"Using project {PROJECT_ID} on {HOST}")
BASE = f"/api/projects/{PROJECT_ID}"


# --- Query builders (PostHog current "query" schema, HogQL-based) ---
def events_node(event, math="total", properties=None):
    node = {"kind": "EventsNode", "event": event, "name": event, "math": math}
    if properties:
        node["properties"] = properties
    return node


def trends(event, math="total", breakdown=None, display=None):
    source = {
        "kind": "TrendsQuery",
        "series": [events_node(event, math=math)],
        "dateRange": {"date_from": DATE_FROM},
    }
    if breakdown:
        source["breakdownFilter"] = {"breakdown": breakdown, "breakdown_type": "event"}
    if display:
        source["trendsFilter"] = {"display": display}
    return {"kind": "InsightVizNode", "source": source}


def funnel():
    series = [
        events_node(
            "quiz_question_viewed",
            properties=[{"key": "question_number", "type": "event",
                         "operator": "exact", "value": [i + 1]}],
        )
        for i in range(NUM_QUESTIONS)
    ]
    series.append(events_node("quiz_completed"))
    return {
        "kind": "InsightVizNode",
        "source": {
            "kind": "FunnelsQuery",
            "series": series,
            "funnelsFilter": {"funnelVizType": "steps"},
            "dateRange": {"date_from": DATE_FROM},
        },
    }


INSIGHTS = [
    {"name": "Quiz completion funnel (Q1 -> last -> result)", "query": funnel()},
    {"name": "Results by type", "query": trends(
        "quiz_completed", breakdown="result", display="ActionsBarValue")},
    {"name": "Language split (EN vs ID)", "query": trends(
        "$pageview", math="dau", breakdown="language", display="ActionsPie")},
    {"name": "Retake quiz clicks", "query": trends(
        "quiz_retake_clicked", display="BoldNumber")},
    {"name": "Visitors by country", "query": trends(
        "$pageview", math="dau", breakdown="$geoip_country_code", display="WorldMap")},
    {"name": "Shelter Instagram clicks (top shelters)", "query": trends(
        "shelter_instagram_click", breakdown="shelter", display="ActionsTable")},
]

# --- Reuse an existing dashboard of the same name, else create one ---
existing = api("GET", f"{BASE}/dashboards/?limit=200")
dash = next((d for d in existing.get("results", [])
             if d.get("name") == DASH_NAME and not d.get("deleted")), None)
if dash:
    dash_id = dash["id"]
    print(f"Reusing existing dashboard #{dash_id}")
else:
    dash = api("POST", f"{BASE}/dashboards/", {
        "name": DASH_NAME,
        "description": "Quiz funnel, results, language, retakes, geography and shelter clicks.",
    })
    dash_id = dash["id"]
    print(f"Created dashboard #{dash_id}")

# Skip tiles already present (so re-running is safe).
existing_tiles = api("GET", f"{BASE}/dashboards/{dash_id}/")
existing_names = {
    (t.get("insight") or {}).get("name")
    for t in existing_tiles.get("tiles", [])
}

for spec in INSIGHTS:
    if spec["name"] in existing_names:
        print(f"  = tile already exists: {spec['name']}")
        continue
    insight = api("POST", f"{BASE}/insights/", {
        "name": spec["name"],
        "query": spec["query"],
        "dashboards": [dash_id],
    })
    print(f"  + tile: {spec['name']} (insight #{insight['id']})")

print(f"\nDone. Open it at: {HOST}/project/{PROJECT_ID}/dashboard/{dash_id}")
