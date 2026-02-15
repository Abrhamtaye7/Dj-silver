function Community() {
  return (
    <div className="full-bleed flex flex-col gap-8">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
          Community
        </p>
        <h1 className="mt-3 text-3xl font-semibold glow-text">
          For Fans
        </h1>
      </header>

      <section className="glass-card neon-border rounded-3xl p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/50 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Stories & Reactions
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Share your favorite set moments, tag photos, and leave
              testimonials.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Giveaways
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Access exclusive drops and early ticket invites.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/50 p-5 md:col-span-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Fan Testimonials
            </p>
            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                "The soundscape was unreal."
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                "Best night of the year."
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Community;
