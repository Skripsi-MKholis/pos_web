# Milestone Pengembangan MVP System POS

Dokumen ini merinci rencana pengembangan bertahap untuk mencapai versi **Minimum Viable Product (MVP)** dari sistem Point of Sale (POS) Web ini. Fokus utama adalah pada fungsionalitas inti: manajemen produk, proses transaksi (kasir), dan pencatatan riwayat.

## Fase 1: Fondasi & Autentikasi (Minggu 1)
Menyiapkan infrastruktur dasar dan akses pengguna.

- [ ] **Setup Database (Supabase)**: Migrasi skema untuk profil, toko, produk, dan transaksi.
- [ ] **Sistem Autentikasi**: Implementasi Login, Register, dan Proteksi Route.
- [ ] **Manajemen Toko**: Pengguna dapat membuat toko pertama atau beralih antar toko (Store Switcher fungsional).
- [ ] **Sidebar Dinamis**: Navigasi yang aktif sesuai dengan role dan status login.

## Fase 2: Manajemen Produk & Stok (Minggu 2)
Membangun inventaris produk yang akan dijual.

- [ ] **Kategori Produk**: CRUD kategori untuk pengelompokan produk.
- [ ] **Katalog Produk**: CRUD produk (Nama, Harga, SKU, Gambar, Stok Minimal).
- [ ] **Manajemen Stok**: Update stok otomatis saat terjadi transaksi atau input manual.
- [ ] **Data Table**: Implementasi pencarian, sorting, dan filter pada daftar produk.

## Fase 3: Core POS / Interface Kasir (Minggu 3)
Fitur paling kritikal untuk operasional bisnis.

- [ ] **Antarmuka Kasir**: Grid produk dengan pencarian cepat dan filter kategori.
- [ ] **Sistem Keranjang**: Menambah, mengurangi, dan menghapus item dari pesanan.
- [ ] **Proses Checkout**: 
    - Kalkulasi total, pajak, dan diskon.
    - Input nominal pembayaran dan kembalian.
    - Pemilihan metode pembayaran (Tunai, QRIS, Transfer).
- [ ] **Struk Digital**: Generate tampilan struk setelah transaksi berhasil.

## Fase 4: Riwayat Transaksi & Laporan Dasar (Minggu 4)
Memastikan data terekam dengan baik dan dapat dianalisa.

- [ ] **Log Transaksi**: Daftar semua transaksi yang telah selesai.
- [ ] **Detail Transaksi**: Melihat detail item dalam satu nomor pesanan/struk.
- [ ] **Dashboard Analytics**: 
    - Widget Total Penjualan Harian.
    - Grafik tren penjualan (menggunakan Recharts).
    - Top 5 Produk Terlaris.
- [ ] **Ekspor Data**: Download laporan penjualan dalam format CSV/Excel (opsional untuk MVP).

## Fase 5: Polish, Testing & Deployment (Minggu 5)
Menghaluskan UI/UX dan publikasi.

- [ ] **Settings**: Update Profil Toko (Alamat, Logo, No. Telp untuk Struk).
- [ ] **PWA / Mobile Responsive**: Memastikan tampilan kasir nyaman digunakan di tablet atau smartphone.
- [ ] **Security Review**: Menyiapkan RLS (Row Level Security) di Supabase agar data antar toko tidak bocor.
- [ ] **Deployment**: Hosting di Vercel dan menghubungkan domain.

---

## Prioritas MVP (MoSCoW)
- **Must Have**: Login, CRUD Produk, Kasir, Riwayat Transaksi.
- **Should Have**: Dashboard Analytics, Cetak Struk, Manajemen Stok.
- **Could Have**: Manajemen Meja (F&B), Voucher/Diskon, Laporan Lanjut.
- **Won't Have (Next Version)**: Manajemen Karyawan, Reservasi, Multi-outlet (Global Inventory).

## Rencana Verifikasi
- **UAT (User Acceptance Testing)**: Melakukan simulasi transaksi dari awal (dari input produk hingga checkout).
- **Performance Test**: Memastikan interface kasir tetap responsif dengan >100 item produk.
