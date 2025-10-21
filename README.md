# WMS React Frontend Setup

Frontend aplikasi Warehouse Management System (WMS) dibangun menggunakan React (Vite) dan Bootstrap.

## Persyaratan
- Node.js >= 18.x
- npm atau yarn
- Backend Laravel WMS berjalan (lihat README backend untuk setup)

## Langkah-langkah Instalasi

1.  **Clone Repository:**
    ```bash
    git clone [URL_REPOSITORY_GITHUB_ANDA] wms-frontend
    cd wms-frontend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # atau jika menggunakan yarn:
    # yarn install
    ```

3.  **Setup Environment File:**
    Salin file `.env.example` (jika ada) menjadi `.env.local`. Jika tidak ada `.env.example`, buat file baru bernama `.env.local`.
    ```bash
    cp .env.example .env.local
    # atau buat file baru
    # touch .env.local
    ```
    Buka file `.env.local` dan atur URL backend API Anda. Pastikan nama variabel diawali dengan `VITE_`.
    ```env
    VITE_API_BASE_URL=http://localhost:8000/api
    ```
    *(Ganti `http://localhost:8000/api` jika backend Anda berjalan di URL/port yang berbeda).*

4.  **Jalankan Server Development:**
    ```bash
    npm run dev
    # atau jika menggunakan yarn:
    # yarn dev
    ```
    Aplikasi frontend sekarang seharusnya berjalan (biasanya di `http://localhost:5173` atau port sejenis).

    login dengan Email dan password

    User :
    1. username : admin@example.com
       password : password
    2. username : purchasing@example.com
       password : password
    3. username : warehouse@example.com
       password : password

---

## Fitur Frontend

Frontend ini menyediakan antarmuka pengguna untuk berinteraksi dengan API backend WMS, meliputi:

1.  **Autentikasi:**
    * Halaman **Login** untuk masuk ke sistem.
    * Penyimpanan **token** autentikasi (menggunakan Local Storage).
    * **Logout** pengguna.
    * **Protected Routes** yang hanya bisa diakses setelah login.
    * **Auth Context** untuk mengelola status login secara global.

2.  **Layout Utama:**
    * **Sidebar** navigasi dinamis yang menampilkan menu berdasarkan **role** pengguna (Admin, Purchasing Staff, Warehouse Staff).
    * Area konten utama.

3.  **Dashboard:** 📊
    * Menampilkan **KPI Cards** utama (Total Nilai Stok, Total Kuantitas, Total SKU, Open PO).
    * Menampilkan **grafik Line Chart** pergerakan stok (masuk vs keluar) **harian** untuk minggu berjalan (Senin-Minggu).

4.  **Modul Purchasing:** 🛒
    * **Purchase Request (PR):**
        * Halaman **Daftar PR** dengan pagination (menampilkan nomor, requester, tanggal, status).
        * Halaman **Buat PR Baru** dengan form dinamis untuk menambah/menghapus item.
        * Halaman **Detail PR** (read-only).
        * Halaman **Edit PR** (memungkinkan update data dan status).
        * Tombol **Hapus PR** (hanya jika status `draft`).
        * Tombol **"Buat PO"** pada PR yang statusnya `approved`.
    * **Purchase Order (PO):**
        * Halaman **Daftar PO** dengan pagination.
        * Halaman **Buat PO**, bisa manual atau otomatis terisi dari PR yang `approved` (memerlukan input Supplier dan Harga).
        * Halaman **Detail PO**.
        * Tombol **"Terima Barang"** pada PO yang statusnya `sent` atau `partially_received`.

5.  **Modul Inventory:** 📦
    * **Goods Receipt (GR):**
        * Halaman **Daftar GR**.
        * Halaman **Buat GR** yang diakses dari tombol "Terima Barang" di PO, form otomatis terisi item PO, user mengisi Gudang dan Kuantitas diterima.
        * Halaman **Detail GR**.
    * **Goods Issue (GI):**
        * Halaman **Daftar GI**.
        * Halaman **Buat GI Baru** (manual), dengan **chained dropdown**: dropdown item hanya aktif setelah Gudang Asal dipilih dan hanya menampilkan item yang memiliki stok di gudang tersebut.
        * Halaman **Detail GI**.
    * **Goods Transfer (GT):**
        * Halaman **Daftar GT**.
        * Halaman **Buat GT Baru** (manual), dengan **chained dropdown** untuk item berdasarkan Gudang Asal. Validasi gudang asal != gudang tujuan.
        * Halaman **Detail GT**.
    * **Stock Inquiry:**
        * Halaman **Daftar Stok** (`StockLevel`) dengan filter berdasarkan Item dan/atau Gudang.
        * Menampilkan sisa stok per item per gudang.
        * Link ke **Kartu Stok**.
    * **Stock Card:**
        * Halaman **Detail Kartu Stok** yang menampilkan histori transaksi (masuk/keluar) untuk item spesifik di gudang spesifik, diurutkan berdasarkan tanggal.

6.  **Master Data:**
    * **Master Items:**
        * Halaman **Daftar Item** dengan pagination.
        * Halaman **Tambah Item Baru**.
        * Halaman **Edit Item**.
        * *(Fungsi Hapus tidak diimplementasikan sesuai permintaan).*

7.  **Service Layer:** ⚙️
    * Menggunakan `axios` dengan *interceptor* untuk otomatis menambahkan *Bearer Token* ke setiap request API.
    * Logika panggilan API dipisahkan ke dalam *service files* (`authService.js`, `purchasingService.js`, `inventoryService.js`, `itemService.js`, `dashboardService.js`) untuk menjaga kebersihan komponen.