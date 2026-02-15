import { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", icon: "⌂" },
  { to: "/promo", label: "Promo", icon: "✦" },
  { to: "/schedule", label: "Schedule", icon: "⌁" },
  { to: "/booking", label: "Booking", icon: "✎" },
  { to: "/contact", label: "Contact", icon: "✉" },
  { to: "/music", label: "Music", icon: "♫" },
  { to: "/media", label: "Media", icon: "▦" },
  { to: "/fans", label: "Fans", icon: "✪" },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="glass-nav sticky top-0 z-40">
      <nav className="relative flex w-full items-center justify-between px-6 py-4">
        <div className="text-lg font-semibold tracking-[0.35em] text-cyan-300">
          DJ SILVER
        </div>
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-cyan-300"
        >
          <span className="text-lg">☰</span>
        </button>

        {open && (
          <div className="absolute right-6 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-black/80 p-4 backdrop-blur">
            <div className="flex flex-col gap-4 text-left">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `text-xs uppercase tracking-[0.35em] transition hover:text-cyan-200 ${
                      isActive ? "text-cyan-300" : "text-slate-400"
                    }`
                  }
                >
                  <span className="group grid grid-cols-[18px_1fr] items-center gap-3">
                    <span className="text-sm text-cyan-300 transition group-hover:drop-shadow-[0_0_8px_rgba(0,242,255,0.7)]">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
