DROP TABLE IF EXISTS galeri_foto;
CREATE TABLE galeri_foto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    tanggal_upload TEXT DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS daftar_pengumuman;
CREATE TABLE daftar_pengumuman (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    judul TEXT NOT NULL,
    tanggal TEXT NOT NULL,
    tipe TEXT NOT NULL
);

DROP TABLE IF EXISTS daftar_unduhan;
CREATE TABLE daftar_unduhan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    kategori TEXT NOT NULL,
    format TEXT NOT NULL,
    ukuran TEXT NOT NULL,
    download_url TEXT NOT NULL
);

-- 🚀 INI DIA TABEL YANG TADI KETINGGALAN BANG!
DROP TABLE IF EXISTS daftar_jurnal;
CREATE TABLE daftar_jurnal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    judul TEXT NOT NULL,
    penulis TEXT NOT NULL,
    vol TEXT NOT NULL,
    status TEXT NOT NULL,
    pdf_url TEXT NOT NULL
);

-- Isi Data Sampel Awal Otomatis
INSERT INTO galeri_foto (url, deskripsi) VALUES 
('https://picsum.photos', 'Kegiatan Rapat Akademik Dosen STIT YA''MAL'),
('https://picsum.photos', 'Suasana Ruang Laboratorium Komputer');

INSERT INTO daftar_pengumuman (judul, tanggal, tipe) VALUES 
('Pendaftaran Mahasiswa Baru STIT YA''MAL 2026/2027 Resmi Dibuka!', '05 Juni 2026', 'Akademik'),
('Jadwal Pelaksanaan Sidang Skripsi Gelombang II', '01 Juni 2026', 'Pengumuman');

INSERT INTO daftar_unduhan (nama, kategori, format, ukuran, download_url) VALUES 
('Kalender Akademik Semester Ganjil 2026/2027', 'Akademik', 'PDF', '1.2 MB', '#'),
('Formulir Pengajuan Judul Skripsi Mahasiswa S1', 'Skripsi', 'DOCX', '245 KB', '#');

-- Isi Data Sampel Jurnal Biar Langsung Muncul di Web
INSERT INTO daftar_jurnal (judul, penulis, vol, status, pdf_url) VALUES 
('Implementasi Manajemen Kurikulum Berbasis Nilai Islam di Era Digital', 'Dr. Ahmad Fauzi, M.Pd.', 'Vol. 5 No. 1 (2025)', 'Sinta 4', '#');
