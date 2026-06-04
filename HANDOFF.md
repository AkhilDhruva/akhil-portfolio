# HANDOFF — Akhil Reddy portfolio site (→ Claude Code)

**Owner:** Akhil Reddy · druva.akhil@gmail.com · https://www.linkedin.com/in/akhilreddy-
**Goal right now:** get this static portfolio onto **GitHub + Vercel** so the owner can
redeploy by pushing. (A previous agent ran in a sandbox that couldn't do Git on this
OneDrive folder — that's why it's being handed to you.)

---

## 0. Do this first (there's a broken .git to remove)

An automated `git init` from a sandbox failed (OneDrive locked `.git`) and left a **broken,
partial `.git` folder** that the sandbox could not delete. Before anything else:

```powershell
Remove-Item -Recurse -Force .git
```

**Strongly recommended:** this project lives in **OneDrive**, where Git `.git` folders hit
sync conflicts. Copy the project to a non-synced path first and work from there:

```powershell
# from a normal (non-OneDrive) location
robocopy "C:\Users\Akhil Reddy Gaddam\OneDrive\Documents\Claude\Projects\ID infographics builder" "C:\dev\akhil-portfolio" /E /XD .git ohio-drivesmart\node_modules
cd C:\dev\akhil-portfolio
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
```

(`/XD .git` skips the broken repo on copy.)

---

## 1. What this is

A **static** personal portfolio for a Learning-Experience / Instructional Designer.
One page, three real project case studies. No backend, no build step at the repo root.

Three featured projects (all real, deployed or deployable):
- **AI Workflow Quest** — `ai-workflow-quest.html` (self-contained; ships with this repo).
- **SiteReady — Scissor Lift Safety** — `deploy/index.html` module + `SiteReady-ScissorLift-PreUseCard.html` (ship with this repo).
- **Ohio DriveSmart Academy** — a **separate React/Vite app** in `ohio-drivesmart/`. It is its
  own Vercel project, **already live at https://ohio-drivesmart-academy.vercel.app/** , and is
  **excluded from this repo** via `.gitignore`. The portfolio just links to that URL. Do NOT
  bundle it into the portfolio deploy.

## 2. File map

```
index.html                          # the homepage (single-file SPA: home + 3 case-study views)
ai-workflow-quest.html              # live project, linked from index
deploy/                             # SiteReady scissor-lift module (index.html + assets/p/ + pre-use card)
SiteReady-ScissorLift-PreUseCard.html
assets/p/01-hero.png                # used by index (SiteReady card preview); rest of assets/ is unused source
vercel.json  .vercelignore  .gitignore   # Vercel/Git config (ready)
DEPLOY-VERCEL.md                    # step-by-step deploy guide
ohio-drivesmart/                    # SEPARATE app — gitignored, its own Vercel project
firebase.json  DEPLOY.md            # legacy Firebase path — gitignored, safe to delete
*.bak / *.bak2 / _*.png / assets/ChatGPT* / SiteReady-ScissorLift-Module.html  # junk, gitignored
```

## 3. Deploy (the task)

Static site, no build. See `DEPLOY-VERCEL.md` for the click-by-click. TL;DR after Step 0:

```powershell
git init
git add .
git commit -m "portfolio"
git branch -M main
git remote add origin https://github.com/<owner>/<repo>.git
git push -u origin main
```

Then on Vercel: **Import** the repo → Framework preset **Other** (empty Build Command /
Output Directory) → Deploy. Redeploy = push. Custom domain: add in Vercel, paste the DNS
records into IONOS DNS.

## 4. index.html architecture (read before editing it)

- Single self-contained file: injected `<style>`, the home views, and one big `<script>` at
  the bottom. Project case studies live in a JS `PROJECTS` object keyed `p-lms` (= AI Workflow
  Quest), `p-safe` (= SiteReady), `p-drive` (= DriveSmart). `go(id)` is the view router; each
  section value is a template-literal HTML string.
- **After ANY edit to index.html, verify the script still parses:**
  ```bash
  node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');const m=h.match(/<script>([\s\S]*)<\/script>/);require('fs').writeFileSync('/tmp/i.js',m[1]);" && node --check /tmp/i.js
  ```
  Also keep backticks balanced (each section value is a `\`...\`` literal — don't nest raw backticks).
- **Design system:** light theme, CSS variables in `:root` (`--bg`, `--surface`, `--primary`
  #2D5BD6, `--emerald` #178A55, `--amber`, etc.). Fonts: Schibsted Grotesk / Hanken Grotesk /
  JetBrains Mono via Google Fonts.
- **Metric cards** use `.mtgt` "direction of success" chips (`↑ improve` / `↓ reduce`) — NOT
  numbers. This is deliberate (see honesty rules).

## 5. Honesty rules — DO NOT regress (the whole portfolio is built on these)

- **No fabricated metrics.** Every result is a design target / direction, never a claimed
  outcome. Unknowns are marked `[NEEDS USER INPUT]`.
- **Scope honesty per project:** SiteReady = "awareness only, not a certification," `[VERIFY
  WITH SME]` flags kept. DriveSmart = "educational concept," readiness capped at "Practice-ready,"
  sourced stats only. AI Workflow Quest = `PORTFOLIO CONCEPT` disclaimer, Scenario 4 labeled
  "storyboarded."
- **AI Workflow Quest accessibility is honestly marked "in progress"** in its case study (✓ for
  contrast/buttons, ◌ for keyboard/aria-live/reduced-motion). Don't claim AA there until the
  a11y pass is actually done (see backlog).

## 6. Backlog / open items (owner-facing)

1. **Résumé PDF** — the "Download full résumé (PDF)" button and the footer "Résumé (PDF)" link
   are placeholders (`href="#"`). Add the PDF to the repo and wire both.
2. **Footer "Portfolio deck"** link is still a placeholder (`href="#"`) — wire or remove.
3. **Resume section heading** still says "Experience, framed around outcomes." but the "Selected
   Experience" panel was removed (only "Credentials & Frameworks" remains). Consider retitling.
4. **AI Workflow Quest a11y pass** — convert clickable `<div onclick>` to buttons (or add
   role/tabindex/keydown), add `:focus-visible`, `aria-live` on coach/feedback/report, and a
   `prefers-reduced-motion` block. Then flip its accessibility section to ✓ and AA.
5. **DriveSmart card preview** is an illustrative SVG mock — swap for a real screenshot of the
   live app when convenient.
6. **DriveSmart app** has its own `ohio-drivesmart/HANDOFF.md` and `README.md` for its Vercel
   deploy + `ANTHROPIC_API_KEY` (server-side). Keep it a separate project.

## 7. Identity / links already wired
- Contact email: `druva.akhil@gmail.com` (mailto, 3 places).
- LinkedIn: `https://www.linkedin.com/in/akhilreddy-` (footer).
- DriveSmart live: `https://ohio-drivesmart-academy.vercel.app/`.
