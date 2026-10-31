# AYMORATO Apps — Developer Website

**Quality Apps for Everyone**

Live site: https://aymorato.github.io/aymorato-apps/
Contact: aymorato.apps@gmail.com

A static website made of plain HTML, CSS and a little JavaScript. It has no build step and no dependencies, so it runs on GitHub Pages as soon as you upload it.

Every page shares `css/style.css` and `js/main.js`. Everything that lists apps is built from `apps.json`: the app tiles on the homepage and `apps/index.html`, the footer app links, the command palette and the hero terminal. A local preview therefore needs a web server (for example VS Code Live Server); opening `index.html` straight from disk won't load the apps.

**Design system:** Navy `#0F172A` · Android green `#3DDC84` · dark-first, with a light theme toggle · Geist (UI) + JetBrains Mono (code, labels) · dot grid, bento tiles, terminal UI.

**Built-in extras:** press <kbd>Ctrl</kbd>+<kbd>K</kbd> (<kbd>⌘</kbd><kbd>K</kbd> on Mac) or <kbd>/</kbd> on any page for the command palette. The homepage terminal takes commands (`help`, `ls`, `open lto`, `doctor`, `contact`, `theme`). The git log tile is static, display-only text in `index.html`; edit it there.

---

## Folder structure

```
aymorato-apps/
├── index.html               Homepage (hero + terminal, apps bento, studio bento, contact)
├── apps.json                App list: tiles, footer links, palette and terminal
├── privacy-policy.html      Older CSC Mastery privacy policy (kept so existing links keep working)
├── terms.html               Terms of Use (general, all apps)
├── contact.html             Contact page
├── .nojekyll                Tells GitHub Pages to serve files as-is
├── css/style.css            All styles (colors are set in :root)
├── js/main.js               Theme, menu, app tiles, command palette, terminal, clock
├── assets/
│   ├── logo/
│   │   ├── aymorato_final_colored_white_bg.png   Original logo (1600×1600)
│   │   ├── logo-512.png     Cropped logo for large uses
│   │   ├── logo-192.png     Header, footer, app card, apple-touch-icon
│   │   └── logo-64.png      Favicon
│   ├── csc-mastery/         app_icon.png, feature_graphic.jpg, screenshots/
│   ├── let-reviewer/        app_icon.png, feature_graphic.png, screenshots/
│   └── gwa-calculator/      app_icon.png, feature_graphic.png, screenshots/
└── apps/
    ├── index.html           List of all apps (cards from apps.json)
    └── <id>/                csc-mastery, let-reviewer, gwa-calculator
        ├── index.html       App page: 1 About, 2 Screenshots, 3 Privacy summary
        └── privacy.html     "Privacy Policy for <App Name>"
```

### Where the content came from

- All three `apps/<id>/privacy.html` pages use the same shared policy text; only the app name changes.
- About text comes from each app's `play_store_assets` (`about_this_app.txt` / `store_listing/`).
- Icons and screenshots were copied from each app's `play_store_assets` folder.
- `terms.html` is a **general template** written for this site and was not in your assets. Read it and change it to suit you before you publish.

---

## Upload to GitHub Pages

### Option A: GitHub website (no Git needed)

1. Sign in to GitHub as **aymorato**.
2. Click **New repository** and name it exactly **`aymorato-apps`**. Set it to **Public** and click **Create repository**.
3. On the new repo page, click **uploading an existing file**.
4. Drag in **everything inside** the `aymorato-apps` folder: the files and the `css`, `js`, `assets` and `apps` folders. Upload the folder's contents, not the folder itself, so that `index.html` ends up at the repo root.
   - Windows hides `.nojekyll` because its name starts with a dot. The site works without it, so you can skip it.
5. Click **Commit changes**.
6. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to _Deploy from a branch_, **Branch** to `main`, and the folder to `/ (root)`. Click **Save**.
7. Wait 1–2 minutes, then open https://aymorato.github.io/aymorato-apps/

### Option B: Git command line

```bash
cd C:\Users\DOH\Documents\Alwin\Android_app\aymorato-apps
git init
git add .
git commit -m "Initial AYMORATO Apps website"
git branch -M main
git remote add origin https://github.com/aymorato/aymorato-apps.git
git push -u origin main
```

Then turn on Pages as in step 6 above.

### Privacy policy URL for the Play Console

In **Play Console → App content → Privacy policy**, use:

```
https://aymorato.github.io/aymorato-apps/apps/csc-mastery/privacy.html
https://aymorato.github.io/aymorato-apps/apps/let-reviewer/privacy.html
https://aymorato.github.io/aymorato-apps/apps/gwa-calculator/privacy.html
```

---

## Add a new app

1. Copy `apps/gwa-calculator/` to `apps/your-new-app/`.
2. Put the new app's icon at `assets/your-new-app/app_icon.png` and screenshots in `assets/your-new-app/screenshots/`.
3. In `apps/your-new-app/index.html` and `privacy.html`, change the name, text, image paths, `<title>` and canonical URL.
4. Add an entry to `apps.json` (`id` must match the folder name). The homepage tiles, All Apps page, footer links, command palette and terminal all update automatically. Fields:
   - `id`, `name`, `badge`, `description`: required.
   - `short`: short name for the footer, palette and terminal (falls back to `name`).
   - `tagline`: one-line summary shown by `ls` in the terminal.
   - `specs`: up to 3 or 4 `"label": "value"` pairs shown on the tile, for example `"questions": "1,100"`.
   - `play`: Google Play URL. Leave it `""` while the app isn't published; the tile then shows "Google Play · soon".
5. Add it to the `<noscript>` list in `index.html`.
6. Commit and push. GitHub Pages updates in about a minute.

## When an app goes live on Google Play

1. In `apps.json`, set the app's `play` field to its Play Store URL. The tile's status chip becomes a "Google Play ↗" link.
2. In `apps/<id>/index.html`, find the `TODO` comment by the Play Store button. Set its `href` to the Play Store link, remove `aria-disabled="true"`, and change the label to "Get it on Google Play".

## Change the theme

Colors are CSS variables at the top of `css/style.css`: `:root` holds the dark (default) theme and `:root[data-theme="light"]` overrides it for light mode. A visitor's choice is saved in `localStorage` under `aymorato:theme`.

---

© AYMORATO Apps 2026
