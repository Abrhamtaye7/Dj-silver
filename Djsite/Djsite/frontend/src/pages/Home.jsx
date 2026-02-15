import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import WaveSurfer from "wavesurfer.js";
import api from "../lib/api.js";

const services = [
  "Club & Lounge Sets",
  "Corporate Events",
  "Festival Stages",
  "Private Celebrations",
];

const defaultTicker = [
  { venue: "New Dates Incoming", location: "Global", date: new Date().toISOString() },
];

const defaultDemoTrack =
  import.meta.env.VITE_DEMO_TRACK_URL ||
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

function Home() {
  const [events, setEvents] = useState([]);
  const [nextGig, setNextGig] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveReady, setWaveReady] = useState(false);
  const [audioError, setAudioError] = useState("");

  const waveRef = useRef(null);
  const waveInstanceRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    api
      .get("/api/events")
      .then((response) => {
        if (!isMounted) return;
        const fetchedEvents = Array.isArray(response.data) ? response.data : [];
        setEvents(fetchedEvents);
        setNextGig(fetchedEvents[0] || null);
      })
      .catch(() => {
        if (!isMounted) return;
        setEvents([]);
        setNextGig(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!waveRef.current) return undefined;

    const wave = WaveSurfer.create({
      container: waveRef.current,
      waveColor: "rgba(34, 211, 238, 0.35)",
      progressColor: "#22d3ee",
      cursorColor: "#ffffff",
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      height: 72,
      normalize: true,
    });

    waveInstanceRef.current = wave;

    wave.on("ready", () => {
      setWaveReady(true);
      setAudioError("");
    });
    wave.on("play", () => setIsPlaying(true));
    wave.on("pause", () => setIsPlaying(false));
    wave.on("finish", () => setIsPlaying(false));
    wave.on("error", () => {
      setAudioError("Could not load demo track.");
      setWaveReady(false);
      setIsPlaying(false);
    });

    wave.load(defaultDemoTrack);

    return () => {
      wave.destroy();
      waveInstanceRef.current = null;
    };
  }, []);

  const tickerItems = events.length > 0 ? events : defaultTicker;
  const marqueeItems = useMemo(() => [...tickerItems, ...tickerItems], [tickerItems]);

  const gigDate = nextGig
    ? new Date(nextGig.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "TBD";

  const togglePlayback = () => {
    if (!waveInstanceRef.current || !waveReady) return;
    waveInstanceRef.current.playPause();
  };

  return (
    <div className="full-bleed flex flex-col gap-12 pb-20">
      <section className="hero-shell rounded-3xl border border-white/10 bg-black/45 px-6 py-16 text-center md:px-10">
        <p className="text-xs uppercase tracking-[0.38em] text-cyan-300">DJ Silver</p>
        <h1 className="hero-glitch mt-6 text-5xl font-bold text-white md:text-8xl">SILVER SOUND</h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm uppercase tracking-[0.24em] text-slate-300">
          Underground energy crafted for clubs, festivals, and premium private events.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link className="btn-electric rounded-full border border-cyan-300/60" to="/booking">
            Book Now
          </Link>
          <Link
            className="rounded-full border border-white/20 px-7 py-3 text-xs uppercase tracking-[0.25em] text-slate-200 transition hover:border-cyan-300 hover:text-cyan-100"
            to="/schedule"
          >
            View Schedule
          </Link>
        </div>
      </section>

      <section className="glass-card neon-border rounded-2xl p-4">
        <p className="px-2 text-xs uppercase tracking-[0.3em] text-slate-400">Gig Ticker</p>
        <div className="gig-marquee mt-3">
          <div className="gig-track">
            {marqueeItems.map((item, index) => (
              <div className="gig-chip" key={`${item.venue}-${item.date}-${index}`}>
                <span className="text-cyan-300">
                  {new Date(item.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
                <span>{item.venue}</span>
                <span className="text-slate-400">{item.location}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-4">
        {services.map((service) => (
          <div key={service} className="electric-card">
            <div className="electric-card-inner">
              <h2 className="mb-2 text-cyan-400">{service}</h2>
              <p className="text-sm text-gray-400">Experience precise, high-impact live sound design.</p>
              <div className="mt-4 h-1 w-12 bg-cyan-400" />
            </div>
          </div>
        ))}
      </section>

      <section className="audio-strip rounded-3xl border border-cyan-400/30 px-4 py-5 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Live Audio Strip</p>
            <p className="mt-1 text-sm text-slate-300">Preview the sonic identity before you book.</p>
          </div>
          <button
            onClick={togglePlayback}
            disabled={!waveReady}
            className="rounded-full border border-cyan-400 bg-cyan-400/10 px-6 py-2 text-xs uppercase tracking-[0.28em] text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
        <div className="mt-4" ref={waveRef} />
        {audioError && <p className="mt-2 text-xs text-rose-300">{audioError}</p>}
      </section>

      <section className="glass-card neon-border rounded-3xl p-8">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Next Gig</p>
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-300">Live Sets</span>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/50 p-6 text-sm text-slate-400">
          <p className="text-2xl font-semibold text-slate-100">{nextGig ? nextGig.venue : "Stay tuned"}</p>
          <p className="mt-2">{nextGig ? `${nextGig.location}` : "New dates dropping soon"}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-cyan-300">{gigDate}</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
