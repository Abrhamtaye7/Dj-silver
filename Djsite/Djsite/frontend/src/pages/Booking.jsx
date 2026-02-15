import { useMemo, useState } from "react";
import api from "../lib/api.js";

const steps = ["Details", "Event", "Confirm"];

const initialForm = {
  clientName: "",
  email: "",
  eventType: "Club",
  eventDate: "",
  budgetRange: "",
  message: "",
};

const emailRegex = /^\S+@\S+\.\S+$/;

function Booking() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrorMessage("");
    if (status !== "idle") setStatus("idle");
  };

  const stepValid = useMemo(() => {
    if (stepIndex === 0) {
      return form.clientName.trim().length >= 2 && emailRegex.test(form.email.trim());
    }

    if (stepIndex === 1) {
      return Boolean(form.eventDate);
    }

    return true;
  }, [form, stepIndex]);

  const overallValid =
    form.clientName.trim().length >= 2 &&
    emailRegex.test(form.email.trim()) &&
    Boolean(form.eventDate);

  const handleNext = () => {
    if (!stepValid) {
      setErrorMessage("Please complete the required fields before continuing.");
      return;
    }

    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setErrorMessage("");
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!overallValid) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      await api.post("/api/bookings", {
        ...form,
        clientName: form.clientName.trim(),
        email: form.email.trim(),
        budgetRange: form.budgetRange.trim(),
        message: form.message.trim(),
      });

      setStatus("success");
      setForm(initialForm);
      setStepIndex(0);
    } catch {
      setStatus("error");
      setErrorMessage("Could not submit. Please try again later.");
    }
  };

  return (
    <div className="full-bleed flex flex-col gap-8">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Booking</p>
        <h1 className="mt-3 text-3xl font-semibold glow-text">3-Step Booking Wizard</h1>
      </header>

      <div className="flex items-center gap-3">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`flex-1 rounded-full px-4 py-2 text-center text-xs uppercase tracking-[0.3em] ${
              index <= stepIndex
                ? "bg-cyan-400/20 text-cyan-200"
                : "bg-white/5 text-slate-400"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="glass-card neon-border rounded-2xl p-6">
        {stepIndex === 0 && (
          <div className="grid gap-4">
            <label className="grid gap-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              Full Name*
              <input
                value={form.clientName}
                onChange={handleChange("clientName")}
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm normal-case tracking-normal text-slate-100"
                placeholder="Full name"
              />
            </label>

            <label className="grid gap-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              Email*
              <input
                value={form.email}
                onChange={handleChange("email")}
                type="email"
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm normal-case tracking-normal text-slate-100"
                placeholder="Email address"
              />
            </label>
          </div>
        )}

        {stepIndex === 1 && (
          <div className="grid gap-4">
            <label className="grid gap-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              Event Type
              <select
                value={form.eventType}
                onChange={handleChange("eventType")}
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm normal-case tracking-normal text-slate-100"
              >
                <option>Club</option>
                <option>Corporate</option>
                <option>Festival</option>
                <option>Private</option>
                <option>Production</option>
              </select>
            </label>

            <label className="grid gap-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              Event Date*
              <input
                value={form.eventDate}
                onChange={handleChange("eventDate")}
                type="date"
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm normal-case tracking-normal text-slate-100"
              />
            </label>

            <label className="grid gap-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              Budget Range
              <input
                value={form.budgetRange}
                onChange={handleChange("budgetRange")}
                className="rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm normal-case tracking-normal text-slate-100"
                placeholder="Budget range"
              />
            </label>

            <label className="grid gap-1 text-xs uppercase tracking-[0.2em] text-slate-400">
              Message
              <textarea
                value={form.message}
                onChange={handleChange("message")}
                className="min-h-[120px] rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm normal-case tracking-normal text-slate-100"
                placeholder="Tell us more about the event"
                maxLength={1000}
              />
            </label>
          </div>
        )}

        {stepIndex === 2 && (
          <div className="text-sm text-slate-300">
            <p className="text-slate-100">Review your request:</p>
            <ul className="mt-4 space-y-2">
              <li>Name: {form.clientName || "-"}</li>
              <li>Email: {form.email || "-"}</li>
              <li>Event Type: {form.eventType}</li>
              <li>Date: {form.eventDate || "-"}</li>
              <li>Budget: {form.budgetRange || "Not specified"}</li>
              <li>Message: {form.message || "-"}</li>
            </ul>
          </div>
        )}

        {errorMessage && <p className="mt-4 text-xs text-rose-300">{errorMessage}</p>}

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={stepIndex === 0 || status === "loading"}
            className="rounded-full border border-white/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-slate-400 disabled:opacity-40"
          >
            Back
          </button>

          {stepIndex < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="rounded-full border border-cyan-400 bg-cyan-400/10 px-6 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="rounded-full border border-cyan-400 bg-cyan-400/10 px-6 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100 disabled:opacity-50"
            >
              {status === "loading" ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>

        {status === "success" && (
          <p className="mt-4 text-xs text-emerald-300">
            Booking submitted. We will reach out shortly.
          </p>
        )}
      </div>
    </div>
  );
}

export default Booking;
