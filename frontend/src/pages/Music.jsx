import { useMemo, useRef, useState } from "react";

const tracks = [
  {
    title: import.meta.env.VITE_MUSIC_TRACK_1_TITLE || "Featured Mix 01",
    artist: import.meta.env.VITE_MUSIC_TRACK_1_ARTIST || "DJ Silver",
    duration: import.meta.env.VITE_MUSIC_TRACK_1_DURATION || "04:12",
    url:
      import.meta.env.VITE_MUSIC_TRACK_1_URL ||
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover:
      import.meta.env.VITE_MUSIC_TRACK_1_COVER ||
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=900",
  },
  {
    title: import.meta.env.VITE_MUSIC_TRACK_2_TITLE || "Featured Mix 02",
    artist: import.meta.env.VITE_MUSIC_TRACK_2_ARTIST || "DJ Silver",
    duration: import.meta.env.VITE_MUSIC_TRACK_2_DURATION || "03:58",
    url:
      import.meta.env.VITE_MUSIC_TRACK_2_URL ||
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover:
      import.meta.env.VITE_MUSIC_TRACK_2_COVER ||
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=900",
  },
  {
    title: import.meta.env.VITE_MUSIC_TRACK_3_TITLE || "Featured Mix 03",
    artist: import.meta.env.VITE_MUSIC_TRACK_3_ARTIST || "DJ Silver",
    duration: import.meta.env.VITE_MUSIC_TRACK_3_DURATION || "05:06",
    url:
      import.meta.env.VITE_MUSIC_TRACK_3_URL ||
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover:
      import.meta.env.VITE_MUSIC_TRACK_3_COVER ||
      "https://images.unsplash.com/photo-1571935441005-74d48f5f4f5d?auto=format&fit=crop&q=80&w=900",
  },
].filter((track) => track.url);

function Music() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const audioRef = useRef(null);

  const activeTrack = useMemo(() => tracks[activeIndex] || null, [activeIndex]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setErrorMessage("");
        })
        .catch(() => {
          setErrorMessage("Playback blocked by browser. Use the native controls below.");
        });
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const selectTrack = (index) => {
    setActiveIndex(index);
    setErrorMessage("");

    const audio = audioRef.current;
    if (!audio) return;

    setTimeout(() => {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }, 0);
  };

  const playFromGrid = (event, index) => {
    event.stopPropagation();
    selectTrack(index);
  };

  return (
    <div className="full-bleed flex flex-col gap-8 pb-10">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-500/70">Music</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">All Tracks</h1>
      </header>

      <section className="rounded-3xl border border-emerald-500/25 bg-gradient-to-b from-[#183d2d] to-[#09130e] p-6 md:p-8">
        {!activeTrack ? (
          <p className="text-sm text-rose-300">No track URLs configured.</p>
        ) : (
          <article className="rounded-2xl border border-white/10 bg-black/35 p-4 md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={activeTrack.cover}
                  alt={`${activeTrack.title} cover`}
                  className="h-16 w-16 rounded-md object-cover shadow-[0_6px_24px_rgba(0,0,0,0.45)]"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Now Playing</p>
                  <h2 className="mt-1 text-lg font-semibold text-white">{activeTrack.title}</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-300/80">
                    {activeTrack.artist}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={togglePlayback}
                className="rounded-full bg-[#1db954] px-6 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-black transition hover:brightness-110"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
            </div>

            <audio
              key={activeTrack.url}
              ref={audioRef}
              src={activeTrack.url}
              controls
              preload="metadata"
              className="mt-4 w-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={() => {
                setIsPlaying(false);
                setErrorMessage("Could not load this track URL.");
              }}
            />
            {errorMessage && <p className="mt-2 text-xs text-rose-300">{errorMessage}</p>}
          </article>
        )}
      </section>

      <section>
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-500">Music Grid</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track, index) => (
            <button
              key={`${track.title}-${index}`}
              type="button"
              onClick={() => selectTrack(index)}
              className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                index === activeIndex
                  ? "border-[#1db954] bg-[#1db954]/15"
                  : "border-white/10 bg-[#121212] hover:border-[#1db954]/60 hover:bg-[#1c1c1c]"
              }`}
            >
              <div className="group/cover relative h-12 w-12 shrink-0 overflow-hidden rounded">
                <img
                  src={track.cover}
                  alt={`${track.title} icon`}
                  className="h-12 w-12 object-cover"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={(event) => playFromGrid(event, index)}
                  className="absolute inset-0 flex items-center justify-center bg-black/55 text-[#1db954] opacity-0 transition group-hover/cover:opacity-100"
                  aria-label={`Play ${track.title}`}
                >
                  ▶
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{track.title}</p>
                <p className="mt-1 truncate text-[11px] uppercase tracking-[0.12em] text-slate-400">
                  {track.artist}
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-black/45 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-300">
                {track.duration || "--:--"}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Music;
