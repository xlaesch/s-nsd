import { assetUrl } from "./paths";
import { FRANCE_OUTLINE } from "./geography";
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
  Play,
  X,
  Menu,
  MapPin,
  Plus,
  Minus,
  Check,
  Accessibility,
  CalendarDays,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import {
  anthology,
  programmeTrailer,
  bi,
  cities,
  films,
  seedScreenings,
  type Application,
  type Bilingual,
  type Film,
  type Lang,
  type Screening,
} from "./data";
import { STORAGE_KEY, validBooking } from "./demo.mjs";
import "./styles.css";
import "./campaign.css";
import "./art-direction.css";
import "./october-update.css";

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
function MiyuLogo({ light = true }: { light?: boolean }) {
  return <img className="miyu-logo" src={assetUrl(light ? "/images/brand/miyu-white.png" : "/images/brand/miyu-black.png")} alt="MIYU" width="3135" height="809" />;
}

function FilmVideo({ src, poster, title }: { src: string; poster: string; title: string }) {
  return (
    <figure className="film-video">
      <video controls playsInline preload="metadata" poster={poster} aria-label={title}>
        <source src={src} type="video/mp4" />
        <a href={src}>{title}</a>
      </video>
      <figcaption>{title}</figcaption>
    </figure>
  );
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
    <header className={`header ${location.pathname.startsWith("/programme/") ? "header-paper" : ""}`}>
      <Link
        to="/"
        className="brand"
        aria-label={t(bi("Miyu, accueil", "Miyu, home"))}
      >
        <MiyuLogo light={!location.pathname.startsWith("/programme/")} />
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
  return (
    <>
      <section className="hero campaign-hero section-pad">
        <figure className="hero-art">
          <img
            src={assetUrl("/images/campaign-still.jpg")}
            width="2048"
            height="1152"
            fetchPriority="high"
            alt={t(
              bi(
                "La Fée des Roberts : un personnage violet derrière une vitre magenta.",
                "The Boob Fairy: a violet character looking through a magenta window.",
              ),
            )}
          />
          <figcaption>{t(bi("La Fée des Roberts", "The Boob Fairy"))} · Leahn Vivier-Chapas · Folivari</figcaption>
        </figure>
        <div className="campaign-heading">
          <h1>
            {lang === "fr" ? (
              <>
                <span>SOMMES-NOUS</span>
                <span>SEULES</span>
                <span>DANS L’UNIVERS ?</span>
              </>
            ) : (
              <>
                <span className="musicals-title">Musicals!</span>
              </>
            )}
          </h1>
          <div className="campaign-intro">
            <p className="release-date">
              <span>{t(bi("Prochainement au cinéma", "Coming to cinemas"))}</span>
              <strong>21</strong>
              <span>{t(bi("décembre", "December"))}</span>
            </p>
            <p className="anthology-line">
              {t(
                bi(
                  "Six courts métrages d’animation\net de comédie musicale. Une heure de cinéma.",
                  "Six animated musical shorts.\nOne hour of cinema.",
                ),
              )}
            </p>
            <div className="hero-actions">
              <Link className="pill-button primary" to="/seances">
                {t(bi("Trouver une séance", "Find a screening"))}
                <ArrowUpRight size={20} />
              </Link>
              <button className="trailer-sticker text-link" onClick={trailer}>
                <Play size={16} />
                {t(bi("Bande-annonce", "Watch the trailer"))}
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="film-preview section-pad">
        <div className="section-heading">
          <div>
            <p className="section-overline">{t(bi("Une anthologie en six voix", "An anthology in six voices"))}</p>
            <h2>{t(bi("Le programme", "The programme"))}</h2>
            <p>
              {t(
                bi(
                  "Depuis l’espace, le futur ou un karaoké post-apocalyptique, six films pour finir l’année en chanson.",
                  "From outer space, the future or a post-apocalyptic karaoke bar, six films to end the year with a song.",
                ),
              )}
            </p>
          </div>
          <TextLink to="/programme">
            {t(bi("Tous les films", "All films"))}
          </TextLink>
        </div>
        <div className="film-grid">
          {films.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      </section>
      <section className="home-screenings">
        <div className="screenings-pitch section-pad">
          <h2>{t(bi("Près de\nchez vous", "Close to\nhome"))}</h2>
          <p>
            {t(
              bi(
                "Choisissez votre ville et retrouvez les séances sur la carte.",
                "Choose your city and find screenings on the map.",
              ),
            )}
          </p>
          <Link className="pill-button primary" to="/seances">
            {t(bi("Voir les séances", "Find screenings"))}
            <ArrowUpRight size={20} />
          </Link>
          <DemoNote>
            {t(bi("Séances de démonstration", "Demonstration screenings"))}
          </DemoNote>
        </div>
        <Link
          to="/seances"
          className="home-map"
          aria-label={t(
            bi("Explorer la carte des séances", "Explore the screening map"),
          )}
        >
          <FranceMap
            screenings={state.screenings}
            selected={null}
            onSelect={() => {}}
            preview
          />
        </Link>
      </section>
      <SmallCTA host />
    </>
  );
}

function FilmCard({ film }: { film: Film }) {
  const { t } = useApp();
  return (
    <Link to={"/programme/" + film.id} className="film-card">
      <span className="film-index" aria-hidden="true">{String(films.findIndex((item) => item.id === film.id) + 1).padStart(2, "0")}</span>
      <div className="film-image">
        <img
          src={film.image}
          alt={t(
            bi(`Image du film ${film.title.fr}`, `Still from ${film.title.en}`),
          )}
          loading="lazy"
        />
      </div>
      <div className="film-card-title">
        <h3>{t(film.title)}</h3>
        <ArrowUpRight size={20} />
      </div>
      <p className="film-director">
        {t(film.director)} <span>· {film.duration.replace(":", "′")}″</span>
      </p>
      <p className="film-synopsis">{t(film.shortSynopsis)}</p>
      <p className="film-production">{t(film.producer)}</p>
    </Link>
  );
}

function PageTitle({
  title,
  description,
  color = "lime",
}: {
  label?: Bilingual;
  title: Bilingual;
  description?: Bilingual;
  color?: string;
}) {
  const { t } = useApp();
  return (
    <section className={`page-title ${color} section-pad`}>
      <h1>{t(title)}</h1>
      {description && <p>{t(description)}</p>}
    </section>
  );
}

function Programme() {
  const { t } = useApp();
  return (
    <>
      <PageTitle
        title={bi("Le programme", "The programme")}
        description={bi(
          "Six courts métrages d’animation et de comédie musicale. Au cinéma le 21 décembre.",
          "Six animated musical shorts. In cinemas on 21 December.",
        )}
      />
      <section className="section-pad programme-content">
        <div className="programme-meta">
          <span>
            {t(bi("Durée du programme : 1 h", "Programme runtime: 1 hour"))}
          </span>
          <span>Miyu Distribution · Vivement Lundi !</span>
        </div>
        <div className="film-grid programme-grid">
          {films.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      </section>
      <SmallCTA />
    </>
  );
}

function FilmDetail() {
  const { id } = useParams();
  const aliases: Record<string, string> = {
    fleurs: "la-fee-des-roberts",
    minuit: "tuna-tartare",
    maree: "jeanne-jean-jean",
    satellite: "2-love",
    encore: "maestro",
  };
  const film = films.find((film) => film.id === (aliases[id || ""] || id));
  const { t } = useApp();
  if (!film) return <NotFound />;
  return (
    <>
      <section className="film-detail section-pad">
        <TextLink to="/programme">
          {t(bi("Retour au programme", "Back to the programme"))}
        </TextLink>
        <h1>{t(film.title)}</h1>
        {film.trailer ? (
          <FilmVideo src={film.trailer} poster={film.image} title={t(bi(`Teaser de ${film.title.fr}`, `${film.title.en} teaser`))} />
        ) : (
          <img className="detail-image" src={film.image} alt={t(bi(`Image du film ${film.title.fr}`, `Still from ${film.title.en}`))} />
        )}
        <div className="detail-grid">
          <div>
            <h2>{t(bi("Synopsis", "Synopsis"))}</h2>
            <p className="large-copy">{t(film.synopsis)}</p>
          </div>
          <dl>
            {[
              [bi("Réalisation", "Director"), film.director],
              [bi("Production", "Production"), film.producer],
              [
                bi("Durée", "Runtime"),
                bi(
                  film.duration.replace(":", " min ") + " s",
                  film.duration.replace(":", " min ") + " sec",
                ),
              ],
              [bi("Technique", "Technique"), film.format],
              [bi("Pays de production", "Production countries"), film.country],
            ].map(([key, value]) => (
              <div key={key.fr}>
                <dt>{t(key)}</dt>
                <dd>{t(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="section-pad next-film">
        <TextLink
          to={
            "/programme/" + films[(films.indexOf(film) + 1) % films.length].id
          }
        >
          {t(bi("Film suivant : ", "Next film: "))}
          {t(films[(films.indexOf(film) + 1) % films.length].title)}
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
  // Resolve known cities afresh so persisted demo screenings use corrected geography.
  const position = (screening: Screening) => {
    const city = cities.find((city) => city.name === screening.city);
    return city
      ? { x: city.x * 4.6, y: city.y * 4.8 }
      : { x: 45 + screening.x * 3.45, y: 35 + screening.y * 4 };
  };
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
          <path className="france-shape" d={FRANCE_OUTLINE} />
          {grouped.map((s) => (
            <g
              key={s.city}
              transform={`translate(${position(s).x} ${position(s).y})`}
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
              <text
                y={s.city === "Lille" ? 20 : -15}
                textAnchor="middle"
                className="map-city"
              >
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
                  left: `${(position(s).x / 460) * 100}%`,
                  top: `${(position(s).y / 480) * 100}%`,
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
        title={bi("Trouver une séance", "Find a screening")}
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
      <PageTitle title={bi("Presse", "Press")} />
      <section className="section-pad press-content">
        <h2>{t(bi("Parlons du programme", "About the programme"))}</h2>
        <p>{t(bi("Pour un dossier de presse, une interview ou des visuels supplémentaires, contactez Miyu Distribution.", "For a press kit, an interview or additional artwork, contact Miyu Distribution."))}</p>
        <a className="text-link" href="mailto:stagiaire.diffusion@miyu.fr">stagiaire.diffusion@miyu.fr<ArrowUpRight size={18} /></a>
      </section>
    </>
  );
}

function About() {
  const { t } = useApp();
  return (
    <>
      <PageTitle title={bi("Qui sommes-nous ?", "Who are we?")} />
      <section className="section-pad company-profiles">
        <article className="company-profile">
          <div className="company-logo"><MiyuLogo /></div>
          <div>
            <h2>Miyu Distribution</h2>
            <p>{t(bi(
              "Né de l’association entre Luce Grosjean et Miyu Productions en 2017, Miyu Distribution est spécialisé dans les ventes internationales et la diffusion de films d’animation. La société distribue un large catalogue de courts métrages de sociétés de production et de réalisateur.ice.s indépendant.e.s, ainsi que les films de fin d’études de grandes écoles d’animation.",
              "Founded through the partnership between Luce Grosjean and Miyu Productions in 2017, Miyu Distribution specialises in international sales and the distribution of animated films. The company distributes a broad catalogue of short films from production companies and independent filmmakers, as well as graduation films from leading animation schools."
            ))}</p>
            <p>{t(bi(
              "Avec 10 nominations aux Oscars, 2 victoires aux César – Eté 96 de Mathilde Bédouet (2024) et Beurk ! de Loïc Espuche (2025) -, une Palme d’or et un Cristal du court-métrage pour 27 de Flora Anna Buda (2023) ainsi que deux prix de la meilleure société de distribution remis par UniFrance et la Fête du court-métrage (2021, 2024), Miyu Distribution s’impose comme le leader de son secteur.",
              "With 10 Oscar nominations, two César wins—Summer 96 by Mathilde Bédouet (2024) and Yuck! by Loïc Espuche (2025)—a Palme d’Or and a Cristal for Best Short Film for 27 by Flora Anna Buda (2023), and two Best Distribution Company awards from UniFrance and La Fête du court-métrage (2021, 2024), Miyu Distribution has established itself as a leader in its field."
            ))}</p>
            <a className="text-link" href="https://www.miyu.fr/distribution/" target="_blank" rel="noreferrer">miyu.fr<ArrowUpRight size={18} /></a>
          </div>
        </article>
        <article className="company-profile">
          <div className="company-logo"><img src={assetUrl("/images/vivement-lundi.svg")} alt="Vivement Lundi !" width="605" height="197" /></div>
          <div>
            <h2>Vivement Lundi !</h2>
            <p>{t(bi(
              "Depuis sa création à Rennes en 1998, Vivement Lundi ! alterne production de documentaires et de films et séries en animation. Les productions de la société cumulent plus de 600 distinctions dans des festivals nationaux et internationaux.",
              "Since its creation in Rennes in 1998, Vivement Lundi ! has alternated between producing documentaries and animated films and series. The company’s productions have received more than 600 awards at national and international festivals."
            ))}</p>
            <p>{t(bi(
              "De 2011 à 2024, la société a gagné 2 fois le Cristal au FIFA Annecy, un Grand prix de la compétition nationale au Festival International du court métrage de Clermont-Ferrand, reçu 6 nominations aux César, 4 nominations aux Oscars et a été récompensée 4 fois aux European Film Awards. Les documentaires de Vivement Lundi ! ont reçu 4 Etoiles de la SCAM et un Grand prix de la compétition internationale au Sundance Film Festival.",
              "From 2011 to 2024, the company won two Cristals at the Annecy International Animation Film Festival and a National Competition Grand Prix at the Clermont-Ferrand International Short Film Festival, received six César nominations and four Oscar nominations, and won four European Film Awards. Vivement Lundi !’s documentaries have received four SCAM Stars and a World Cinema Grand Jury Prize at the Sundance Film Festival."
            ))}</p>
          </div>
        </article>
      </section>
      <SmallCTA host />
    </>
  );
}

function Contact() {
  const { t } = useApp();
  return (
    <>
      <PageTitle
        title={bi("Contact", "Contact")}
        description={bi(
          "Une question sur le programme ou une envie de projection ?",
          "A question about the programme or a screening in mind?",
        )}
      />
      <section className="section-pad contact-content">
        <h2>Miyu Distribution</h2>
        <a className="contact-email" href="mailto:stagiaire.diffusion@miyu.fr">
          stagiaire.diffusion@miyu.fr
          <ArrowUpRight size={22} />
        </a>
        <TextLink to="/organiser">
          {t(bi("Organiser une séance", "Host a screening"))}
        </TextLink>
      </section>
    </>
  );
}

const ORGANISER_EMAIL = "stagiaire.diffusion@miyu.fr";
function Organise() {
  const { t } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("_honey")) return;
    if (
      ["Organisation", "Lieu", "Ville"].some(
        (key) => !String(data.get(key) || "").trim(),
      )
    ) {
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
    setSubmitting(true);
    setError("");
    const payload = Object.fromEntries(
      [...data.entries()].map(([key, value]) => [key, String(value).trim()]),
    );
    payload._subject = `Demande de projection — ${payload.Organisation} — ${payload.Ville}`;
    payload._replyto = payload.email;
    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${ORGANISER_EMAIL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(20000),
        },
      );
      const result = await response.json();
      if (
        !response.ok ||
        !(result.success === true || result.success === "true")
      )
        throw new Error("Submission was not confirmed");
      setSent(true);
      form.reset();
    } catch {
      setError(
        t(
          bi(
            "L’envoi n’a pas pu être confirmé. Vos informations sont conservées dans le formulaire. Vous pouvez aussi écrire à stagiaire.diffusion@miyu.fr.",
            "We could not confirm your submission. Your details are still in the form. You can also email stagiaire.diffusion@miyu.fr.",
          ),
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <PageTitle
        title={bi("Organiser une séance", "Host a screening")}
        description={bi(
          "Cinéma, association ou lieu culturel : faites venir le programme chez vous.",
          "Cinema, association or cultural venue: bring the programme to your audience.",
        )}
      />
      <section className="section-pad organiser-content">
        <div className="organiser-layout">
          <div>
            {sent ? (
              <div className="submission-success" role="status">
                <Check size={32} />
                <h2>{t(bi("Demande transmise", "Application submitted"))}</h2>
                <p>
                  {t(
                    bi(
                      "Merci ! L’équipe Miyu vous répondra par email pour préparer votre séance.",
                      "Thank you! The Miyu team will reply by email to arrange your screening.",
                    ),
                  )}
                </p>
                <button className="text-link" onClick={() => setSent(false)}>
                  {t(bi("Faire une autre demande", "Send another application"))}
                  <ArrowUpRight size={18} />
                </button>
              </div>
            ) : (
              <form
                className="application-form"
                action={`https://formsubmit.co/${ORGANISER_EMAIL}`}
                method="POST"
                onSubmit={submit}
                aria-busy={submitting}
              >
                <div className="form-heading">
                  <h2>{t(bi("Votre projection", "Your screening"))}</h2>
                  <p>
                    {t(
                      bi(
                        "Les champs marqués d’un * sont obligatoires.",
                        "Fields marked with * are required.",
                      ),
                    )}
                  </p>
                </div>
                <input
                  type="hidden"
                  name="_subject"
                  value="Demande de projection — Sommes-nous seules dans l’univers ?"
                />
                <input type="hidden" name="_template" value="table" />
                <div className="form-honeypot" aria-hidden="true">
                  <label>
                    Leave this field empty
                    <input name="_honey" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <fieldset disabled={submitting}>
                  <div className="form-grid">
                    <label>
                      {t(bi("Organisation *", "Organisation *"))}
                      <input
                        name="Organisation"
                        required
                        maxLength={120}
                        autoComplete="organization"
                        placeholder={t(
                          bi("Cinéma, association…", "Cinema, association…"),
                        )}
                      />
                    </label>

                    <label>
                      {t(bi("Email de contact *", "Contact email *"))}
                      <input
                        name="email"
                        type="email"
                        required
                        maxLength={254}
                        autoComplete="email"
                      />
                    </label>
                    <label>
                      {t(bi("Nom du lieu *", "Venue name *"))}
                      <input name="Lieu" required maxLength={120} />
                    </label>
                    <label>
                      {t(bi("Ville *", "City *"))}
                      <input
                        name="Ville"
                        required
                        maxLength={120}
                        autoComplete="address-level2"
                      />
                    </label>
                    <label>
                      {t(bi("Date souhaitée *", "Proposed date *"))}
                      <input
                        name="Date"
                        type="date"
                        required
                        min={new Date().toLocaleDateString("en-CA")}
                      />
                    </label>



                    <label className="full-width">
                      {t(
                        bi(
                          "Votre message (facultatif)",
                          "Your message (optional)",
                        ),
                      )}
                      <textarea name="Message" maxLength={4000} rows={4} />
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
                          "Votre demande sera envoyée à Miyu Distribution. La séance sera confirmée avec l’équipe par email.",
                          "Your application will be sent to Miyu Distribution. The team will confirm the screening by email.",
                        ),
                      )}
                    </p>
                    <button
                      type="submit"
                      className="pill-button dark"
                      disabled={submitting}
                    >
                      {t(
                        submitting
                          ? bi("Envoi en cours…", "Sending…")
                          : bi("Envoyer ma demande", "Send my application"),
                      )}
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                </fieldset>
              </form>
            )}
          </div>
          <aside className="organiser-aside">
            <img
              src={assetUrl("/images/films/2-love.webp")}
              alt={t(bi("Image de 2:LOVE", "Still from 2:LOVE"))}
            />
            <h2>{t(bi("Six films, une heure", "Six films, one hour"))}</h2>
            <p>
              {t(
                bi(
                  "Un programme d’animation et de comédie musicale, présenté par Miyu Distribution en partenariat avec Vivement Lundi !.",
                  "A programme of animated musical shorts, presented by Miyu Distribution in partnership with Vivement Lundi !.",
                ),
              )}
            </p>

            <p className="organiser-contact">
              {t(bi("Une question ?", "Any questions?"))}
              <a href={`mailto:${ORGANISER_EMAIL}`}>{ORGANISER_EMAIL}</a>
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
function SmallCTA({ host = false }: { host?: boolean }) {
  const { t } = useApp();
  return (
    <section className="small-cta section-pad">
      <div>
        <h2>
          {t(
            host
              ? bi("Dans votre salle", "In your cinema")
              : bi("On se retrouve au cinéma", "See you at the cinema"),
          )}
        </h2>
        {host && (
          <p>
            {t(
              bi(
                "Cinéma, association ou lieu culturel : accueillez le programme.",
                "Cinema, association or cultural venue: host the programme.",
              ),
            )}
          </p>
        )}
      </div>
      <Link className="pill-button dark" to={host ? "/organiser" : "/seances"}>
        {t(
          host
            ? bi("Organiser une séance", "Host a screening")
            : bi("Trouver une séance", "Find a screening"),
        )}
        <ArrowUpRight size={20} />
      </Link>
    </section>
  );
}
function Footer() {
  const { t } = useApp();
  return (
    <footer className="footer section-pad">
      <div className="footer-partners">
        <Link to="/a-propos" className="brand">
          <MiyuLogo />
        </Link>
        <div className="partner-mark">
          <span>{t(bi("En partenariat avec", "In partnership with"))}</span>
          <img
            src={assetUrl("/images/vivement-lundi.svg")}
            alt="Vivement Lundi !"
            width="605"
            height="197"
          />
        </div>
      </div>
      <div className="footer-bottom">
        <p>{t(anthology)}</p>
        <nav aria-label={t(bi("Pied de page", "Footer"))}>
          <Link to="/programme">{t(bi("Programme", "Programme"))}</Link>
          <Link to="/presse">{t(bi("Presse", "Press"))}</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/organiser">{t(bi("Organisateurs", "Organisers"))}</Link>
        </nav>
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
        {programmeTrailer && <FilmVideo src={programmeTrailer} poster={assetUrl("/images/campaign-still.jpg")} title={t(bi("Bande-annonce du programme", "Programme trailer"))} />}
        <div className="trailer-caption">
          <h2 id="trailer-title">{t(bi("Bande-annonce", "Trailer"))}</h2>
          {!programmeTrailer && <p>
            {t(
              bi(
                "La vidéo sera disponible ici prochainement.",
                "The video will be available here soon.",
              ),
            )}
          </p>}
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
