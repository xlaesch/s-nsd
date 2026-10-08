import { assetUrl } from "./paths";
export type Lang = "fr" | "en";
export type Bilingual = { fr: string; en: string };
export const bi = (fr: string, en: string): Bilingual => ({ fr, en });
export const anthology = bi(
  "Sommes-nous seuls dans l’univers ?",
  "Are we alone in the universe?",
);
export const cities = [
  { name: "Paris", x: 51, y: 30 },
  { name: "Lyon", x: 68, y: 61 },
  { name: "Marseille", x: 69, y: 85 },
  { name: "Bordeaux", x: 29, y: 68 },
  { name: "Nantes", x: 22, y: 44 },
  { name: "Lille", x: 57, y: 13 },
  { name: "Strasbourg", x: 86, y: 34 },
  { name: "Toulouse", x: 43, y: 82 },
  { name: "Rennes", x: 20, y: 34 },
  { name: "Montpellier", x: 57, y: 82 },
];
export interface Film {
  id: string;
  number: string;
  title: Bilingual;
  tagline: Bilingual;
  synopsis: Bilingual;
  image: string;
  color: string;
  duration: number;
  country: Bilingual;
  year: number;
  director: Bilingual;
  producer: Bilingual;
}
export const films: Film[] = [
  {
    id: "signal",
    number: "01",
    title: bi("Le dernier signal", "The last signal"),
    tagline: bi("Une voix, quelque part.", "A voice, somewhere."),
    synopsis: bi(
      "Sur une planète silencieuse, une voyageuse capte une chanson qui pourrait bien changer sa trajectoire. Une rencontre imaginée entre l’infiniment grand et les toutes petites choses.",
      "On a silent planet, a traveller picks up a song that might change her course. An imagined encounter between the infinitely large and the smallest things.",
    ),
    image: assetUrl("/images/moon.jpg"),
    color: "#b9b1ec",
    duration: 12,
    country: bi("France", "France"),
    year: 2026,
    director: bi("À confirmer", "To be confirmed"),
    producer: bi("À confirmer", "To be confirmed"),
  },
  {
    id: "fleurs",
    number: "02",
    title: bi("Les fleurs du dimanche", "Sunday flowers"),
    tagline: bi("La famille, ça se chante.", "Family comes with a soundtrack."),
    synopsis: bi(
      "Un déjeuner de famille se transforme en comédie musicale végétale. Les souvenirs poussent et les non-dits finissent par fleurir. Synopsis de démonstration.",
      "A family lunch turns into a botanical musical. Memories grow and the things left unsaid finally bloom. Demonstration synopsis.",
    ),
    image: assetUrl("/images/flowers.jpg"),
    color: "#ff9b71",
    duration: 9,
    country: bi("Belgique", "Belgium"),
    year: 2026,
    director: bi("À confirmer", "To be confirmed"),
    producer: bi("À confirmer", "To be confirmed"),
  },
  {
    id: "minuit",
    number: "03",
    title: bi("Minuit, encore", "Midnight, again"),
    tagline: bi(
      "Danser jusqu’au bout du monde.",
      "Dance to the end of the world.",
    ),
    synopsis: bi(
      "Le monde s’arrête, mais dans un karaoké oublié, une dernière chanson commence. Une nuit électrique et une invitation à rester ensemble. Synopsis de démonstration.",
      "The world stops, but in a forgotten karaoke bar, one last song begins. An electric night and an invitation to stay together. Demonstration synopsis.",
    ),
    image: assetUrl("/images/disco.jpg"),
    color: "#ed92b6",
    duration: 14,
    country: bi("France", "France"),
    year: 2026,
    director: bi("À confirmer", "To be confirmed"),
    producer: bi("À confirmer", "To be confirmed"),
  },
  {
    id: "maree",
    number: "04",
    title: bi("À contre-marée", "Against the tide"),
    tagline: bi(
      "Une mélodie sous la surface.",
      "A melody beneath the surface.",
    ),
    synopsis: bi(
      "Un petit être marin part à la recherche du son qu’il entend chaque nuit. Une traversée douce et étrange, au rythme de l’océan. Synopsis de démonstration.",
      "A small sea creature searches for the sound it hears every night. A gentle, strange journey to the rhythm of the ocean. Demonstration synopsis.",
    ),
    image: assetUrl("/images/sea.jpg"),
    color: "#8ec9db",
    duration: 8,
    country: bi("Portugal", "Portugal"),
    year: 2026,
    director: bi("À confirmer", "To be confirmed"),
    producer: bi("À confirmer", "To be confirmed"),
  },
  {
    id: "satellite",
    number: "05",
    title: bi("Satellite sentimental", "Sentimental satellite"),
    tagline: bi(
      "L’amour à quelques années-lumière.",
      "Love, a few light-years away.",
    ),
    synopsis: bi(
      "Deux satellites se croisent sans jamais se rencontrer. Leurs messages deviennent une chanson d’amour cosmique. Synopsis de démonstration.",
      "Two satellites pass without ever meeting. Their messages become a cosmic love song. Demonstration synopsis.",
    ),
    image: assetUrl("/images/city.jpg"),
    color: "#f0ca65",
    duration: 11,
    country: bi("Canada", "Canada"),
    year: 2026,
    director: bi("À confirmer", "To be confirmed"),
    producer: bi("À confirmer", "To be confirmed"),
  },
  {
    id: "encore",
    number: "06",
    title: bi("Et on recommence", "One more time"),
    tagline: bi(
      "Le générique n’est qu’un début.",
      "The credits are just the beginning.",
    ),
    synopsis: bi(
      "Une salle de cinéma vide se réveille après la dernière séance. Les fauteuils ont eux aussi quelque chose à raconter. Synopsis de démonstration.",
      "An empty cinema wakes up after the last screening. Even the seats have a story to tell. Demonstration synopsis.",
    ),
    image: assetUrl("/images/night.jpg"),
    color: "#a7c38e",
    duration: 10,
    country: bi("France", "France"),
    year: 2026,
    director: bi("À confirmer", "To be confirmed"),
    producer: bi("À confirmer", "To be confirmed"),
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
