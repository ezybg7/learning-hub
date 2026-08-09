# Learning Hub

Everett's personal learning site — every certification is a **section**, every section is split into **chapters**, and every chapter teaches in short **bursts** with a quiz after each one, ending in a **chapter exam**. Progress, scores, and streaks save automatically in the browser (localStorage).

Built with zero dependencies and zero build step: plain HTML + CSS + JS. Open it, it works.

## Run it locally

Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .        # or: python3 -m http.server
```

## Deploy to GitHub Pages (one-time setup)

```bash
cd ~/Code/learning-hub
git remote add origin https://github.com/<your-username>/learning-hub.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: "Deploy from a branch" → Branch: `main` / `/ (root)` → Save.**

The site goes live at `https://<your-username>.github.io/learning-hub/` within a minute or two. Every future `git push` updates it automatically — no build, no Actions.

> Note: progress is stored per-browser-origin, so localhost progress and github.io progress are separate.

## How the site is structured

```
index.html              app shell (loads registry + engine)
styles.css              all styling, dark/light themes
app.js                  router, quiz engine, exam runner, progress store
data/
  registry.js           the exam catalog: every exam + its chapter list
  aws-ccp/
    chapter-01.js       one file per chapter of actual lesson content
```

- `data/registry.js` declares each exam (title, accent color, exam date, domains) and its chapters with `status: "ready"` or `"soon"`.
- Chapter content files call `LEARN.registerChapter({...})` with bursts (lesson HTML + quiz questions), an overview, and a chapter exam. They're lazy-loaded only when the chapter is opened.

## Adding a new chapter (the study-session workflow)

1. Create `data/<exam-id>/chapter-NN.js` following the shape of `chapter-01.js`.
2. In `data/registry.js`, flip that chapter's `status` to `"ready"` and add `src: "data/<exam-id>/chapter-NN.js"`.
3. Commit and push. Done — no build step.

Adding a whole new exam = one `registerExam({...})` block in the registry plus a `data/<exam-id>/` folder.

*(In practice: tell Claude "build Chapter N" during a study session and it does all of this for you.)*
