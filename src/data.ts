import { assetUrl } from "./paths";
import { projectFrance } from "./geography";
export type Lang = "fr" | "en";
export type Bilingual = { fr: string; en: string };
const videoUrl = (filename: string, version = "20261012-full-res") => `${assetUrl(`/videos/${filename}`)}?v=${version}`;
export const bi = (fr: string, en: string): Bilingual => ({ fr, en });
export const anthology = bi(
  "Sommes-nous seules dans l’univers ?",
  "Musicals!",
);
export const cities = [
  { name: "Paris", longitude: 2.3522, latitude: 48.8566 },
  { name: "Lyon", longitude: 4.8357, latitude: 45.764 },
  { name: "Marseille", longitude: 5.3698, latitude: 43.2965 },
  { name: "Bordeaux", longitude: -0.5792, latitude: 44.8378 },
  { name: "Nantes", longitude: -1.5536, latitude: 47.2184 },
  { name: "Lille", longitude: 3.0573, latitude: 50.6292 },
  { name: "Strasbourg", longitude: 7.7521, latitude: 48.5734 },
  { name: "Toulouse", longitude: 1.4442, latitude: 43.6047 },
  { name: "Rennes", longitude: -1.6778, latitude: 48.1173 },
  { name: "Montpellier", longitude: 3.8767, latitude: 43.6119 },
].map((city) => {
  const position = projectFrance(city.longitude, city.latitude);
  return { ...city, x: position.x / 4.6, y: position.y / 4.8 };
});
export interface Film {
  id: string;
  title: Bilingual;
  shortSynopsis: Bilingual;
  synopsis: Bilingual;
  image: string;
  duration: string;
  format: Bilingual;
  country: Bilingual;
  director: Bilingual;
  producer: Bilingual;
  trailer?: string;
}
export const films: Film[] = [
  {
    id: "maestro",
    trailer: videoUrl("maestro-teaser.mp4"),
    title: bi("Maestro", "Maestro"),
    shortSynopsis: bi(
      "Un opéra nocturne, mené par un écureuil.",
      "A woodland opera, conducted by a squirrel.",
    ),
    synopsis: bi(
      "Au milieu d’une forêt, une troupe d’animaux sauvages se lance dans un opéra nocturne, un écureuil à la baguette.",
      "Deep in a forest, a troupe of wild animals performs a nocturnal opera, with a squirrel conducting.",
    ),
    image: assetUrl("/images/films/maestro.webp"),
    duration: "1:49",
    format: bi("Animation 3D", "3D animation"),
    country: bi("France", "France"),
    director: bi("Illogic", "Illogic"),
    producer: bi("Bloom Pictures", "Bloom Pictures"),
  },
  {
    id: "signal",
    trailer: videoUrl("signal-teaser.mp4"),
    title: bi("Signal", "Signal"),
    shortSynopsis: bi(
      "À l’écoute de l’espace, loin des autres.",
      "Listening to space, drifting away from others.",
    ),
    synopsis: bi(
      "Claudie sonde l’espace à la recherche de signes de vie extraterrestre. Absorbée par sa mission, elle perd peu à peu contact avec son entourage, jusqu’à voir la réalité lui échapper.",
      "Claudie scans space for signs of extraterrestrial life. Absorbed in her mission, she gradually loses touch with those around her, until reality itself begins to slip away.",
    ),
    image: assetUrl("/images/films/signal.webp"),
    duration: "16:44",
    format: bi("Stop motion", "Stop motion"),
    country: bi("France / Belgique", "France / Belgium"),
    director: bi(
      "Emma Carré & Mathilde Parquet",
      "Emma Carré & Mathilde Parquet",
    ),
    producer: bi(
      "Vivement Lundi ! · Lunanime · Komawé",
      "Vivement Lundi ! · Lunanime · Komawé",
    ),
  },
  {
    id: "la-fee-des-roberts",
    trailer: videoUrl("boob-fairy-trailer.mp4"),
    title: bi("La Fée des Roberts", "The Boob Fairy"),
    shortSynopsis: bi(
      "Une lionne, une petite fille et leurs rôles à jouer.",
      "A lioness, a little girl and the roles they play.",
    ),
    synopsis: bi(
      "Qui, de la lionne qui danse ou de la petite fille que l’on dresse, tiendra le mieux son rôle ? La Fée des Roberts saura qui est réellement digne d’attention.",
      "Who will play her part best: the dancing lioness or the little girl being trained? The Boob Fairy knows who truly deserves attention.",
    ),
    image: assetUrl("/images/films/la-fee-des-roberts.webp"),
    duration: "13:44",
    format: bi("Animation 2D", "2D animation"),
    country: bi("France", "France"),
    director: bi("Leahn Vivier-Chapas", "Leahn Vivier-Chapas"),
    producer: bi("Folivari", "Folivari"),
  },
  {
    id: "tuna-tartare",
    trailer: videoUrl("tuna-tartare-trailer.mp4"),
    title: bi("Tuna Tartare", "Tuna Tartare"),
    shortSynopsis: bi(
      "Deux laissés-pour-compte prennent le micro.",
      "Two cast-offs find their voices.",
    ),
    synopsis: bi(
      "Dans un karaoké du Los Angeles post-apocalyptique, une boîte de thon périmée et un faux sac Louis Vuitton s’encouragent à croire en leur voix artistique, même si le monde les considère comme des déchets.",
      "In a karaoke bar in post-apocalyptic Los Angeles, an expired tin of tuna and a fake Louis Vuitton bag encourage each other to believe in their artistic voices, even if the world sees them as rubbish.",
    ),
    image: assetUrl("/images/films/tuna-tartare.webp"),
    duration: "10:33",
    format: bi("Animation 2D", "2D animation"),
    country: bi("États-Unis", "United States"),
    director: bi("Lena Greene", "Lena Greene"),
    producer: bi("Autoproduction", "Self-produced"),
  },
  {
    id: "jeanne-jean-jean",
    trailer: videoUrl("jeanne-jean-jean-trailer.mp4"),
    title: bi("Jeanne & Jean Jean", "Jeanne & Jean Jean"),
    shortSynopsis: bi(
      "Une visite au magasin, un couple en question.",
      "A furniture shop visit puts a couple to the test.",
    ),
    synopsis: bi(
      "Un samedi après-midi, au cœur d’un magasin d’ameublement, Jeanne et Jean Jean se demandent s’ils sont vraiment faits pour vivre ensemble.",
      "One Saturday afternoon, in a furniture shop, Jeanne and Jean Jean wonder whether they are really meant to live together.",
    ),
    image: assetUrl("/images/films/jeanne-jean-jean.webp"),
    duration: "7:02",
    format: bi("Animation 2D", "2D animation"),
    country: bi("France", "France"),
    director: bi("Thanys Martin", "Thanys Martin"),
    producer: bi("Atelier de Sèvres", "Atelier de Sèvres"),
  },
  {
    id: "2-love",
    trailer: videoUrl("2-love-trailer.mp4"),
    title: bi("2:LOVE", "2:LOVE"),
    shortSynopsis: bi(
      "sur la court, la rivalité devient passion.",
      "On court, rivalry turns into passion.",
    ),
    synopsis: bi(
      "Lorsque deux ramasseuses de balles échangent un regard sur le court d’un prestigieux tournoi de tennis, leur rivalité se transforme peu à peu en une passion irrésistible.",
      "When two ball girls exchange a glance on the court of a prestigious tennis tournament, their rivalry gradually turns into an irresistible passion.",
    ),
    image: assetUrl("/images/films/2-love.webp"),
    duration: "11:00",
    format: bi("Animation 2D", "2D animation"),
    country: bi("Belgique / Israël", "Belgium / Israel"),
    director: bi("Ronni Shalev", "Ronni Shalev"),
    producer: bi(
      "OZÙ Productions · Mind The Gap Animation",
      "OZÙ Productions · Mind The Gap Animation",
    ),
  },
];
export interface Screening {
  id: string;
  partnerId: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  accessibility: string;
  booking?: string;
  x: number;
  y: number;
}
// Add bookings here only after their venue, date and time have been confirmed.
export const confirmedScreenings: Screening[] = [];
export interface Application {
  id: string;
  organisation: string;
  name: string;
  email: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  accessibility: string;
  booking: string;
  x: number;
  y: number;
  status: "pending" | "approved";
}
export const resources = [
  {
    title: bi("Dossier de presse", "Press kit"),
    type: "PDF",
    description: bi(
      "Tout le programme, en quelques pages.",
      "The entire programme, in a few pages.",
    ),
  },
  {
    title: bi("Kit de communication", "Communication kit"),
    type: "ZIP",
    description: bi(
      "Affiches, visuels et éléments pour vos réseaux.",
      "Posters, artwork and social assets.",
    ),
  },
  {
    title: bi("Bande-annonce HD", "HD trailer"),
    type: "MP4",
    description: bi(
      "Pour donner envie de venir chanter.",
      "A little preview of what is to come.",
    ),
  },
  {
    title: bi("Bande-annonce DCP", "DCP trailer"),
    type: "DCP",
    description: bi(
      "La bande-annonce pour votre salle.",
      "The trailer for your cinema.",
    ),
  },
  {
    title: bi("Autour de la séance", "Around the screening"),
    type: "PDF",
    description: bi(
      "Atelier de dessin, conversations et cocktails cosmiques.",
      "Drawing workshop, conversation starters and cosmic cocktails.",
    ),
  },
];

export const programmeTrailers = bi(
  videoUrl("programme-trailer-vf.mp4", "20261022-v4"),
  videoUrl("programme-trailer-veng.mp4", "20261022-v4"),
);
