export const onRequestGet = async ({ env, request }) => {
  const url = new URL(request.url);
  const all = url.searchParams.get('all') === '1';
  let sql = 'SELECT * FROM articles ORDER BY date DESC';
  if (!all) sql += ' WHERE published = 1';
  const { results } = await env.DB.prepare(sql).all();
  return Response.json({
    items: results.map(r => ({ ...r, tags: JSON.parse(r.tags || '[]'), published: !!r.published }))
  });
};

export const onRequestPost = async ({ env, request }) => {
  const body = await request.json();
  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO articles (id, title, date, tags, summary, content, published)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, body.title, body.date || '', JSON.stringify(body.tags || []),
         body.summary || '', body.content || '', body.published ? 1 : 0).run();
  return Response.json({ id, ...body });
};
