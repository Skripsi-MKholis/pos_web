# Dokumentasi Fitur Sistem POS Web (Kholis POS)

Dokumen ini merangkum seluruh fitur, arsitektur data, dan spesifikasi sistem Point of Sale (POS) berbasis web yang telah diimplementasikan.

---

## 👥 Jenis Pengguna & Peran (Role)

Sistem menggunakan Role-Based Access Control (RBAC) untuk membatasi akses fitur:

### 1. Owner (Pemilik Toko)
- **Akses Penuh**: Memiliki kontrol total atas satu atau lebih toko.
- **Manajemen Inventaris**: Tambah/edit/hapus produk, kategori, dan stok.
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

### 1. Multi-Store Management
- Satu akun dapat memiliki atau bergabung ke banyak toko.
- Switcher toko yang seamless di sidebar dengan dukungan logo kustom.
- **Identitas Toko**: Setiap toko memiliki branding profesional melalui logo dan informasi alamat unik.

### 2. Pusat Inventaris & Produk
- Manajemen produk dengan dukungan SKU, Barcode, Harga Modal (HPP), dan Harga Jual.
- Sistem Kategori Produk untuk pengelompokan yang rapi.
- Indikator stok real-time (Stok Menipis/Habis).

### 3. Sistem Kasir & Manajemen Meja (Point of Sale)
- **Antarmuka Kasir**: Cepat, responsif, dan mendukung pencarian SKU/Nama.
- **Manajemen Meja (F&B)**: Visualisasi status meja (Tersedia/Terisi), estimasi waktu duduk, dan bill sementara.
- **Agregasi Pesanan**: Penggabungan otomatis beberapa transaksi pending dari meja yang sama.
- **Logika Pembayaran Fleksibel**: 
    - **Bayar Semua**: Pelunasan seluruh tagihan meja sekaligus.
    - **Split Bill**: Pembayaran terpisah berdasarkan item pilihan pelanggan.
    - **Pindah Meja**: Transfer seluruh pesanan dari satu meja ke meja lain tanpa kehilangan data.
- **Audit Finansial**: Pencatatan jumlah uang tunai diterima dan kembalian secara presisi di setiap transaksi.

### 4. Sistem Cetak Struk & Dokumen
- **Receipt Bermerek**: Struk belanja dengan logo toko, rincian item, dan detail pembayaran (Tunai/Kembalian).
- **Print Dapur**: Dokumen khusus dapur (tanpa harga) untuk alur persiapan makanan yang efisien.
- **Print Tagihan (Invoice)**: Struk sementara untuk pengecekan tagihan sebelum pembayaran dilakukan.

### 5. Sistem Notifikasi Real-time
- Notifikasi instan untuk variabel stok (Stok Menipis).
- **Omni-channel Inbox**: Menggabungkan notifikasi sistem dan pesan internal dari Owner.
- **Redirect Kontekstual**: Navigasi langsung ke halaman terkait melalui notifikasi klik.

---

## 🎨 UI/UX Design System

Sistem mengadopsi estetika **Modern Premium & Ergonomic** dengan spesifikasi berikut:

### 🌈 Palet Warna (Brand Identity)
- **Primary (Vibrant Lime)**: `oklch(0.841 0.238 128.85)`. Digunakan untuk aksi utama, status meja terisi, dan identitas brand. Memberikan kesan segar dan energi.
- **Success (Emerald)**: `oklch(0.648 0.2 131.684)`. Digunakan untuk indikator pembayaran berhasil dan nominal uang masuk.
- **Destructive (Ruby)**: `oklch(0.577 0.245 27.325)`. Digunakan untuk peringatan stok habis dan penghapusan data.
- **Muted (Sof Gray)**: Digunakan untuk teks sekunder dan latar belakang yang tidak mencolok agar mata fokus pada data penting.

### ✍️ Tipografi (Typography)
- **Heading (Space Grotesk)**: Digunakan untuk judul halaman dan nama meja. Memberikan karakter modern dan futuristik.
- **Sans/Body (Outfit)**: Digunakan untuk seluruh teks konten dan tombol. Dirancang untuk keterbacaan tinggi dengan nuansa yang ramah.
- **Data/Mono (Geist Mono)**: Digunakan untuk SKU, ID Transaksi, dan data teknis lainnya agar presisi.

### 📐 Prinsip Desain
- **Skalabilitas Sentuh**: Target sentuh (tombol) diperbesar (min `h-12`) agar nyaman digunakan pada perangkat tablet dan mobile di lingkungan operasional yang cepat.
- **Visual Hierarchy**: Penggunaan ukuran font yang kontras (dari `text-xs` hingga `text-4xl`) untuk mengarahkan pandangan kasir ke informasi paling penting (Total Tagihan).
- **Ergonomi Navigasi**: Implementasi *Internal ScrollArea* pada setiap dialog panjang agar tombol konfirmasi tetap "terkunci" di bagian bawah layar.
- **Border Radius**: Penggunaan sudut membulat yang lebar (hingga `2.5rem` pada modal) untuk memberikan kesan software yang modern dan "soft".

---

## 📊 Model Data (Schema Supabase)

### Inti Bisnis & Inventaris
- **`stores`**: Metadata utama toko (Nama, Alamat, Logo URL).
- **`store_members`**: Relasi user-toko beserta hak akses (Owner/Staff).
- **`products`**: Katalog barang (Harga Jual, HPP, Stok, SKU).
- **`categories`**: Klasifikasi produk.

### Manajemen Meja
- **`tables`**: Daftar meja fisik, kapasitas, dan status real-time (Available/Occupied).

### Transaksi & Audit
- **`transactions`**: Log transaksi utama (Total, Metode Bayar, Diskon, `cash_paid`, `change_amount`).
- **`transaction_items`**: Detail snapshot produk saat transaksi terjadi.
- **`vouchers` & `discounts`**: Manajemen promosi yang terintegrasi.
