# Campaign assets

## Supplied material

The programme document supplied in chat contains six film stills and one secondary programme poster. Both uploaded copies are identical. The website uses the real programme metadata from that document. `instructions.docx` was read as supplied reference material; the user’s chat request controls the work.

| Website asset | Source image in the programme document |
| --- | --- |
| `public/images/films/maestro.webp` | `word/media/image1.jpg` |
| `public/images/films/signal.webp` | `word/media/image2.png` |
| `public/images/films/la-fee-des-roberts.webp` | `word/media/image5.jpg` |
| `public/images/films/tuna-tartare.webp` | `word/media/image6.png` |
| `public/images/films/jeanne-jean-jean.webp` | `word/media/image3.png` |
| `public/images/films/2-love.webp` | `word/media/image7.png` |
| `public/images/programme-poster.webp` | `word/media/image4.jpg` |

Images are encoded to WebP without crops or creative alterations. Their full original proportions and colours are retained. Wide stills use containment in the programme grid.

The primary design reference is the magenta/violet poster shown in chat, with bright yellow condensed serif lettering and artwork from La Fée des Roberts. The embedded secondary poster is a different supplied design and is used in the press/download area.

`public/images/vivement-lundi.svg` was converted from the supplied `Logo VL blanc.eps` using Ghostscript and pdftocairo, retaining its white/red artwork.

The uploaded `sommes_nous_seules_V3.mp4` exceeds the download tool’s 32 MiB transfer limit and is not included. Private viewing links and passwords are not shipped in the public application.

## Fonts and interface

Chicle, by Miguel Hernandez, provides the rounded, condensed display lettering. DM Sans provides supporting text. Both fonts are self-hosted and licensed under the SIL Open Font License; copies of the licences are in `public/fonts/`.

- https://github.com/google/fonts/tree/main/ofl/chicle
- https://github.com/google/fonts/tree/main/ofl/dmsans

Icons are from Lucide. The old generated concept image and unrelated stock photos have been replaced by supplied programme artwork.

## Map

`src/geography.ts` uses public-domain Natural Earth 1:50m admin-0 geography: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson.

It includes metropolitan mainland France, Corsica and Île d’Oléron. A spherical Lambert conformal conic projection with standard parallels 44° and 49° positions both the outline and cities. The map stays north-up; interactive targets follow the same coordinates and zoom transformation as visible markers.
