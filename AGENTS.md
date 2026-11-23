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

- Structure: pages in src/components/pages, reusable UI in src/components/throttle, sample data in src/data, types in src/types, hooks in src/hooks, helpers in src/lib; route files stay thin — keeps screens composed from shared components.
- Prototype persistence goes through useLocalStorage (keys prefixed `throttle:`) — SSR-safe and resettable in one place.
- App shell (SideNav desktop, BottomNav mobile) lives in __root around <Outlet /> — one nav for all pages.
- Keep the theme hook module's refresh-reset directive — live updates must remount consumers rather than reuse stale hook order.
- The landing page is an isolated static Vite + React site in `landing/` with base `/remix-of-archive-to-canvas/`; keep it independent of the TanStack Start app so GitHub Pages can deploy it without backend services.
- Each landing feature owns an adjacent, self-contained preview with local React state and browser-safe sample data in demo.ts; never import the main app or persist visitor interactions, so no distant tabs or shared demo state can confuse visitors.
