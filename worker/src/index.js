const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  const allowed = env.DASHBOARD_ORIGIN && origin === env.DASHBOARD_ORIGIN
    ? origin
    : env.DASHBOARD_ORIGIN || "*";
  return {
    "access-control-allow-origin": allowed,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
    "vary": "Origin",
  };
}

function withCors(response, request, env) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders(request, env))) {
    headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, headers });
}

function authorized(request, env) {
  if (!env.API_SECRET) return false;
  return request.headers.get("Authorization") === `Bearer ${env.API_SECRET}`;
}

export default {
  async fetch(request, env) {
    try {
      if (request.method === "OPTIONS") {
        return withCors(new Response(null, { status: 204 }), request, env);
      }

      const url = new URL(request.url);

      if (request.method === "GET" && url.pathname === "/api/health") {
        return withCors(json({
          ok: true,
          service: "techmindcentral-creator-bridge",
          version: "0.2.0",
        }), request, env);
      }

      if (request.method === "GET" && url.pathname === "/api/status") {
        return withCors(json({
          storage: "google-drive-primary",
          notifications: "telegram",
          analytics: "planned",
          publishing: "manual",
          daily_video_targets: { hindi: 1, english: 1 },
        }), request, env);
      }

      const origin = request.headers.get("Origin");
      if (origin && env.DASHBOARD_ORIGIN && origin !== env.DASHBOARD_ORIGIN) {
        return withCors(json({ error: "origin_not_allowed" }, 403), request, env);
      }

      if (!authorized(request, env)) {
        return withCors(json({ error: "unauthorized" }, 401), request, env);
      }

      if (request.method === "GET" && url.pathname === "/api/config") {
        return withCors(json({
          environment: env.ENVIRONMENT || "unknown",
          storage: "google-drive",
          notification: "telegram",
          publishing: "manual",
        }), request, env);
      }

      return withCors(json({ error: "not_found" }, 404), request, env);
    } catch (error) {
      console.error("Unhandled request error", error instanceof Error ? error.message : String(error));
      return withCors(json({ error: "internal_error" }, 500), request, env);
    }
  },
};
