const spotifySets = [
  {
    title: "Night Drive Sessions",
    type: "playlist",
    id: "37i9dQZF1DX4WYpdgoIcn6",
  },
  {
    title: "Peak Hour Club Tools",
    type: "playlist",
    id: "37i9dQZF1DX0XUsuxWHRQd",
  },
  {
    title: "Afterhours Minimal Pulse",
    type: "playlist",
    id: "37i9dQZF1DWYJDJNwAklav",
  },
];

function Music() {
  return (
    <div className="full-bleed flex flex-col gap-8">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Music</p>
        <h1 className="mt-3 text-3xl font-semibold glow-text">Official Playlists</h1>
      </header>

      <section className="glass-card neon-border rounded-3xl p-6 md:p-8">
        <p className="text-sm text-slate-300">
          Stream curated DJ Silver sets directly from Spotify.
        </p>

        <div className="mt-6 grid gap-5">
          {spotifySets.map((set) => {
            const embedSrc = `https://open.spotify.com/embed/${set.type}/${set.id}?utm_source=generator&theme=0`;
            const openUrl = `https://open.spotify.com/${set.type}/${set.id}`;

            return (
              <article
                key={set.id}
                className="rounded-2xl border border-white/10 bg-black/45 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-sm uppercase tracking-[0.24em] text-cyan-200">{set.title}</h2>
                  <a
                    href={openUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-cyan-400/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100 hover:bg-cyan-400/10"
                  >
                    Open in Spotify
                  </a>
                </div>

                <iframe
                  title={set.title}
                  src={embedSrc}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl"
                />
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Music;
