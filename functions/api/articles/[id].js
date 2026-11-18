export const onRequestPut = async ({ env, params, request }) => {
  const body = await request.json();
  await env.DB.prepare(
    `UPDATE articles SET title=?, date=?, tags=?, summary=?, content=?, published=?, updated_at=datetime('now') WHERE id=?`
  ).bind(body.title, body.date, JSON.stringify(body.tags || []),
         body.summary, body.content, body.published ? 1 : 0, params.id).run();
  return Response.json({ id: params.id, ...body });
};

export const onRequestDelete = async ({ env, params }) => {
  await env.DB.prepare('DELETE FROM articles WHERE id=?').bind(params.id).run();
  return Response.json({ ok: true });
};
