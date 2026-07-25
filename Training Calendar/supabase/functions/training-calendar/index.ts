import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function normalizeCode(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-");
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function cleanCalendar(value: unknown) {
  const calendar =
    value && typeof value === "object"
      ? value as Record<string, unknown>
      : {};

  const rawDays =
    calendar.days && typeof calendar.days === "object"
      ? calendar.days as Record<string, unknown>
      : {};

  const days: Record<string, unknown> = {};

  for (const [date, rawEntry] of Object.entries(rawDays)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    if (!rawEntry || typeof rawEntry !== "object") continue;

    const entry = rawEntry as Record<string, unknown>;
    const trainingType =
      entry.trainingType === "muay" || entry.trainingType === "bjj"
        ? entry.trainingType
        : "";

    const task =
      typeof entry.task === "string"
        ? entry.task.slice(0, 2000)
        : "";

    const taskDone = Boolean(entry.taskDone);

    if (trainingType || task || taskDone) {
      days[date] = { trainingType, task, taskDone };
    }
  }

  const cleanSchedule = (value: unknown) => {
    if (!Array.isArray(value)) return [];

    return [...new Set(
      value
        .map(Number)
        .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6),
    )].sort();
  };

  return {
    muayThaiGoal:
      typeof calendar.muayThaiGoal === "string"
        ? calendar.muayThaiGoal.slice(0, 2000)
        : "",
    bjjGoal:
      typeof calendar.bjjGoal === "string"
        ? calendar.bjjGoal.slice(0, 2000)
        : "",
    muaySchedule: cleanSchedule(calendar.muaySchedule),
    bjjSchedule: cleanSchedule(calendar.bjjSchedule),
    days,
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Use POST." }, 405);
  }

  try {
    const body = await request.json();
    const action = body?.action;
    const code = normalizeCode(body?.code);

    if (code.length < 8 || code.length > 80) {
      return json({ error: "Code must be 8 to 80 characters." }, 400);
    }

    const codeHash = await sha256(code);

    if (action === "load_calendar") {
      const { data, error } = await supabase
        .from("saved_calendars")
        .select("calendar_data")
        .eq("code_hash", codeHash)
        .maybeSingle();

      if (error) throw error;

      return json({
        exists: Boolean(data),
        calendar: data?.calendar_data ?? null,
      });
    }

    if (action === "save_calendar") {
      const calendar = cleanCalendar(body?.calendar);

      const { error } = await supabase
        .from("saved_calendars")
        .upsert(
          {
            code_hash: codeHash,
            calendar_data: calendar,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "code_hash" },
        );

      if (error) throw error;

      return json({ saved: true });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (error) {
    console.error(error);
    return json({ error: "Server error." }, 500);
  }
});
