import type { APIRoute } from 'astro';

// ⚙️ API ROUTE HANDLER FOR CRUD OPERATIONS (LOCAL/REMOTE CONNECTED)
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 🛡️ Suntikkan as any agar lolos dari sensor ketat Type Checking ts(2339)
    const body = await request.json() as any;
    const { action, id, semester, kode_mk, nama_mk, sks } = body;
    
    const db = (locals as any).runtime?.env?.DB; // Amankan binding database D1 bapak

    if (action === 'CREATE') {
      await db.prepare("INSERT INTO kurikulum_obe (semester, kode_mk, nama_mk, sks) VALUES (?, ?, ?, ?)")
        .bind(semester, kode_mk, nama_mk, Number(sks)).run();
      return new Response(JSON.stringify({ success: true, message: 'Data MK Berhasil Ditambahkan!' }));
    }

    if (action === 'UPDATE') {
      await db.prepare("UPDATE kurikulum_obe SET semester = ?, kode_mk = ?, nama_mk = ?, sks = ? WHERE id = ?")
        .bind(semester, kode_mk, nama_mk, Number(sks), id).run();
      return new Response(JSON.stringify({ success: true, message: 'Data MK Berhasil Diubah!' }));
    }

    if (action === 'DELETE') {
      await db.prepare("DELETE FROM kurikulum_obe WHERE id = ?").bind(id).run();
      return new Response(JSON.stringify({ success: true, message: 'Data MK Berhasil Dihapus!' }));
    }

    return new Response(JSON.stringify({ success: false, message: 'Aksi Tidak Dikenal' }), { status: 400 });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
};
