export const onRequestGet = async ({ env, request }) => {
  try {
    const url = new URL(request.url);
    const all = url.searchParams.get('all') === '1';
    let sql = 'SELECT * FROM articles';
if (!all) sql += ' WHERE published = 1';
sql += ' ORDER BY date DESC';
    
    // 检查 DB 是否存在
    if (!env.DB) throw new Error("数据库绑定丢失：请检查 Settings -> Bindings 中是否绑定了名为 DB 的数据库");
    
    const { results } = await env.DB.prepare(sql).all();
    return Response.json({
      items: results.map(r => ({ ...r, tags: JSON.parse(r.tags || '[]'), published: !!r.published }))
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestPost = async ({ env, request }) => {
  try {
    const body = await request.json();
    const id = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO articles (id, title, date, tags, summary, content, published)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, body.title, body.date || '', JSON.stringify(body.tags || []),
           body.summary || '', body.content || '', body.published ? 1 : 0).run();
    return Response.json({ id, ...body });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
