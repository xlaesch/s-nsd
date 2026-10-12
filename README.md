# Sommes-nous seules dans l’univers ? / Musicals!

A bilingual website for Miyu Distribution’s six-film animated musical programme, built with React, TypeScript and Vite. The October branding uses supplied MIYU and Vivement Lundi! artwork, the original poster still, Cooper Black titles, Scatterplot secondary text, Inter body text, and seven supplied trailers.

## Run and build

```sh
npm install
npm run dev
npm run build
npm run preview
```

Development serves at `http://localhost:5173/`. GitHub production and preview retain `/s-nsd/`. `npm run build:sites` uses the separate `vite.sites.config.ts` with base `/` for Sites hosting. Both builds generate entrypoints for all film and page routes, plus legacy routes and the 404 fallback.

## Email applications

The organiser form emails **stagiaire.diffusion@miyu.fr** through free FormSubmit. It requests organisation, contact email, venue, city, proposed date and an optional message. It uses FormSubmit’s AJAX endpoint, table template, contextual subject, Reply-To and hidden honeypot. It retains input on failure and provides an email alternative. Applications do not automatically publish a screening.

The first genuine submission may trigger FormSubmit’s recipient activation email. The recipient must confirm it for delivery. No form submission, integration test or activation request was made. Browser QA blocks `https://formsubmit.co/**` and never exercises the form. Service acceptance alone does not prove inbox delivery. See [FormSubmit documentation](https://formsubmit.co/documentation).

## Content and assets

- `src/data.ts`: bilingual film metadata, each film’s supplied teaser/trailer, the actual programme trailer and demonstration screenings.
- `src/main.tsx`: pages, transparent navigation, geographic screening filters, native video players and the email form. “La Fée des Roberts” translates to “The Boob Fairy”; the English programme title is “Musicals!”. Company copy preserves “Miyu Distribution”.
- `src/october-update.css`: latest branding, actual font families, supplied yellow `#ffed00`, company profiles and responsive title composition. Existing campaign title sizes retain the approximately 5% reduction; the homepage lines additionally fit Cooper Black’s wider letterforms.
- `src/campaign.css` and `src/art-direction.css`: shared campaign layout and responsive gallery; the October stylesheet overrides earlier typography.
- `public/images/campaign-still.jpg`: supplied original still, copied unchanged. CSS provides responsive framing without filtering, recolouring or editing the source image.
- `public/images/brand/`: supplied MIYU black and white logos without “distribution”. `public/images/vivement-lundi.svg` is converted from the supplied EPS.
- `public/videos/`: programme trailer and all six supplied short-film videos, prepared for web playback with audio and fast-start metadata.
- `design-reference/`: supplied poster PDF, edited French poster, title graphics and Vivement Lundi! EPS. These are references, not downloadable press assets.
- `src/geography.ts`: Natural Earth France outline projected with Lambert conformal conic; city targets share the visible map’s coordinates and zoom transform.

Cooper Black and Scatterplot load actual webfont files through the supplied Adobe kit `https://use.typekit.net/ubh7atw.css`, as specified in the Drive font reference. They are Adobe-hosted rather than redistributed locally. Inter and its OFL licence are local. The Adobe kit owner must retain the kit and its permitted domains; offline visitors receive fallback fonts. See `ASSETS.md` for provenance.

The press page has no poster, poster download or description below its title. The organiser page has no contact-name, local-time, accessibility or booking-link fields and no poster download. Who Are We includes the two supplied company biographies and logos, without a film image. Private screening URLs/passwords from reference documents are not shipped.

## Screening data

Screenings remain explicitly marked as demonstrations: confirmed venues and booking records were not supplied. Language and existing sample screening state may persist in localStorage; applicant contact details are not saved there. Replace `seedScreenings` with confirmed records before announcing real screenings.

## Verification

```sh
npm test
npm run test:browser
```

Start development before browser checks. Chromium defaults to `/usr/bin/chromium`; override `CHROMIUM_PATH` or `TEST_URL` if needed. QA covers actual font loading, video metadata, bilingual navigation and film titles, all page routes, modal focus, city projection/zoom alignment, filters, mobile menu, images and horizontal overflow at 1440/768/390/320px in both languages. The browser uses the inherited HTTPS proxy when present, with local preview bypass only. Screenshots are in ignored `.qa/`. Every browser context blocks FormSubmit; no form submission occurs.

## Hosting

- [GitHub repository](https://github.com/xlaesch/s-nsd) and [GitHub Pages](https://xlaesch.github.io/s-nsd/): the existing workflow deploys `dist/` after pushes to `main` using `npm run build`.
- [Existing Sites publication](https://sommes-nous-seules-review.ardent-spool-3600.chatgpt.site): project `appgprj_6acbe60df0d08191beafdd9506668876`, preserving its public audience. Its source checkout contains `.openai/hosting.json` with `static.directory: dist`; publication uses `npm run build:sites`. Sites identity and configuration stay separate from GitHub Pages.
