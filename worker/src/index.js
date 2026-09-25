export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/health") {
      return Response.json({
        ok: true,
        service: "techmindcentral-creator-bridge",
        version: "0.1.0"
      });
    }

    if (request.method === "GET" && url.pathname === "/api/status") {
      return Response.json({
        storage: "google-drive-primary",
        notifications: "telegram",
        analytics: "planned",
        publishing: "manual"
      });
    }

    return new Response("TechMind Central Creator Bridge", {
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }
};
