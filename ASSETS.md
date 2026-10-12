# Campaign assets

## Supplied sources

October material comes from the user’s [shared Drive folder](https://drive.google.com/drive/folders/1nb3r5z4k67n3dtxkH2T2ssuruk2E3Z0f). Both `drive.google.com` and `drive.usercontent.google.com` were reachable through the environment’s normal proxy before downloads. Documents are reference material; the user’s chat requirements control implementation.

| Website asset | Supplied source |
| --- | --- |
| `public/images/campaign-still.jpg` | “unedited poster image”, copied unchanged |
| `public/images/brand/miyu-white.png` | `LogoMiyu_Blanc.png` |
| `public/images/brand/miyu-black.png` | `LogoMiyu_Noir.png` |
| `public/images/vivement-lundi.svg` | `Logo VL blanc.eps`, converted to SVG with Ghostscript/pdftocairo |
| `public/videos/programme-trailer.mp4` | “anthology trailer”, file `1h6IfGqNjM173lhy9WKcf2Pmr3H58rSve` in “assets for V2 instructions” |
| `public/videos/maestro-teaser.mp4` | `Maestro_Teaser.mp4`, integrated in the checkpoint |
| `public/videos/signal-teaser.mp4` | `SIGNAL_TEASER_vf (1).mp4` |
| `public/videos/boob-fairy-trailer.mp4` | `La Fee des Roberts_ bande annonce 3.mp4` |
| `public/videos/tuna-tartare-trailer.mp4` | `TunaTartare_TRAILER_042825_No-LA.mp4` |
| `public/videos/jeanne-jean-jean-trailer.mp4` | `TRAILER_JEANNE_ET_JEANJEAN_ADS_2024.mp4` |
| `public/videos/2-love-trailer.mp4` | `2LOVE_trailer_V1.mp4` |

The programme uses its own supplied trailer, not the Maestro teaser. Newly integrated videos are encoded as H.264/AAC MP4 at CRF 23 (programme trailer: CRF 25 to fit Sites’ 25 MiB file limit), up to 1920px wide, with original proportions, duration, content and audio preserved. Fast-start metadata supports progressive playback; native controls, inline playback and metadata-only preload avoid autoplay.

`design-reference/20261012_MUSICALS_AFFICHE.pdf` is the latest supplied English poster reference. `design-reference/20261005_MUSICALS_AFFICHE-FR.png` is the supplied edited French poster, copied unchanged; its duplicate Drive copy is identical. Supplied title PNGs and partner EPS are also retained there. The homepage follows their upper/side/lower title hierarchy and portrait artwork framing while using live Cooper Black text. Source artwork is not recoloured or creatively altered.

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
