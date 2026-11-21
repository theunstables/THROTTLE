# THROTTLE landing page

An isolated static Vite + React landing page. It does not import or change the existing TanStack Start application and needs no backend, authentication, database, API or Lovable Cloud.

## Local development

```sh
bun install
bun run dev
```

Open the local URL printed by Vite under the `/remix-of-archive-to-canvas/` base path.

## Production build

```sh
bun run build
bun run preview
```

The deployable static output is `landing/dist`. The Vite base path is `/remix-of-archive-to-canvas/` for the `remix-of-archive-to-canvas` GitHub repository.

## Waitlist and footer configuration

Edit `src/config.ts`:

- `WAITLIST_FORM_URL`: full externally hosted Google Form URL. While empty, CTAs focus a visible "not yet open" notice and never collect or save details.
- `INSTAGRAM_URL`: full public Instagram profile URL.
- `CONTACT_EMAIL`: public contact email address without `mailto:`.

## GitHub Pages

The workflow at `.github/workflows/throttle-landing-pages.yml` runs on pushes to `throttle-landing` and through manual dispatch. It builds only this directory and deploys with GitHub Actions.

In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** as the source. Push this directory and the workflow to the `throttle-landing` branch. The site is not live until that workflow succeeds.

## Photography

- Existing THROTTLE project motorcycle photographs, reused and optimised as WebP.
- `india-road.webp`: "Gata Loops, Leh Manali Highway" by Narender9, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Gata_Loops,Leh_Manali_Highway.jpg). Licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Converted from JPEG to WebP; no other creative changes.
