# Sommes-nous seules dans l’univers ?

A bilingual website for Miyu Distribution’s six-film animated musical programme. React, TypeScript and Vite, with supplied film stills, real programme credits, locally hosted fonts and a geographic France map.

## Run and build

```sh
npm install
npm run dev
npm run build
npm run preview
```

Development serves at `http://localhost:5173/`. Production retains the existing GitHub Pages base `/s-nsd/`; preview serves at `http://localhost:4173/s-nsd/`. The build generates entrypoints for every film and the existing routes, including legacy film URLs.

## Email applications

The organiser form sends real applications to **stagiaire.diffusion@miyu.fr** through the free FormSubmit service. It uses its documented AJAX endpoint, a table email template, a contextual subject, the applicant’s email as Reply-To, and a hidden honeypot. The form supports any city, a screening date/time, accessibility, an optional booking URL and a message. It displays pending, confirmation and failure states, retains input on failure, and offers the same address as an email alternative.

**One-time setup:** the first genuine submission triggers an activation email to the recipient. The recipient must follow FormSubmit’s confirmation link before enquiries are delivered. No test submission or activation request was sent during implementation, as requested. See https://formsubmit.co/ and https://formsubmit.co/documentation.

The service’s acceptance does not establish inbox delivery. This integration has not been tested by submitting a form. Browser checks block the service and never click the submit button.

Applications are sent to the team for review. They do not automatically publish a screening or approve themselves. There is no public simulated approval panel.

## Content and assets

- `src/data.ts`: six actual films, directors, producers, exact runtimes, techniques, short/full bilingual synopses, and demonstration screening records.
- `src/main.tsx`: presentation pages, navigation, screening filters, map, organiser email form and trailer placement.
- `src/campaign.css`: shared magenta/yellow/violet campaign styling and Chicle headlines.
- `src/art-direction.css`: full-bleed poster composition, expressive title placement, staggered open film gallery and responsive portrait framing. Film gallery images retain their original proportions; the hero uses a responsive crop.
- `src/geography.ts`: public-domain Natural Earth geography projected with Lambert conformal conic. `cities` holds longitude/latitude. Named city lookup corrects positions in older browser-local records.
- `public/images/films/`: all six supplied stills, encoded to WebP without crops or recolouring.
- `public/images/programme-poster.webp`: the secondary poster embedded in the programme document, available to download from the press and organiser pages.
- `public/images/vivement-lundi.svg`: browser-compatible conversion of the supplied EPS partner logo.
- `public/fonts/`: self-hosted fonts and their licences. No external font requests are needed.

The primary poster shown in chat guides the design. It differs from the secondary poster embedded in the document. The private full-film screening URLs and passwords from the source document are not included in the website.

The uploaded MP4 exceeded the environment’s 32 MiB transfer limit. The trailer placement therefore remains unavailable until an accessible video export or hosted trailer URL is supplied. No unrelated video is substituted.

## Screening data

Screenings are still explicitly marked as demonstrations: no confirmed real venues or booking records were supplied. Language and the pre-existing sample screening state may persist in localStorage. The form does not save applicant contact details to localStorage. Before announcing actual screenings, replace `seedScreenings` with confirmed records or connect a managed source of approved screening data.

## Verification

```sh
npm test
npm run test:browser
```

Start the development server before running browser checks. Chromium defaults to `/usr/bin/chromium`; set `CHROMIUM_PATH` or `TEST_URL` if needed. Checks cover programme metadata, film routes, FR/EN navigation, the modal, city projection and zoom alignment, map filters, mobile navigation, image loading and overflow at desktop/tablet/mobile sizes. They make zero email-service requests and do not submit or exercise the email form. Screenshots are stored in ignored `.qa/`.

## Existing hosting

Repository: https://github.com/xlaesch/s-nsd

Site: https://xlaesch.github.io/s-nsd/

The existing Pages workflow deploys `dist/` on pushes to `main`. Local implementation does not itself update that deployment.
