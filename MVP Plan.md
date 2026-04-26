# Milestone Pengembangan MVP System POS

Dokumen ini merinci rencana pengembangan bertahap untuk mencapai versi **Minimum Viable Product (MVP)** dari sistem Point of Sale (POS) Web ini. Fokus utama adalah pada fungsionalitas inti: manajemen produk, proses transaksi (kasir), dan pencatatan riwayat.

## Fase 1: Fondasi & Autentikasi (Selesai pada 2026-04-25 23:25) ✅
Menyiapkan infrastruktur dasar dan akses pengguna.

- [x] **Setup Database (Supabase)**: Migrasi skema untuk profil, toko, produk, dan transaksi.
- [x] **Sistem Autentikasi**: Implementasi Login, Register, dan Proteksi Route.
- [x] **Manajemen Toko**: Pengguna dapat membuat toko pertama atau beralih antar toko (Store Switcher fungsional).
- [x] **Sidebar Dinamis**: Navigasi yang aktif sesuai dengan role dan status login.

## Fase 2: Manajemen Produk & Stok (Selesai pada 2026-04-25 23:48) ✅
Membangun inventaris produk yang akan dijual.

- [x] **Kategori Produk**: CRUD kategori untuk pengelompokan produk.
- [x] **Katalog Produk**: CRUD produk (Nama, Harga, SKU, Gambar, Stok Minimal).
- [x] **Manajemen Stok**: Update stok otomatis saat terjadi transaksi atau input manual.
- [x] **Data Table**: Implementasi pencarian, sorting, dan filter pada daftar produk.

## Fase 3: Core POS / Interface Kasir (Selesai pada 2026-04-26 00:09) ✅
Fitur paling kritikal untuk operasional bisnis.

- [x] **Antarmuka Kasir**: Grid produk dengan pencarian cepat dan filter kategori.
- [x] **Sistem Keranjang**: Menambah, mengurangi, dan menghapus item dari pesanan.
- [x] **Proses Checkout**: 
    - [x] Kalkulasi total, pajak, dan diskon.
    - [x] Input nominal pembayaran dan kembalian.
    - [x] Pemilihan metode pembayaran (Tunai, QRIS, Transfer).
- [x] **Struk Digital**: Ringkasan transaksi setelah pembayaran berhasil.

## Fase 4: Riwayat Transaksi & Laporan Dasar (Selesai pada 2026-04-26 00:22) ✅
Memastikan data terekam dengan baik dan dapat dianalisa.

- [x] **Log Transaksi**: Daftar semua transaksi yang telah selesai.
- [x] **Detail Transaksi**: Melihat detail item dalam satu nomor pesanan/struk.
- [/] **Dashboard Analytics**: 
    - [x] Widget Total Penjualan Harian.
    - [ ] Grafik tren penjualan (menggunakan Recharts).
    - [ ] Top 5 Produk Terlaris.
- [x] **Ekspor Data**: Download laporan penjualan dalam format CSV/Excel (opsional untuk MVP).

## Fase 5: Polish, Testing & Deployment (Selesai pada 2026-04-26 00:27) ✅
Menghaluskan UI/UX dan publikasi.

- [x] **Settings**: Update Profil Toko (Alamat, Logo, No. Telp untuk Struk).
- [x] **PWA / Mobile Responsive**: Memastikan tampilan kasir nyaman digunakan di tablet atau smartphone.
- [x] **Security Review**: Menyiapkan RLS (Row Level Security) di Supabase agar data antar toko tidak bocor.
- [/] **Deployment**: Hosting di Vercel (Menyiapkan env vars).

---

## Fase 6: Analytics Lanjut & Customer Engagement (Selesai pada 2026-04-26 11:08) ✅
Meningkatkan wawasan bisnis dan loyalitas pelanggan.

- [x] **Visualisasi Data**: Menghidupkan grafik Recharts di Dashboard dengan data transaksi real.
- [x] **Daftar Pelanggan**: CRUD pelanggan dan integrasi dengan sistem Kasir untuk pencatatan member.
- [x] **Cetak Struk (Thermal)**: Fitur cetak struk dengan format printer thermal (58mm/80mm).
- [x] **Manajemen Karyawan**: Menambah staf kasir ke dalam toko dengan role terbatas.

## Fase 7: Multi-Outlet & Enterprise Management (Selesai pada 2026-04-26 11:18) ✅
Skalasi bisnis dengan pengelolaan banyak cabang dalam satu akun.

- [x] **Store Switcher**: UI untuk berpindah antar outlet/toko secara instan.
- [x] **Kelola Cabang**: Antarmuka khusus untuk menambah dan menonaktifkan cabang/outlet baru.
- [x] **Laporan Konsolidasi**: Dashboard ringkasan stok global dari seluruh outlet secara real-time.
- [x] **Enterprise Billing**: Penyesuaian skema langganan (Free vs Pro vs Enterprise).

## Fase 8: Financials & Profitability (Selesai pada 2026-04-26 11:34) ✅
Memberikan wawasan tentang keuntungan bisnis melalui pelacakan HPP (Harga Pokok Penjualan).

- [x] **HPP Tracking**: Input harga modal pada setiap produk.
- [x] **Historical COGS**: Mencatat harga modal pada setiap item transaksi untuk akurasi laporan profit masa lalu.
- [x] **Gross Profit Analysis**: Laporan laba kotor per produk dan harian.
- [x] **Profit Margin**: Visualisasi trend laba pada dashboard dan laporan baru.

## Fase 9: Multi-Tenancy & Role-Based Access Control (Selesai pada 2026-04-26 12:10) ✅
Mendukung pengelolaan banyak toko dan pembatasan hak akses karyawan.

- [x] **Intermediate Store Selection**: Halaman pilih toko setelah login untuk menentukan sesi aktif.
- [x] **Role Kasir/Karyawan**: Pembatasan UI dan akses menu (menyembunyikan inventaris & pengaturan).
- [x] **Server-side RBAC**: Proteksi route secara ketat untuk mencegah akses ilegal ke fitur Owner.
- [x] **Cross-Store Membership**: Satu akun dapat terdaftar di banyak toko dengan peran berbeda.

## Fase 10: Notification System (Selesai pada 2026-04-26 12:56) ✅
Meningkatkan kesadaran operasional melalui sistem pemberitahuan real-time.

- [x] **Notification Center**: UI ikon lonceng pada header dengan dropdown daftar notifikasi terbaru.
- [x] **Low Stock Alerts**: Notifikasi otomatis (via DB Trigger) saat stok produk mencapai ambang batas minimum.
- [x] **Stock Movement Notifications**: Pemberitahuan realtime saat stok berkurang via transaksi atau update manual.
- [x] **Real-time Sync**: Penggunaan Supabase Realtime untuk memunculkan notifikasi instan dan Toast pop-up.

## Fase 11: Omni-Channel Notifications & Admin Messaging (Selesai pada 2026-04-26 13:12) ✅
Menyatukan fitur Inbox dan Notifikasi ke dalam satu sistem komunikasi yang terintegrasi.

- [x] **Unified Inbox**: Mengintegrasikan pesan internal (Owner <-> Staf) ke dalam sistem notifikasi.
- [x] **Role-Based Targeting**: Kemampuan untuk membedakan notifikasi berdasarkan tipe (Promo, Info, Maintenance).
- [x] **System Announcements**: Support untuk pesan global (System-wide) yang tidak terbatas pada satu toko.
- [x] **Custom Visuals**: Penggunaan ikon dan skema warna yang berbeda untuk setiap jenis pesan (Tiket untuk Promo, Speaker untuk Pengumuman, dll).
- [x] **Rich Contextual Action**: Notifikasi mendukung redirect ke halaman spesifik berdasarkan metadata URL.

## Fase 12: Owner Broadcast Center (Selesai pada 2026-04-26 13:30) ✅
Memberikan kendali penuh bagi Owner untuk berkomunikasi secara efisien dengan seluruh staf toko.

- [x] **Notification Composer**: UI form premium bagi Owner untuk membuat pengumuman dengan Live Preview.
- [x] **Target Audience**: Dukungan pengiriman ke seluruh staf, peran tertentu (Kasir), atau individu spesifik.
- [x] **Broadcast Templates**: Penyediaan template siap pakai untuk Rapat, Info Stok, Promo, dan Maintenance.
- [x] **Sidebar Integration**: Menu khusus "Komunikasi" untuk akses cepat ke fitur Broadcast dan Notifikasi.

## Fase 13: Promotions, Discounts & Vouchers (Selesai pada 2026-04-26 13:57) ✅
Meningkatkan daya tarik penjualan melalui sistem promosi yang fleksibel dan terintegrasi.

- [x] **Voucher System**: Owner dapat membuat kode voucher (Persentase/Nominal) dengan batasan minimal belanja dan limit penggunaan.
- [x] **Store-wide Discounts**: Pengaturan diskon otomatis yang berlaku untuk periode tertentu di seluruh toko.
- [x] **Cashier Integration**: Input voucher real-time di layar Kasir dengan validasi otomatis terhadap total belanja.
- [x] **Transaction Tracking**: Pencatatan nilai diskon dalam setiap transaksi untuk laporan laba rugi yang akurat.
- [x] **Promotion Hub**: Dashboard khusus bagi Owner untuk memantau performa voucher dan mengelola promo aktif.

## Fase 14: Receipt Customization & Printer Management (Selesai pada 2026-04-26 19:31) ✅
Konfigurasi branding struk dan fleksibilitas perangkat keras.

- [x] **Receipt Template Builder**: UI khusus untuk mengatur konten struk (Header, Footer, Logo).
- [x] **Paper Size Settings**: Pengaturan format cetak (58mm, 80mm, atau A4).
- [x] **Print Preview & Test**: Fitur pratinjau struk secara live dan simulasi cetak.
- [x] **Branding Integration**: Penggunaan Logo Toko secara dinamis pada struk.

## Fase 15: Manajemen Meja & Open Bill (Selesai pada 2026-04-26 23:53) ✅
Transformasi POS untuk F&B dengan sistem pesanan per meja dan pembayaran tunda.

- [x] **Table Management**: CRUD daftar meja dan kapasitas.
- [x] **Visual Floor Plan**: Tampilan grid meja dengan indikator status real-time.
- [x] **Table Selection**: Alur kasir terintegrasi dengan pemilihan meja.
- [x] **Open Bill / Pay Later**: Kemampuan menyimpan pesanan ke meja (Status `Pending`) dan menambah item di kemudian waktu.
- [x] **Table Monitoring Dashboard**: Monitoring terpusat untuk melihat meja mana yang sedang aktif memesan.
- [x] **Split Bill / Partial Payment**: Fitur untuk membayar sebagian pesanan atau membagi tagihan per item dalam satu meja.
- [x] **Kitchen Order Tickets (KOT)**: Sistem cetak atau tampilan digital pesanan khusus untuk bagian dapur/bar.

## Fase 16: Reservasi & Booking Meja (Selesai pada 2026-04-27 00:55) ✅
Sistem pengelolaan antrean dan pemesanan tempat di masa mendatang.

- [x] **Reservation Management**: Dashboard untuk mencatat pesan tempat (Nama, Jam, Jumlah Orang).
- [x] **Availability Calendar**: Indikator ringkasan ketersediaan dan statistik reservasi harian.
- [x] **Automatic Reminders**: Integrasi status "Pending" untuk membantu staf memantau booking yang mendekati waktu.

## Fase 17: Table Order & Kitchen Display (KDS) (Selesai pada 2026-04-27 01:12) ✅
Manajemen pesanan yang aktif per meja dan integrasi bagian dapur.

- [x] **Order Tracking**: Tracker status pesanan di KDS (Pending, Cooking, Ready).
- [x] **Move Order**: Fitur untuk memindahkan pesanan dari satu meja ke meja lain tanpa membatalkan transaksi.

## Prioritas MVP (MoSCoW)
- **Must Have**: Login, CRUD Produk, Kasir, Riwayat Transaksi, Multi-Store Selection.
- **Should Have**: Dashboard Analytics, Cetak Struk, Manajemen Stok, Laporan Laba Kotor.
- **Could Have**: Manajemen Meja (F&B), Voucher/Diskon, Manajemen Karyawan (RBAC).
- **Won't Have (Next Version)**: Manajemen Inventaris Global (Sync Antar Cabang), Customer Loyalty Points.

## Rencana Verifikasi
- **UAT (User Acceptance Testing)**: Melakukan simulasi transaksi dari awal (dari input produk hingga checkout).
- **Performance Test**: Memastikan interface kasir tetap responsif dengan >100 item produk.
