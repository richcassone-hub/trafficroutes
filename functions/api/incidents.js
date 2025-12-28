// functions/api/incidents.js
export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const dispatchId = (url.searchParams.get("dispatchId") || "").toUpperCase();

  const allowed = new Set(["LACC", "BCCC", "VTCC", "OCCC"]);
  if (!allowed.has(dispatchId)) {
    return new Response("Invalid dispatchId", { status: 400 });
  }

  const upstream = `https://m.chp.ca.gov/incident.aspx?DispatchId=${encodeURIComponent(dispatchId)}`;

  const resp = await fetch(upstream, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://m.chp.ca.gov/"
    }
  });

  if (!resp.ok) return new Response(`Upstream HTTP ${resp.status}`, { status: 502 });

  const html = await resp.text();

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
