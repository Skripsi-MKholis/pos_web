# Milestone Pengembangan MVP System POS

Dokumen ini merinci rencana pengembangan bertahap untuk mencapai versi **Minimum Viable Product (MVP)** dari sistem Point of Sale (POS) Web ini. Fokus utama adalah pada fungsionalitas inti: manajemen produk, proses transaksi (kasir), dan pencatatan riwayat.

## Fase 1: Fondasi & Autentikasi (Minggu 1)
Menyiapkan infrastruktur dasar dan akses pengguna.

- [x] **Setup Database (Supabase)**: Migrasi skema untuk profil, toko, produk, dan transaksi.
- [x] **Sistem Autentikasi**: Implementasi Login, Register, dan Proteksi Route.
- [x] **Manajemen Toko**: Pengguna dapat membuat toko pertama atau beralih antar toko (Store Switcher fungsional).
- [x] **Sidebar Dinamis**: Navigasi yang aktif sesuai dengan role dan status login.

## Fase 2: Manajemen Produk & Stok (Minggu 2)
Membangun inventaris produk yang akan dijual.

- [x] **Kategori Produk**: CRUD kategori untuk pengelompokan produk.
- [x] **Katalog Produk**: CRUD produk (Nama, Harga, SKU, Gambar, Stok Minimal).
- [x] **Manajemen Stok**: Update stok otomatis saat terjadi transaksi atau input manual.
- [x] **Data Table**: Implementasi pencarian, sorting, dan filter pada daftar produk.

## Fase 3: Core POS / Interface Kasir (Minggu 3)
Fitur paling kritikal untuk operasional bisnis.

- [x] **Antarmuka Kasir**: Grid produk dengan pencarian cepat dan filter kategori.
- [x] **Sistem Keranjang**: Menambah, mengurangi, dan menghapus item dari pesanan.
- [x] **Proses Checkout**: 
    - [x] Kalkulasi total, pajak, dan diskon.
    - [x] Input nominal pembayaran dan kembalian.
    - [x] Pemilihan metode pembayaran (Tunai, QRIS, Transfer).
- [x] **Struk Digital**: Ringkasan transaksi setelah pembayaran berhasil.

## Fase 4: Riwayat Transaksi & Laporan Dasar (Minggu 4)
Memastikan data terekam dengan baik dan dapat dianalisa.

- [x] **Log Transaksi**: Daftar semua transaksi yang telah selesai.
- [x] **Detail Transaksi**: Melihat detail item dalam satu nomor pesanan/struk.
- [/] **Dashboard Analytics**: 
    - [x] Widget Total Penjualan Harian.
    - [ ] Grafik tren penjualan (menggunakan Recharts).
    - [ ] Top 5 Produk Terlaris.
- [x] **Ekspor Data**: Download laporan penjualan dalam format CSV/Excel (opsional untuk MVP).

## Fase 5: Polish, Testing & Deployment (Minggu 5)
Menghaluskan UI/UX dan publikasi.

- [x] **Settings**: Update Profil Toko (Alamat, Logo, No. Telp untuk Struk).
- [x] **PWA / Mobile Responsive**: Memastikan tampilan kasir nyaman digunakan di tablet atau smartphone.
- [x] **Security Review**: Menyiapkan RLS (Row Level Security) di Supabase agar data antar toko tidak bocor.
- [/] **Deployment**: Hosting di Vercel (Menyiapkan env vars).

---

## Fase 6: Analytics Lanjut & Customer Engagement
Meningkatkan wawasan bisnis dan loyalitas pelanggan.

- [ ] **Visualisasi Data**: Menghidupkan grafik Recharts di Dashboard dengan data transaksi real.
- [ ] **Daftar Pelanggan**: CRUD pelanggan dan integrasi dengan sistem Kasir untuk pencatatan member.
- [ ] **Cetak Struk (Thermal)**: Fitur cetak struk dengan format printer thermal (58mm/80mm).
- [ ] **Manajemen Karyawan**: Menambah staf kasir ke dalam toko dengan role terbatas.

## Fase 7: Multi-Outlet & Enterprise Management
Skalasi bisnis dengan pengelolaan banyak cabang dalam satu akun.

- [ ] **Kelola Cabang**: Antarmuka khusus untuk menambah dan menonaktifkan cabang/outlet baru.
- [ ] **Laporan Konsolidasi**: Dashboard ringkasan total pendapatan dari seluruh outlet secara real-time.
- [ ] **Penugasan Staf**: Fitur untuk menentukan staf mana yang bekerja di cabang mana.
- [ ] **Transfer Stok**: (Opsional) Fitur untuk memindahkan stok produk antar cabang.

## Prioritas MVP (MoSCoW)
- **Must Have**: Login, CRUD Produk, Kasir, Riwayat Transaksi.
- **Should Have**: Dashboard Analytics, Cetak Struk, Manajemen Stok.
- **Could Have**: Manajemen Meja (F&B), Voucher/Diskon, Laporan Lanjut.
- **Won't Have (Next Version)**: Manajemen Karyawan, Reservasi, Multi-outlet (Global Inventory).

## Rencana Verifikasi
- **UAT (User Acceptance Testing)**: Melakukan simulasi transaksi dari awal (dari input produk hingga checkout).
- **Performance Test**: Memastikan interface kasir tetap responsif dengan >100 item produk.
