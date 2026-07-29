import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    // 🟢 1. Ambil koneksi database Cloudflare D1 bapak dari konteks runtime locals
    const db = (locals as any).runtime?.env?.DB;
    
    if (!db) {
      return new Response(
        JSON.stringify({ error: "Koneksi database Cloudflare D1 tidak ditemukan, b0sskuu!" }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 🟢 2. Eksekusi query SQL murni menyedot seluruh isi tabel kurikulum secara simetris
    const { results } = await db.prepare("SELECT * FROM kurikulum ORDER BY semester ASC, kode_mk ASC").all();

    // 🟢 3. Semburkan data mentah JSON ke udara bebas agar bisa dilumat oleh Flutter abang!
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // 🔒 Kunci CORS agar aplikasi mobile Flutter di HP asli abang diizinkan menyedot datanya!
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "Gagal menyedot pipa data: " + error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
