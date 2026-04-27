# Dokumentasi Fitur Sistem POS Web (Parzello POS)

Dokumen ini merangkum seluruh fitur, arsitektur data, dan spesifikasi sistem Point of Sale (POS) berbasis web yang telah diimplementasikan.

---

## 👥 Jenis Pengguna & Peran (Role)

Sistem menggunakan Role-Based Access Control (RBAC) untuk membatasi akses fitur:

### 1. Owner (Pemilik Toko)
- **Akses Penuh**: Memiliki kontrol total atas satu atau lebih toko.
- **Manajemen Inventaris**: Tambah/edit/hapus produk, kategori, dan stok.
- **Konfigurasi Modular**: Mengaktifkan/nonaktifkan fitur (Meja, KDS, Reservasi) sesuai model bisnis.
- **Manajemen Staf**: Menambah karyawan ke toko melalui email.
- **Pusat Komunikasi**: Mengirim broadcast/pengumuman ke seluruh staf.
- **Promosi**: Membuat dan mengelola voucher belanja serta diskon toko.
- **Laporan Finansial**: Melihat laporan laba rugi, analytics penjualan, dan audit kasir secara mendalam.

### 2. Karyawan (Staff/Kasir)
- **Operasional Kasir**: Melakukan transaksi penjualan, input voucher, dan cetak struk.
- **Manajemen Meja**: Mengelola pesanan pelanggan di tempat (Dine-in).
- **Manajemen Produk terbatas**: Melihat daftar produk dan stok.
- **Komunikasi**: Menerima pengumuman real-time dari Owner.
- **Laporan terbatas**: Melihat riwayat transaksi yang dilakukan.

---

## 🚀 Fitur Utama

### 1. Modular Store Personalization (NEW)
- **Feature Toggles**: Kemampuan untuk menyesuaikan antarmuka berdasarkan kebutuhan bisnis:
    - Aktifkan/Matikan Sistem Meja (Dine-in).
    - Aktifkan/Matikan Kitchen Display (KDS).
    - Aktifkan/Matikan Sistem Reservasi.
- **Business Model Presets**: Konfigurasi otomatis dalam satu klik untuk model bisnis:
    - **F&B Restoran**: Menampilkan Meja, KDS, dan Pajak.
    - **Retail & Toko**: Antarmuka ringkas tanpa Meja/KDS, fokus pada kecepatan scan.
    - **Kedai Kopi**: Fokus pada antrean dan KDS.

### 2. Multi-Store Management
- Satu akun dapat memiliki atau bergabung ke banyak toko.
- Switcher toko yang seamless di sidebar dengan dukungan logo kustom.
- **Identitas Toko**: Setiap toko memiliki branding profesional melalui logo dan informasi alamat unik.

### 3. Pintasan Akses Cepat (Dashboard)
- **Konfigurasi & Akses Cepat**: Tombol pintasan di baris teratas Dashboard untuk alur kerja prioritas:
    - Link langsung ke Pengaturan Modul.
    - Akses cepat ke Kasir.
    - Akses cepat ke Manajemen Meja & Stok Produk.

### 4. Pusat Inventaris & Produk
- Manajemen produk dengan dukungan SKU, Barcode, Harga Modal (HPP), dan Harga Jual.
- Sistem Kategori Produk untuk pengelompokan yang rapi.
- Indikator stok real-time (Stok Menipis/Habis).
- **Fuzzy Search**: Pencarian produk cerdas yang toleran terhadap kesalahan ketik.

### 5. Sistem Kasir & Manajemen Meja (Point of Sale)
- **Antarmuka Kasir**: Cepat, responsif, dan mendukung pencarian SKU/Nama.
- **Manajemen Meja (F&B)**: Visualisasi status meja (Tersedia/Terisi), estimasi waktu duduk, dan bill sementara.
- **Agregasi Pesanan**: Penggabungan otomatis beberapa transaksi pending dari meja yang sama.
- **Logika Pembayaran Fleksibel**: 
    - **Bayar Semua**: Pelunasan seluruh tagihan meja sekaligus.
    - **Split Bill**: Pembayaran terpisah berdasarkan item pilihan pelanggan.
    - **Pindah Meja**: Transfer seluruh pesanan dari satu meja ke meja lain.
- **Audit Finansial**: Pencatatan jumlah uang tunai diterima dan kembalian secara presisi.

### 6. Financial & Tax Engine
- **Otomatisasi Pajak**: Konfigurasi pajak (PPN/VAT) yang dapat diaktifkan per toko.
- **Service Charge**: Penambahan biaya layanan otomatis untuk operasional hospitality.

### 7. Sistem Cetak Struk & Dokumen
- **Receipt Bermerek**: Struk belanja dengan logo toko, rincian item, dan detail pembayaran.
- **Print Dapur (KOT)**: Dokumen khusus dapur (tanpa harga) untuk alur persiapan makanan.
- **Print Tagihan (Invoice)**: Struk sementara untuk pengecekan sebelum pembayaran.

### 8. Performa & UX Optimasi
- **Skeleton Loading**: Animasi pemuatan state yang halus untuk menghilangkan kesan lambat saat navigasi.
- **Database Indexing**: Penggunaan indeks GIN dan B-Tree pada kolom kritikal untuk menjamin performa query kilat meskipun data berjumlah besar.

---

## 🎨 UI/UX Design System

Sistem mengadopsi estetika **Modern Premium & Ergonomic**:

### 🌈 Palet Warna (Brand Identity)
- **Primary (Vibrant Lime)**: `oklch(0.841 0.238 128.85)`. Digunakan untuk aksi utama, item aktif di sidebar, dan status meja terisi.
- **Success (Emerald)**: `oklch(0.648 0.2 131.684)`. Digunakan untuk indikator pembayaran berhasil dan status meja tersedia.
- **Destructive (Ruby)**: `oklch(0.577 0.245 27.325)`. Digunakan untuk peringatan stok habis dan penghapusan data.

### ✍️ Tipografi (Typography)
- **Heading (Space Grotesk)**: Karakter modern dan futuristik.
- **Sans/Body (Outfit)**: Keterbacaan tinggi dengan nuansa yang ramah.
- **Data/Mono (Geist Mono)**: Digunakan untuk SKU, ID Transaksi, dan data teknis.

---

## 📊 Model Data (Schema Supabase)

### Inti Bisnis & Inventaris
- **`stores`**: Metadata toko dan kolom `settings` (JSONB) untuk kontrol fitur modular.
- **`store_members`**: Relasi user-toko beserta hak akses (Owner/Staff).
- **`products`**: Katalog barang (Harga Jual, HPP, Stok, SKU).
- **`categories`**: Klasifikasi produk.

### Manajemen Operasional
- **`tables`**: Daftar meja fisik, kapasitas, dan status real-time.
- **`reservations`**: Pencatatan reservasi pelanggan (Bila diaktifkan).

### Transaksi & Audit
- **`transactions`**: Log transaksi utama (Total, Metode Bayar, `cash_paid`, `change_amount`).
- **`transaction_items`**: Detail snapshot produk saat transaksi.
- **`vouchers` & `discounts`**: Manajemen promosi terintegrasi.
