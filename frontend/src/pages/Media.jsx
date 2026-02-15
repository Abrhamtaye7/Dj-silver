const mediaVideos = [
  {
    title: "Live Club Set Reel",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    title: "Festival Highlights",
    youtubeId: "3JZ_D3ELwOQ",
  },
];

const mediaAudio = [
  {
    title: "Peak Hour Mix",
    soundCloudUrl:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/293&color=%2300f2ff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false",
    openUrl: "https://soundcloud.com",
  },
  {
    title: "Afterhours Session",
    soundCloudUrl:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/444&color=%2300f2ff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false",
    openUrl: "https://soundcloud.com",
  },
];

const downloads = [
  {
    label: "Press Kit",
    fileName: "PressKit_2026.pdf",
    href: "/uploads/press/PressKit_2026.pdf",
  },
  {
    label: "Tech Rider",
    fileName: "DJ_Silver_TechRider.pdf",
    href: "/uploads/press/DJ_Silver_TechRider.pdf",
  },
  {
    label: "Logo Pack",
    fileName: "DJ_Silver_Logos.zip",
    href: "/uploads/press/DJ_Silver_Logos.zip",
  },
];

function Media() {
  return (
    <div className="full-bleed flex flex-col gap-8 pb-8">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Media</p>
        <h1 className="mt-3 text-3xl font-semibold glow-text">Mixes, Videos, Files</h1>
      </header>

      <section className="glass-card neon-border rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Video Highlights</p>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {mediaVideos.map((video) => (
            <article
              key={video.youtubeId}
              className="rounded-2xl border border-white/10 bg-black/45 p-4"
            >
              <p className="mb-3 text-sm uppercase tracking-[0.2em] text-cyan-200">
                {video.title}
              </p>
              <div className="overflow-hidden rounded-xl border border-cyan-400/25">
                <iframe
                  title={video.title}
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  width="100%"
                  height="220"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-3xl border border-white/10 p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Audio Streams</p>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {mediaAudio.map((track) => (
            <article
              key={track.title}
              className="rounded-2xl border border-white/10 bg-black/45 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">{track.title}</p>
                <a
                  href={track.openUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-cyan-400/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100 hover:bg-cyan-400/10"
                >
                  Open
                </a>
              </div>

              <iframe
                title={track.title}
                width="100%"
                height="125"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={track.soundCloudUrl}
                loading="lazy"
                className="rounded-xl border border-cyan-400/20"
              />
            </article>
          ))}
        </div>
      </section>

      <section className="glass-card neon-border rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Downloads</p>
        <div className="mt-4 grid gap-3">
          {downloads.map((item) => (
            <article
              key={item.fileName}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/45 px-4 py-3"
            >
              <div>
                <p className="text-sm text-slate-100">{item.label}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.fileName}</p>
              </div>
              <a
                href={item.href}
                className="rounded-full border border-cyan-400/60 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-cyan-100 hover:bg-cyan-400/10"
              >
                Download
              </a>
            </article>
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-500">
          If a file is unavailable, request it via the Contact page and it will be shared directly.
        </p>
      </section>
    </div>
  );
}

export default Media;
