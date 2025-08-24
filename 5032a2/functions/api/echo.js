// Cloudflare Pages Function: POST /api/echo  &  GET /api/echo
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export async function onRequestPost({ request }) {
  const ct = request.headers.get('content-type') || '';
  let payload = null;

  try {
    if (ct.includes('application/json')) {
      payload = await request.json();
    } else if (ct.includes('application/x-www-form-urlencoded')) {
      const form = await request.formData();
      payload = Object.fromEntries([...form.entries()]);
    } else {
      // 纯文本等
      payload = await request.text();
    }
  } catch (e) {
    return json({ ok: false, error: 'Invalid body' }, 400);
  }

  return json({
    ok: true,
    type: 'echo',
    received: payload,
    ts: new Date().toISOString(),
  });
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  return json({
    ok: true,
    type: 'echo',
    received: params,
    ts: new Date().toISOString(),
  });
}
