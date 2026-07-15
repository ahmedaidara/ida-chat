// supabase/functions/telegram-notify/index.ts
//
// Relaie un message vers Telegram via un bot, sans jamais exposer le
// token du bot côté client. Le token ET l'identifiant de chat Telegram
// restent des secrets Supabase (jamais dans index.html, jamais sur GitHub).

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!BOT_TOKEN || !CHAT_ID) {
      return new Response(
        JSON.stringify({ error: "TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID manquant côté serveur" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let message = "Notification";
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      if (body && typeof body.message === "string" && body.message.trim()) {
        message = body.message;
      }
    } else {
      const url = new URL(req.url);
      message = url.searchParams.get("message") || message;
    }

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const resp = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
    });
    const result = await resp.json();

    return new Response(JSON.stringify({ ok: resp.ok, telegram: result }), {
      status: resp.ok ? 200 : 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
