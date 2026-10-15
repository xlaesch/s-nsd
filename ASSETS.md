# Campaign assets

## Supplied sources

October material comes from the user’s [shared Drive folder](https://drive.google.com/drive/folders/1nb3r5z4k67n3dtxkH2T2ssuruk2E3Z0f). Both `drive.google.com` and `drive.usercontent.google.com` were reachable through the environment’s normal proxy before downloads. Documents are reference material; the user’s chat requirements control implementation.

| Website asset | Supplied source |
| --- | --- |
| `public/images/campaign-still.jpg` | “unedited poster image”, copied unchanged |
| `public/images/brand/miyu-white.png` | `LogoMiyu_Blanc.png` |
| `public/images/brand/miyu-black.png` | `LogoMiyu_Transparent (1).png`, copied unchanged from the 15 October upload |
| `public/images/vivement-lundi-black.svg` | `Logo VL noir.eps`, supplied 15 October and converted to transparent SVG with Ghostscript/pdftocairo; original EPS retained in `design-reference/` |
| `public/videos/programme-trailer.mp4` | “anthology trailer”, file `1h6IfGqNjM173lhy9WKcf2Pmr3H58rSve` in “assets for V2 instructions” |
| `public/videos/maestro-teaser.mp4` | `Maestro_Teaser.mp4`, integrated in the checkpoint |
| `public/videos/signal-teaser.mp4` | `SIGNAL_TEASER_vf (1).mp4` |
| `public/videos/boob-fairy-trailer.mp4` | `La Fee des Roberts_ bande annonce 3.mp4` |
| `public/videos/tuna-tartare-trailer.mp4` | `TunaTartare_TRAILER_042825_No-LA.mp4` |
| `public/videos/jeanne-jean-jean-trailer.mp4` | `TRAILER_JEANNE_ET_JEANJEAN_ADS_2024.mp4` |
| `public/videos/2-love-trailer.mp4` | `2LOVE_trailer_V1.mp4` |

The programme uses its own supplied trailer, not the Maestro teaser. Every clip preserves the original supplied pixel dimensions: Jeanne & Jean Jean is 3840×2160; The Boob Fairy is 2048×1152; 2:LOVE is 1998×1080; the other four clips are 1920×1080. Videos already below GitHub’s 100 MiB per-file limit are remuxed without re-encoding video or audio. Larger sources use H.264 CRF 18, with no resizing, a 16 Mb/s bitrate cap and 192 kb/s AAC audio. Content and proportions are preserved; frame duration remains unchanged apart from sub-frame audio/container padding. Fast-start metadata enables progressive playback and seeking. Native controls include full-screen playback. Clicking the homepage trailer button or a film card starts the selected video with sound; direct-page visits wait for a click on the play button. If the browser blocks automatic playback, the play button remains available. Inline playback and original-resolution exports are preserved.

GitHub Pages is the sole maintained publication. The earlier Sites-specific 25 MiB export constraint no longer applies. The design now combines the supplied campaign artwork and typefaces with the uppercase programme navigation and clean catalogue layout of [Miyu Production](https://www.miyu.fr/production/en/home/). Miyu’s proprietary Antique Olive font is not copied; utility text retains the requested Inter.

`design-reference/20261012_MUSICALS_AFFICHE.pdf` is the latest supplied English poster reference. `design-reference/20261005_MUSICALS_AFFICHE-FR.png` is the supplied edited French poster, copied unchanged; its duplicate Drive copy is identical. Supplied title PNGs and partner EPS are also retained there. The homepage follows the newer V4 banner’s lower-left title block and keeps the character’s eyes clear while using live Cooper Black text. Source artwork is not recoloured or creatively altered.

The programme document supplies all six stills and the original programme metadata:

| Website still | Image in the programme document |
| --- | --- |
| `public/images/films/maestro.webp` | `word/media/image1.jpg` |
| `public/images/films/signal.webp` | `word/media/image2.png` |
| `public/images/films/la-fee-des-roberts.webp` | `word/media/image5.jpg` |
| `public/images/films/tuna-tartare.webp` | `word/media/image6.png` |
| `public/images/films/jeanne-jean-jean.webp` | `word/media/image3.png` |
| `public/images/films/2-love.webp` | `word/media/image7.png` |
| `public/images/programme-poster.webp` | `word/media/image4.jpg`, legacy secondary poster, no longer shown or linked |

Film stills retain their proportions and colours and were encoded without crops. Who Are We uses the supplied French company biographies and English translations. Private film-viewing links/passwords are excluded from the application.

## Fonts and interface

The Drive document “fonts and hex code color” supplies Adobe kit `https://use.typekit.net/ubh7atw.css` and yellow `#ffed00`. `index.html` loads that kit; the browser downloads the actual Cooper Std Black and Scatterplot VF font files. CSS uses `cooper-black-std` for titles and `scatterplot-vf` for secondary text, with `"RAND" 0, "wght" 300`. These files remain Adobe-hosted under the supplied kit’s service licence; they are not extracted, repackaged or redistributed as self-hosted assets.

Inter is self-hosted in `public/fonts/Inter.ttf` with `Inter-OFL.txt`. Earlier Chicle and DM Sans files/licences remain legacy assets; they are no longer selected by the final font variables. Icons are from Lucide. No generated artwork or unrelated stock video is substituted.

## Map

`src/geography.ts` uses [public-domain Natural Earth 1:50m admin-0 geography](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson).

It includes metropolitan mainland France, Corsica and Île d’Oléron. A spherical Lambert conformal conic projection with standard parallels 44° and 49° positions the outline and cities. The map stays north-up; interactive targets share the visible markers’ coordinates and zoom transform.

## V4 banner composition

The user’s 14 October ZIP supplies the French and English `20261012_MUSICALS_BANNIERE FB` artwork, retained unchanged as `design-reference/20261012_MUSICALS_BANNER-FR.png` and `...-EN.png`. The accompanying unedited still is byte-identical to `public/images/campaign-still.jpg`. The homepage uses that unchanged still with live Cooper Black lettering grouped in the lower-left corner, aligned to the logo and page text. It follows the supplied banner’s title hierarchy while keeping the character’s eyes unobstructed.

`public/favicon.svg` is a ringed planet and star drawn with the campaign’s yellow, magenta and violet palette. All visible team contact links display “écrivez-nous” in French and “email us” in English; the original recipient remains in the mailto destination and FormSubmit configuration.

## 15 October interface update

The uploaded ZIP contains only the two logo artworks listed above. The supplied black Vivement Lundi! artwork retains its red mark; it is used in the About page and footer without a background panel. The About-page MIYU logo uses the supplied transparent black PNG. All inner-page headers show the translated programme name as a link to the homepage; MIYU remains in the homepage header. The programme introduction uses the user’s supplied French and English text verbatim.
