import { Link } from "react-router-dom";

const featuredEvents = [
  {
    city: "London",
    venue: "Neon District",
    date: "15 Feb 2026",
    note: "Peak-hour warehouse set with immersive visuals.",
  },
  {
    city: "Dubai",
    venue: "Skyline Rooftop",
    date: "01 Mar 2026",
    note: "Open-air sunset-to-midnight progressive session.",
  },
  {
    city: "Berlin",
    venue: "Pulse Lounge",
    date: "18 Mar 2026",
    note: "Guest set focused on minimal and melodic techno.",
  },
];

const pressAssets = [
  { label: "Artist Bio", type: "PDF", size: "160 KB" },
  { label: "Stage Plot", type: "PDF", size: "220 KB" },
  { label: "Logo Pack", type: "ZIP", size: "1.8 MB" },
  { label: "Press Photos", type: "ZIP", size: "8.4 MB" },
];

function Promo() {
  return (
    <div className="full-bleed flex flex-col gap-10 pb-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Promo</p>
          <h1 className="mt-3 text-3xl font-semibold glow-text">Press Photos & Highlights</h1>
        </div>

        <Link
          to="/booking"
          className="rounded-full border border-cyan-400 bg-cyan-400/10 px-6 py-2 text-xs uppercase tracking-[0.25em] text-cyan-100"
        >
          Request Booking Deck
        </Link>
      </header>

      <section className="grid gap-6 md:grid-cols-[1.35fr_1fr]">
        <article className="glass-card neon-border rounded-3xl p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="promo-shot promo-shot-lg">
              <img
                src="https://images.unsplash.com/photo-1571266028243-1049c2b5b3f0?auto=format&fit=crop&q=80&w=1200"
                alt="DJ performing in front of crowd"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="grid gap-4">
              <div className="promo-shot promo-shot-sm">
                <img
                  src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=1000"
                  alt="Club lighting and DJ booth"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="promo-shot promo-shot-sm">
                <img
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=1000"
                  alt="Audience during live electronic set"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-300">
            High-resolution visuals and event recap material for promoters, venue teams,
            and media publications.
          </p>
        </article>

        <article className="glass-card rounded-3xl border border-white/10 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Press Kit Assets</p>
          <div className="mt-4 space-y-3">
            {pressAssets.map((asset) => (
              <div
                key={asset.label}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-slate-100">{asset.label}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    {asset.type} • {asset.size}
                  </p>
                </div>
                <button className="rounded-full border border-cyan-400/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100 hover:bg-cyan-400/10">
                  Request
                </button>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="glass-card neon-border rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Featured Events</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {featuredEvents.map((event) => (
            <article
              key={`${event.venue}-${event.date}`}
              className="rounded-2xl border border-white/10 bg-black/45 p-4"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{event.city}</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-100">{event.venue}</h2>
              <p className="mt-1 text-xs text-slate-400">{event.date}</p>
              <p className="mt-3 text-sm text-slate-300">{event.note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Promo;
