const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

const META_API_BASE = "https://api.meta.ai/v1";

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

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function callMetaChat(env, payload) {
  if (!env.META_MODEL_API_KEY) {
    throw new Error("meta_model_api_key_not_configured");
  }

  const body = {
    model: payload.model || env.META_MODEL_NAME || "muse-spark-1.3",
    messages: payload.messages,
  };

  if (payload.temperature !== undefined) body.temperature = payload.temperature;
  if (payload.max_tokens !== undefined) body.max_tokens = payload.max_tokens;
  if (payload.reasoning_effort !== undefined) body.reasoning_effort = payload.reasoning_effort;
  if (payload.tools !== undefined) body.tools = payload.tools;
  if (payload.response_format !== undefined) body.response_format = payload.response_format;

  let lastStatus = 500;
  let lastBody = "";

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(`${META_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.META_MODEL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return await response.json();
    }

    lastStatus = response.status;
    lastBody = await response.text();

    if (response.status !== 429 && response.status < 500) break;

    const retryAfter = Number(response.headers.get("retry-after"));
    const delay = Number.isFinite(retryAfter) && retryAfter > 0
      ? Math.min(retryAfter * 1000, 4000)
      : 500 * (2 ** attempt);

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  let providerError = "meta_api_request_failed";
  try {
    const parsed = JSON.parse(lastBody);
    providerError = parsed?.error?.message || parsed?.message || providerError;
  } catch {
    // Keep provider details out of logs, but return a useful non-secret error.
  }

  const error = new Error(providerError);
  error.status = lastStatus;
  throw error;
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
          version: "0.3.0",
        }), request, env);
      }

      if (request.method === "GET" && url.pathname === "/api/status") {
        return withCors(json({
          storage: "google-drive-primary",
          notifications: "telegram",
          analytics: "planned",
          publishing: "manual",
          ai: {
            provider: "meta-model-api",
            model: env.META_MODEL_NAME || "muse-spark-1.3",
            configured: Boolean(env.META_MODEL_API_KEY),
          },
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
          meta_model_api: {
            base_url: META_API_BASE,
            model: env.META_MODEL_NAME || "muse-spark-1.3",
            configured: Boolean(env.META_MODEL_API_KEY),
          },
        }), request, env);
      }

      if (request.method === "POST" && url.pathname === "/api/muse/chat") {
        const payload = await readJson(request);

        if (!payload || !Array.isArray(payload.messages) || payload.messages.length === 0) {
          return withCors(json({
            error: "invalid_request",
            message: "messages must be a non-empty array",
          }, 400), request, env);
        }

        if (payload.messages.length > 40) {
          return withCors(json({
            error: "invalid_request",
            message: "too_many_messages",
          }, 400), request, env);
        }

        const result = await callMetaChat(env, payload);

        return withCors(json({
          ok: true,
          provider: "meta-model-api",
          model: result.model || payload.model || env.META_MODEL_NAME || "muse-spark-1.3",
          response: result,
        }), request, env);
      }

      return withCors(json({ error: "not_found" }, 404), request, env);
    } catch (error) {
      console.error(
        "Unhandled request error",
        error instanceof Error ? error.message : String(error),
      );

      const status = error?.status >= 400 && error?.status < 600 ? error.status : 500;
      const message = status >= 500
        ? "provider_or_internal_error"
        : (error instanceof Error ? error.message : "request_failed");

      return withCors(json({ error: message }, status), request, env);
    }
  },
};
