import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const env = (locals as any).runtime?.env;
    if (!env) {
      return new Response(JSON.stringify({ error: 'Runtime Cloudflare tidak ditemukan!' }), { status: 500 });
    }

    // 1. Ambil database D1 dan R2 bucket dari environment binding Anda
    const db = env.database_campuses || env.database_kampus;
    const bucket = env.portal_kampus_backup_bucket;

    if (!db || !bucket) {
      return new Response(JSON.stringify({ error: 'Gagal terhubung ke database atau R2 bucket!' }), { status: 500 });
    }

    // 2. Membaca kiriman paket form biner foto dari Frontend
    const dataForm = await request.formData();
    const fileFoto = dataForm.get('foto-kampus') as File;
    const deskripsi = dataForm.get('deskripsi') as string || '';

    if (!fileFoto || fileFoto.size === 0) {
      return new Response(JSON.stringify({ error: 'File foto tidak ditemukan!' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Generate nama file unik agar tidak menimpa file lama di R2
    const fileExtension = fileFoto.name.split('.').pop() || 'jpg';
    const uniqueFileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExtension}`;

    // 4. Upload file biner mentah langsung ke Cloudflare R2 bucket
    const arrayBuffer = await fileFoto.arrayBuffer();
    await bucket.put(uniqueFileName, arrayBuffer, {
      httpMetadata: { contentType: fileFoto.type }
    });

    // 5. Buat alamat URL lokal untuk mengakses foto tersebut
    const fileUrl = `/api/gallery-image?key=${uniqueFileName}`;

    // 6. Simpan string URL yang ringan ke dalam database D1 Anda
    await db.prepare(
      "INSERT INTO galeri_foto (url, deskripsi) VALUES (?, ?)"
    ).bind(fileUrl, deskripsi).run();

    return new Response(JSON.stringify({ success: true, url: fileUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
