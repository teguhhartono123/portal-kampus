import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = (locals as any).runtime?.env?.DB;
    if (!db) return new Response(JSON.stringify({ error: "DB missing!" }), { status: 500 });

    // Mengambil data dari tabel yang benar sesuai dashboard admin Anda
    const { results } = await db.prepare("SELECT * FROM daftar_pengumuman ORDER BY id DESC").all();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
