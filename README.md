# NextGuide printer assistance

The site starts with a printer-issue choice, then guides visitors through brand and model selection before offering live chat or a callback request.

## Local development

Use Node.js 22, then run:

```sh
npm ci
npm run dev
```

Run `npm test`, `npx tsc --noEmit`, and `npm run build` to check changes.

## Deployment

The existing Netlify site can build this TanStack Start app using `netlify.toml`. The build uses Nitro's Netlify preset and publishes `dist`. Check the Netlify deploy log and the deployed site after pushing; a local build cannot verify the connected site's settings or external services.

The callback form posts directly from the visitor's browser to FormSubmit. Live chat uses Tawk. Neither delivery nor agent availability is guaranteed by a successful build. The `0xC0000142` card on the final screen is explicitly labeled as a sample design preview, not a detected error.
