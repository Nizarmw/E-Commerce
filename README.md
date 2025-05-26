# E-Commerce WebApp

## Pendahuluan
Aplikasi web e-commerce modern yang dibangun dengan arsitektur microservices. Sistem ini memungkinkan pengguna untuk menjelajahi katalog produk, menambahkan barang ke keranjang, dan melakukan checkout dengan pembayaran terintegrasi. Proyek ini mengimplementasikan DevSecOps practices dengan CI/CD pipeline menggunakan Jenkins dan containerization dengan Docker.

## Teknologi yang Digunakan

### Frontend
- **React.js** - Library JavaScript untuk membangun user interface
- **Vite** - Build tool untuk development yang cepat
- **Material-UI** - Component library untuk UI yang konsisten
- **Redux** - State management untuk aplikasi

### Backend
- **Go (Golang)** - Bahasa pemrograman untuk backend services
- **Gin Framework** - Web framework untuk Go
- **JWT** - JSON Web Token untuk autentikasi
- **Supabase** - Backend-as-a-Service untuk database dan storage

### Infrastructure & DevOps
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container application management
- **Kubernetes** - Container orchestration (k8s manifests tersedia)
- **Nginx** - Reverse proxy dan load balancer
- **Jenkins** - CI/CD automation server

## Ruang Lingkup
Aplikasi mencakup fitur:
- Autentikasi dan autorisasi pengguna (JWT-based)
- Manajemen produk dengan kategori dan review
- Sistem keranjang belanja (cart)
- Checkout dengan pembayaran terintegrasi
- Dashboard admin untuk manajemen sistem
- API Gateway untuk komunikasi aman antara frontend dan backend
- Monitoring dan logging

## End User

| No | Kategori Pengguna | Tugas | Hak Akses |
|----|------------------|-------|-----------|
| 1  | Guest | Registrasi dan login | Akses halaman registrasi, login, dan katalog produk |
| 2  | Buyer | Menjelajahi katalog, checkout, dan memberikan ulasan | Akses penuh ke fitur pembelian, ulasan, dan riwayat transaksi |
| 3  | Seller | Menambahkan, mengedit, dan menghapus produk | Akses penuh ke fitur manajemen produk |
| 4  | Admin | Mengelola pengguna, produk, dan transaksi | Akses penuh ke seluruh sistem termasuk dashboard admin |

## Batasan
- Hanya dapat diakses melalui browser modern dengan dukungan JavaScript dan CSS terbaru
- Registrasi hanya untuk buyer dan seller dengan email valid
- Seller harus diverifikasi oleh Admin
- Memerlukan koneksi internet
- Database menggunakan Supabase untuk produksi

## Arsitektur Sistem

### 1. Frontend (React.js + Vite)
```
front-end/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components (auth, dashboard, public)
│   ├── services/       # API service layer
│   ├── redux/          # State management
│   └── layouts/        # Layout components
```

### 2. Backend (Go Microservices)
```
back-end/
├── controllers/        # HTTP request handlers
├── services/          # Business logic layer
├── models/            # Data models and structures
├── routes/            # API route definitions
├── middlewares/       # Authentication and role middlewares
└── utils/             # Utility functions (JWT, etc.)
```

### 3. Infrastructure
- **Nginx Proxy Manager** - Reverse proxy dengan SSL termination
- **Docker Containers** - Isolated application environments
- **Kubernetes** - Production orchestration (manifests di folder k8s/)

### 4. Database (Supabase)
- **Users** - Data pengguna dan autentikasi
- **Products** - Katalog produk dengan kategori
- **Orders** - Transaksi dan order items
- **Payments** - Data pembayaran
- **Reviews** - Ulasan dan rating produk
- **Cart Items** - Items dalam keranjang belanja

## CI/CD Pipeline

Proyek ini menggunakan Jenkins untuk automation pipeline:

### Pipeline Stages
1. **Checkout** - Clone repository dari GitHub
2. **Build** - Build Docker images untuk frontend dan backend
3. **Test** - Run unit tests dan integration tests
4. **Security Scan** - Static analysis dan vulnerability scanning
5. **Deploy** - Deploy ke environment staging/production

### Dokumentasi CI/CD
Lihat folder `DokumentasiCICD/` untuk informasi lengkap:
- [Setup Jenkins](DokumentasiCICD/JENKINS_SETUP.md)
- [Demo CI/CD](DokumentasiCICD/DEMO_CICD.md)
- [Panduan CI/CD](DokumentasiCICD/BacaIniBuatCICD.md)

## Quick Start

### Prerequisites
- Docker dan Docker Compose
- Node.js 18+ (untuk development)
- Go 1.21+ (untuk backend development)

### 1. Clone Repository
```bash
git clone <repository-url>
cd E-Commerce
```

### 2. Environment Setup
```bash
# Jalankan quick start script
chmod +x quick-start.sh
./quick-start.sh
```

### 3. Development Mode
```bash
# Frontend
cd front-end
npm install
npm run dev

# Backend
cd back-end
go mod download
go run main.go
```

### 4. Production Deployment
```bash
# Menggunakan Docker Compose
docker-compose up -d

# Atau menggunakan setup script
chmod +x setup-vps.sh
./setup-vps.sh
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Seller)
- `PUT /api/products/:id` - Update product (Seller)
- `DELETE /api/products/:id` - Delete product (Seller/Admin)

### Orders & Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

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
| 7  | EC-F-07 | Manajemen Keranjang | User dapat menambah, mengubah, dan menghapus item dari keranjang |
| 8  | EC-F-08 | Review Produk | Buyer dapat memberikan review dan rating pada produk |
| 9  | EC-F-09 | Pencarian Produk | User dapat mencari produk berdasarkan nama, kategori, atau filter |

## Monitoring & Logging

### Nginx Proxy Manager
- Web interface untuk manajemen proxy
- SSL certificate automation
- Access logs dan error logs tersedia di `nginx/data/logs/`

### Application Logs
- Backend logs untuk debugging dan monitoring
- Database query logs melalui Supabase dashboard

## Keamanan

### Implementasi Keamanan
- **JWT Authentication** - Token-based authentication dengan refresh tokens
- **Role-based Access Control** - Middleware untuk autorisasi berdasarkan role
- **Input Validation** - Validasi input pada backend dan frontend
- **CORS Protection** - Cross-Origin Resource Sharing configuration
- **Rate Limiting** - Protection against API abuse
- **HTTPS Enforcement** - SSL/TLS encryption melalui Nginx

### Security Best Practices
- Environment variables untuk sensitive data
- Password hashing dengan bcrypt
- SQL injection prevention dengan prepared statements
- XSS protection dengan proper input sanitization

## Testing

### Frontend Testing
```bash
cd front-end
npm run test
```

### Backend Testing
```bash
cd back-end
go test ./...
```

## Deployment Options

### 1. Docker Compose (Recommended untuk Development)
```bash
docker-compose up -d
```

### 2. Kubernetes (Production)
```bash
kubectl apply -f k8s/
```

### 3. Manual Setup
Ikuti instruksi di `setup-vps.sh` untuk setup manual di VPS.

## Kontribusi

### Development Workflow
1. Fork repositori ini
2. Buat branch baru dari `develop`
   ```bash
   git checkout -b feature/nama-fitur
   ```
3. Commit perubahan dengan conventional commits
   ```bash
   git commit -m "feat: menambahkan fitur X"
   ```
4. Push ke branch
   ```bash
   git push origin feature/nama-fitur
   ```
5. Ajukan pull request ke branch `develop`

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development integration branch
- `feature/*` - Feature development branches
- `hotfix/*` - Emergency fixes

### Code Style
- Frontend: Gunakan Prettier dan ESLint
- Backend: Gunakan gofmt dan golint
- Commit messages: Follow conventional commits

## Troubleshooting

### Common Issues
1. **Port conflicts** - Pastikan port 3000 (frontend) dan 8080 (backend) tidak digunakan
2. **Database connection** - Periksa environment variables untuk Supabase
3. **Docker issues** - Restart Docker daemon atau rebuild containers

### Logs Location
- Frontend: Browser console dan terminal
- Backend: Application logs di container
- Nginx: `nginx/data/logs/`

## Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## Kontak & Support
Untuk pertanyaan atau dukungan, silakan buat issue di repository ini atau hubungi tim development.

