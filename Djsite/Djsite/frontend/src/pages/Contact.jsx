import { Link } from "react-router-dom";

const contactMethods = [
  {
    label: "Phone",
    value: "+1 (202) 555-0147",
    href: "tel:+12025550147",
    action: "Call now",
  },
  {
    label: "Email",
    value: "booking@djsilver.com",
    href: "mailto:booking@djsilver.com?subject=Booking%20Inquiry",
    action: "Send email",
  },
  {
    label: "WhatsApp",
    value: "+1 (202) 555-0147",
    href: "https://wa.me/12025550147",
    action: "Open chat",
  },
];

const mapEmbedSrc =
  "https://www.google.com/maps?q=Brooklyn%2C%20New%20York&z=12&output=embed";

function Contact() {
  return (
    <div className="full-bleed flex flex-col gap-8">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Contact</p>
        <h1 className="mt-3 text-3xl font-semibold glow-text">Stay in Touch</h1>
      </header>

      <section className="glass-card neon-border rounded-3xl p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4 text-sm text-slate-300">
            {contactMethods.map((method) => (
              <article
                key={method.label}
                className="rounded-2xl border border-white/10 bg-black/50 p-4"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {method.label}
                </p>
                <p className="mt-2 text-base text-slate-100">{method.value}</p>
                <a
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                  className="mt-3 inline-flex rounded-full border border-cyan-400/60 px-4 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100 transition hover:bg-cyan-400/10"
                >
                  {method.action}
                </a>
              </article>
            ))}

            <article className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">
                Response Window
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Most booking requests are answered within 24 hours.
              </p>
              <Link
                to="/booking"
                className="mt-3 inline-flex rounded-full border border-cyan-300 px-4 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100"
              >
                Start Booking Form
              </Link>
            </article>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/50 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Base Location</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-100">Brooklyn, New York</h2>
            <p className="mt-2 text-xs text-slate-400">
              Open to domestic and international bookings.
            </p>

            <div className="mt-4 overflow-hidden rounded-xl border border-cyan-400/20">
              <iframe
                title="DJ Silver base location"
                src={mapEmbedSrc}
                width="100%"
                height="260"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
