function Promo() {
  return (
    <div className="full-bleed flex flex-col gap-10">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
          Promo
        </p>
        <h1 className="mt-3 text-3xl font-semibold glow-text">
          Press Photos & Highlights
        </h1>
      </header>

      <section className="glass-card neon-border rounded-3xl p-8">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="h-64 rounded-2xl border border-dashed border-cyan-400/30 bg-black/40" />
            <p className="text-sm text-slate-300">
              Upload high-resolution promo shots and highlight reels from recent
              events. This section mirrors the full-scale promo area in your
              sketch.
            </p>
          </div>
          <div className="space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Featured Events
              </p>
              <ul className="mt-3 space-y-2">
                <li>Neon District — London</li>
                <li>Pulse Lounge — Berlin</li>
                <li>Skyline Rooftop — Dubai</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Highlights
              </p>
              <p className="mt-3 text-xs text-slate-400">
                Include short descriptions for press kits and booking decks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Promo;
