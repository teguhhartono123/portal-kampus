import type { APIRoute } from 'astro';
// 1. CARA TERBARU ASTRO v6: Ambil runtime environment Cloudflare secara resmi
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  try {
    // 2. Membaca kiriman paket form biner foto dari Frontend
    const dataForm = await request.formData();
    const fileFoto = dataForm.get('foto-kampus') as File;

    if (!fileFoto || fileFoto.size === 0) {
      return new Response(JSON.stringify({ error: 'File foto tidak ditemukan!' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. KONEKSI DATABASE D1: Ambil tangki database Anda
    const db = (env as any).database_campuses || (env as any).database_kampus;

    if (!db) {
      throw new Error(
        'Gagal terhubung ke database_kampus! Periksa kembali file konfigurasi wrangler Anda.'
      );
    }

      // Mengonversi file foto menjadi base64 Data URL menggunakan standard web APIs yang didukung penuh oleh Cloudflare Workers
    const arrayBuffer = await fileFoto.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let biner = '';
    for (let i = 0; i < bytes.length; i++) {
      biner += String.fromCharCode(bytes[i]);
    }
    const base64Image = `data:${fileFoto.type};base64,${btoa(biner)}`;

    // Clean description handling: Replace dash/underscore characters with empty spaces
    const deskripsiOtomatis = fileFoto.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ');

    // 4. EKSEKUSI QUERY SQL INSERT: Inject the real image data URL and clean description strings
    await db
      .prepare('INSERT INTO galeri_foto (url, deskripsi) VALUES (?, ?)')
      .bind(base64Image, deskripsiOtomatis)
      .run();

    // 5. Mengembalikan laporan sukses biner ke Frontend
    return new Response(
      JSON.stringify({
        pesan: 'Sukses! Catatan arsip foto kampus Anda telah resmi disimpan permanen ke dalam Cloudflare D1 Database.',
        namaFile: fileFoto.name,
        ukuran: `${(fileFoto.size / 1024 / 1024).toFixed(2)} MB`,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
