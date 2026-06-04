# Deploy the portfolio on GitHub + Vercel

Same push-to-redeploy flow you already use for DriveSmart. This site is **plain static
files — no build step**, so Vercel just serves it.

- **Homepage:** `index.html`
- **Live links it ships:** the AI Workflow Quest (`ai-workflow-quest.html`), the SiteReady
  module (`deploy/`) + Pre-Use Card. DriveSmart stays its own Vercel project; the portfolio
  links out to it.
- The included `.gitignore` keeps the repo clean (skips the DriveSmart subfolder, backups,
  unused images, and the old Firebase config).

> One caution: this folder lives inside **OneDrive**, and Git repos inside OneDrive can hit
> sync conflicts on the `.git` folder. If you see weird Git behavior, either pause OneDrive
> sync while you commit, or copy the project to a non-synced path (e.g. `C:\dev\akhil-portfolio`)
> and run Git from there.

---

## Step 0 — clean up + get out of OneDrive (do this first)

An automated attempt to `git init` from inside OneDrive failed (OneDrive locks the `.git`
folder) and left a broken `.git` folder behind. Fix it in one of two ways:

**Recommended — move the project out of OneDrive, then init fresh:**
1. Copy this whole folder to a non-synced path, e.g. `C:\dev\akhil-portfolio`.
2. In the *copy*, delete the `.git` folder if it came along (PowerShell in that folder:
   `Remove-Item -Recurse -Force .git`). The config files (`.gitignore`, `vercel.json`, etc.)
   stay — only `.git` goes.
3. Do all the Git steps below from `C:\dev\akhil-portfolio`.

**Or — stay in place, just remove the broken repo:**
- PowerShell in this folder: `Remove-Item -Recurse -Force .git`
  (or File Explorer → View → Show → Hidden items → delete the `.git` folder), then continue.
  If OneDrive gives you grief later, fall back to the "move it out" option above.

---

## One-time setup

### Put it on GitHub (easiest: GitHub Desktop — you have it installed)
1. GitHub Desktop → **File → Add local repository** → choose this folder.
2. It'll offer to **create a repository here** → do that (the `.gitignore` is already in place).
3. Write a summary ("portfolio") → **Commit to main** → **Publish repository**
   (uncheck "Keep this code private" if you want it public).

*CLI alternative:*
```
git init
git add .
git commit -m "portfolio"
# create an empty repo on github.com, then:
git remote add origin https://github.com/<you>/<repo>.git
git branch -M main
git push -u origin main
```

### Import to Vercel
1. https://vercel.com → **Add New → Project → Import** your repo.
2. **Framework Preset: Other** (it's static — leave Build Command and Output Directory empty).
3. **Deploy.** Live in ~20 seconds at `https://<repo>.vercel.app`.

---

## Redeploy on every change

Just commit and push:
- GitHub Desktop → **Commit to main** → **Push origin**, or `git push`.
- Vercel auto-deploys the new commit. That's the whole loop — new designs/modules go live by pushing.

---

## Custom domain (buy at IONOS)

1. Vercel → your project → **Settings → Domains** → add `yourname.com` (and `www`).
2. Vercel shows the DNS records. In **IONOS → Domains & SSL → your domain → DNS**, add them
   (an A record / CNAME as Vercel specifies). SSL provisions automatically.

---

## Notes
- You can delete `firebase.json` and `DEPLOY.md` if you've fully moved off Firebase — they're
  already excluded from the repo, so they won't deploy either way.
- To add a new module later: drop the file in, link it from `index.html`, commit, push. Done.
