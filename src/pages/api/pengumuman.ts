import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    // Menggunakan cara Astro v6 / Cloudflare Workers resmi sesuai saran error
    const db = (env as any).database_campuses || (env as any).database_kampus || (env as any).DB;

    
    if (!db) {
      return new Response(JSON.stringify({ error: "Koneksi database D1 tidak ditemukan!" }), { status: 500 });
    }

    // Ambil data langsung dari tabel pengumuman Anda
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
