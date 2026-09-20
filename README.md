# HealthHub — Health & Wellness Website

A mobile-friendly health & wellness website with a real admin panel and
shared product database, built with plain HTML/CSS/JS + Firebase (free tier).

## Files
- `index.html` — website structure, including a live Shop section
- `style.css` — design and responsive layout
- `script.js` — article search and category filtering
- `admin.html` — real login (Firebase Authentication) to add/edit/delete products and prices
- `admin.js` — admin login + product form logic
- `products.js` — shared product database logic (Firebase Firestore), used by both index.html and admin.html
- `firebase-config.js` — where you paste your own free Firebase project keys
- `SETUP.md` — one-time step-by-step setup for the free database and admin login

## First-time setup (required)
Before the admin panel or shop section will work, follow **SETUP.md** —
it walks through creating a free Firebase project (no credit card), turning
on login, and turning on the database. Takes about 10 minutes, one time only.

## Admin panel
Open `admin.html` (or tap "Admin" in the site footer) and log in with the
email/password you created in Firebase during setup. Products you add,
edit or delete appear instantly for every visitor, on any device — this is
a real shared database, not just your own browser.

## GitHub Pages
1. Create a GitHub account.
2. Create a new repository (for example `healthhub`).
3. Upload all files in this folder, including your edited `firebase-config.js`.
4. Open the repository's **Settings → Pages**.
5. Select the main branch and root folder, then save.
6. GitHub will provide the live website address — always test the admin
   login there (not by double-clicking `index.html`), since Firebase login
   needs `https://`.

## Important
The sample health content is educational placeholder content. Replace it
with medically reviewed content before publishing as a real health-
information service. Add your final Privacy Policy, Disclaimer and Contact
details.
