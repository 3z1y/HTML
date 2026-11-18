export const onRequestPost = async ({ env, request }) => {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: '未授权' }), { status: 401 });
  }
  return Response.json({ ok: true });
};
