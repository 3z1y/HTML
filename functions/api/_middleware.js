export const onRequest = async (context) => {
  const { request, env } = context;
  const method = request.method;
  const url = new URL(request.url);
  const needAuth = (method !== 'GET') || url.searchParams.get('all') === '1';
  if (needAuth) {
    const auth = request.headers.get('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: '未授权' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  return context.next();
};
