import type { APIRoute } from 'astro';
// 1. CARA TERBARU ASTRO v6: Ambil runtime environment Cloudflare secara resmi
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  try {
    // 2. Membaca kiriman paket form biner foto dari Frontend
    const dataForm = await request.formData();
    const fileFoto = dataForm.get('foto-kampus') as File;

    if (!fileFoto || fileFoto.size === 0) {
      return new Response(JSON.stringify({ error: "File foto tidak ditemukan!" }), { status: 400 });
    }

    // 3. KONEKSI DATABASE D1: Ambil tangki database Anda
    const db = (env as any).database_campuses || (env as any).database_kampus;


    if (!db) {
      throw new Error("Gagal terhubung ke database_kampus! Periksa kembali file konfigurasi wrangler Anda.");
    }

    // Buat deskripsi otomatis berdasarkan nama file yang Anda pilih di komputer Mac
    const deskripsiOtomatis = `Foto: ${fileFoto.name.replace(/\.[^/.]+$/, "")}`;
    
    // Untuk simulasi link gambar, kita kosongkan saja karena kita menggunakan placeholder kamera 📷 indigo di frontend
    const linkGambarSimulasi = ""; 

    // 4. EKSEKUSI QUERY SQL INSERT: Suntik data baru ke dalam tabel database D1 lokal Anda secara asinkron!
    await db.prepare(
      "INSERT INTO galeri_foto (url, deskripsi) VALUES (?, ?)"
    )
    .bind(linkGambarSimulasi, deskripsiOtomatis)
    .run();

    // 5. Mengembalikan laporan sukses biner ke Frontend
    return new Response(JSON.stringify({
      pesan: "Sukses! Catatan arsip foto kampus Anda telah resmi disimpan permanen ke dalam Cloudflare D1 Database.",
      namaFile: fileFoto.name,
      ukuran: `${(fileFoto.size / 1024 / 1024).toFixed(2)} MB`
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
