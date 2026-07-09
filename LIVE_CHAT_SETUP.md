# Live chat setup (Firebase)

The support chat (visitor widget + `/agent` dashboard) runs on Firebase
Firestore. Until the env vars below are set, the site works normally and the
widget shows a friendly "chat isn't connected yet" message — nothing breaks.

## 1. Create the Firebase project
1. Go to <https://console.firebase.google.com> → **Add project** (free "Spark" plan is enough).
2. **Build → Firestore Database → Create database** → start in **production mode**
   (we ship real rules below), pick a region.
3. **Build → Authentication → Get started → Email/Password → Enable.**
4. **Authentication → Users → Add user** — create your agent account
   (e.g. `agent@yourdomain.com` + a password). This is what you log into `/agent` with.
5. **Project settings (gear) → General → Your apps → Web app (`</>`)** → register an
   app, then copy the `firebaseConfig` values.

## 2. Add the env vars
Copy `.env.local.example` to `.env.local` and fill in the 6 values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

For the deployed site, add the same 6 vars in **Vercel → Project → Settings →
Environment Variables** (or run `vercel env add` for each), then redeploy.

## 3. Deploy the security rules
`firestore.rules` is the real access control (visitor phone numbers are readable
only by a signed-in agent).

1. Open `firestore.rules` and put your agent email in the `isAgent()` allow-list.
2. Publish it — either paste it into **Firestore → Rules** in the console and hit
   **Publish**, or use the CLI:
   ```
   npm i -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules
   ```

## 4. Try it
- Visit the site → **Chat with us** (bottom-right) → enter name + phone → chat.
- In another tab/browser, go to **`/agent`** → sign in with the agent account →
  open the conversation → reply. Messages appear on both sides instantly.

## Notes
- **Whenever `firestore.rules` changes, re-publish it** (console → Firestore →
  Rules → paste → Publish) — the app's newer features (presence, typing,
  unread badges, close/delete) depend on the latest rules being live.
- The 6 `NEXT_PUBLIC_*` keys are **public by design** (they identify the project,
  they don't grant access). Access is enforced by `firestore.rules`, so keep that
  file correct.
- `/agent` is `noindex` and kept out of the sitemap.
- To add more agents: create them under Authentication and add their emails to
  `isAgent()` in `firestore.rules`, then redeploy the rules.
- The **contact form** also writes to Firestore (`contactMessages` collection).
  Read submissions in the Firebase console → Firestore → `contactMessages`;
  only allow-listed agents can read them.
