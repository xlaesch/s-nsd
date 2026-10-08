import { assetUrl } from "./paths";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Play,
  X,
  Menu,
  MapPin,
  Plus,
  Minus,
  Check,
  Accessibility,
  Download,
  Music2,
  CalendarDays,
  RotateCcw,
  ExternalLink,
  Mail,
} from "lucide-react";
import {
  anthology,
  bi,
  cities,
  films,
  resources,
  seedScreenings,
  type Application,
  type Bilingual,
  type Film,
  type Lang,
  type Screening,
} from "./data";
import {
  approveApplication,
  calculateStats,
  STORAGE_KEY,
  validBooking,
} from "./demo.mjs";
import "./styles.css";
import "./experimental.css";

type DemoState = { applications: Application[]; screenings: Screening[] };
type AppContext = {
  lang: Lang;
  t: (value: Bilingual) => string;
  state: DemoState;
  update: (next: DemoState) => void;
  storageError: boolean;
  trailer: () => void;
};
const Context = createContext<AppContext>(null!);
const useApp = () => useContext(Context);
const initial = (): DemoState => ({
  applications: [],
  screenings: seedScreenings,
});
function readDemo(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial();
    const value = JSON.parse(raw);
    if (!Array.isArray(value.applications) || !Array.isArray(value.screenings))
      return initial();
    const screenings = value.screenings.filter(
      (s: Screening) =>
        typeof s.id === "string" &&
        typeof s.city === "string" &&
        typeof s.partnerId === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(s.date) &&
        Number.isFinite(s.x) &&
        Number.isFinite(s.y),
    );
    const applications = value.applications.filter(
      (a: Application) =>
        typeof a.id === "string" &&
        typeof a.organisation === "string" &&
        typeof a.email === "string" &&
        ["pending", "approved"].includes(a.status),
    );
    return { screenings, applications };
  } catch {
    return initial();
  }
}
function Star({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`star ${className}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <path
        d="M50 0 60 33 85 15 67 40 100 50 67 60 85 85 60 67 50 100 40 67 15 85 33 60 0 50 33 40 15 15 40 33Z"
        fill="currentColor"
      />
    </svg>
  );
}
function Eye({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 140 90" aria-hidden="true">
      <path
        d="M5 45Q70-30 135 45Q70 120 5 45Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
      />
      <ellipse cx="70" cy="45" rx="20" ry="30" fill="currentColor" />
      <circle cx="77" cy="35" r="6" fill="var(--lime)" />
    </svg>
  );
}
function dateLabel(
  date: string,
  lang: Lang,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" },
) {
  return new Intl.DateTimeFormat(
    lang === "fr" ? "fr-FR" : "en-GB",
    opts,
  ).format(new Date(date + "T12:00:00"));
}
function Label({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className={`eyebrow ${light ? "light" : ""}`}>
      <span className="tiny-star" aria-hidden="true">
        ✳
      </span>
      {children}
    </div>
  );
}
function TextLink({
  to,
  children,
  className = "",
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link to={to} className={`text-link ${className}`}>
      {children}
      <ArrowUpRight size={21} />
    </Link>
  );
}
function DemoNote({ children }: { children?: React.ReactNode }) {
  const { t } = useApp();
  return (
    <div className="demo-note">
      <span className="demo-dot" />
      {children ||
        t(
          bi(
            "Prototype créatif · contenu de démonstration",
            "Creative prototype · demonstration content",
          ),
        )}
    </div>
  );
}

function App() {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return localStorage.getItem("s-nsd-language") === "en" ? "en" : "fr";
    } catch {
      return "fr";
    }
  });
  const [state, setState] = useState<DemoState>(readDemo);
  const [storageError, setStorageError] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const update = (next: DemoState) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  };
  const changeLanguage = (next: Lang) => {
    setLang(next);
    try {
      localStorage.setItem("s-nsd-language", next);
    } catch {
      /* Session language still works. */
    }
  };
  const t = (v: Bilingual) => v[lang];
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t(anthology) + " — Miyu";
  }, [lang]);
  return (
    <Context.Provider
      value={{
        lang,
        t,
        state,
        update,
        storageError,
        trailer: () => setShowTrailer(true),
      }}
    >
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollReset />
        <a className="skip-link" href="#main">
          {t(bi("Aller au contenu", "Skip to content"))}
        </a>
        <Header changeLanguage={changeLanguage} />
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programme" element={<Programme />} />
            <Route path="/programme/:id" element={<FilmDetail />} />
            <Route path="/seances" element={<Screenings />} />
            <Route path="/presse" element={<Press />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/organiser" element={<Organise />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        {showTrailer && <TrailerModal close={() => setShowTrailer(false)} />}
      </BrowserRouter>
    </Context.Provider>
  );
}
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.querySelector("main")?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}
function Header({ changeLanguage }: { changeLanguage: (lang: Lang) => void }) {
  const { lang, t } = useApp();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);
  const nav = [
    ["/programme", bi("Le programme", "The programme")],
    ["/seances", bi("Trouver une séance", "Find a screening")],
    ["/presse", bi("Presse", "Press")],
    ["/a-propos", bi("Qui sommes-nous ?", "Who are we?")],
  ] as const;
  return (
    <header className="header">
      <Link
        to="/"
        className="brand"
        aria-label={t(bi("Miyu, accueil", "Miyu, home"))}
      >
        miyu<span className="brand-sub">DISTRIBUTION</span>
      </Link>
      <nav
        className={`main-nav ${open ? "is-open" : ""}`}
        aria-label={t(bi("Navigation principale", "Main navigation"))}
      >
        {nav.map(([href, label]) => (
          <NavLink to={href} key={href}>
            {t(label)}
          </NavLink>
        ))}
      </nav>
      <div className="header-right">
        <div className="languages" aria-label={t(bi("Langue", "Language"))}>
          <button
            aria-pressed={lang === "fr"}
            onClick={() => changeLanguage("fr")}
          >
            FR
          </button>
          <span>/</span>
          <button
            aria-pressed={lang === "en"}
            onClick={() => changeLanguage("en")}
          >
            EN
          </button>
        </div>
        <Link to="/organiser" className="organise-link">
          {t(bi("J’organise", "Host a screening"))}
          <ArrowUpRight size={18} />
        </Link>
        <button
          className="menu-toggle icon-button"
          id="menu-toggle"
          aria-expanded={open}
          aria-controls={open ? "mobile-navigation" : undefined}
          aria-label={t(
            open
              ? bi("Fermer le menu", "Close menu")
              : bi("Ouvrir le menu", "Open menu"),
          )}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label={t(bi("Navigation mobile", "Mobile navigation"))}
        >
          {nav.map(([href, label]) => (
            <NavLink to={href} key={href}>
              {t(label)}
              <ArrowUpRight />
            </NavLink>
          ))}
          <Link to="/organiser">
            {t(bi("J’organise une séance", "Host a screening"))}
            <ArrowUpRight />
          </Link>
        </nav>
      )}
    </header>
  );
}
function Home() {
  const { t, lang, trailer, state } = useApp();
  const stats = calculateStats(state.screenings);
  const [dimension, setDimension] = useState(false);
  const movePoster = (event: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--drift-x",
      `${((event.clientX - bounds.left) / bounds.width - 0.5) * 22}px`,
    );
    event.currentTarget.style.setProperty(
      "--drift-y",
      `${((event.clientY - bounds.top) / bounds.height - 0.5) * 16}px`,
    );
  };
  return (
    <>
      <section
        className={`hero experimental-poster ${dimension ? "other-dimension" : ""}`}
        onPointerMove={movePoster}
        onPointerLeave={(event) => {
          event.currentTarget.style.setProperty("--drift-x", "0px");
          event.currentTarget.style.setProperty("--drift-y", "0px");
        }}
      >
        <div className="poster-orbit orbit-one" aria-hidden="true" />
        <div className="poster-orbit orbit-two" aria-hidden="true" />
        <span className="poster-coordinate" aria-hidden="true">
          48°51′ N / 02°21′ E — ∞
        </span>
        <div className="hero-topline">
          <span>
            {t(
              bi(
                "LE JOUR LE PLUS COURT SE CHANTE.",
                "THE SHORTEST DAY HAS A SOUNDTRACK.",
              ),
            )}
          </span>
          <span>
            {t(
              bi(
                "UN PROGRAMME MIYU DISTRIBUTION",
                "A MIYU DISTRIBUTION PROGRAMME",
              ),
            )}
            <ArrowDown size={14} />
          </span>
        </div>
        <div className="hero-composition">
          <div className="hero-title">
            <h1>
              {lang === "fr" ? (
                <>
                  <span>SOMMES-NOUS</span>
                  <span className="serif-word">seuls</span>
                  <span>
                    DANS L’UNIVERS<span className="question-mark">?</span>
                  </span>
                </>
              ) : (
                <>
                  <span>ARE WE</span>
                  <span className="serif-word">alone</span>
                  <span>
                    IN THE UNIVERSE<span className="question-mark">?</span>
                  </span>
                </>
              )}
            </h1>
            <div className="poster-footnote">
              <span>
                {t(
                  bi(
                    "six films pour chanter dans le vide",
                    "six films to sing into the void",
                  ),
                )}
              </span>
              <svg viewBox="0 0 180 70" aria-hidden="true">
                <path
                  d="M4 12C80 65 142-8 167 29S80 70 48 35M128 61l44-28-10 31"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <span className="poster-edition" aria-hidden="true">
              VOL.<strong>06</strong>
            </span>
          </div>
          <div className="hero-art">
            <div className="art-frame">
              <img
                src={assetUrl("/images/hero.webp")}
                alt={t(
                  bi(
                    "Illustration de concept : un chanteur solitaire sur une planète bleue, sous un soleil orange.",
                    "Concept illustration: a lone singer on a blue planet beneath an orange sun.",
                  ),
                )}
              />
              <span className="art-caption">
                {t(bi("QUELQUE PART, ENSEMBLE.", "SOMEWHERE, TOGETHER."))}
              </span>
            </div>
            <span className="portal-ring" aria-hidden="true">
              LE CINÉMA NOUS RAPPROCHE / CINEMA BRINGS US CLOSER /
            </span>
            <Star className="hero-star" />
            <button className="trailer-sticker" onClick={trailer}>
              <Play size={22} fill="currentColor" />
              <span>
                {t(bi("BANDE-", "WATCH THE"))}
                <br />
                {t(bi("ANNONCE", "TRAILER"))}
              </span>
              <ArrowUpRight size={19} />
            </button>
            <button
              className="dimension-switch"
              onClick={() => setDimension(!dimension)}
              aria-pressed={dimension}
            >
              <Eye />
              <span>{t(bi("changer de dimension", "switch dimensions"))}</span>
            </button>
            <span className="orbit-note">
              {t(bi("à voir sur grand écran", "made for the big screen"))} ↗
            </span>
          </div>
        </div>
        <div className="hero-bottom">
          <div className="hero-description">
            <span className="hero-count">
              06<span>✳</span>
            </span>
            <p>
              {t(
                bi(
                  "Six courts métrages. Six chansons.\nZéro bonne raison de ne pas y aller.",
                  "Six short films. Six songs.\nEvery reason to be there.",
                ),
              )}
            </p>
          </div>
          <Link className="pill-button dark" to="/seances">
            {t(bi("Trouver ma séance", "Find my screening"))}
            <ArrowUpRight size={23} />
          </Link>
        </div>
        <div className="hero-bottomline">
          <DemoNote />
          <a href="#decouvrir" className="scroll-cue">
            {t(bi("ON VOUS EMMÈNE ?", "SHALL WE?"))}
            <ArrowDown size={16} />
          </a>
        </div>
      </section>
      <Marquee />
      <section id="decouvrir" className="intro section-pad">
        <Label>
          {t(bi("LE CINÉMA, ÇA SE PARTAGE", "CINEMA IS BETTER TOGETHER"))}
        </Label>
        <div className="intro-grid">
          <h2>
            {t(
              bi(
                "On n’est jamais\nvraiment seuls.",
                "We’re never\nreally alone.",
              ),
            )}
            <Eye className="intro-eye" />
          </h2>
          <div>
            <p className="large-copy">
              {t(
                bi(
                  "Depuis l’espace, le futur ou un karaoké post-apocalyptique, six films d’animation vous invitent à finir l’année en chanson.",
                  "From outer space, the future, or a post-apocalyptic karaoke bar, six animated shorts invite you to end the year with a song.",
                ),
              )}
            </p>
            <p>
              {t(
                bi(
                  "Pour survivre aux fêtes, au froid, aux films de famille et à la famille elle-même. Miyu Distribution vous promet au moins ça : sortir de là avec une chanson en tête.",
                  "To survive the holidays, the cold, the home movies, and the family itself. Miyu Distribution promises you this much: you’ll leave with a song stuck in your head.",
                ),
              )}
            </p>
            <TextLink to="/programme">
              {t(bi("Découvrir le programme", "Discover the programme"))}
            </TextLink>
          </div>
        </div>
      </section>
      <section className="film-preview section-pad">
        <div className="section-heading">
          <div>
            <Label>
              {t(
                bi("SIX FILMS, UN MÊME ÉLAN", "SIX FILMS, ONE SHARED FEELING"),
              )}
            </Label>
            <h2>
              {t(
                bi(
                  "Chacun son\npetit vertige.",
                  "A little dizzy.\nA little different.",
                ),
              )}
            </h2>
          </div>
          <TextLink to="/programme">
            {t(bi("Les 6 courts métrages", "All 6 short films"))}
          </TextLink>
        </div>
        <div className="film-grid">
          {films.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
        <DemoNote>
          {t(
            bi(
              "Sélection fictive et images de concept. Les six films seront annoncés prochainement.",
              "Fictional selection and concept images. The six films will be announced soon.",
            ),
          )}
        </DemoNote>
      </section>
      <section className="home-screenings">
        <div className="screenings-pitch section-pad">
          <Label>{t(bi("ON SE RETROUVE OÙ ?", "WHERE SHALL WE MEET?"))}</Label>
          <h2>
            {t(
              bi(
                "Quelque part\nprès de\nchez vous.",
                "Somewhere\nclose to\nyou.",
              ),
            )}
          </h2>
          <p>
            {t(
              bi(
                "Une salle, un grand écran, des gens.\nIl ne manque plus que vous.",
                "A cinema, a big screen, a few people.\nAll that’s missing is you.",
              ),
            )}
          </p>
          <Link className="pill-button dark" to="/seances">
            {t(bi("Voir toutes les séances", "See all screenings"))}
            <ArrowUpRight size={21} />
          </Link>
        </div>
        <div className="home-map">
          <FranceMap
            screenings={state.screenings}
            selected={null}
            onSelect={() => {}}
            preview
          />
          <div className="map-callout">
            <span className="live-dot" />
            {stats.cities}{" "}
            {t(bi("villes, et ça continue", "cities, and counting"))}
            <ArrowUpRight size={18} />
          </div>
        </div>
      </section>
      <section className="stats-section section-pad">
        <Label>
          {t(bi("LA TOURNÉE EN QUELQUES CHIFFRES", "THE TOUR, IN NUMBERS"))}
        </Label>
        <div className="stats-grid">
          {[
            [stats.screenings, bi("séances", "screenings")],
            [stats.partners, bi("complices", "partners")],
            [stats.cities, bi("villes", "cities")],
            [stats.karaoke, bi("karaokés mal chantés*", "bad karaoke songs*")],
            [stats.cocktails, bi("cocktails cosmiques*", "cosmic cocktails*")],
          ].map(([n, label], i) => (
            <div className="stat" key={i}>
              <span>{String(n).padStart(2, "0")}</span>
              <p>{t(label as Bilingual)}</p>
            </div>
          ))}
        </div>
        <div className="stats-foot">
          <span>
            {t(
              bi(
                "* Estimations hautement fantaisistes. Tous les chiffres de ce prototype sont des exemples.",
                "* Highly imaginative estimates. All prototype numbers are examples.",
              ),
            )}
          </span>
          <Link to="/organiser">
            {t(
              bi("Et si on ajoutait votre ville ?", "Shall we add your city?"),
            )}
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="host-banner section-pad">
        <Star />
        <div>
          <Label>{t(bi("À VOUS DE JOUER", "YOUR TURN"))}</Label>
          <h2>
            {t(bi("Faites vibrer\nvotre salle.", "Make your\ncinema sing."))}
          </h2>
        </div>
        <div>
          <p>
            {t(
              bi(
                "Cinéma, association, lieu culturel…\nEt si la prochaine séance, c’était chez vous ?",
                "Cinema, association, cultural space…\nWhat if the next screening was yours?",
              ),
            )}
          </p>
          <Link className="pill-button dark" to="/organiser">
            {t(bi("J’organise une séance", "Host a screening"))}
            <ArrowUpRight size={21} />
          </Link>
        </div>
      </section>
    </>
  );
}
function Marquee() {
  const { t } = useApp();
  const text = t(bi("SIX FILMS", "SIX FILMS"));
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i}>
            {text}
            <Star />
            {t(bi("SIX CHANSONS", "SIX SONGS"))}
            <Star />
            {t(bi("UN UNIVERS", "ONE UNIVERSE"))}
            <Star />
          </span>
        ))}
      </div>
    </div>
  );
}
function FilmCard({ film }: { film: Film }) {
  const { t } = useApp();
  return (
    <Link to={"/programme/" + film.id} className="film-card">
      <div className="film-image" style={{ backgroundColor: "var(--paper)" }}>
        <img
          src={film.image}
          alt={t(
            bi(
              "Image de concept, sélection provisoire",
              "Concept image, provisional selection",
            ),
          )}
          loading="lazy"
        />
        <span className="film-number">{film.number}</span>
        <span className="film-arrow">
          <ArrowUpRight />
        </span>
        <span className="film-runtime">{film.duration} MIN</span>
      </div>
      <div className="film-card-title">
        <h3>{t(film.title)}</h3>
        <ArrowUpRight size={20} />
      </div>
      <p>{t(film.tagline)}</p>
    </Link>
  );
}
function PageTitle({
  label,
  title,
  description,
  color = "lime",
}: {
  label: Bilingual;
  title: Bilingual;
  description?: Bilingual;
  color?: string;
}) {
  const { t } = useApp();
  return (
    <section className={`page-title ${color} section-pad`}>
      <Label>{t(label)}</Label>
      <div>
        <h1>{t(title)}</h1>
        <Star />
      </div>
      {description && <p className="large-copy">{t(description)}</p>}
    </section>
  );
}
function Programme() {
  const { t } = useApp();
  return (
    <>
      <PageTitle
        label={bi("LE PROGRAMME", "THE PROGRAMME")}
        title={bi(
          "Six petits films.\nUne grande échappée.",
          "Six little films.\nOne great escape.",
        )}
        description={bi(
          "Des voix, des mondes, et des chansons qui restent.",
          "Voices, worlds, and songs that stay with you.",
        )}
      />
      <section className="section-pad programme-content">
        <div className="programme-meta">
          <span>
            6 {t(bi("COURTS MÉTRAGES D’ANIMATION", "ANIMATED SHORT FILMS"))}
          </span>
          <span>
            {t(bi("SÉLECTION À CONFIRMER", "SELECTION TO BE CONFIRMED"))}
          </span>
          <span>FR / EN</span>
        </div>
        <DemoNote>
          {t(
            bi(
              "Les titres, crédits, durées et pays ci-dessous sont des exemples de mise en page.",
              "The titles, credits, runtimes and countries below are layout examples.",
            ),
          )}
        </DemoNote>
        <div className="film-grid programme-grid">
          {films.map((f) => (
            <FilmCard film={f} key={f.id} />
          ))}
        </div>
      </section>
      <SmallCTA />
    </>
  );
}
function FilmDetail() {
  const { id } = useParams();
  const film = films.find((f) => f.id === id);
  const { t } = useApp();
  if (!film) return <NotFound />;
  return (
    <>
      <section
        className="film-detail section-pad"
        style={{ backgroundColor: "var(--paper)" }}
      >
        <TextLink to="/programme">
          {t(bi("Retour au programme", "Back to the programme"))}
        </TextLink>
        <div className="detail-title">
          <span>{film.number}/06</span>
          <h1>{t(film.title)}</h1>
        </div>
        <div className="detail-grid">
          <img
            className="detail-image"
            src={film.image}
            alt={t(
              bi(
                "Photographie de concept, pas une image du film",
                "Concept photograph, not a film still",
              ),
            )}
          />
          <div>
            <Label>{t(bi("SYNOPSIS", "SYNOPSIS"))}</Label>
            <p className="large-copy">{t(film.synopsis)}</p>
            <dl>
              {[
                [bi("Réalisation", "Director"), film.director],
                [bi("Production", "Producer"), film.producer],
                [
                  bi("Pays / Année", "Country / Year"),
                  bi(
                    `${film.country.fr} / ${film.year}`,
                    `${film.country.en} / ${film.year}`,
                  ),
                ],
                [
                  bi("Durée", "Runtime"),
                  bi(`${film.duration} minutes`, `${film.duration} minutes`),
                ],
                [
                  bi("Dialogues / Sous-titres", "Dialogue / Subtitles"),
                  bi("À confirmer", "To be confirmed"),
                ],
                [bi("Format", "Format"), bi("À confirmer", "To be confirmed")],
                [
                  bi("Distribution", "Distribution"),
                  bi("Miyu Distribution", "Miyu Distribution"),
                ],
              ].map(([key, val]) => (
                <div key={key.fr}>
                  <dt>{t(key)}</dt>
                  <dd>{t(val)}</dd>
                </div>
              ))}
            </dl>
            <div className="availability">
              <Play size={18} />
              {t(
                bi(
                  "Bande-annonce individuelle à venir",
                  "Individual trailer coming soon",
                ),
              )}
            </div>
          </div>
        </div>
        <DemoNote>
          {t(
            bi(
              "Fiche fictive pour présenter le format. Visuel de concept.",
              "Fictional entry to demonstrate the format. Concept image.",
            ),
          )}
        </DemoNote>
      </section>
      <section className="section-pad next-film">
        <span>{t(bi("ET ENSUITE ?", "WHAT’S NEXT?"))}</span>
        <TextLink to={"/programme/" + films[(films.indexOf(film) + 1) % 6].id}>
          {t(films[(films.indexOf(film) + 1) % 6].title)}
        </TextLink>
      </section>
      <SmallCTA />
    </>
  );
}

function FranceMap({
  screenings,
  selected,
  onSelect,
  preview = false,
}: {
  screenings: Screening[];
  selected: string | null;
  onSelect: (id: string) => void;
  preview?: boolean;
}) {
  const { t } = useApp();
  const [zoom, setZoom] = useState(1);
  const grouped = screenings.filter(
    (s, i, all) => all.findIndex((a) => a.city === s.city) === i,
  );
  return (
    <div className={`france-map ${preview ? "preview-map" : ""}`}>
      <svg
        viewBox="0 0 460 480"
        role="img"
        aria-label={t(
          bi(
            "Carte de France métropolitaine. Retrouvez toutes les séances dans la liste associée.",
            "Map of metropolitan France. All screenings are available in the associated list.",
          ),
        )}
      >
        <defs>
          <pattern
            id={preview ? "dots-preview" : "dots"}
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r=".8" fill="currentColor" opacity=".16" />
          </pattern>
        </defs>
        <rect
          width="460"
          height="480"
          fill={`url(#${preview ? "dots-preview" : "dots"})`}
        />
        <g transform={`translate(230 240) scale(${zoom}) translate(-230 -240)`}>
          <path
            className="france-shape"
            d="M209 46 238 52 257 31 276 54 285 82 326 99 333 119 377 127 386 160 364 186 374 220 352 245 368 282 347 305 345 337 322 355 321 386 294 390 270 370 244 385 218 369 193 390 156 377 145 355 121 349 127 313 137 289 134 259 119 236 98 229 99 210 74 203 69 187 33 180 24 163 51 152 42 137 76 141 103 151 128 142 143 119 139 101 161 111 177 93 179 70 203 77Z"
          />
          <path
            className="corsica-shape"
            d="m380 387 10-15 5 19-7 39-12 9-1-23Z"
          />
          <path
            className="map-lines"
            d="M143 119 209 190 137 289M209 190 285 82M209 190 279 252 368 282M279 252 270 370M127 313 279 252"
          />
          {grouped.map((s) => (
            <g
              key={s.city}
              transform={`translate(${45 + s.x * 3.45} ${35 + s.y * 4})`}
            >
              <circle
                r={preview ? 6 : 8}
                className={
                  selected &&
                  screenings.find((a) => a.id === selected)?.city === s.city
                    ? "map-point active"
                    : "map-point"
                }
              />
              <text y="-15" textAnchor="middle" className="map-city">
                {s.city}
              </text>
            </g>
          ))}
        </g>
      </svg>
      {!preview && (
        <>
          <div className="map-controls">
            <button
              onClick={() => setZoom(Math.min(1.4, zoom + 0.2))}
              aria-label={t(bi("Agrandir la carte", "Zoom in"))}
              disabled={zoom >= 1.4}
            >
              <Plus size={18} />
            </button>
            <button
              onClick={() => setZoom(Math.max(1, zoom - 0.2))}
              aria-label={t(bi("Réduire la carte", "Zoom out"))}
              disabled={zoom <= 1}
            >
              <Minus size={18} />
            </button>
          </div>
          <div className="map-markers" style={{ transform: `scale(${zoom})` }}>
            {grouped.map((s) => (
              <button
                style={{
                  left: `${((45 + s.x * 3.45) / 460) * 100}%`,
                  top: `${((35 + s.y * 4) / 480) * 100}%`,
                }}
                key={s.city}
                className="map-hit"
                onClick={() => onSelect(s.id)}
                aria-label={t(
                  bi(
                    `Voir les séances à ${s.city}`,
                    `View screenings in ${s.city}`,
                  ),
                )}
                aria-pressed={
                  !!selected &&
                  screenings.find((a) => a.id === selected)?.city === s.city
                }
              />
            ))}
          </div>
        </>
      )}
      <span className="map-sea">
        {t(bi("OCÉAN ATLANTIQUE", "ATLANTIC OCEAN"))}
      </span>
    </div>
  );
}
function Screenings() {
  const { t, lang, state } = useApp();
  const [city, setCity] = useState("");
  const [after, setAfter] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const filtered = state.screenings
    .filter((s) => (!city || s.city === city) && (!after || s.date >= after))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const current = filtered.find((s) => s.id === selected);
  const select = (id: string) => {
    setSelected(id);
    setTimeout(
      () =>
        selectionRef.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
          block: "nearest",
        }),
      0,
    );
  };
  useEffect(() => {
    if (selected && !filtered.some((s) => s.id === selected)) setSelected(null);
  }, [city, after, state.screenings]);
  return (
    <>
      <PageTitle
        label={bi("OÙ VOIR LE PROGRAMME", "WHERE TO WATCH")}
        title={bi(
          "Le grand écran.\nPas si loin.",
          "The big screen.\nCloser than you think.",
        )}
        description={bi(
          "Trouvez votre ville. Choisissez votre séance. On s’y retrouve.",
          "Find your city. Pick your screening. See you there.",
        )}
        color="lavender"
      />
      <section className="section-pad screenings-content">
        <DemoNote>
          {t(
            bi(
              "Séances fictives : aucune réservation réelle. Carte limitée à la France métropolitaine.",
              "Fictional screenings: no real reservations. Map covers metropolitan France.",
            ),
          )}
        </DemoNote>
        <div className="screening-filters">
          <label>
            {t(bi("Votre ville", "Your city"))}
            <select
              aria-label={t(bi("Votre ville", "Your city"))}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">
                {t(bi("Toutes les villes", "All cities"))}
              </option>
              {[...new Set(state.screenings.map((s) => s.city))]
                .sort()
                .map((c) => (
                  <option key={c}>{c}</option>
                ))}
            </select>
          </label>
          <label>
            {t(bi("À partir du", "From date"))}
            <input
              type="date"
              value={after}
              onChange={(e) => setAfter(e.target.value)}
            />
          </label>
          <button
            className="text-link"
            onClick={() => {
              setCity("");
              setAfter("");
              setSelected(null);
            }}
          >
            {t(bi("Réinitialiser", "Reset"))}
            <RotateCcw size={16} />
          </button>
          <span className="results-count" aria-live="polite">
            {filtered.length} {t(bi("séance(s)", "screening(s)"))}
          </span>
        </div>
        <div className="screenings-layout">
          <div className="map-panel">
            <FranceMap
              screenings={filtered}
              selected={selected}
              onSelect={select}
            />
            <div className="map-legend">
              <span className="live-dot" />
              {t(
                bi(
                  "Cliquez sur une ville pour explorer",
                  "Select a city to explore",
                ),
              )}
            </div>
          </div>
          <div className="screening-list">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <Eye />
                <h2>
                  {t(
                    bi("Pas encore de séance ici.", "No screenings here yet."),
                  )}
                </h2>
                <p>
                  {t(
                    bi(
                      "Essayez une autre ville ou une autre date.",
                      "Try another city or date.",
                    ),
                  )}
                </p>
                <TextLink to="/organiser">
                  {t(bi("Et si vous en organisiez une ?", "Why not host one?"))}
                </TextLink>
              </div>
            ) : (
              filtered.map((s) => (
                <button
                  className={`screening-row ${selected === s.id ? "selected" : ""}`}
                  key={s.id}
                  onClick={() => select(s.id)}
                  aria-pressed={selected === s.id}
                >
                  <span className="screening-date">
                    <strong>
                      {dateLabel(s.date, lang, { day: "2-digit" })}
                    </strong>
                    {dateLabel(s.date, lang, { month: "short" })}
                  </span>
                  <span className="screening-info">
                    <strong>{s.city}</strong>
                    <span>{s.venue}</span>
                    <small>
                      {s.time.replace(":", "h")} ·{" "}
                      {t(bi("Séance démo", "Demo screening"))}
                    </small>
                  </span>
                  <ArrowUpRight size={22} />
                </button>
              ))
            )}
            {current && (
              <div
                ref={selectionRef}
                className="screening-detail"
                aria-live="polite"
              >
                <div className="section-heading">
                  <Label>{t(bi("VOTRE SÉANCE", "YOUR SCREENING"))}</Label>
                  <button
                    className="icon-button"
                    onClick={() => setSelected(null)}
                    aria-label={t(bi("Fermer le détail", "Close details"))}
                  >
                    <X size={20} />
                  </button>
                </div>
                <h3>{current.venue}</h3>
                <p>
                  <MapPin size={16} />
                  {current.city}
                </p>
                <p>
                  <CalendarDays size={16} />
                  {dateLabel(current.date, lang)} · {current.time}
                </p>
                <p>
                  <Accessibility size={16} />
                  {t(
                    current.accessibility === "step-free"
                      ? bi(
                          "Accès sans marche (exemple)",
                          "Step-free access (example)",
                        )
                      : bi(
                          "Accessibilité à confirmer auprès du lieu",
                          "Confirm accessibility with the venue",
                        ),
                  )}
                </p>
                {current.booking && validBooking(current.booking) ? (
                  <a
                    href={current.booking}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    {t(
                      bi(
                        "Lien fourni par l’organisateur (démo)",
                        "Organiser-provided link (demo)",
                      ),
                    )}
                    <ExternalLink size={16} />
                  </a>
                ) : (
                  <span className="availability">
                    {t(
                      bi(
                        "Billetterie à venir · séance de démonstration",
                        "Tickets coming soon · demonstration screening",
                      ),
                    )}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      <SmallCTA host />
    </>
  );
}
function Press() {
  const { t } = useApp();
  return (
    <>
      <PageTitle
        label={bi("LA REVUE DE PRESSE", "PRESS REVIEW")}
        title={bi("Ça fait\nun peu de bruit.", "Making\na little noise.")}
        description={bi(
          "Les mots des autres, autour de nos images.",
          "Other people’s words, around our images.",
        )}
        color="pink"
      />
      <section className="section-pad press-content">
        <div className="press-intro">
          <h2>
            {t(
              bi(
                "À lire, à écouter,\nà partager.",
                "Read, listen,\npass it on.",
              ),
            )}
          </h2>
          <div>
            <p className="large-copy">
              {t(
                bi(
                  "Les premiers articles arriveront ici. Presse papier, entretiens et découvertes en ligne : toutes les voix ont leur place.",
                  "The first articles will appear here. Print coverage, interviews and online discoveries: every voice has a place.",
                ),
              )}
            </p>
            <DemoNote>
              {t(
                bi(
                  "Aucune couverture de presse publiée pour le moment.",
                  "No press coverage published yet.",
                ),
              )}
            </DemoNote>
          </div>
        </div>
        {[
          bi("Articles & entretiens", "Articles & interviews"),
          bi("Dans la presse papier", "In print"),
          bi("Revue de presse complète", "Complete press review"),
        ].map((label, i) => (
          <div className="press-row" key={i}>
            <span>0{i + 1}</span>
            <h3>{t(label)}</h3>
            <span>{t(bi("À VENIR", "COMING SOON"))}</span>
            {i === 2 ? <Download /> : <ArrowUpRight />}
          </div>
        ))}
        <div className="press-contact">
          <p>
            {t(
              bi(
                "Vous souhaitez parler du programme ?",
                "Want to cover the programme?",
              ),
            )}
          </p>
          <TextLink to="/contact">
            {t(
              bi(
                "Contacter les relations presse",
                "Get in touch with the press team",
              ),
            )}
          </TextLink>
        </div>
      </section>
    </>
  );
}
function About() {
  const { t } = useApp();
  return (
    <>
      <PageTitle
        label={bi("QUI SOMMES-NOUS ?", "WHO ARE WE?")}
        title={bi(
          "Des images.\nEt des gens derrière.",
          "Images.\nAnd the people behind them.",
        )}
        color="blue"
      />
      <section className="section-pad about-grid">
        <div className="about-visual">
          <Eye />
          <span>miyu</span>
          <Star />
        </div>
        <div>
          <Label>MIYU DISTRIBUTION</Label>
          <h2>
            {t(
              bi(
                "Le cinéma d’animation,\nsans frontières.",
                "Animation,\nwithout borders.",
              ),
            )}
          </h2>
          <p className="large-copy">
            {t(
              bi(
                "Né de l’association entre Luce Grosjean et Miyu Productions en 2017, Miyu Distribution est spécialisé dans les ventes internationales et la diffusion de films d’animation.",
                "Founded by Luce Grosjean and Miyu Productions in 2017, Miyu Distribution specialises in international sales and the distribution of animated films.",
              ),
            )}
          </p>
          <p>
            {t(
              bi(
                "Courts métrages indépendants, films de fin d’études et longs métrages : nous accompagnons les films pour qu’ils rencontrent leurs publics, partout dans le monde.",
                "Independent shorts, graduation films and features: we help films find their audiences around the world.",
              ),
            )}
          </p>
          <a
            className="text-link"
            href="https://www.miyu.fr/distribution/"
            target="_blank"
            rel="noreferrer"
          >
            {t(bi("Explorer Miyu Distribution", "Explore Miyu Distribution"))}
            <ArrowUpRight size={21} />
          </a>
          <p className="availability">
            {t(
              bi(
                "Liens vers nos chaînes et partenaires à confirmer.",
                "Channel and partner links to be confirmed.",
              ),
            )}
          </p>
        </div>
      </section>
      <section className="playlist-section section-pad">
        <Music2 size={46} />
        <h2>
          {t(
            bi(
              "Vous avez\nl’oreille cosmique ?",
              "Got a cosmic\near for music?",
            ),
          )}
        </h2>
        <div>
          <p>
            {t(
              bi(
                "Une petite porte vers les chansons de l’espace. La playlist officielle arrivera plus tard.",
                "A little doorway to songs from space. The official playlist will follow.",
              ),
            )}
          </p>
          <a
            href="https://open.spotify.com/search/space%20songs"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            {t(bi("Explorer les chansons cosmiques", "Explore cosmic songs"))}
            <ArrowUpRight />
          </a>
        </div>
      </section>
    </>
  );
}
function Contact() {
  const { t } = useApp();
  return (
    <>
      <PageTitle
        label={bi("CONTACTS", "CONTACT")}
        title={bi("On se parle ?", "Let’s talk?")}
        description={bi(
          "Une question, une idée, une envie de projection.",
          "A question, an idea, a screening in mind.",
        )}
        color="pink"
      />
      <section className="section-pad contacts-grid">
        {[
          [
            bi("Distribution", "Distribution"),
            bi("Miyu Distribution", "Miyu Distribution"),
          ],
          [
            bi("Programmation", "Programming"),
            bi("L’équipe du programme", "The programme team"),
          ],
          [
            bi("Relations presse", "Press relations"),
            bi("Le contact presse", "The press contact"),
          ],
        ].map(([title, name]) => (
          <div className="contact-block" key={title.fr}>
            <Mail size={28} />
            <h2>{t(title)}</h2>
            <p>{t(name)}</p>
            <span className="availability">
              {t(
                bi(
                  "Nom, email et téléphone à confirmer",
                  "Name, email and phone to be confirmed",
                ),
              )}
            </span>
          </div>
        ))}
        <div className="contact-bottom">
          <p>
            {t(
              bi(
                "En attendant les coordonnées définitives, retrouvez Miyu sur son site officiel.",
                "Until final contact details are available, visit Miyu’s official website.",
              ),
            )}
          </p>
          <a
            className="text-link"
            href="https://www.miyu.fr/distribution/"
            target="_blank"
            rel="noreferrer"
          >
            miyu.fr
            <ArrowUpRight />
          </a>
        </div>
      </section>
    </>
  );
}

function Organise() {
  const { t, state, update, storageError } = useApp();
  const [tab, setTab] = useState<"apply" | "review" | "resources">("apply");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [resourceNotice, setResourceNotice] = useState("");
  const [form, setForm] = useState({
    organisation: "",
    name: "",
    email: "",
    venue: "",
    city: "Paris",
    date: "",
    time: "20:00",
    accessibility: "unknown",
    booking: "",
  });
  const approved = state.applications.some((a) => a.status === "approved");
  const field = (key: keyof typeof form, value: string) =>
    setForm({ ...form, [key]: value });
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!validBooking(form.booking)) {
      setError(
        t(
          bi(
            "Le lien doit commencer par https:// ou http://.",
            "The link must begin with https:// or http://.",
          ),
        ),
      );
      return;
    }
    if (!form.organisation.trim() || !form.name.trim() || !form.venue.trim()) {
      setError(
        t(
          bi(
            "Veuillez remplir les champs obligatoires.",
            "Please complete the required fields.",
          ),
        ),
      );
      return;
    }
    const location = cities.find((c) => c.name === form.city)!;
    const app: Application = {
      ...form,
      organisation: form.organisation.trim(),
      venue: form.venue.trim(),
      name: form.name.trim(),
      id: crypto.randomUUID(),
      x: location.x,
      y: location.y,
      status: "pending",
    };
    update({ ...state, applications: [...state.applications, app] });
    setNotice(
      t(
        bi(
          "Votre demande de démonstration est prête. Ouvrez « Validation démo » pour l’approuver. Aucun email n’a été envoyé.",
          "Your demo application is ready. Open “Demo review” to approve it. No email has been sent.",
        ),
      ),
    );
    setForm({
      ...form,
      organisation: "",
      name: "",
      email: "",
      venue: "",
      booking: "",
    });
  };
  const approve = (id: string) => {
    update(
      approveApplication(state.applications, state.screenings, id) as DemoState,
    );
    setNotice(
      t(
        bi(
          "Séance ajoutée à la carte ! Les compteurs ont été mis à jour et le kit démo est débloqué.",
          "Screening added to the map! Counters are updated and the demo kit is unlocked.",
        ),
      ),
    );
  };
  return (
    <>
      <PageTitle
        label={bi("L’ESPACE ORGANISATEURS", "THE ORGANISER SPACE")}
        title={bi(
          "Et si ça se\npassait chez vous ?",
          "What if it\nhappened at yours?",
        )}
        description={bi(
          "Un programme à projeter. Une soirée à inventer ensemble.",
          "A programme to screen. An evening to create together.",
        )}
        color="lime"
      />
      <section className="section-pad organiser-content">
        <div className="organise-intro">
          <div>
            <Label>{t(bi("COMMENT ÇA MARCHE ?", "HOW DOES IT WORK?"))}</Label>
            <h2>
              {t(
                bi(
                  "Trois temps.\nEt on chante.",
                  "Three steps.\nThen we sing.",
                ),
              )}
            </h2>
          </div>
          <ol className="steps">
            <li>
              <span>01</span>
              <div>
                <h3>
                  {t(
                    bi("Racontez-nous votre lieu", "Tell us about your venue"),
                  )}
                </h3>
                <p>
                  {t(
                    bi(
                      "Quelques informations sur vous et la séance que vous imaginez.",
                      "A few details about you and the screening you have in mind.",
                    ),
                  )}
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>
                  {t(
                    bi("On prépare ça ensemble", "We’ll get it ready together"),
                  )}
                </h3>
                <p>
                  {t(
                    bi(
                      "L’équipe étudie votre demande et confirme les modalités.",
                      "The team reviews your application and confirms the arrangements.",
                    ),
                  )}
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>{t(bi("Le grand soir", "The big night"))}</h3>
                <p>
                  {t(
                    bi(
                      "Votre séance apparaît sur la carte. Vous recevez les informations et les ressources.",
                      "Your screening appears on the map. You receive the details and resources.",
                    ),
                  )}
                </p>
              </div>
            </li>
          </ol>
        </div>
        <div className="demo-workspace">
          <div className="demo-workspace-header">
            <DemoNote>
              {t(
                bi(
                  "SIMULATION LOCALE · utilisez des coordonnées fictives · aucune donnée envoyée",
                  "LOCAL SIMULATION · use fictional contact details · no data is sent",
                ),
              )}
            </DemoNote>
            <button
              className="text-link reset-demo"
              onClick={() => {
                update(initial());
                setNotice(
                  t(
                    bi(
                      "La démonstration a été réinitialisée.",
                      "The demonstration has been reset.",
                    ),
                  ),
                );
                setResourceNotice("");
              }}
            >
              <RotateCcw size={15} />
              {t(bi("Réinitialiser la démo", "Reset demo"))}
            </button>
          </div>
          <div
            className="demo-tabs"
            role="tablist"
            aria-label={t(
              bi("Étapes de la démonstration", "Demonstration steps"),
            )}
          >
            {(["apply", "review", "resources"] as const).map((key, i) => (
              <button
                key={key}
                role="tab"
                id={`tab-${key}`}
                aria-controls="demo-panel"
                aria-selected={tab === key}
                tabIndex={tab === key ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const keys = ["apply", "review", "resources"] as const;
                    const next =
                      keys[(i + (e.key === "ArrowRight" ? 1 : 2)) % 3];
                    setTab(next);
                    document.getElementById(`tab-${next}`)?.focus();
                  }
                }}
                onClick={() => setTab(key)}
              >
                <span>0{i + 1}</span>
                {t(
                  key === "apply"
                    ? bi("Ma demande", "My application")
                    : key === "review"
                      ? bi("Validation démo", "Demo review")
                      : bi("Mes ressources", "My resources"),
                )}
                {key === "review" &&
                  state.applications.filter((a) => a.status === "pending")
                    .length > 0 && (
                    <span className="pending-count">
                      {
                        state.applications.filter((a) => a.status === "pending")
                          .length
                      }
                    </span>
                  )}
              </button>
            ))}
          </div>
          {notice && (
            <div role="status" className="notice">
              <Check size={19} />
              {notice}
            </div>
          )}
          {storageError && (
            <div role="alert" className="error-message">
              {t(
                bi(
                  "Le stockage local est indisponible. La démo fonctionne pour cette session, mais vos changements ne seront pas conservés.",
                  "Local storage is unavailable. The demo works for this session, but changes will not be saved.",
                ),
              )}
            </div>
          )}
          <div
            className="demo-panel"
            id="demo-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
          >
            {tab === "apply" ? (
              <form onSubmit={submit} className="application-form">
                <div className="form-heading">
                  <h3>
                    {t(bi("Faisons connaissance.", "Let’s get acquainted."))}
                  </h3>
                  <p>
                    {t(
                      bi(
                        "Champs obligatoires marqués d’un *",
                        "Required fields marked with *",
                      ),
                    )}
                  </p>
                </div>
                <div className="form-grid">
                  <label>
                    {t(bi("Organisation *", "Organisation *"))}
                    <input
                      required
                      maxLength={120}
                      value={form.organisation}
                      onChange={(e) => field("organisation", e.target.value)}
                      placeholder={t(
                        bi(
                          "Cinéma, association, collectif…",
                          "Cinema, association, collective…",
                        ),
                      )}
                    />
                  </label>
                  <label>
                    {t(bi("Votre nom *", "Your name *"))}
                    <input
                      required
                      maxLength={100}
                      value={form.name}
                      onChange={(e) => field("name", e.target.value)}
                      placeholder={t(
                        bi("Un prénom, un nom", "First and last name"),
                      )}
                    />
                  </label>
                  <label>
                    {t(bi("Email de contact *", "Contact email *"))}
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => field("email", e.target.value)}
                      placeholder="bonjour@example.com"
                    />
                  </label>
                  <label>
                    {t(bi("Nom du lieu *", "Venue name *"))}
                    <input
                      required
                      maxLength={120}
                      value={form.venue}
                      onChange={(e) => field("venue", e.target.value)}
                      placeholder={t(bi("Votre salle", "Your venue"))}
                    />
                  </label>
                  <label>
                    {t(bi("Ville *", "City *"))}
                    <select
                      aria-label={t(bi("Ville *", "City *"))}
                      required
                      value={form.city}
                      onChange={(e) => field("city", e.target.value)}
                    >
                      {cities.map((c) => (
                        <option key={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <small>
                      {t(
                        bi(
                          "10 villes disponibles dans cette démo.",
                          "10 cities available in this demo.",
                        ),
                      )}
                    </small>
                  </label>
                  <label>
                    {t(bi("Date souhaitée *", "Proposed date *"))}
                    <input
                      type="date"
                      required
                      min={new Date().toLocaleDateString("en-CA")}
                      value={form.date}
                      onChange={(e) => field("date", e.target.value)}
                    />
                  </label>
                  <label>
                    {t(bi("Horaire local *", "Local time *"))}
                    <input
                      type="time"
                      required
                      value={form.time}
                      onChange={(e) => field("time", e.target.value)}
                    />
                  </label>
                  <label>
                    {t(bi("Accessibilité", "Accessibility"))}
                    <select
                      aria-label={t(bi("Accessibilité", "Accessibility"))}
                      value={form.accessibility}
                      onChange={(e) => field("accessibility", e.target.value)}
                    >
                      <option value="unknown">
                        {t(bi("À confirmer", "To be confirmed"))}
                      </option>
                      <option value="step-free">
                        {t(bi("Accès sans marche", "Step-free access"))}
                      </option>
                    </select>
                  </label>
                  <label className="full-width">
                    {t(
                      bi(
                        "Lien de billetterie (facultatif)",
                        "Booking link (optional)",
                      ),
                    )}
                    <input
                      type="url"
                      value={form.booking}
                      onChange={(e) => field("booking", e.target.value)}
                      placeholder="https://…"
                    />
                  </label>
                </div>
                {error && (
                  <p role="alert" className="error-message">
                    {error}
                  </p>
                )}
                <div className="form-bottom">
                  <p>
                    {t(
                      bi(
                        "Démonstration uniquement. Vos informations restent dans ce navigateur.",
                        "Demonstration only. Your information stays in this browser.",
                      ),
                    )}
                  </p>
                  <button type="submit" className="pill-button dark">
                    {t(
                      bi("Créer ma demande démo", "Create my demo application"),
                    )}
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </form>
            ) : tab === "review" ? (
              <div>
                <div className="form-heading">
                  <h3>
                    {t(bi("De l’idée à la séance.", "From idea to screening."))}
                  </h3>
                  <p>
                    {t(
                      bi(
                        "Panneau de simulation, sans accès administrateur réel.",
                        "Simulation panel, without real administrator access.",
                      ),
                    )}
                  </p>
                </div>
                {!state.applications.length ? (
                  <div className="empty-state">
                    <Star />
                    <h3>
                      {t(
                        bi(
                          "Tout commence par une idée.",
                          "It all starts with an idea.",
                        ),
                      )}
                    </h3>
                    <p>
                      {t(
                        bi(
                          "Créez une demande dans le premier onglet.",
                          "Create an application in the first tab.",
                        ),
                      )}
                    </p>
                    <button
                      className="text-link"
                      onClick={() => setTab("apply")}
                    >
                      {t(bi("Faire une demande", "Create an application"))}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                ) : (
                  state.applications.map((app) => (
                    <div className="application-row" key={app.id}>
                      <div>
                        <h3>{app.organisation}</h3>
                        <p>
                          {app.venue} · {app.city}
                        </p>
                        <small>
                          {app.date} · {app.time} · {app.email}
                        </small>
                      </div>
                      {app.status === "approved" ? (
                        <span className="approved">
                          <Check size={18} />
                          {t(bi("Approuvée", "Approved"))}
                        </span>
                      ) : (
                        <button
                          className="pill-button dark"
                          onClick={() => approve(app.id)}
                        >
                          {t(bi("Approuver (démo)", "Approve (demo)"))}
                          <Check size={18} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div>
                <div className="form-heading">
                  <h3>{t(bi("La boîte à outils.", "The toolkit."))}</h3>
                  <p>
                    {t(
                      approved
                        ? bi(
                            "Votre kit démo est débloqué. Les fichiers officiels sont à venir.",
                            "Your demo kit is unlocked. Official files are coming soon.",
                          )
                        : bi(
                            "Approuvez une demande démo pour débloquer cet espace.",
                            "Approve a demo application to unlock this space.",
                          ),
                    )}
                  </p>
                </div>
                {resources.map((r) => (
                  <div className="resource-row" key={r.type + r.title.fr}>
                    <span className="resource-type">{r.type}</span>
                    <div>
                      <h3>{t(r.title)}</h3>
                      <p>{t(r.description)}</p>
                    </div>
                    <button
                      className="icon-button resource-download"
                      disabled={!approved}
                      aria-label={t(
                        bi(
                          `Disponibilité : ${r.title.fr}`,
                          `Availability: ${r.title.en}`,
                        ),
                      )}
                      onClick={() =>
                        setResourceNotice(
                          t(
                            bi(
                              "Accès démo accordé. Le fichier officiel sera ajouté après validation des éléments graphiques.",
                              "Demo access granted. The official file will be added after artwork is finalised.",
                            ),
                          ),
                        )
                      }
                    >
                      <Download size={21} />
                    </button>
                  </div>
                ))}
                {resourceNotice && (
                  <p role="status" className="notice">
                    {resourceNotice}
                  </p>
                )}
                <p className="availability">
                  {t(
                    bi(
                      "Liens de visionnage, affiches et matériel supplémentaire : contactez l’équipe lorsque ses coordonnées seront disponibles.",
                      "For viewing links, posters and further materials, contact the team once their details are available.",
                    ),
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
function SmallCTA({ host = false }: { host?: boolean }) {
  const { t } = useApp();
  return (
    <section className="small-cta section-pad">
      <h2>
        {t(
          host
            ? bi("Votre ville manque\nà l’appel ?", "Is your city\nmissing?")
            : bi(
                "Ça se passe\nsur grand écran.",
                "It happens\non the big screen.",
              ),
        )}
      </h2>
      <Link className="pill-button dark" to={host ? "/organiser" : "/seances"}>
        {t(
          host
            ? bi("Organiser une séance", "Host a screening")
            : bi("Trouver une séance", "Find a screening"),
        )}
        <ArrowUpRight />
      </Link>
      <Star />
    </section>
  );
}
function Footer() {
  const { t } = useApp();
  return (
    <footer className="footer section-pad">
      <div className="footer-top">
        <Label light>
          {t(
            bi(
              "LE GÉNÉRIQUE N’EST QU’UN DÉBUT",
              "THE CREDITS ARE JUST THE BEGINNING",
            ),
          )}
        </Label>
        <Link to="/contact" className="text-link">
          {t(bi("On reste en contact", "Let’s stay in touch"))}
          <ArrowUpRight size={20} />
        </Link>
      </div>
      <div className="footer-title">
        <span>
          {t(bi("ON SE RETROUVE", "SEE YOU"))}
          <br />
          {t(bi("DANS LE NOIR.", "IN THE DARK."))}
        </span>
        <Link
          to="/a-propos"
          className="footer-eye"
          aria-label={t(bi("Découvrir Miyu", "Discover Miyu"))}
        >
          <Eye />
        </Link>
      </div>
      <div className="footer-bottom">
        <Link to="/" className="brand">
          miyu<span className="brand-sub">DISTRIBUTION</span>
        </Link>
        <span>
          {t(bi("Des films. Des chansons. Et vous.", "Films. Songs. And you."))}
        </span>
        <nav aria-label={t(bi("Pied de page", "Footer"))}>
          <Link to="/contact">Contact</Link>
          <Link to="/presse">{t(bi("Presse", "Press"))}</Link>
          <Link to="/organiser">
            {t(bi("Espace organisateurs", "Organiser space"))}
          </Link>
        </nav>
        <span className="footer-demo">
          {t(bi("PROTOTYPE · 2026", "PROTOTYPE · 2026"))}
        </span>
      </div>
    </footer>
  );
}
function TrailerModal({ close }: { close: () => void }) {
  const { t } = useApp();
  const ref = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef(document.activeElement as HTMLElement);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      previousFocus.current?.focus();
    };
  }, []);
  return (
    <dialog
      className="trailer-dialog"
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      aria-labelledby="trailer-title"
    >
      <div className="trailer-modal-content">
        <button
          className="modal-close icon-button"
          onClick={close}
          aria-label={t(bi("Fermer la bande-annonce", "Close trailer"))}
        >
          <X />
        </button>
        <div className="trailer-placeholder">
          <Eye />
          <span>
            {t(bi("LE SUSPENSE EST ENTIER.", "THE SUSPENSE IS REAL."))}
          </span>
        </div>
        <div className="trailer-caption">
          <Label>{t(bi("LA BANDE-ANNONCE", "THE TRAILER"))}</Label>
          <h2 id="trailer-title">
            {t(bi("Encore un peu\nde patience.", "Just a little\nlonger."))}
          </h2>
          <p>
            {t(
              bi(
                "La bande-annonce officielle arrive bientôt. Cet espace accueillera le lecteur vidéo dès qu’elle sera disponible.",
                "The official trailer is coming soon. This space will contain the video player once it is available.",
              ),
            )}
          </p>
          <DemoNote>
            {t(
              bi(
                "Aucune vidéo fournie avec le brief.",
                "No video was supplied with the brief.",
              ),
            )}
          </DemoNote>
        </div>
      </div>
    </dialog>
  );
}
function NotFound() {
  const { t } = useApp();
  return (
    <section className="not-found section-pad">
      <Star />
      <Label>404</Label>
      <h1>{t(bi("Perdus dans\nl’univers ?", "Lost in\nthe universe?"))}</h1>
      <TextLink to="/">{t(bi("Retour sur Terre", "Back to Earth"))}</TextLink>
    </section>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
