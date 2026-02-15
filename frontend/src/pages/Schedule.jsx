import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DEMO_ENABLED = (import.meta.env.VITE_ENABLE_SCHEDULE_DEMO || "true") === "true";

// TODO: Remove demo events before production launch.
const DEMO_EVENTS = [
  {
    _id: "demo-1",
    venue: "Neon District",
    location: "London, UK",
    date: "2026-03-28T22:00:00.000Z",
    endDate: "2026-03-29T01:00:00.000Z",
    eventType: "Club",
    isDemo: true,
  },
  {
    _id: "demo-2",
    venue: "Sonic Fields",
    location: "Barcelona, ES",
    date: "2026-04-11T18:30:00.000Z",
    endDate: "2026-04-11T21:30:00.000Z",
    eventType: "Festival",
    isDemo: true,
  },
  {
    _id: "demo-3",
    venue: "Private Rooftop Session",
    location: "Los Angeles, CA",
    date: "2026-04-24T02:00:00.000Z",
    endDate: "2026-04-24T04:00:00.000Z",
    eventType: "Private",
    isDemo: true,
  },
];

const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const toCalendarStamp = (date) =>
  date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

const plusHours = (date, hours) => new Date(date.getTime() + hours * 60 * 60 * 1000);

const toGoogleCalendarUrl = ({ title, location, description, start, end }) => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toCalendarStamp(start)}/${toCalendarStamp(end)}`,
    details: description,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const toIcsDataUrl = ({ uid, title, location, description, start, end }) => {
  const stamp = toCalendarStamp(new Date());
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DJ Silver//Schedule//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toCalendarStamp(start)}`,
    `DTEND:${toCalendarStamp(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
};

const normalizeEvent = (event) => {
  const start = new Date(event.date);
  const end = event.endDate ? new Date(event.endDate) : plusHours(start, 2);
  const type = event.eventType || event.type || "Event";

  return {
    ...event,
    parsedDate: start,
    parsedEndDate: end,
    dateKey: toDateKey(start),
    eventType: type,
  };
};

const buildMonthCells = (referenceDate, eventDateKeys) => {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startDay = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < startDay; i += 1) {
    cells.push({ day: null, dateKey: null, isEvent: false, isToday: false });
  }

  const todayKey = toDateKey(new Date());

  for (let day = 1; day <= daysInMonth; day += 1) {
    const current = new Date(year, month, day);
    const dateKey = toDateKey(current);

    cells.push({
      day,
      dateKey,
      isEvent: eventDateKeys.has(dateKey),
      isToday: dateKey === todayKey,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: null, dateKey: null, isEvent: false, isToday: false });
  }

  return cells;
};

function Schedule() {
  const [events, setEvents] = useState(() =>
    DEMO_ENABLED ? DEMO_EVENTS.map((event) => normalizeEvent(event)) : []
  );
  const [loading, setLoading] = useState(true);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDateKey, setSelectedDateKey] = useState("");

  useEffect(() => {
    let isMounted = true;

    api
      .get("/api/events")
      .then((response) => {
        if (!isMounted) return;

        const fetched = Array.isArray(response.data) ? response.data : [];
        const sourceEvents = DEMO_ENABLED ? [...fetched, ...DEMO_EVENTS] : fetched;
        const mapped = sourceEvents
          .map((event) => normalizeEvent(event))
          .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

        setEvents(mapped);
      })
      .catch(() => {
        if (isMounted) {
          setEvents(DEMO_ENABLED ? DEMO_EVENTS.map((event) => normalizeEvent(event)) : []);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const monthReference = useMemo(() => {
    const base = new Date();
    return new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  }, [monthOffset]);

  const eventDateKeys = useMemo(() => new Set(events.map((event) => event.dateKey)), [events]);

  const cells = useMemo(
    () => buildMonthCells(monthReference, eventDateKeys),
    [monthReference, eventDateKeys]
  );

  const monthLabel = monthReference.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const filteredEvents = useMemo(() => {
    if (!selectedDateKey) return events;
    return events.filter((event) => event.dateKey === selectedDateKey);
  }, [events, selectedDateKey]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events.filter((event) => event.parsedDate >= now).slice(0, 8);
  }, [events]);

  const nextEvent = upcomingEvents[0] || null;

  return (
    <div className="full-bleed flex flex-col gap-10">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Schedule</p>
        <h1 className="mt-3 text-3xl font-semibold glow-text">Event Calendar</h1>
      </header>

      {nextEvent && (
        <section className="rounded-2xl border border-cyan-400/35 bg-cyan-400/10 px-5 py-4 text-sm text-slate-200">
          <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-200">Next Up</p>
          <p className="mt-1 text-base font-semibold text-white">{nextEvent.venue}</p>
          <p className="text-xs text-slate-300">
            {nextEvent.location} • {nextEvent.parsedDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </section>
      )}

      <section className="glass-card neon-border rounded-3xl p-8">
        <div className="grid gap-6 md:grid-cols-[1.45fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-black/50 p-6">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Calendar View</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMonthOffset((prev) => prev - 1)}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
                >
                  Prev
                </button>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{monthLabel}</p>
                <button
                  type="button"
                  onClick={() => setMonthOffset((prev) => prev + 1)}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {WEEKDAY_LABELS.map((label) => (
                <div key={label}>{label}</div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2 text-center text-xs text-slate-300">
              {cells.map((cell, index) => (
                <button
                  key={`${cell.day || "empty"}-${index}`}
                  type="button"
                  disabled={!cell.day}
                  onClick={() => setSelectedDateKey(cell.dateKey || "")}
                  className={`rounded-lg border py-3 transition ${
                    !cell.day
                      ? "border-transparent bg-transparent"
                      : selectedDateKey === cell.dateKey
                        ? "border-cyan-300 bg-cyan-400/25 text-cyan-100"
                        : cell.isEvent
                          ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-100"
                          : cell.isToday
                            ? "border-white/30 bg-white/10 text-white"
                            : "border-white/5 bg-black/40 hover:border-white/20"
                  }`}
                >
                  {cell.day || ""}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {selectedDateKey ? "Selected Day" : "Upcoming Events"}
              </p>
              {selectedDateKey && (
                <button
                  type="button"
                  onClick={() => setSelectedDateKey("")}
                  className="text-[10px] uppercase tracking-[0.2em] text-cyan-300"
                >
                  Clear
                </button>
              )}
            </div>

            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-slate-400">
                Loading events...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-slate-400">
                No events for this selection.
              </div>
            ) : (
              filteredEvents.slice(0, 10).map((item) => (
                <article
                  key={item._id || `${item.venue}-${item.date}`}
                  className="rounded-2xl border border-white/10 bg-black/50 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                    {item.parsedDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    {item.parsedDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-lg font-semibold text-slate-100">{item.venue}</p>
                    <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-cyan-200">
                      {item.eventType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{item.location}</p>
                  {item.isDemo && (
                    <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-amber-300">
                      Demo Data
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <a
                      href={toGoogleCalendarUrl({
                        title: `DJ Silver - ${item.venue}`,
                        location: item.location,
                        description: `${item.eventType} event`,
                        start: item.parsedDate,
                        end: item.parsedEndDate,
                      })}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-slate-200 hover:border-cyan-300"
                    >
                      Add Google
                    </a>
                    <a
                      href={toIcsDataUrl({
                        uid: `${item._id || `${item.venue}-${item.date}`}@djsilver.local`,
                        title: `DJ Silver - ${item.venue}`,
                        location: item.location,
                        description: `${item.eventType} event`,
                        start: item.parsedDate,
                        end: item.parsedEndDate,
                      })}
                      download={`${(item.venue || "event").replace(/\s+/g, "_")}.ics`}
                      className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-slate-200 hover:border-cyan-300"
                    >
                      Add ICS
                    </a>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Schedule;
