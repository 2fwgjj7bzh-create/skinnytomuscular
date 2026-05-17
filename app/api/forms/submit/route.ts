import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubmitBody = {
  formId?: unknown;
  data?: unknown;
  utm?: unknown;
};

const MAX_FIELD_LEN = 1000;

function asString(v: unknown, max = MAX_FIELD_LEN): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function asObject(v: unknown): Record<string, unknown> {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    return v as Record<string, unknown>;
  }
  return {};
}

function readSessionFromCookie(req: Request): string | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  for (const part of cookie.split(";")) {
    const [k, v] = part.trim().split("=");
    if (k === "lp_session" && v) return v.slice(0, 64);
  }
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "supabase_not_configured" }, { status: 503 });
  }

  let body: SubmitBody;
  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const formId = asString(body.formId, 64);
  const validFormIds = [siteConfig.forms.qualification.id, siteConfig.forms.newsletter.id];
  if (!formId || !validFormIds.includes(formId)) {
    return NextResponse.json({ ok: false, error: "unknown_form" }, { status: 400 });
  }

  const sessionId = req.headers.get("x-lp-session") ?? readSessionFromCookie(req);
  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "no_session" }, { status: 400 });
  }

  const data = asObject(body.data);
  const utm = asObject(body.utm);
  const supabase = getSupabaseAdmin();

  // --- Newsletter form ---
  if (formId === siteConfig.forms.newsletter.id) {
    const firstName = asString(data.firstName, 60);
    const lastName = asString(data.lastName, 60);
    const email = asString(data.email, 200);

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    const { error: leadError } = await supabase.from("leads").insert({
      session_id: sessionId,
      form_id: formId,
      name: `${firstName} ${lastName}`,
      email,
      qualified: true,
      utm,
    });

    if (leadError) {
      console.error("[forms/submit] newsletter lead insert failed", leadError);
      return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
    }

    await supabase.from("events").insert({
      session_id: sessionId,
      event_name: "newsletter_signup",
      payload: { form_id: formId },
      utm,
      path: asString(req.headers.get("referer"), 512),
      user_agent: asString(req.headers.get("user-agent"), 512),
    });

    return NextResponse.json({ ok: true, qualified: true });
  }

  // --- Qualification form ---
  const name = asString(data.name, 120);
  const context = asString(data.context, 300);
  const stage = asString(data.stage, 40);
  const goal = asString(data.goal, 800);
  const email = asString(data.email, 200);

  if (!name || !context || !stage || !goal || !email) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const form = siteConfig.forms.qualification;
  const stageQuestion = form.questions.find(
    (q): q is Extract<typeof q, { type: "choice" }> => q.id === "stage" && q.type === "choice",
  );
  const opt = stageQuestion?.options.find((o) => o.value === stage);
  if (!opt) {
    return NextResponse.json({ ok: false, error: "invalid_stage" }, { status: 400 });
  }
  const qualified = !opt.disqualifies;

  const { error: leadError } = await supabase.from("leads").insert({
    session_id: sessionId,
    form_id: formId,
    name,
    email,
    niche: context,
    pain: goal,
    revenue: stage,
    qualified,
    utm,
  });

  if (leadError) {
    console.error("[forms/submit] qualification lead insert failed", leadError);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  await supabase.from("events").insert({
    session_id: sessionId,
    event_name: qualified ? "form_qualified" : "form_unqualified",
    payload: { form_id: formId, stage },
    utm,
    path: asString(req.headers.get("referer"), 512),
    user_agent: asString(req.headers.get("user-agent"), 512),
  });

  return NextResponse.json({ ok: true, qualified });
}
