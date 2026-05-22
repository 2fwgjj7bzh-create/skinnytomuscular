"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import type { FormDefinition, FormQuestion } from "@/config/site";
import { cn } from "@/lib/utils";
import { track, getStoredUtm } from "@/lib/tracking";

type FormState = Record<string, string>;

type Status =
  | { kind: "intro" }
  | { kind: "question"; index: number }
  | { kind: "submitting" }
  | { kind: "unqualified" }
  | { kind: "calendar"; name?: string; email?: string }
  | { kind: "confirmed" }
  | { kind: "error"; message: string };

export function QualificationForm({
  form,
  onClose,
}: {
  form: FormDefinition;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>(
    !form.intro ? { kind: "question", index: 0 } : { kind: "intro" }
  );
  const [data, setData] = useState<FormState>({});
  const statusRef = useRef<Status>(status);
  statusRef.current = status;

  const totalSteps = form.questions.length;
  const currentIndex = status.kind === "question" ? status.index : -1;
  const progress = currentIndex < 0 ? 0 : ((currentIndex + 1) / totalSteps) * 100;

  // Track form_open on mount + form_abandoned on unmount if mid-flow.
  useEffect(() => {
    track("form_open", { form_id: form.id });
    return () => {
      const last = statusRef.current;
      if (last.kind === "question" || last.kind === "submitting") {
        track("form_abandoned", {
          form_id: form.id,
          step: last.kind === "question" ? last.index + 1 : totalSteps,
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function start() {
    track("form_step", { form_id: form.id, step: 1, action: "start" });
    setStatus({ kind: "question", index: 0 });
  }

  function setField(id: string, value: string) {
    setData((prev) => ({ ...prev, [id]: value }));
  }

  function next(currentQ: FormQuestion) {
    if (currentQ.type === "group") {
      const allFilled = currentQ.fields.every((f) => {
        const v = (data[f.id] ?? "").trim();
        if (!v) return false;
        if (f.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        return true;
      });
      if (!allFilled) return;
    } else {
      const value = (data[currentQ.id] ?? "").trim();
      if (currentQ.required !== false && !value) return;
      if (currentQ.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return;
    }

    track("form_step", { form_id: form.id, step: currentIndex + 1, field: currentQ.id });

    if (currentIndex >= totalSteps - 1) {
      void submit();
      return;
    }
    setStatus({ kind: "question", index: currentIndex + 1 });
  }

  function back() {
    if (currentIndex <= 0) {
      setStatus({ kind: "intro" });
    } else {
      setStatus({ kind: "question", index: currentIndex - 1 });
    }
  }

  async function submit() {
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: form.id,
          data,
          utm: getStoredUtm(),
        }),
      });
      const json = (await res.json()) as { ok: boolean; qualified?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus({
          kind: "error",
          message: errorLabel(json.error),
        });
        return;
      }
      if (!json.qualified) {
        setStatus({ kind: "unqualified" });
        return;
      }
      if (form.successScreen.kind === "redirect") {
        track("form_qualified", { form_id: form.id });
        window.location.href = form.successScreen.href;
        return;
      }
      if (form.successScreen.kind === "confirmation") {
        setStatus({ kind: "confirmed" });
        track("newsletter_signup", { form_id: form.id });
        return;
      }
      setStatus({ kind: "calendar", name: data.name ?? data.firstName, email: data.email });
    } catch {
      setStatus({ kind: "error", message: "Erreur réseau. Réessaye dans quelques secondes." });
    }
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-background text-foreground">
      {/* Top bar : progress + close */}
      <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 md:px-8">
        <div className="flex-1 max-w-md">
          {status.kind === "question" && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted">
                <span>
                  Étape {currentIndex + 1} / {totalSteps}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1 rounded-full bg-card overflow-hidden">
                <div
                  className="h-full bg-[#ff0000] transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted hover:text-foreground hover:border-foreground/30 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {status.kind === "intro" && form.intro && (
          <Step>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
              {form.intro.headline}
            </h2>
            {form.intro.subheadline && (
              <p className="text-muted text-base md:text-lg leading-relaxed mb-10 max-w-xl">
                {form.intro.subheadline}
              </p>
            )}
            <button
              type="button"
              onClick={start}
              className="inline-flex h-12 items-center gap-2 rounded-[var(--radius)] bg-primary px-7 text-sm font-semibold text-primary-foreground hover:opacity-90 transition cta-glow"
            >
              Commencer
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
            <p className="mt-6 text-xs text-muted">~ 90 secondes · {form.questions.length} questions</p>
          </Step>
        )}

        {status.kind === "question" && (() => {
          const q = form.questions[currentIndex];
          if (q.type === "group") {
            const allFilled = q.fields.every((f) => {
              const v = (data[f.id] ?? "").trim();
              if (!v) return false;
              if (f.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
              return true;
            });
            return (
              <Step key={currentIndex}>
                <div className="flex flex-col gap-4 w-full max-w-md">
                  {q.label && <p className="text-xs uppercase tracking-widest text-muted mb-2">{q.label}</p>}
                  {q.fields.map((f) => (
                    <div key={f.id} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground/80">{f.label}</label>
                      {f.type === "textarea" ? (
                        <textarea
                          placeholder={"placeholder" in f ? f.placeholder : undefined}
                          value={data[f.id] ?? ""}
                          onChange={(e) => setField(f.id, e.target.value)}
                          rows={3}
                          className="rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                        />
                      ) : f.type === "scale" ? (
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: f.max - f.min + 1 }, (_, i) => f.min + i).map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setField(f.id, String(n))}
                              className={cn(
                                "h-10 w-10 rounded-[var(--radius)] border text-sm font-semibold transition",
                                data[f.id] === String(n)
                                  ? "border-accent bg-accent text-white"
                                  : "border-border bg-card text-foreground hover:border-foreground/30"
                              )}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          type={f.type === "email" ? "email" : "text"}
                          placeholder={"placeholder" in f ? f.placeholder : undefined}
                          value={data[f.id] ?? ""}
                          onChange={(e) => setField(f.id, e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter" && allFilled) next(q); }}
                          className="h-11 rounded-[var(--radius)] border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    disabled={!allFilled}
                    onClick={() => next(q)}
                    className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius)] bg-primary px-7 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
                  >
                    Continuer
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </Step>
            );
          }
          return (
            <Step key={currentIndex}>
              <QuestionView
                question={q}
                value={data[q.id] ?? ""}
                onChange={(v) => setField(q.id, v)}
                onNext={() => next(q)}
              />
            </Step>
          );
        })()}

        {status.kind === "submitting" && (
          <Step>
            <div className="flex items-center gap-3 text-muted">
              <span className="h-3 w-3 rounded-full bg-[#ff0000] animate-blink" />
              <span className="text-sm">On enregistre tes réponses…</span>
            </div>
          </Step>
        )}

        {status.kind === "unqualified" && (
          <Step>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              {form.unqualifiedScreen.headline}
            </h2>
            <p className="text-muted text-base leading-relaxed mb-8 max-w-xl">
              {form.unqualifiedScreen.description}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center rounded-[var(--radius)] border border-border bg-card px-6 text-sm font-medium hover:border-foreground/30 transition"
            >
              Fermer
            </button>
          </Step>
        )}

        {status.kind === "calendar" && form.successScreen.kind === "calcom" && (
          <CalendarView
            calLink={form.successScreen.calcomLink}
            namespace={form.successScreen.namespace}
            name={status.name}
            email={status.email}
            headline={form.successScreen.headline}
            subheadline={form.successScreen.subheadline}
            redirectAfterBooking={form.redirectAfterBooking}
            formId={form.id}
          />
        )}

        {status.kind === "confirmed" && form.successScreen.kind === "confirmation" && (
          <Step>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
              {form.successScreen.headline}
            </h2>
            {form.successScreen.subheadline && (
              <p className="text-muted text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                {form.successScreen.subheadline}
              </p>
            )}
            {form.successScreen.cta && (
              <a
                href={form.successScreen.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-3 rounded-[var(--radius)] bg-primary px-8 text-2xl md:text-4xl font-display uppercase tracking-wide text-primary-foreground hover:opacity-90 transition cta-glow"
              >
                {form.successScreen.cta.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            )}
          </Step>
        )}

        {status.kind === "error" && (
          <Step>
            <h2 className="text-2xl font-bold mb-3">Oups.</h2>
            <p className="text-muted mb-6">{status.message}</p>
            <button
              type="button"
              onClick={() => setStatus({ kind: "question", index: totalSteps - 1 })}
              className="inline-flex h-11 items-center rounded-[var(--radius)] bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Réessayer
            </button>
          </Step>
        )}
      </div>

      {/* Footer nav — masqué pour les questions group (bouton intégré) */}
      {status.kind === "question" && form.questions[currentIndex]?.type !== "group" && (
        <footer className="border-t border-border px-5 py-4 md:px-8">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={back}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              ← Retour
            </button>
            <button
              type="button"
              onClick={() => next(form.questions[currentIndex])}
              disabled={!isValid(form.questions[currentIndex], data)}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-[var(--radius)] px-6 text-sm font-semibold transition",
                isValid(form.questions[currentIndex], data)
                  ? "bg-primary text-primary-foreground hover:opacity-90 cta-glow"
                  : "bg-card text-muted cursor-not-allowed",
              )}
            >
              Continuer
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-[11px] text-muted text-right">
            <kbd className="font-mono">Entrée ↵</kbd> pour valider
          </p>
        </footer>
      )}
    </div>
  );
}

function Step({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12 md:px-10 md:py-20 animate-fade-in">
      {children}
    </div>
  );
}

function QuestionView({
  question,
  value,
  onChange,
  onNext,
}: {
  question: FormQuestion;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="animate-slide-in-right">
      <label htmlFor={question.id} className="block text-2xl md:text-4xl font-bold tracking-tight mb-8">
        {question.label}
        {"required" in question && question.required !== false && <span className="text-[#ff0000] ml-1">*</span>}
      </label>

      {question.type === "text" && (
        <input
          id={question.id}
          type="text"
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onNext();
            }
          }}
          placeholder={question.placeholder}
          className="w-full text-2xl md:text-3xl bg-transparent border-b-2 border-border py-3 px-1 focus:outline-none focus:border-[#ff0000] transition placeholder:text-muted/60"
        />
      )}

      {question.type === "email" && (
        <input
          id={question.id}
          type="email"
          autoFocus
          value={value}
          autoComplete="email"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onNext();
            }
          }}
          placeholder={question.placeholder}
          className="w-full text-2xl md:text-3xl bg-transparent border-b-2 border-border py-3 px-1 focus:outline-none focus:border-[#ff0000] transition placeholder:text-muted/60"
        />
      )}

      {question.type === "textarea" && (
        <textarea
          id={question.id}
          autoFocus
          value={value}
          maxLength={question.maxLength ?? 400}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              onNext();
            }
          }}
          placeholder={question.placeholder}
          rows={4}
          className="w-full text-lg md:text-xl bg-transparent border-2 border-border rounded-[var(--radius)] p-4 focus:outline-none focus:border-[#ff0000] transition placeholder:text-muted/60 resize-none"
        />
      )}

      {question.type === "choice" && (
        <ul className="space-y-2.5">
          {question.options.map((opt) => {
            const selected = value === opt.value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setTimeout(() => onNext(), 180);
                  }}
                  className={cn(
                    "group w-full flex items-center justify-between gap-3 rounded-[var(--radius)] border-2 px-5 py-4 text-left transition-all",
                    selected
                      ? "border-[#ff0000] bg-[#ff0000]/5"
                      : "border-border hover:border-foreground/40",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid h-5 w-5 place-items-center rounded-full border-2 transition",
                        selected ? "border-[#ff0000] bg-[#ff0000]" : "border-border",
                      )}
                    >
                      {selected && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                    <span className="text-base md:text-lg font-medium">{opt.label}</span>
                  </span>
                  <span
                    className={cn(
                      "text-xs font-mono opacity-0 group-hover:opacity-60 transition",
                      selected && "opacity-100",
                    )}
                  >
                    →
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function CalendarView({
  calLink,
  namespace,
  name,
  email,
  headline,
  subheadline,
  redirectAfterBooking,
  formId,
}: {
  calLink: string;
  namespace: string;
  name?: string;
  email?: string;
  headline?: string;
  subheadline?: string;
  redirectAfterBooking?: string;
  formId: string;
}) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cal = await getCalApi({ namespace });
        if (cancelled) return;
        cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
        cal("on", {
          action: "bookingSuccessful",
          callback: () => {
            track("booking_success", { form_id: formId });
            if (redirectAfterBooking) {
              window.location.href = redirectAfterBooking;
            }
          },
        });
      } catch (e) {
        console.error("[cal] init failed", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [namespace, redirectAfterBooking, formId]);

  const config = useMemo(
    () => ({
      layout: "month_view" as const,
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
    }),
    [name, email],
  );

  return (
    <div className="animate-fade-in">
      {(headline || subheadline) && (
        <div className="mx-auto w-full max-w-2xl px-6 pt-10 md:px-10">
          {headline && (
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{headline}</h2>
          )}
          {subheadline && <p className="text-muted text-sm md:text-base">{subheadline}</p>}
        </div>
      )}
      <div className="mx-auto w-full max-w-5xl px-2 md:px-6 py-6">
        <Cal
          namespace={namespace}
          calLink={calLink}
          style={{ width: "100%", height: "100%", minHeight: "640px", overflow: "scroll" }}
          config={config}
        />
      </div>
    </div>
  );
}

function isValid(question: FormQuestion, data: FormState): boolean {
  if (question.type === "group") {
    return question.fields.every((f) => {
      const v = (data[f.id] ?? "").trim();
      if (!v) return false;
      if (f.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      return true;
    });
  }
  const value = (data[question.id] ?? "").trim();
  if ("required" in question && question.required === false) return true;
  if (!value) return false;
  if (question.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  return true;
}

function errorLabel(code?: string): string {
  switch (code) {
    case "invalid_email":
      return "L'email n'a pas l'air valide. Vérifie et réessaye.";
    case "missing_fields":
      return "Une réponse manque. Reviens en arrière pour la compléter.";
    case "supabase_not_configured":
      return "Le backend n'est pas encore branché. Reviens dans 5 min.";
    default:
      return "Erreur côté serveur. Réessaye dans quelques secondes.";
  }
}
