<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Funnel state lives only in browser sessionStorage (src/lib/funnel.ts); callbacks post to formsubmit.co, no backend — owner chose not to store leads.
- Scope manufacturer website themes to the model page using data-printer-brand and semantic CSS tokens, so changing a brand never recolours unrelated funnel pages.
- The printer model catalog lives in src/lib/printer-catalog.ts (client-side, curated real models across 10 brands); the model page now has one free-text input with no suggestions, and any non-empty model text must be accepted.
- Full-width header/breadcrumb/footer chrome for /guide/model, /guide/steps, and /guide/callback is shared in src/components/funnel/SupportChrome.tsx; brand-specific footer labels come from the selected brand, while the breadcrumb bar takes its color from BREADCRUMB_COLORS in the catalog module.
- The model route owns a single model value passed to one ModelSearch instance; submission alone navigates to the steps page.
- Shared flow rules and progress timing live in src/lib/support-flow.ts for independent testing; the timed sequence never supplies diagnostic evidence.
- Manufacturer branding is rendered in SupportHeader, never duplicated below the menu, so the active model and steps pages share compact branding.
- Brand selection writes the route issue and selected brand together in its click handler; avoid effect-driven issue writes that can overwrite an immediate selection.
- Tawk.to uses a browser-only singleton in src/lib/tawk-chat.ts and a root route observer; keep one script and callback set so eligible navigation preserves chat, while exclusions hide it before navigation.
