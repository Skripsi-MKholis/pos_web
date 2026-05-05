# Dokumentasi Fitur Sistem POS Web (Parzello POS)

Dokumen ini merangkum seluruh fitur, arsitektur data, dan spesifikasi sistem Point of Sale (POS) berbasis web yang telah diimplementasikan.

---

## 👥 Jenis Pengguna & Peran (Role)

Sistem menggunakan Role-Based Access Control (RBAC) untuk membatasi akses fitur:

### 1. Owner (Pemilik Toko)
- **Akses Penuh**: Memiliki kontrol total atas satu atau lebih toko.
- **Manajemen Inventaris**: Tambah/edit/hapus produk, kategori, dan stok.
- **Konfigurasi Modular**: Mengaktifkan/nonaktifkan fitur (Meja, KDS, Reservasi) sesuai model bisnis.
- **Manajemen Staf**: Mengelola tim melalui undangan email atau **Unique Invite Code**.
- **Persetujuan Bergabung**: Meninjau permintaan bergabung dari staf (Accept/Decline).
- **Pusat Komunikasi**: Mengirim broadcast/pengumuman ke seluruh staf.
- **Promosi**: Membuat dan mengelola voucher belanja serta diskon toko.
- **Laporan Finansial**: Melihat laporan laba rugi, analytics penjualan, dan audit kasir secara mendalam.

### 3. Super Admin (System Administrator)
- **Otoritas Global**: Memiliki akses ke seluruh data toko, pengguna, dan transaksi di sistem.
- **Manajemen Toko (Governance)**: Menangguhkan (Suspend) atau mengaktifkan kembali toko berdasarkan kepatuhan atau status pembayaran.
- **Manajemen Paket Langganan**: Mengatur detail harga, fitur, dan limitasi pada setiap tingkatan paket (Lite, UMKM, Bisnis).
- **Konfigurasi Sistem**: Mengirim pengumuman sistem (Announcements) dan mengelola konfigurasi aplikasi (`app_configs`).
- **Manajemen Pengguna**: Mengelola hak akses admin bagi pengguna lain dan memantau aktivitas akun secara global.
- **Analytics Agregat**: Melihat performa seluruh platform melalui dashboard analytics terpusat.

---

## 🚀 Fitur Utama

### 1. Modular Store Setup & Onboarding (NEW)
- **Guided Setup Flow**: Alur pendaftaran toko baru yang terpisah (`/setup`) untuk pengalaman yang lebih fokus dan modular.
- **Business Model Presets**: Konfigurasi otomatis dalam satu klik saat pembuatan toko:
    - **F&B Restoran**: Otomatis mengaktifkan Meja, KDS, Reservasi, dan Pajak.
    - **Retail & Toko**: Antarmuka ringkas tanpa Meja/KDS, fokus pada kecepatan stok.
    - **Kedai Kopi**: Fokus pada antrean dan display dapur (KDS).
- **Feature Toggles**: Kontrol penuh pasca-pembuatan melalui halaman Modul untuk mengaktifkan/matikan fitur spesifik (Dine-in, KDS, Reservasi, Promosi, dll).

### 2. Multi-Store & Invitation Ecosystem (UPDATED)
- **Select Store Page**: Antarmuka pusat untuk memilih outlet aktif atau melihat **Undangan Masuk**.
- **Invitation System**: 
    - **Email Invitations**: Undang staf langsung ke alamat email mereka.
    - **Invite Code Fast-track**: Setiap toko memiliki **Unique 8-digit Code** untuk pendaftaran staf yang lebih cepat tanpa input email manual.
    - **Membership Status**: Mendukung status `Pending` dan `Active` untuk keamanan akses data toko.
- **Store Switcher**: Navigasi antar-toko yang cepat dari sidebar dengan tautan langsung ke manajemen semua toko.

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

### 6. Financial, Tax, & Billing Engine
- **Otomatisasi Pajak**: Konfigurasi pajak (PPN/VAT) yang dapat diaktifkan per toko.
- **Service Charge**: Penambahan biaya layanan otomatis untuk operasional hospitality.
- **Affordable Subscription Plans**: Struktur harga yang kompetitif bagi UMKM (Lite, UMKM Hebat 49rb/bln, Bisnis Skalabel).
- **Development Phase Transparency**: Informasi status pengembangan fitur untuk mengelola ekspektasi pengguna.

### 7. Sistem Cetak Struk & Dokumen
- **Receipt Bermerek**: Struk belanja dengan logo toko, rincian item, dan detail pembayaran.
- **Print Dapur (KOT)**: Dokumen khusus dapur (tanpa harga) untuk alur persiapan makanan.
- **Print Tagihan (Invoice)**: Struk sementara untuk pengecekan sebelum pembayaran.

### 8. Super Admin Governance & Monitoring (NEW)
- **Store Inspector**: Detail mendalam untuk setiap toko, mencakup daftar produk, riwayat transaksi, dan metrik performa tanpa perlu masuk sebagai owner.
- **Quick Action Dashboard**: Panel kontrol cepat untuk tindakan administratif (Hubungi Owner, Kelola Billing, Toggle Status Toko).
- **Announcement System**: Pengiriman pesan informasi atau peringatan ke seluruh pengguna platform secara real-time.

### 8. Kitchen Display System (KDS) & Operational Flow
- **Real-time Order Monitoring**: Antarmuka khusus dapur untuk melihat pesanan yang masuk secara instan tanpa perlu kertas fisik.
- **Status Tracking**: Menandai pesanan sebagai `Processing` atau `Ready` untuk sinkronisasi dengan kasir.
- **Efisiensi Produksi**: Mengurangi miskomunikasi antara pramusaji dan staf dapur.

### 9. Reservation & Customer Management (CRM)
- **Manajemen Reservasi**: Pencatatan booking meja dengan informasi waktu, jumlah tamu, dan catatan khusus.
- **Database Pelanggan**: Menyimpan riwayat kunjungan, total belanja, dan informasi kontak pelanggan untuk loyalitas.
- **Insights Pelanggan**: Identifikasi pelanggan setia (Top Customers) berdasarkan frekuensi transaksi.

### 10. Broadcast & Internal Communication
- **Store-wide Broadcast**: Owner dapat mengirimkan pengumuman penting (misal: menu baru, perubahan shift) yang muncul langsung di dashboard seluruh staf.
- **Notification Hub**: Pusat notifikasi real-time untuk aktivitas penting dalam toko.

### 11. Performa & UX Optimasi
- **Skeleton Loading**: Animasi pemuatan state yang halus untuk menghilangkan kesan lambat saat navigasi.
- **Database Indexing**: Penggunaan indeks GIN dan B-Tree pada kolom kritikal untuk menjamin performa query kilat meskipun data berjumlah besar.

### 9. Account Security & Identity (NEW)
- **Unified Profile Management**: Pengelolaan informasi pribadi dan keamanan dalam satu antarmuka yang modern.
- **Identity Linking**: Kemampuan menautkan beberapa provider (Google & Email) ke satu akun yang sama.
- **Credential Management**:
    - Pengaturan kata sandi untuk pengguna OAuth (Google) agar mendukung login manual.
    - Pembaruan kata sandi berkala bagi pengguna email.
- **Active Session Tracking**: Monitoring sesi aktif untuk keamanan akun dan deteksi akses tak dikenal.

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

### 🛡️ Keamanan & Privasi
- **RBAC (Role-Based Access Control)**: Validasi izin akses di tingkat Server (Middleware & RLS) dan Client.
- **Super Admin Protection**: Proteksi khusus pada fungsi administratif yang hanya bisa diakses oleh akun dengan flag `is_admin: true`.

---

## 📊 Model Data (Schema Supabase)

### Inti Bisnis & Inventaris
- **`store_members`**: Relasi user-toko dengan kolom `status` (pending/active) dan `role` (Owner/Staff).
- **`stores`**: Metadata toko termasuk `invite_code` unik dan kolom `settings` (JSONB) untuk kontrol fitur modular.
- **`products`**: Katalog barang (Harga Jual, HPP, Stok, SKU).
- **`categories`**: Klasifikasi produk.

### Manajemen Operasional
- **`tables`**: Daftar meja fisik, kapasitas, dan status real-time.
- **`reservations`**: Pencatatan reservasi pelanggan (Bila diaktifkan).
- **`kds_orders`**: Status persiapan pesanan di area dapur.

### Transaksi & Audit
- **`transactions`**: Log transaksi utama (Total, Metode Bayar, `cash_paid`, `change_amount`).
- **`transaction_items`**: Detail snapshot produk saat transaksi.
- **`vouchers` & `discounts`**: Manajemen promosi terintegrasi.

### CRM & Komunikasi
- **`customers`**: Database profil pelanggan dan metrik loyalitas.
- **`broadcasts`**: Pesan pengumuman internal toko dari owner ke staf.
- **`notifications`**: Log pemberitahuan real-time untuk aktivitas sistem.

### Infrastruktur & Konfigurasi Sistem
- **`subscription_plans`**: Definisi paket layanan, harga, dan fitur yang tersedia bagi owner.
- **`app_configs`**: Penyimpanan terpusat untuk pengumuman sistem dan pengaturan global aplikasi.
- **`users`**: Data profil dasar dengan kolom `is_admin` untuk identifikasi Super Admin.
