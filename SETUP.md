# Setup guide — connect HealthHub to a free real database

This site uses **Firebase** (Google's app backend) for the database and
admin login. The free "Spark" plan is enough for a small shop — no credit
card required. Follow these steps once; after that, everything just works.

## 1. Create a free Firebase project
1. Go to https://console.firebase.google.com and log in with any Google account.
2. Click **Add project** → give it a name (e.g. `healthhub`) → keep default options → **Create project**.

## 2. Register a Web app
1. On your new project's home screen, click the **</>** (Web) icon.
2. Give the app a nickname (e.g. `healthhub-web`) → **Register app**.
3. Firebase shows a `firebaseConfig = { ... }` block. Copy those values into
   `firebase-config.js` in this project, replacing the placeholder text.
4. Click **Continue to console**.

## 3. Turn on Email/Password login (for the admin page)
1. In the left sidebar: **Build → Authentication → Get started**.
2. Under **Sign-in method**, enable **Email/Password** → **Save**.
3. Go to the **Users** tab → **Add user** → enter the email and password
   you (the shop owner) will log in with on `admin.html`. You can add more
   than one admin user later the same way.

## 4. Turn on Firestore (the product database)
1. In the left sidebar: **Build → Firestore Database → Create database**.
2. Choose a location close to you → start in **production mode** → **Enable**.
3. Go to the **Rules** tab and replace the contents with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;               // anyone can view products
      allow write: if request.auth != null; // only logged-in admins can add/edit/delete
    }
  }
}
```

4. Click **Publish**.

## 5. Deploy to GitHub Pages
Upload all files (including your edited `firebase-config.js`) to your GitHub
repository as before, then enable Pages in **Settings → Pages**. Firebase
works the same way whether you open the site locally or on GitHub Pages,
but Email/Password login needs `https://`, so always test the admin login
on the live GitHub Pages link — not by double-clicking `index.html` on your
phone/computer.

## 6. Log in
Open `yoursite.github.io/admin.html`, log in with the email/password you
created in step 3. From there you can add, edit and delete products, and
change your password — all changes appear instantly for every visitor.

## That's it
No server to run, no monthly bill on the free tier for a small shop. If you
outgrow the free tier (very high traffic) Firebase will show you Google's
current pricing before anything is charged.
