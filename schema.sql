DROP TABLE IF EXISTS galeri_foto;
CREATE TABLE galeri_foto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    tanggal_upload TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Kita suntikkan 3 data contoh awal ke dalam tabel database
INSERT INTO galeri_foto (url, deskripsi) VALUES ('https://picsum.photos', 'Kegiatan Rapat Akademik Dosen STIT');
INSERT INTO galeri_foto (url, deskripsi) VALUES ('https://picsum.photos', 'Suasana Ruang Laboratorium Komputer Kampus');
INSERT INTO galeri_foto (url, deskripsi) VALUES ('https://picsum.photos', 'Kunjungan Studi Banding Akademik Utama');
