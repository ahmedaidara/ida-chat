// supabase/functions/agora-token/index.ts
//
// Ce fichier génère les "tokens" Agora côté serveur.
// C'est INDISPENSABLE : ton App Certificate (la 2e clé) est un secret.
// Si tu le mets dans index.html, n'importe qui peut l'ouvrir dans le
// navigateur (Inspecter > Sources) et se faire passer pour toi sur Agora.
// Cette fonction reste la SEULE à connaître le certificat, en variable
// d'environnement Supabase (jamais dans le code, jamais sur GitHub).

import { RtcTokenBuilder, RtcRole } from "npm:agora-token@2.0.6";

const APP_ID = Deno.env.get("AGORA_APP_ID") ?? "";
const APP_CERTIFICATE = Deno.env.get("AGORA_APP_CERTIFICATE") ?? "";

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
    if (!APP_ID || !APP_CERTIFICATE) {
      return new Response(
        JSON.stringify({ error: "AGORA_APP_ID ou AGORA_APP_CERTIFICATE manquant côté serveur" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const url = new URL(req.url);
    const channel = url.searchParams.get("channel");
    const uidParam = url.searchParams.get("uid") ?? "0";
    const uid = parseInt(uidParam, 10);

    if (!channel || Number.isNaN(uid)) {
      return new Response(
        JSON.stringify({ error: "paramètres 'channel' et 'uid' requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Le token expire dans 1h (largement assez pour un appel)
    const expireSeconds = 3600;
    const currentTs = Math.floor(Date.now() / 1000);
    const privilegeExpireTs = currentTs + expireSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channel,
      uid,
      RtcRole.PUBLISHER,
      privilegeExpireTs,
      privilegeExpireTs,
    );

    return new Response(JSON.stringify({ token, appId: APP_ID }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
