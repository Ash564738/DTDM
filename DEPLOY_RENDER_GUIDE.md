# Hướng Dẫn Chi Tiết: Container Hóa (Docker) & Triển Khai (Deploy) Lên Render

> **Đề tài môn học**: Develop a NodeJS and PostgreSQL, Docker, Render application.  
> **Dự án**: **EventFlow - Cloud Event Management System (Hệ thống Quản lý Sự kiện)**  
> **Phần phụ trách**: **Frontend (React 19 + TypeScript + Tailwind CSS)**  

---

## 📑 Mục lục
1. [Kiến Trúc Tổng Thể Toàn Hệ Thống](#1-kiến-trúc-tổng-thể-toàn-hệ-thống)
2. [Cơ Chế Đóng Gói Docker Cho Frontend (Multi-Stage Build)](#2-cơ-chế-đóng-gói-docker-cho-frontend-multi-stage-build)
3. [Hướng Dẫn Chạy Thử Local Bằng Docker](#3-hướng-dẫn-chạy-thử-local-bằng-docker)
4. [Hướng Dẫn Từng Bước Deploy Lên Render](#4-hướng-dẫn-từng-bước-deploy-lên-render)
   - [Phương án A: Deploy dạng Docker Web Service (Chuẩn yêu cầu bài tập)](#phương-án-a-deploy-dạng-docker-web-service-chuẩn-yêu-cầu-bài-tập)
   - [Phương án B: Deploy dạng Static Site (Nhanh & Tối ưu tài nguyên)](#phương-án-b-deploy-dạng-static-site-nhanh--tối-ưu-tài-nguyên)
5. [Kết Nối Frontend Với NodeJS & PostgreSQL Backend](#5-kết-nối-frontend-với-nodejs--postgresql-backend)
6. [Xử Lý Lỗi Thường Gặp (Troubleshooting)](#6-xử-lý-lỗi-thường-gặp-troubleshooting)

---

## 1. Kiến Trúc Tổng Thể Toàn Hệ Thống

```
+-------------------------------------------------------------------------+
|                              RENDER CLOUD                               |
|                                                                         |
|  +---------------------------+          +----------------------------+  |
|  |   Frontend (React SPA)    |          |   Backend (NodeJS/Express) |  |
|  |   Dockerized / Nginx      | -------> |   REST API Services        |  |
|  |   Port: $PORT (10000)     | (HTTPS)  |   Port: 5000 / $PORT       |  |
|  +---------------------------+          +----------------------------+  |
|                                                       |                 |
|                                                       v                 |
|                                         +----------------------------+  |
|                                         |  Render Managed PostgreSQL |  |
|                                         |  Database Server           |  |
|                                         +----------------------------+  |
+-------------------------------------------------------------------------+
```

---

## 2. Cơ Chế Đóng Gói Docker Cho Frontend (Multi-Stage Build)

Frontend React được đóng gói thông qua kỹ thuật **Docker Multi-stage Build** nhằm:
1. **Giảm kích thước Image**: Từ ~800MB (gồm NodeJS, npm, devDependencies) xuống chỉ còn **~25MB** (chỉ chứa file tĩnh đã compile và Nginx Alpine siêu nhẹ).
2. **Bảo mật**: Không để lộ mã nguồn gốc TypeScript hoặc công cụ build trong môi trường production.
3. **SPA History Fallback**: Cấu hình `nginx.conf` với lệnh `try_files $uri $uri/ /index.html;` để tránh lỗi 404 Not Found khi người dùng refresh trang hoặc truy cập URL con (như `/events/evt-1`, `/my-tickets`).

### Cấu trúc file Dockerfile:
- **Stage 1 (Builder)**: Sử dụng base image `node:22-alpine`, copy `package.json`, cài thư viện với `npm ci` và chạy `npm run build` để sinh thư mục `dist/`.
- **Stage 2 (Nginx Production)**: Sử dụng `nginx:alpine`, copy các file từ `dist/` vào `/usr/share/nginx/html`, tự động đọc biến môi trường `$PORT` do Render cấp phát.

---

## 3. Hướng Dẫn Chạy Thử Local Bằng Docker

### Cách 1: Sử dụng Docker CLI thuần
```bash
# 1. Build Docker image từ thư mục dự án
docker build -t event-management-frontend .

# 2. Chạy container tại cổng 3000
docker run -d -p 3000:80 --name ems_fe event-management-frontend

# 3. Truy cập trình duyệt:
# http://localhost:3000
```

### Cách 2: Sử dụng Docker Compose
```bash
# Build và chạy ngầm container
docker compose up -d --build

# Kiểm tra log
docker compose logs -f frontend

# Dừng container khi không dùng
docker compose down
```

---

## 4. Hướng Dẫn Từng Bước Deploy Lên Render

### Chuẩn bị trước khi deploy:
1. Đẩy toàn bộ mã nguồn frontend lên GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: complete React event management system frontend with Docker config"
   git branch -M main
   git remote add origin https://github.com/<your-username>/event-management-frontend.git
   git push -u origin main
   ```

---

### Phương án A: Deploy dạng Docker Web Service (Chuẩn yêu cầu bài tập)

Render sẽ tự động đọc `Dockerfile` trong repository của bạn, build container và chạy ứng dụng.

1. **Đăng nhập vào Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)
2. Nhấn nút **New +** ở góc trên bên phải -> chọn **Web Service**.
3. Chọn **Build and deploy from a Git repository** -> Kết nối GitHub của bạn và chọn repository frontend.
4. Điền các thông số cấu hình:
   - **Name**: `event-management-frontend` (hoặc tên tùy ý)
   - **Region**: `Singapore` (để tốc độ tải tại Việt Nam nhanh nhất)
   - **Branch**: `main`
   - **Language / Runtime**: Chọn **Docker**
   - **Dockerfile Path**: `./Dockerfile` (mặc định)
   - **Instance Type**: Chọn **Free**
5. Cấu hình biến môi trường (**Environment Variables**):
   - Thêm biến `VITE_API_BASE_URL`: Điền URL backend NodeJS của nhóm bạn (Ví dụ: `https://event-management-backend.onrender.com/api`).
   - Thêm biến `VITE_USE_MOCK`: Đặt `true` nếu muốn dùng dữ liệu giả định để thuyết trình ngay, hoặc `false` khi đã kết nối backend thật.
6. Nhấn nút **Create Web Service**.
7. Chờ Render build container (khoảng 2-3 phút). Khi trạng thái chuyển sang **Live**, bạn sẽ nhận được đường link công khai (ví dụ: `https://event-management-frontend.onrender.com`).

---

### Phương án B: Deploy dạng Static Site (Nhanh & Tối ưu tài nguyên)

Nếu nhóm muốn tiết kiệm giới hạn giờ chạy Free của Web Service cho NodeJS Backend:

1. Vào Render Dashboard -> Nhấn **New +** -> Chọn **Static Site**.
2. Kết nối tới Git repository của bạn.
3. Cấu hình:
   - **Name**: `event-management-web`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Cấu hình **Redirects/Rewrites** (rất quan trọng cho React Router):
   - Vào tab **Redirects/Rewrites** trong Service setting.
   - Thêm rule:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: `Rewrite`
5. Nhấn **Create Static Site**.

---

## 5. Kết Nối Frontend Với NodeJS & PostgreSQL Backend

Khi các bạn trong nhóm hoàn thiện Backend NodeJS + PostgreSQL:

1. **Cấu hình CORS ở Backend NodeJS**:
   Đảm bảo Backend cho phép domain Render của Frontend gọi API:
   ```javascript
   // Trong server NodeJS (server.js hoặc app.js)
   const cors = require('cors');
   app.use(cors({
     origin: ['http://localhost:3000', 'https://<your-frontend-domain>.onrender.com'],
     credentials: true
   }));
   ```

2. **Cập nhật URL API trên Frontend**:
   - Ở file `.env` (local) hoặc Render Environment Variables (production):
     ```env
     VITE_API_BASE_URL=https://<your-backend-domain>.onrender.com/api
     VITE_USE_MOCK=false
     ```

3. **Danh sách các Endpoints chuẩn đã tích hợp trong Frontend Service** (`src/services/api.ts`):
   - `POST /api/auth/login`: Đăng nhập
   - `POST /api/auth/register`: Đăng ký tài khoản
   - `GET /api/events`: Lấy danh sách sự kiện (hỗ trợ filter category, search)
   - `GET /api/events/:id`: Lấy chi tiết một sự kiện
   - `POST /api/events`: Tạo sự kiện mới (Organizer)
   - `PUT /api/events/:id`: Cập nhật sự kiện (Organizer)
   - `DELETE /api/events/:id`: Xóa sự kiện
   - `POST /api/events/:id/register`: Đăng ký vé sự kiện
   - `GET /api/registrations/my`: Lấy danh sách vé đã đặt của Attendee
   - `DELETE /api/registrations/:id`: Hủy đăng ký vé
   - `GET /api/events/:id/registrations`: Danh sách người tham gia sự kiện
   - `PATCH /api/registrations/:id/check-in`: Điểm danh người tham gia
   - `GET /api/organizer/stats`: Thống kê doanh thu, số lượng vé

---

## 6. Xử Lý Lỗi Thường Gặp (Troubleshooting)

| Vấn đề | Nguyên nhân | Cách khắc phục |
| :--- | :--- | :--- |
| **Refresh trang con bị 404** | Web server không rewrite về `index.html` | Đảm bảo Nginx có `try_files $uri $uri/ /index.html;` hoặc thêm Rewrite rule trên Render Static Site. |
| **Lỗi PORT trên Render Docker** | Render cấp dynamic `$PORT` khác 80 | Dockerfile đã cấu hình Nginx template tự động đọc biến `${PORT}` qua `nginx.conf.template`. |
| **Lỗi CORS khi gọi API** | Backend NodeJS chưa cho phép domain Frontend | Thêm `cors()` middleware trong Express NodeJS với domain của Render. |
| **Muốn demo khi backend chưa xong** | Backend chưa deploy kịp | Đặt `VITE_USE_MOCK=true`. Hệ thống sẽ tự lưu trữ và hoạt động trơn tru 100% bằng LocalStorage. |
