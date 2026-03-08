import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key",
};

const MAX_RECORDS = 100;
const MAX_STRING = 500;
const MAX_LONG_STRING = 2000;

function isString(v: unknown, maxLen = MAX_STRING): v is string {
  return typeof v === "string" && v.length <= maxLen;
}
function isOptionalString(v: unknown, maxLen = MAX_STRING): boolean {
  return v === undefined || v === null || isString(v, maxLen);
}
function isOptionalUrl(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (typeof v !== "string" || v.length > MAX_STRING) return false;
  try { new URL(v); return true; } catch { return false; }
}
function isOptionalStringArray(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  return Array.isArray(v) && v.length <= 20 && v.every((s) => isString(s, 200));
}

const RESTAURANT_ALLOWED_KEYS = new Set([
  "name", "category", "address", "city", "gf_level", "price", "rating",
  "kosher", "description", "website_url", "menu_url", "image_urls",
  "review_count", "opening_hours",
]);

const ARTICLE_ALLOWED_KEYS = new Set([
  "title", "category", "summary", "source_name", "source_url", "published_date",
]);

function validateRestaurant(r: unknown): string | null {
  if (typeof r !== "object" || r === null || Array.isArray(r)) return "Record must be an object";
  const rec = r as Record<string, unknown>;
  for (const key of Object.keys(rec)) {
    if (!RESTAURANT_ALLOWED_KEYS.has(key)) return `Unknown field: ${key}`;
  }
  if (!isString(rec.name, 200)) return "name: required string <= 200 chars";
  if (!isString(rec.category, 100)) return "category: required string <= 100 chars";
  if (!isString(rec.address, 300)) return "address: required string <= 300 chars";
  if (!isString(rec.city, 100)) return "city: required string <= 100 chars";
  if (!isString(rec.gf_level, 50)) return "gf_level: required string <= 50 chars";
  if (!isString(rec.price, 20)) return "price: required string <= 20 chars";
  if (rec.rating !== undefined && (typeof rec.rating !== "number" || rec.rating < 0 || rec.rating > 5)) return "rating: number 0-5";
  if (rec.kosher !== undefined && typeof rec.kosher !== "boolean") return "kosher: must be boolean";
  if (!isOptionalString(rec.description, MAX_LONG_STRING)) return "description: string <= 2000 chars";
  if (!isOptionalUrl(rec.website_url)) return "website_url: invalid URL";
  if (!isOptionalUrl(rec.menu_url)) return "menu_url: invalid URL";
  if (!isOptionalStringArray(rec.image_urls)) return "image_urls: array of strings";
  if (rec.review_count !== undefined && (typeof rec.review_count !== "number" || rec.review_count < 0 || !Number.isInteger(rec.review_count))) return "review_count: non-negative integer";
  if (rec.opening_hours !== undefined && (typeof rec.opening_hours !== "object" || rec.opening_hours === null)) return "opening_hours: must be object";
  return null;
}

function validateArticle(r: unknown): string | null {
  if (typeof r !== "object" || r === null || Array.isArray(r)) return "Record must be an object";
  const rec = r as Record<string, unknown>;
  for (const key of Object.keys(rec)) {
    if (!ARTICLE_ALLOWED_KEYS.has(key)) return `Unknown field: ${key}`;
  }
  if (!isString(rec.title, 300)) return "title: required string <= 300 chars";
  if (!isString(rec.category, 100)) return "category: required string <= 100 chars";
  if (!isOptionalString(rec.summary, MAX_LONG_STRING)) return "summary: string <= 2000 chars";
  if (!isOptionalString(rec.source_name, 200)) return "source_name: string <= 200 chars";
  if (!isOptionalUrl(rec.source_url)) return "source_url: invalid URL";
  if (rec.published_date !== undefined && rec.published_date !== null) {
    if (typeof rec.published_date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(rec.published_date)) return "published_date: YYYY-MM-DD format";
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate API key
  const apiKey = req.headers.get("x-api-key");
  const expectedKey = Deno.env.get("INGEST_API_KEY");
  if (!apiKey || apiKey !== expectedKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.json();
    const { table, records } = body;

    if (!table || !Array.isArray(records) || records.length === 0) {
      return new Response(
        JSON.stringify({ error: "Body must include `table` (string) and `records` (non-empty array)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (records.length > MAX_RECORDS) {
      return new Response(
        JSON.stringify({ error: `Maximum ${MAX_RECORDS} records per request` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!["restaurants", "articles"].includes(table)) {
      return new Response(
        JSON.stringify({ error: "Table must be 'restaurants' or 'articles'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate each record
    const validator = table === "restaurants" ? validateRestaurant : validateArticle;
    for (let i = 0; i < records.length; i++) {
      const err = validator(records[i]);
      if (err) {
        return new Response(
          JSON.stringify({ error: `Record ${i}: ${err}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const { data, error } = await supabase
      .from(table)
      .upsert(records, { onConflict: table === "restaurants" ? "name,city" : "title" })
      .select();

    if (error) {
      console.error("Supabase upsert error:", error);
      return new Response(JSON.stringify({ error: "Failed to process records" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, inserted: data.length, data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Ingest error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
