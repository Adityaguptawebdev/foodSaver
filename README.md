# Food Saver landing page

A one-page site for downloading the Food Saver Android app (APK). It's plain HTML, CSS and JS, with no build step, so it deploys anywhere.

```
index.html          the page
styles.css          all styles (colours and fonts match the app)
main.js             config, download link, iPhone detection, scroll effects
assets/screens/     cleaned-up app screenshots (WebP)
assets/brand/       logo mark and icons (copied from foodApp)
assets/og-image.jpg social preview (1200×630)
assets/video/       the 1-minute product film (MP4, 19 MB) and its poster frame
downloads/          the APK the Download buttons serve
vercel.json         makes Vercel send the APK as a download (attachment, APK type)
screenshots/        original screenshots: local only, not in git (they show personal details)
```

## Where the APK comes from

The Download buttons serve `downloads/food-saver-v1.1.3.apk`, which is hosted with the site
itself (an exact copy of `foodApp/dist/food-saver-v1.1.3.apk`, same SHA-256 as the Drive
file). Tapping **Download for Android** starts the download straight away.

Google Drive can't do that reliably. Visitors who aren't signed in to Google get the file,
but signed-in visitors (most Android phones) get Drive's "Google Drive has detected issues
with your download… Download anyway" page first, and a website can't skip it. So Drive is
only linked as a backup ("Open in Google Drive").

What still appears and can't be removed by any website: on Android, Chrome may ask you to
confirm downloading an APK, and Android asks once to allow installs from that app. The
Install section on the page explains both.

## Releasing a new version

1. Copy the new APK into `downloads/`, e.g. `downloads/food-saver-v1.2.0.apk`.
   A new file name per version avoids browsers serving an old cached copy.
2. Edit the `CONFIG` object at the top of `main.js`:

```js
const CONFIG = {
  APK_URL: "downloads/food-saver-v1.2.0.apk",
  DRIVE_URL: "https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing", // backup copy
  WEB_APP_URL: "https://donateforgood.vercel.app",
  APK_VERSION: "1.2.0",
  APK_SIZE: "57 MB",
  MIN_ANDROID: "Android 7.0 or newer",
};
```

3. Delete the old APK from `downloads/` and redeploy.

`index.html` contains the same links and version text, so the page works with JavaScript
turned off. The JS overwrites them on load, so updating them is optional. Set `APK_URL` to
`""` to fall back to a direct Drive download link.

## Preview locally

```bash
cd foodLanding
python3 -m http.server 4321
# open http://localhost:4321
```

To try it on your phone, use your computer's LAN IP instead of localhost, e.g. `http://192.168.1.20:4321`.

## Deploy

Upload the folder as is; there's nothing to build. The APK is 57 MB, so pick a host that
accepts files that size.

- **Vercel (recommended):** `npx vercel` in this folder, or import the folder in the
  dashboard. Leave "Framework" as *Other* and the build command empty. Static files up to
  100 MB are fine on the free Hobby plan, and `vercel.json` sets the download headers.
  `.vercelignore` keeps `screenshots/` out of the upload.
- **GitHub Pages:** push the folder to a repo and enable Pages for the branch. Files up to
  100 MB are allowed; git warns about files over 50 MB, which is expected.
- **Netlify:** large single files aren't well supported there, so it's not recommended
  for hosting the APK.

After deploying, change the `og:image` and `twitter:image` tags in `index.html` to the full
URL (e.g. `https://your-domain/assets/og-image.jpg`). WhatsApp, X and LinkedIn need an
absolute URL to show the preview image.


## How the page behaves

- **Film:** sits right under the hero. It never autoplays because it has a voice-over;
  the poster shows until someone presses "Watch the film", and it returns to the poster
  when it ends. To swap the film, replace `assets/video/food-saver-film.mp4` (keep it
  H.264/AAC MP4) and, if the opening changes, `film-poster.webp`.

- **Android and desktop:** Download buttons in the nav, the hero and the final section.
- **iPhone and iPad:** the Download buttons are replaced by a short note and an
  "Open the web app" button, because there's no iOS app.
- **How it works (desktop):** the phone on the right stays in place and switches screens
  as you scroll through the five steps. On phones, each step shows its own screenshot.
- Motion is turned off for visitors who have "Reduce motion" enabled.

## Screenshots used

The originals are in `screenshots/` on the original machine only; `.gitignore` keeps them
out of the repo because they show a phone number, emails and profile photos. The copies in
`assets/screens/` were cleaned up:
the floating gear button and the floating menu button that appear in the original captures
were removed, the phone number on the handoff screen and the NGO profile photo are
blurred, and everything was resized and converted to WebP.

| Page section | File | From |
|---|---|---|
| Hero (front) | `donor-home.webp` | `Screenshot_1792821233.png` |
| Hero (back) | `partner-home.webp` | `Screenshot_1792820882.png` |
| Getting started: login | `login.webp` | `apk-login-google.png` |
| Getting started: roles | `signup-role.webp` | `apk-signup-role.png` |
| Step 1, Post | `post-food.webp` | `Screenshot_1792820601.png` |
| Step 2, Alert | `alert-nearby.webp` | `Screenshot_1792820277.png` |
| Step 3, Claim | `claim.webp` | `Screenshot_1792822212.png` |
| Step 4, Hand over | `handoff-code.webp` | `Screenshot_1792822253.png` |
| Step 5, Deliver | `delivered.webp` | `Screenshot_1792822267.png` |
| Details: AI | `detail-ai.webp` | `Screenshot_1792820705.png` (crop) |
| Details: progress | `detail-progress.webp` | `Screenshot_1792820895.png` (crop) |
| Details: safe until | `detail-safe-until.webp` | `Screenshot_1792820748.png` (crop) |
| Impact | `impact.webp` | `Screenshot_1792820371.png` |
| Install (welcome screen) | `welcome.webp` | `Screenshot_1792819700.png`, with the loaded “So far, together” numbers row from `Screenshot_1792820389.png` (same card, same position) |
| Web app | `web-browse.webp` | `Pasted 2026-10-24 at 4.36.06 PM.png` |
