# E-Commerce WebApp

## Pendahuluan
Aplikasi web e-commerce ini memungkinkan pengguna untuk menjelajahi katalog produk, menambahkan barang ke keranjang, dan melakukan checkout. Sistem ini berjalan dalam lingkungan berbasis Docker untuk memastikan portabilitas dan skalabilitas.

## Ruang Lingkup
Aplikasi mencakup fitur:
- Autentikasi pengguna
- Manajemen produk
- Checkout dengan pembayaran terintegrasi
- API Gateway untuk komunikasi aman antara frontend dan backend

## End User

| No | Kategori Pengguna | Tugas | Hak Akses |
|----|------------------|-------|-----------|
| 1  | Guest | Registrasi dan login | Akses halaman registrasi, login, dan katalog produk |
| 2  | Buyer | Menjelajahi katalog, checkout, dan memberikan ulasan | Akses penuh ke fitur pembelian, ulasan, dan riwayat transaksi |
| 3  | Seller | Menambahkan, mengedit, dan menghapus produk | Akses penuh ke fitur manajemen produk |
| 4  | Admin | Mengelola pengguna, produk, dan transaksi | Akses penuh ke seluruh sistem |

## Batasan
- Hanya dapat diakses melalui browser modern dengan dukungan JavaScript dan CSS terbaru
- Registrasi hanya untuk buyer dan seller dengan email valid
- Seller harus diverifikasi oleh Admin
- Memerlukan koneksi internet

## Arsitektur Sistem
### 1. Client Side (Frontend)
- Dibangun menggunakan React.js untuk pengalaman responsif
- Mengirim request ke API Gateway (Nginx)

### 2. API Gateway (Nginx)
- Mengelola request dari frontend ke backend
- Load balancing, routing, autentikasi JWT

### 3. Backend Services (Microservices - Golang)
- **User Service:** Mengelola autentikasi dan akun
- **Product Service:** CRUD produk, pencarian, filter
- **Order Service:** Transaksi pembelian dan checkout
- **Payment Service:** Integrasi dengan Midtrans
- **Review Service:** Mengelola ulasan dan rating

### 4. Database (MySQL)
- Menyimpan data pengguna, produk, pesanan, pembayaran, ulasan, dan kategori

### 5. Logging & Monitoring
- **Prometheus & Grafana:** Memantau performa backend
- **Redis (Opsional):** Komunikasi asynchronous antar microservices

### 6. Deployment
- Docker Compose/Kubernetes untuk container management
- GitHub Actions untuk CI/CD

## Kebutuhan Fungsional

| No | Kode | Nama Fungsi | Deskripsi |
|----|------|------------|-----------|
| 1  | EC-F-01 | Registrasi Pengguna | Pengguna dapat membuat akun baru dengan email dan password |
| 2  | EC-F-02 | Login Pengguna | Pengguna dapat masuk ke sistem dengan email dan password |
| 3  | EC-F-03 | Logout Pengguna | Pengguna dapat keluar dari sistem dan token JWT akan dinonaktifkan |
| 4a | EC-F-04a | Tambah Produk | Seller dapat menambahkan produk ke dalam katalog |
| 4b | EC-F-04b | Edit Produk | Seller dapat mengedit informasi produk yang telah ditambahkan |
| 4c | EC-F-04c | Hapus Produk | Seller dapat menghapus produk dari katalog |
| 5  | EC-F-05 | Checkout & Pembayaran | Buyer dapat melakukan checkout dan menyelesaikan pembayaran |
| 6a | EC-F-06a | Melihat Daftar Pengguna | Admin dapat melihat daftar pengguna dalam sistem |
| 6b | EC-F-06b | Mengubah Peran Pengguna | Admin dapat mengubah peran pengguna (Buyer, Seller, Admin) |
| 6c | EC-F-06c | Menonaktifkan Pengguna | Admin dapat menonaktifkan atau menghapus akun pengguna |

## Use Case Diagram
Diagram ini mencakup skenario utama seperti registrasi, login, manajemen produk, transaksi, dan monitoring admin.

## Skema Database (ERD)
- **Users:** Menyimpan data pengguna
- **Products:** Menyimpan data produk
- **Orders:** Menyimpan transaksi pembelian
- **Payments:** Menyimpan data pembayaran
- **Reviews:** Menyimpan ulasan produk

## Keamanan
- Enkripsi data transaksi dan autentikasi JWT
- Proteksi API dengan rate limiting dan firewall
- Logging dan monitoring untuk mendeteksi anomali

## Kontribusi
1. Fork repositori ini
2. Buat branch baru (`git checkout -b feature-branch`)
3. Commit perubahan (`git commit -m "Menambahkan fitur X"`)
4. Push ke branch (`git push origin feature-branch`)
5. Ajukan pull request

## Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).

