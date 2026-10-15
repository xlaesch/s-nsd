# Sommes-nous seules dans l’univers ? / Musicals!

A bilingual website for Miyu Distribution’s six-film animated musical programme, built with React, TypeScript and Vite. The Miyu-style programme header and clean catalogue frame retain the supplied campaign poster, Cooper Black titles, Scatterplot secondary text and Inter body text. All seven supplied teasers/trailers play at their original resolution.

## Run and build

```sh
npm install
npm run dev
npm run build
npm run preview
```

Development serves at `http://localhost:5173/`. GitHub production and preview retain `/s-nsd/`. The build generates entrypoints for all film and page routes, plus legacy routes and the 404 fallback.

## Email applications

The organiser form emails **stagiaire.diffusion@miyu.fr** through free FormSubmit. It requests organisation, contact email, venue, city, one or more proposed dates from 21 December 2026 onward, and an optional message. It uses FormSubmit’s AJAX endpoint, table template, contextual subject, Reply-To and hidden honeypot. It retains input on failure and provides a mailto alternative labelled “écrivez-nous” in French and “email us” in English. All visible contact links use these translated labels rather than showing the recipient’s address. Multiple dates are validated, deduplicated and included together in the email; the date-rule tests are pure functions and do not interact with the form or service. Applications do not automatically publish a screening.

The first genuine submission may trigger FormSubmit’s recipient activation email. The recipient must confirm it for delivery. No form submission, integration test or activation request was made. Browser QA blocks `https://formsubmit.co/**` and never exercises the form. Service acceptance alone does not prove inbox delivery. On 15 October the user reported an unconfirmed-submission error; the screenshot does not distinguish a network failure from a service rejection. Recipient activation and successful inbox delivery remain unverified. See [FormSubmit documentation](https://formsubmit.co/documentation) and [activation help](https://formsubmit.co/help).

## Content and assets

- `src/data.ts`: bilingual film metadata, each film’s supplied teaser/trailer, the actual programme trailer and demonstration screenings.
- `src/main.tsx`: pages, transparent navigation, geographic screening filters, native video players and the email form. “La Fée des Roberts” translates to “The Boob Fairy”; the English programme title is “Musicals!”. Company copy preserves “Miyu Distribution”.
- `src/miyu-extension.css`: Miyu-inspired uppercase programme navigation, larger supplied logo, black/white page frame, three-column film catalogue and responsive text menu. The poster artwork, campaign colours, Cooper Black and Scatterplot remain.
- `src/banner-update.css`: V4 banner-inspired lower-left title block, a shared margin for logo/title/body text, and responsive framing that keeps the character’s eyes clear. The favicon is a ringed planet in the campaign palette.
- `src/october-update.css`: campaign branding, actual font families, supplied yellow `#ffed00`, company profiles and responsive title composition. Existing campaign title sizes retain the approximately 5% reduction; the homepage lines additionally fit Cooper Black’s wider letterforms.
- `src/campaign.css` and `src/art-direction.css`: shared campaign layout and responsive gallery; the October stylesheet overrides earlier typography.
- `public/images/campaign-still.jpg`: supplied original still, copied unchanged. CSS provides responsive framing without filtering, recolouring or editing the source image.
- `public/images/brand/`: supplied MIYU black and white logos without “distribution”; the black version is the transparent PNG supplied on 15 October. `public/images/vivement-lundi-black.svg` is converted from the supplied `Logo VL noir.eps`, preserving its black lettering and red mark. The About page places both black logos directly on the page background.
- `public/videos/`: programme trailer and all six supplied short-film videos, served at the original supplied resolution, with audio and fast-start metadata. Jeanne & Jean Jean remains 3840×2160 (4K); The Boob Fairy remains 2048×1152; 2:LOVE remains 1998×1080. All other supplied clips are 1920×1080.
- `design-reference/`: supplied poster PDF, edited French poster, title graphics and Vivement Lundi! EPS. These are references, not downloadable press assets.
- `src/geography.ts`: Natural Earth France outline projected with Lambert conformal conic; city targets share the visible map’s coordinates and zoom transform.

Cooper Black and Scatterplot load actual webfont files through the supplied Adobe kit `https://use.typekit.net/ubh7atw.css`, as specified in the Drive font reference. They are Adobe-hosted rather than redistributed locally. Inter and its OFL licence are local. The Adobe kit owner must retain the kit and its permitted domains; offline visitors receive fallback fonts. See `ASSETS.md` for provenance.

The homepage trailer starts when its button is clicked; clicking a film card opens its page and starts the supplied teaser with sound. Direct film-page visits show a large play button; if a browser blocks autoplay, that button remains available. Native controls retain pause, seeking and fullscreen. Video players have no visible captions below them; the programme modal retains an accessible name. The homepage header keeps MIYU; all inner pages show a translated “Sommes-nous seules dans l’univers ?” / “Are we alone in the universe?” homepage link. The header has no gallery/distribution/production links. The programme introduction uses the supplied French and English campaign copy. The press page has no poster, poster download or description below its title. The organiser page has no contact-name, local-time, accessibility or booking-link fields and no poster download or film image. Who Are We includes the two supplied company biographies and logos, with links to both company websites and without a film image. Its French title keeps the question mark with the last word. Private screening URLs/passwords from reference documents are not shipped.

## Screening data

Screenings remain explicitly marked as demonstrations: confirmed venues and booking records were not supplied. Language and existing sample screening state may persist in localStorage; applicant contact details are not saved there. Replace `seedScreenings` with confirmed records before announcing real screenings.

## Verification

```sh
npm test
npm run test:browser
npm run test:videos
```

Start development before browser checks. Chromium defaults to `/usr/bin/chromium`; override `CHROMIUM_PATH` or `TEST_URL` if needed. QA covers actual font loading, video metadata, bilingual navigation and film titles, all page routes, modal focus, city projection/zoom alignment, filters, mobile menu, images and horizontal overflow at 1440/768/390/320px in both languages. The browser uses the inherited HTTPS proxy when present, with local preview bypass only. Screenshots are in ignored `.qa/`. Every browser context blocks FormSubmit; no form submission occurs.

The video check verifies original pixel dimensions, duration, one-click playback with sound and seeking on all seven supplied teasers/trailers, plus desktop/mobile direct-page play buttons and homepage playback. It requires user activation and does not invoke playback programmatically. Run against the deployed site with `TEST_URL=https://xlaesch.github.io/s-nsd npm run test:videos`. These are promotional videos; complete short films are not included.

## Hosting

- [GitHub repository](https://github.com/xlaesch/s-nsd) and [GitHub Pages](https://xlaesch.github.io/s-nsd/): the existing workflow deploys `dist/` after pushes to `main` using `npm run build`.

GitHub Pages is the production publication. ChatGPT Sites is no longer maintained or deployed by this project.
