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
- **Laporan Finansial**: Melihat laporan laba rugi dan analytics penjualan secara mendalam.

### 2. Karyawan (Staff/Kasir)
- **Operasional Kasir**: Melakukan transaksi penjualan, input voucher, dan cetak struk.
- **Manajemen Produk terbatas**: Melihat daftar produk dan stok.
- **Komunikasi**: Menerima pengumuman real-time dari Owner.
- **Laporan terbatas**: Melihat riwayat transaksi yang dilakukan.

---

## 🚀 Fitur Utama

### 1. Multi-Store Management
- Satu akun dapat memiliki atau bergabung ke banyak toko.
- Switcher toko yang seamless di sidebar.
- Alur setup awal untuk pengguna baru yang belum memiliki toko.

### 2. Pusat Inventaris & Produk
- Manajemen produk dengan dukungan SKU, Barcode, Harga Modal (HPP), dan Harga Jual.
- Sistem Kategori Produk untuk pengelompokan yang rapi.
- Indikator stok real-time (Stok Menipis/Habis).

### 3. Sistem Kasir (Point of Sale)
- Antarmuka yang responsif (Mobile & Desktop).
- Pencarian produk cepat berdasarkan nama atau SKU.
- Filter kategori yang interaktif.
- Mendukung berbagai metode pembayaran (Tunai, QRIS, Transfer, Kartu).
- Kalkulasi kembalian otomatis.
- **Cetak Struk**: Layout struk belanja yang profesional dan siap cetak.

### 4. Sistem Notifikasi Real-time
- Notifikasi instan untuk variabel stok (Stok Menipis).
- **Omni-channel Inbox**: Menggabungkan notifikasi sistem dan pesan internal.
- **Redirct Kontekstual**: Klik notifikasi untuk langsung menuju halaman terkait (misal: klik stok menipis masuk ke halaman produk).

### 5. Owner Broadcast Center
- Fitur khusus Owner untuk mengirim pengumuman real-time.
- **Preview Live**: Melihat tampilan pesan sebelum dikirim.
- **Targeting**: Kirim ke semua staf, jabatan tertentu, atau individu spesifik.
- **Template**: Menyediakan template untuk Rapat, Info Stok, Promo, dll.

### 6. Promosi & Voucher
- **Voucher Belanja**: Pembuatan kode unik dengan syarat minimal belanja dan kuota penggunaan.
- **Diskon Toko**: Potongan harga (Persentase/Nominal) yang berlaku otomatis dalam periode tertentu.
- **Validasi POS**: Pengecekan kode voucher secara real-time saat transaksi.

---

## 📊 Model Data (Schema Supabase)

### Inti Bisnis
- **`stores`**: Menyimpan informasi utama toko (Nama, Alamat, Owner ID).
- **`store_members`**: Tabel penghubung antara user dan toko beserta role mereka.
- **`products`**: Data barang dagangan (Harga, Stok, SKU, HPP).
- **`categories`**: Pengelompokan produk.

### Transaksi
- **`transactions`**: Header transaksi (Total, Metode Bayar, Diskon, Voucher Info).
- **`transaction_items`**: Detail item yang dibeli dalam satu transaksi (snapshot harga saat transaksi).
- **`customers`**: Database pelanggan (opsional).

### Komunikasi & Promo
- **`notifications`**: Metadata pesan, status baca, dan link navigasi.
- **`discounts`**: Definisi diskon toko yang sedang berjalan.
- **`vouchers`**: Kode promo beserta limitasi dan statistik penggunaan.

### Profil & Keamanan
- **`profiles`**: Metadata tambahan user (Nama Lengkap, Avatar) yang terhubung ke `auth.users`.

---

## 🛠️ Teknologi yang Digunakan
- **Framework**: Next.js 14+ (App Router).
- **Database & Auth**: Supabase (PostgreSQL, RLS, Realtime).
- **UI Components**: shadcn/ui & Tailwind CSS.
- **Icons**: Tabler Icons (@tabler/icons-react).
- **Animations**: Framer Motion.
- **Notifications UI**: Sonner (Toasts).
