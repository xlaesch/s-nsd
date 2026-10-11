import { assetUrl } from "./paths";
import { projectFrance } from "./geography";
export type Lang = "fr" | "en";
export type Bilingual = { fr: string; en: string };
export const bi = (fr: string, en: string): Bilingual => ({ fr, en });
export const anthology = bi(
  "Sommes-nous seules dans l’univers ?",
  "Are we alone in the universe?",
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
}
export const films: Film[] = [
  {
    id: "maestro",
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
    title: bi("La Fée des Roberts", "La Fée des Roberts"),
    shortSynopsis: bi(
      "Une lionne, une petite fille et leurs rôles à jouer.",
      "A lioness, a little girl and the roles they play.",
    ),
    synopsis: bi(
      "Qui, de la lionne qui danse ou de la petite fille que l’on dresse, tiendra le mieux son rôle ? La Fée des Roberts saura qui est réellement digne d’attention.",
      "Who will play her part best: the dancing lioness or the little girl being trained? La Fée des Roberts knows who truly deserves attention.",
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
    title: bi("Jeanne & Jean Jean", "Jeanne & Jean Jean"),
    shortSynopsis: bi(
      "Une virée au magasin, un couple en question.",
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
    title: bi("2:LOVE", "2:LOVE"),
    shortSynopsis: bi(
      "Sur le court, la rivalité devient passion.",
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
  sample: boolean;
}
const baseDate = new Date();
baseDate.setDate(baseDate.getDate() + 14);
const demoDate = (offset: number) => {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const seedScreenings: Screening[] = [
  {
    id: "paris-1",
    partnerId: "demo-paris",
    city: "Paris",
    venue: "Cinéma des étoiles",
    date: demoDate(0),
    time: "20:00",
    accessibility: "step-free",
    x: 51,
    y: 30,
    sample: true,
  },
  {
    id: "lyon-1",
    partnerId: "demo-lyon",
    city: "Lyon",
    venue: "Le Petit Écran",
    date: demoDate(2),
    time: "18:30",
    accessibility: "step-free",
    x: 68,
    y: 61,
    sample: true,
  },
  {
    id: "nantes-1",
    partnerId: "demo-nantes",
    city: "Nantes",
    venue: "Studio imaginaire",
    date: demoDate(4),
    time: "19:00",
    accessibility: "unknown",
    x: 22,
    y: 44,
    sample: true,
  },
  {
    id: "bordeaux-1",
    partnerId: "demo-bordeaux",
    city: "Bordeaux",
    venue: "La Salle bleue",
    date: demoDate(6),
    time: "20:30",
    accessibility: "step-free",
    x: 29,
    y: 68,
    sample: true,
  },
  {
    id: "marseille-1",
    partnerId: "demo-marseille",
    city: "Marseille",
    venue: "Le Grand Bain",
    date: demoDate(8),
    time: "18:00",
    accessibility: "unknown",
    x: 69,
    y: 85,
    sample: true,
  },
  {
    id: "lille-1",
    partnerId: "demo-lille",
    city: "Lille",
    venue: "L’Écran libre",
    date: demoDate(10),
    time: "20:00",
    accessibility: "step-free",
    x: 57,
    y: 13,
    sample: true,
  },
];
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
