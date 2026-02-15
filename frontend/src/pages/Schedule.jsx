import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildMonthCells(referenceDate, events) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startDay = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventDays = new Set(
    events
      .filter((event) => {
        const d = new Date(event.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .map((event) => new Date(event.date).getDate())
  );

  const cells = [];

  for (let i = 0; i < startDay; i += 1) {
    cells.push({ day: null, isEvent: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, isEvent: eventDays.has(day) });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: null, isEvent: false });
  }

  return cells;
}

function Schedule() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const monthReference = useMemo(() => new Date(), []);

  useEffect(() => {
    let isMounted = true;

    api
      .get("/api/events")
      .then((response) => {
        if (!isMounted) return;

        const fetched = Array.isArray(response.data) ? response.data : [];

        const sorted = [...fetched].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setEvents(sorted);
      })
      .catch(() => {
        if (isMounted) setEvents([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const cells = useMemo(
    () => buildMonthCells(monthReference, events),
    [monthReference, events]
  );

  const monthLabel = monthReference.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="full-bleed flex flex-col gap-10">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Schedule</p>
        <h1 className="mt-3 text-3xl font-semibold glow-text">Event Calendar</h1>
      </header>

      <section className="glass-card neon-border rounded-3xl p-8">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-black/50 p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Calendar View</p>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{monthLabel}</p>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {WEEKDAY_LABELS.map((label) => (
                <div key={label}>{label}</div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2 text-center text-xs text-slate-300">
              {cells.map((cell, index) => (
                <div
                  key={`${cell.day || "empty"}-${index}`}
                  className={`rounded-lg border py-3 ${
                    cell.day
                      ? cell.isEvent
                        ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-100"
                        : "border-white/5 bg-black/40"
                      : "border-transparent bg-transparent"
                  }`}
                >
                  {cell.day || ""}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-slate-400">
                Loading events...
              </div>
            ) : events.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-slate-400">
                No upcoming gigs yet.
              </div>
            ) : (
              events.slice(0, 8).map((item) => {
                const itemDate = new Date(item.date);
                return (
                  <div
                    key={item._id || `${item.venue}-${item.date}`}
                    className="rounded-2xl border border-white/10 bg-black/50 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                      {itemDate.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-100">{item.venue}</p>
                    <p className="text-xs text-slate-400">{item.location}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Schedule;
