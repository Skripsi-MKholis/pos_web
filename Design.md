# 🎨 Panduan Desain Parzello POS

Dokumen ini mendefinisikan identitas visual, filosofi desain, dan standar antarmuka pengguna (UI/UX) yang digunakan dalam pengembangan Parzello POS.

---

## 🏛️ Filosofi Desain: "Modern Premium & Ergonomic"

Parzello POS dirancang untuk menggabungkan estetika aplikasi SaaS modern dengan efisiensi alat operasional kasir. 

1. **Clean & Modular**: Antarmuka berbasis kartu (card-based) yang memudahkan navigasi dan skalabilitas fitur.
2. **High Information Density**: Menyajikan data penting secara ringkas tanpa mengorbankan keterbacaan.
3. **Interactive Feedback**: Setiap aksi pengguna harus mendapatkan respon visual instan (hover transitions, loading states, micro-animations).
4. **Consistency**: Pengalaman yang seragam mulai dari halaman Setup, Dashboard Bisnis, hingga Admin Panel.

---

## 🌈 Sistem Warna (OKLCH)

Kami menggunakan ruang warna OKLCH untuk menjamin konsistensi persepsi warna dan kontras yang lebih baik antara mode terang dan gelap.

### 1. Warna Utama (Brand)
- **Primary (Vibrant Lime)**: `oklch(0.841 0.238 128.85)`
  - *Penggunaan*: Tombol aksi utama, tautan navigasi aktif, status sukses.
- **Success (Emerald)**: `oklch(0.648 0.2 131.684)`
  - *Penggunaan*: Indikator stok tersedia, pembayaran berhasil, profit positif.
- **Destructive (Ruby)**: `oklch(0.577 0.245 27.325)`
  - *Penggunaan*: Peringatan stok habis, aksi hapus, indikator kerugian.

### 2. Warna Dasar (Neutral)
- **Background**: `oklch(1 0 0)` (Light) | `oklch(0.147 0.004 49.25)` (Dark)
- **Surface/Card**: Putih bersih dengan border halus `oklch(0.923 0.003 48.717)`.

---

## ✍️ Tipografi (Typography)

Menggunakan kombinasi font Google untuk menciptakan hierarki visual yang kuat:

1. **Heading (Space Grotesk)**:
   - Karakter: Geometris, Futuristis.
   - Digunakan untuk: Judul halaman, Judul Section, Angka Stats besar.
2. **Body & Interface (Outfit)**:
   - Karakter: Hangat, Modern, Sangat terbaca.
   - Digunakan untuk: Navigasi, Deskripsi, Form input.
3. **Data & Technical (Geist Mono)**:
   - Karakter: Presisi, Monospace.
   - Digunakan untuk: SKU Produk, ID Transaksi, Nomor Invoice, Kode Voucher.

---

## 🧩 Komponen & Pola UI

### 1. Navigasi & Sidebar
- **App Sidebar**: Desain *collapsible* (dapat diciutkan) dengan pengelompokan fitur berbasis kategori (Analytics, Operasional, Katalog, Marketing, Laporan).
- **Store Switcher**: Elemen di bagian atas sidebar untuk perpindahan antar outlet yang cepat tanpa kehilangan konteks.
- **Top Bar**: Berisi breadcrumbs untuk orientasi lokasi dan menu profil pengguna.

### 2. Kartu Aksi (Action Cards)
- Mengadopsi gaya **Glassmorphism** halus atau **Solid Minimalist**.
- Dilengkapi dengan *micro-interactions* seperti efek `hover:translate-x-1` dan perubahan warna aksen saat di-hover.
- Menggunakan ikon dari `@tabler/icons-react` dengan stroke-width yang seragam (biasanya 1.5 atau 2).

### 3. Visualisasi Data
- **Interactive Charts**: Menggunakan `Recharts` dengan palet warna yang harmonis (`chart-1` s/d `chart-5`).
- **Status Badges**: Menggunakan varian `outline` atau `secondary` dengan warna latar transparan untuk kesan premium.
- **Skeleton Loaders**: Digunakan secara agresif selama pengambilan data untuk menjaga persepsi kecepatan sistem.

---

## 🖱️ UX & Interaktivitas

1. **Fuzzy Search**: Implementasi pencarian di seluruh tabel yang responsif dan toleran terhadap typo.
2. **Onboarding Flow**: Proses registrasi toko yang dipandu (stepper-based) untuk mengurangi beban kognitif pengguna baru.
3. **Toaster Notifications**: Feedback instan di pojok kanan atas untuk setiap aksi (Sukses, Gagal, Info).
4. **Responsive Layout**: Antarmuka dioptimalkan untuk Desktop (Management) dan Tablet (Operasional Kasir).

---

## 🛠️ Stack Teknologi Desain

- **Core**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 (Utility-first)
- **Components**: Shadcn UI (Radix UI Primitives)
- **Icons**: Tabler Icons & Lucide React
- **Animations**: Tailwind Animate & CSS Transitions
