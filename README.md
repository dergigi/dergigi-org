# dergigi.org

A responsive product showcase for Feather, Goop, Boris, and ants. Built with semantic HTML, CSS, vanilla JavaScript, and Vite. No backend or environment variables required.

## Develop

```sh
npm ci
npm run dev
```

## Build and preview

```sh
npm run build
npm run preview
```

## Browser checks

With the dev server running:

```sh
npx playwright install chromium
node scripts/check.mjs
```

Alternatively set `CHROME_PATH` to your installed Chrome executable. Set `TEST_URL` to check another deployment. Checks cover responsive overflow at four widths, images, JavaScript errors, section navigation, and search suggestions.

## Deploy

The project is linked to `dergigis-projects/dergigi-org` on Vercel. Use a current CLI:

```sh
npx vercel@latest --prod
```

Live URL: https://dergigi.org

Source: https://github.com/dergigi/dergigi-org

Vercel is connected to this GitHub repository. Pushes to `master` automatically deploy to production at https://dergigi.org; other branches receive preview deployments. `.vercel/` contains local project linkage and is not committed. Run `npx vercel@latest link` to connect a new checkout for manual CLI deployments.

## Content and assets

Edit `index.html` for project copy and links, `src/style.css` for design, and `src/main.js` for interactions.

Product information: https://dergigi.com/projects/ and the projects' GitHub repositories. Feather screenshots and icon come from https://github.com/dergigi/feather/tree/master/website/assets. Avatar comes from https://dergigi.com/assets/images/avatars/09.png. Boris focuses on the Android app, with official Android library and reading screenshots from `dergigi/boris-landing`, a Zapstore install link, and source at `dergigi/boris-android`. The ants icon comes from `dergigi/ants`; its search treatment is interactive illustrative UI, not a screenshot. The ants Android link points to https://ants.sh/android. The ants form submits to https://ants.sh/ using its `q` query parameter. Google Fonts serves DM Sans and Manrope, with local system font fallbacks.

Goop uses the official logo and dark-theme chat screenshot from https://goop.dergigi.com/, with product information verified against https://github.com/dergigi/goop.

No Solutions cover art is sourced from https://nosolutions.show/images/nosolutions-cover.jpg and stored locally in `public/images/no-solutions-cover.jpg`.

The GRASP source-link icon uses the official `GraspLogo` path from https://github.com/DanConwayDev/gitworkshop/blob/main/src/components/GraspLogo.tsx.

Boris currently shows Zapstore screenshots 1 and 4 (downloaded from the listing on 2026-10-18) and the light-mode `android-settings-2.webp` screenshot from readwithboris.com.

The navigation Nostr icon is the transparent black icon from https://github.com/mbarulli/nostr-logo (design by Andrea Nicolini / Bembureda).

Goop, Feather, Boris Android, and ants Android include ngit/GRASP source links via GitWorkshop, using their published repository identifiers on `relay.ngit.dev`.

The No Solutions card plays episode 29, “State of the Mint and Mind” with Calle, from the show's public audio URL. Audio loads only on demand; play/pause, seeking, and playback speed are handled with the browser's audio API.

Screenshot thumbnails use prefiltered WebP variants and responsive `srcset`; clicking a screenshot opens its original. The hero uses `social-preview-v5.png`, while social previews use the optimized 1200×630 `social-preview-v6.jpg`. Earlier artwork versions and generation prompts are retained in `public/images/`.

## License

Website code is [MIT licensed](LICENSE). Original writing and artwork by Gigi are [CC BY-SA 4.0](CONTENT-LICENSE.md), unless otherwise noted. Third-party assets retain their existing licenses. See https://dergigi.com/license/.
