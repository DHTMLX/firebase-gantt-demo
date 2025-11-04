# DHTMLX Gantt ⇄ Firebase Realtime Demo

This demo shows how to connect **DHTMLX Gantt** with **Firebase Cloud Firestore** to enable real-time updates and multi-user synchronization. When one user creates, edits, or deletes a task or link, the change is instantly reflected in other open browser tabs - no page reloads needed.

The setup makes it easy to build collaborative project management tools where multiple users can interact with the same Gantt chart simultaneously. Everything runs on the client side using Vanilla JS and Vite, with Firebase handling data storage and live updates.

## Features

- **Realtime two-way sync** - every Gantt change is written to Firestore, every Firestore change is streamed back and applied to the Gantt chart.
- **Zero-backend setup** - pure frontend, Firebase hosts the database, websockets and auth tokens for you.
- **Bulk first load, delta afterwards** - fast initial data load, then per-document updates via `gantt.ext.liveUpdates`.

## Quick start

```bash
git clone https://github.com/DHTMLX/%REPO%.git
cd gantt-realtime-firebase-demo
npm i
cp .env.example .env             # paste your Firebase keys
npm run dev
```

Open **http://localhost:5173** in two browser tabs and watch events propagate in real time.

## Setting-up Firebase

- Create a project in [Firebase Console](https://console.firebase.google.com/).
- Create Firestore Database (in Native mode)
- Register the web app
- Paste Firebase configuration JSON into your .env file (see next section).

## .env format

```bash
VITE_FIREBASE_CONFIGURATION={"apiKey":"xxxxxxxxxxxxxxxxxxx","authDomain":"yourdomain.firebaseapp.com","databaseURL":"https://databasesubdomain.firebaseio.com","projectId":"gantt-with-realtime-firebase","storageBucket":"bucketname.firebasestorage.app","messagingSenderId":"12345","appId":"1:123454:web:4b0d4f77c3abd01367865e","measurementId":"G-QBQ961235KN1"}
```

## Repo structure (relevant bits)

```bash
index.html
src/
  ├─ firebase.js
  ├─ style.css
  └─ main.js
.env.example
package.json
firebase.json
firebaserc
firestore.rules
.gitignore
```

## Scripts

- `npm run dev` - Start Vite development server (localhost:5173)
- `npm run build` - Production build to /dist
- `npm run preview` - Locally preview production build
- `npm run deploy` - Build and deploy to Firebase Hosting (requires setup)

## Deploy the finished bundle to Firebase Hosting:

```bash
npm i -g firebase-tools      # once
firebase login
firebase init hosting        # pick 'dist' as public folder
npm run deploy
```

## License

Source code in this repo is released under the **MIT License**.

**DHTMLX Gantt** is a commercial library - use under a valid [DHTMLX
license](https://dhtmlx.com/docs/products/licenses.shtml) license or evaluation agreement.

Using **Firebase Firestore / Hosting** is subject to Google's terms of service and billing. Stay within the free tier or set quotas.

## Useful links

- [DHTMLX Gantt Product Page](https://dhtmlx.com/docs/products/dhtmlxGantt/)
- [DHTMLX Gantt Documentation](https://docs.dhtmlx.com/gantt/)
- [Firebase Web SDK docs](https://firebase.google.com/docs?hl=ru)
- [Firestore security rules guide](https://firebase.google.com/docs/firestore/security/get-started?hl=ru)
- [DHTMLX technical support forum](https://forum.dhtmlx.com/c/gantt/react-gantt/46)
