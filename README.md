# AYMORATO Apps — Developer Website

**Quality Apps for Everyone**

Live site: https://alwinmorato.github.io/aymorato-apps/
Contact: aymorato.apps@gmail.com

A static website made of plain HTML, CSS and a little JavaScript. It has no build step and no dependencies, so it runs on GitHub Pages as soon as you upload it.

The homepage (`index.html`) is one self-contained file: all of its CSS and JS are inline. It includes the app showcase, screenshot gallery, the full privacy policy and the contact section. The subpages (terms, contact, apps, standalone privacy) share `css/style.css`, which uses the same colors.

**Design system:** Ink `#0F172A` · Cobalt `#1E40AF` · Amber `#F59E0B` · Backgrounds `#F8FAFC` / `#F1F5F9` · Inter font.

---

## Folder structure

```
aymorato-apps/
├── index.html               Homepage (hero + apps grid)
├── privacy-policy.html      CSC Mastery privacy policy (site-level copy)
├── terms.html               Terms of Use (general, all apps)
├── contact.html             Contact page
├── .nojekyll                Tells GitHub Pages to serve files as-is
├── css/style.css            All styles (colors are set in :root)
├── js/main.js               Mobile menu toggle
├── assets/
│   ├── logo/
│   │   ├── aymorato_final_colored_white_bg.png   Original logo (1600×1600)
│   │   ├── logo-512.png     Cropped logo for large uses
│   │   ├── logo-192.png     Header, footer, app card, apple-touch-icon
│   │   └── logo-64.png      Favicon
│   └── csc-mastery/
│       ├── app_icon.png     Copied from play_store_assets/logo/app_icon_512.png
│       ├── feature_graphic.png
│       └── screenshots/     6 screenshots copied from play_store_assets/screenshots/
└── apps/
    ├── index.html           List of all apps
    └── csc-mastery/
        ├── index.html       App page (text from about_this_app.txt)
        └── privacy.html     App privacy policy (text from privacy_policy.txt)
```

### Where the content came from
- The privacy policy pages copy `csc_mastery_app/play_store_assets/privacy_policy.txt` word for word. Only HTML formatting was added.
- The CSC Mastery page text comes from `play_store_assets/about_this_app.txt`.
- The app icon, feature graphic and all 6 screenshots were found and copied, so no image placeholders are needed.
- `terms.html` is a **general template** written for this site and was not in your assets. Read it and change it to suit you before you publish.

---

## Upload to GitHub Pages

### Option A: GitHub website (no Git needed)
1. Sign in to GitHub as **alwinmorato**.
2. Click **New repository** and name it exactly **`aymorato-apps`**. Set it to **Public** and click **Create repository**.
3. On the new repo page, click **uploading an existing file**.
4. Drag in **everything inside** the `aymorato-apps` folder: the files and the `css`, `js`, `assets` and `apps` folders. Upload the folder's contents, not the folder itself, so that `index.html` ends up at the repo root.
   - Windows hides `.nojekyll` because its name starts with a dot. The site works without it, so you can skip it.
5. Click **Commit changes**.
6. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, **Branch** to `main`, and the folder to `/ (root)`. Click **Save**.
7. Wait 1–2 minutes, then open https://alwinmorato.github.io/aymorato-apps/

### Option B: Git command line
```bash
cd C:\Users\DOH\Documents\Alwin\Android_app\aymorato-apps
git init
git add .
git commit -m "Initial AYMORATO Apps website"
git branch -M main
git remote add origin https://github.com/alwinmorato/aymorato-apps.git
git push -u origin main
```
Then turn on Pages as in step 6 above.

### Privacy policy URL for the Play Console
In **Play Console → App content → Privacy policy**, use:
```
https://alwinmorato.github.io/aymorato-apps/apps/csc-mastery/privacy.html
```
The same text is also at `https://alwinmorato.github.io/aymorato-apps/privacy-policy.html`.

---

## Add a new app

1. Copy `apps/csc-mastery/` to `apps/your-new-app/`.
2. Put the new app's icon and screenshots in `assets/your-new-app/`.
3. In `apps/your-new-app/index.html` and `privacy.html`, change the name, text, image paths, `<title>` and canonical URL.
4. Add a card for it in **both** `index.html` and `apps/index.html`. Copy the block marked `<!-- APP CARD -->` and change the `href`, icon, tag (for example *Tools*, *Games* or *Productivity*), title and description. On the homepage, delete one of the "Coming Soon" cards to make room.
5. Commit and push. GitHub Pages updates in about a minute.

## When CSC Mastery goes live on Google Play
In `apps/csc-mastery/index.html`, find the `TODO` comment by the Play Store button. Set its `href` to your Play Store link, remove `aria-disabled="true"`, and change the label to "Get it on Google Play".

On the homepage, also update the **Get CSC App →** header button (`href="#apps"`) and the disabled Google Play button in the "01 / The App" card.

## Change the theme
Colors are CSS variables in two places: the `<style>` block at the top of `index.html` and the top of `css/style.css`. Change both so the subpages keep matching the homepage.

---

© AYMORATO Apps 2026
