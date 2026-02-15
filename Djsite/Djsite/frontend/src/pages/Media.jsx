function Media() {
  return (
    <div className="full-bleed flex flex-col gap-8">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
          Media
        </p>
        <h1 className="mt-3 text-3xl font-semibold glow-text">
          Mixes, Videos, Files
        </h1>
      </header>

      <section className="glass-card neon-border rounded-3xl p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/50 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Music Player
            </p>
            <div className="mt-4 h-40 rounded-xl border border-dashed border-cyan-400/30 bg-black/40" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Video Player
            </p>
            <div className="mt-4 h-40 rounded-xl border border-dashed border-cyan-400/30 bg-black/40" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-5 md:col-span-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Downloads & Flyers
            </p>
            <div className="mt-4 grid gap-3 text-xs text-slate-300">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <span>Press Kit 2026.pdf</span>
                <button className="rounded-full border border-cyan-400 bg-cyan-400/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-cyan-100">
                  Download
                </button>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <span>Event Flyer Template.zip</span>
                <button className="rounded-full border border-cyan-400 bg-cyan-400/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-cyan-100">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Media;
