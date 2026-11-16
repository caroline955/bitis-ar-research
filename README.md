# Biti’s Hunter Matric 10 — AR research website (updated with six product photos)

This is a single-page bilingual (VI / EN) website prototype for academic research, not an official Biti’s website.

## What's updated
- **Real product photos** (optional mode): Six images supplied by the researcher, navigable by thumbnails, arrows, or horizontal swipe. This is a photo gallery, **not AR or a complete photographic 360° scan**.
- **3D / Try AR** (default mode): A real GLB 3D model with approximate geometry and side textures derived from the supplied photos. This is **not an accurate photogrammetry scan**; the top/front/back geometry is approximate and may look different from the actual product. On a supported AR phone over HTTPS, it can be placed into the camera view.
- **Questionnaire + Google Sheets code retained**: `questionnaire.js` and `apps-script.gs` are copied unchanged. `index.html` contains `const APPS_SCRIPT_URL = '';` by default.

## Updating an already deployed website
1. If your existing `index.html` already contains a working `APPS_SCRIPT_URL`, copy it to the new `index.html` before pushing. **Do not post the Google Sheets URL in public chats**.
2. Replace the repository's `index.html`. Add `matric10-photo-assisted.glb`, `side-outer.png`, `side-inner.png`, `photo-01.jpg` … `photo-06.jpg`. No need to replace the Apps Script if it is working.
3. Preserve `questionnaire.js`, `apps-script.gs`, and other files as needed; the new package includes them for completeness.
4. Commit / push to the `main` branch, then wait until GitHub Pages publishes the new version.
5. Test the photo gallery and 3D mode on desktop. Test **AR** on a supported phone over HTTPS.
6. Submit a test survey and verify that a new row actually appears in your Google Sheet. If the website reports 'not confirmed', check the Sheet and Apps Script execution log.

## Local run
```
python -m http.server 8000
```
Open `http://localhost:8000` from the folder containing `index.html`.

## Survey setup
Edit `questionnaire.js` (unchanged in this version). For cloud storage, deploy the code in `apps-script.gs` to Google Apps Script as a Web App, authorize access and paste the `/exec` URL in `APPS_SCRIPT_URL`.

## Research caveat
Photo gallery users and AR users have different experiences. For a study of AR effects, track which mode respondents use and do not treat a click on AR as proof that a live AR session started. The current `ar_entered` measure may not capture sessions launched in the operating system's external AR viewer.

## User experience metadata
The frontend adds `EXPERIENCE_MODE`, `PHOTO_ANGLES_VIEWED`, and `THREED_MODE_VISITED` to the response answer fields. The existing Apps Script automatically creates columns for them without requiring a new deployment. These are descriptive interaction indicators, not verified proof of successfully using AR.
