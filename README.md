# Sommes-nous seuls dans l’univers ?

A local bilingual creative prototype for Miyu’s musical short-film anthology. React, TypeScript, Vite, custom CSS, and a bundled SVG map. No server, account, API key, or hosted service is needed.

## Run

```sh
npm install
npm run dev
```

Open the URL printed by Vite, normally http://localhost:5173.

```sh
npm run build
npm run preview
npm test
npm run test:browser
```

Browser checks require Chromium. They use `/usr/bin/chromium` by default; set `CHROMIUM_PATH` to override it. Start the dev server before running the browser checks. Set `TEST_URL` if it runs on another port. QA screenshots are written to ignored `.qa/`.

## Review the demo

1. Visit **J’organise**. Use fictional contact details to submit a screening application.
2. Open **Validation démo** and approve the application.
3. The screening appears immediately on the map and list; homepage counters update.
4. **Mes ressources** unlocks a simulated packet. Official downloads are unavailable until supplied.
5. Refresh to check browser-local persistence. **Réinitialiser la démo** restores the initial sample screenings and removes applications from this browser.

No information is submitted or emailed. The review panel is a simulation without authentication. Language and demo data are stored in localStorage. Resetting the demo leaves the selected language intact. Sample dates start two weeks after the first launch and persist with the demo state after a change.

## Replace the sample content

- `src/data.ts`: bilingual titles and descriptions, six film entries, city positions, initial screenings, and organiser resource descriptions. `bi(french, english)` keeps translations together. All six films, credits, dates, venues, and numbers are illustrative.
- `public/images/`: replace concept images with licensed film stills or approved campaign graphics. Keep existing filenames to avoid code changes, or update the image paths in `src/data.ts`. The homepage uses `hero.webp`.
- `src/experimental.css`: the exhibition compositions, monochrome palette, pointer-responsive portal, and dimension-switch treatment. The palette uses modern white backgrounds, charcoal typography, monochrome imagery, and a restrained acid-yellow accent. `src/styles.css` contains the shared layout and form styles. `--display` controls condensed headlines, `--serif` the expressive italic type, and `--body` supporting text. Fonts currently load from Google Fonts; self-host them if offline operation is required.
- `src/main.tsx`: page copy, the supplied Miyu introduction, navigation, and placeholder contact details. Search for `À confirmer`, `à venir`, and `coming soon` when preparing final content. `TrailerModal` is the anthology trailer placement; replace its availability panel with a video player after the official trailer is supplied. Individual film trailers have an availability placement in `FilmDetail`.
- The provisional title follows the project brief with standard French spelling. Confirm the final title, English translations, programme metadata, timings, credits, and accessibility information with the team.

After changing initial screenings, reset the demo in the organiser page so previously persisted sample data does not override them. For cities beyond the ten supplied demo options, add their approximate SVG positions to `cities` in `src/data.ts`. Dates are ISO calendar dates; screening times are local to the venue.

## Production boundary

Before launch, replace all sample material and implement a backend for applications, authenticated review, approved screening publication, and email delivery. Replace the local simulation with server-authorised access to organiser files. Approval must remain idempotent and update partner/city totals from the approved records. The existing frontend does not provide security or durable shared data.

The SVG map is a stylised outline of metropolitan France, with the full accessible screening list beside it. Booking links accept only HTTP(S). No ticket sales are implemented. Press coverage is intentionally empty, and contact information is explicitly pending rather than invented.

The anthology artwork and reference-photo sources are documented in [ASSETS.md](ASSETS.md).

## GitHub Pages

Repository: https://github.com/xlaesch/s-nsd

Site: https://xlaesch.github.io/s-nsd/

Pushes to `main` run the Pages workflow, test the demo logic, build the site, and deploy `dist/`. Production builds use `/s-nsd/`; local development stays at `/`. `src/paths.ts` resolves image URLs, and `scripts/pages-routes.mjs` creates entrypoints for deep links and refreshes. Add new public routes to that script when extending the site.

`npm run preview` serves the production build at http://localhost:4173/s-nsd/.
