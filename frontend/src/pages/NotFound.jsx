import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="full-bleed flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-black/60 p-10 text-center neon-border">
      <h1 className="glow-text text-4xl font-semibold">Page not found</h1>
      <p className="text-sm text-slate-400">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="rounded-full border border-cyan-400 bg-cyan-400/10 px-6 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
