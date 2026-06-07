import type { APIRoute } from 'astro';

// 1. Kita buat cetakan tipe data (Interface) agar kodingan kita aman dari typo
interface InfoKampus {
  id: number;
  judul: string;
  tanggal: string;
  tipe: 'akademik' | 'fasilitas' | 'tulisan';
}

// 2. Ini adalah fungsi backend API yang akan berjalan di server Cloudflare
export const GET: APIRoute = async () => {
  // Kita tiru data asli dari menu website STIT Ya'mal Anda tadi
  const dataPengumuman: InfoKampus[] = [
    {
      id: 1,
      judul: 'Surat Edaran Pencetakan Ijazah',
      tanggal: '29 Des 2018',
      tipe: 'akademik',
    },
    {
      id: 2,
      judul: 'Jadwal Ujian Akhir Semester (UAS) Ganjil',
      tanggal: '17 Des 2018',
      tipe: 'akademik',
    },
    {
      id: 3,
      judul: 'Modul Ruang Laboratorium Komputer Baru',
      tanggal: '05 Jun 2026',
      tipe: 'fasilitas',
    },
  ];

  // Mengembalikan respon berupa data JSON bersih agar bisa dibaca oleh Frontend
  return new Response(JSON.stringify(dataPengumuman), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Biar aman dari error CORS
    },
  });
};
