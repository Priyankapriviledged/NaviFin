# NaviFin — India–Finland Talent & Relocation Companion

Front-end prototype for an AI relocation companion.

## Files
- `index.html` — page structure and content
- `styles.css` — all styling
- `app.js` — all interactivity (sign-in, persona questionnaire, roadmap, tabs, chat demo)

All three must stay in the same folder — `index.html` links to the other two by filename.

## Run
Open `index.html` in a browser. No build system, server, or dependencies required.

## Demo accounts
- `meera.student` / `Finland2026` — student scenario
- `arjun.pro` / `Finland2026` — professional-with-family scenario

## Included
- Public marketing site (hero, journeys, five-phase overview, sources, CTA) separate from the logged-in app screen
- Sign-in with a blurred/skeleton dashboard reveal while the questionnaire is answered
- Persona selection (Student / Researcher / Professional) with a dynamic family questionnaire for Student and Professional
- Personalised roadmap: persistent progress header, single Roadmap tab (expandable stage cards with mark-complete tracking), Documents tab
- Interactive AI chat demo
- Official-source trust layer

## Production roadmap
1. Real authentication + user profiles (current sign-in is a front-end-only demo, not connected to a backend)
2. Source ingestion/indexing for Migri, Studyinfo, Suomi.fi, Vero, Kela, DVV, universities and relevant Indian official sources
3. Retrieval-augmented generation with citations and freshness checks
4. Dynamic task/deadline engine
5. Secure document upload and storage (Documents tab is currently a static mock)
6. Housing, tax, healthcare, banking, family and employment modules
7. English/Finnish/Hindi support
8. Human escalation for high-stakes immigration/legal questions

