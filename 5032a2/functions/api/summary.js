// Cloudflare Pages Function: POST /api/summary
// 接收: { numbers: number[] }，返回统计
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export async function onRequestPost({ request }) {
  try {
    const body = await request.json();
    const arr = Array.isArray(body?.numbers)
      ? body.numbers.map(n => parseFloat(n)).filter(n => !Number.isNaN(n))
      : [];

    if (arr.length === 0) {
      return json({
        ok: false,
        error: 'Body must contain { numbers: number[] } with at least one valid number'
      }, 400);
    }

    if (!arr || arr.length === 0 || arr.some(n => Number.isNaN(n))) {
      return json({ ok: false, error: 'Body must be { numbers: number[] }' }, 400);
    }

    const count = arr.length;
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const sum = arr.reduce((a, b) => a + b, 0);
    const avg = sum / count;

    return json({
      ok: true,
      type: 'summary',
      count, min, max, avg,
      ts: new Date().toISOString(),
    });
  } catch (e) {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }
}
