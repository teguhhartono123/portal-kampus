import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers' // 1. Tambah baris impor resmi ini


export const GET: APIRoute = async ({ request }) => {  // 2. Hapus 'locals' karena tidak dipakai lagi
  try {
     // 3. Ganti cara panggil database menggunakan variabel env langsung
    const db = (env as any).database_campuses || (env as any).database_kampus;

    if (!db) {
      return new Response(JSON.stringify({ success: false, error: 'Database binding tidak ditemukan!' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Ambil parameter pencarian opsional (?search=...) dari Flutter jika ada
    const url = new URL(request.url);
    const kataKunci = url.searchParams.get('search');

    let hasilQuery;
    if (kataKunci) {
      // Fitur pencarian judul atau penulis jurnal secara dinamis
      hasilQuery = await db.prepare(
        "SELECT * FROM daftar_jurnal WHERE judul LIKE ? OR penulis LIKE ? ORDER BY id DESC"
      ).bind(`%${kataKunci}%`, `%${kataKunci}%`).all();
    } else {
      // Ambil semua data jurnal default
      hasilQuery = await db.prepare("SELECT * FROM daftar_jurnal ORDER BY id DESC").all();
    }

    const daftarJurnal = hasilQuery.results || [];

    return new Response(JSON.stringify({ success: true, data: daftarJurnal }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Mencegah blokir CORS di mobile/web emulator
        'Cache-Control': 'public, max-age=60' // Cache tipis di Edge Network Cloudflare
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};
