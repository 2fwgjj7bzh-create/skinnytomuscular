"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { QualificationForm } from "./QualificationForm";

const FORM_OPEN_EVENT = "lp:open-form";

declare global {
  interface WindowEventMap {
    "lp:open-form": CustomEvent<{ formId: string }>;
  }
}

export function openForm(formId: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(FORM_OPEN_EVENT, { detail: { formId } }));
}

const ALL_FORMS = [siteConfig.forms.qualification, siteConfig.forms.newsletter];

export function QualificationDialog() {
  const [activeForm, setActiveForm] = useState<typeof ALL_FORMS[number] | null>(null);
  const [mountKey, setMountKey] = useState(0);

  useEffect(() => {
    const handler = (e: CustomEvent<{ formId: string }>) => {
      const form = ALL_FORMS.find((f) => f.id === e.detail?.formId);
      if (form) {
        setMountKey((k) => k + 1);
        setActiveForm(form);
      }
    };
    window.addEventListener(FORM_OPEN_EVENT, handler);
    return () => window.removeEventListener(FORM_OPEN_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!activeForm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveForm(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeForm]);

  if (!activeForm) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Formulaire"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-0 md:p-6"
    >
      <div
        key={mountKey}
        className="relative w-full h-full md:h-auto md:max-h-[92vh] md:w-[min(100%,960px)] md:rounded-2xl overflow-hidden shadow-2xl border border-border bg-background animate-scale-in"
      >
        <QualificationForm
          form={activeForm}
          onClose={() => setActiveForm(null)}
        />
      </div>
    </div>
  );
}
