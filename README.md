# 🎟️ EventFlow - Cloud Event Management System (Frontend)

Ứng dụng web Quản lý Sự kiện hiện đại được xây dựng bằng **React 19**, **TypeScript**, **Tailwind CSS**, và **Vite**. Dự án được cấu hình sẵn sàng đóng gói **Docker** và triển khai lên nền tảng đám mây **Render**, thuộc đề tài môn học: *"Develop a NodeJS and PostgreSQL, Docker, Render application"*.

![EventFlow Architecture](https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80)

---

## 🚀 Các Tính Năng Chính

### 1. Phân quyền Người Tham Gia (Attendee)
- **Khám phá sự kiện**: Tìm kiếm sự kiện theo từ khóa, lọc theo danh mục (Technology, Music, Workshops, Business, v.v.), hình thức (Trực tiếp tại địa điểm hoặc Online Stream), và mức giá (Miễn phí / Có phí).
- **Xem chi tiết sự kiện**: Banner nổi bật, lịch trình (agenda) chi tiết, thông tin diễn giả (speakers), địa chỉ và chỉ dẫn.
- **Đặt vé trực tuyến (Booking)**: Chọn số lượng vé, điền thông tin người tham gia, tính toán tổng tiền và hiệu ứng ăn mừng pháo hoa (Confetti) khi đặt vé thành công.
- **Quản lý vé điện tử (My Tickets)**: Danh sách vé đã đặt, xem chi tiết **E-Ticket kèm mã QR Code mô phỏng** để check-in tại quầy, hỗ trợ in / tải vé trực tiếp (`Print Ticket`), tính năng hủy vé (trả lại chỗ trống cho sự kiện).

### 2. Phân quyền Ban Tổ Chức (Organizer)
- **Dashboard quản trị thông minh**: Thống kê số lượng sự kiện, số lượng vé đã bán ra, tỷ lệ chỗ trống và tổng doanh thu bán vé.
- **Quản lý sự kiện (CRUD)**:
  - Tạo mới sự kiện (`Host Event`) với form nhiều bước: thông tin chung, chọn banner mẫu nhanh, thiết lập giá vé, giới hạn chỗ ngồi, định dạng trực tiếp/online.
  - Chỉnh sửa thông tin sự kiện.
  - Bật/tắt trạng thái Published/Draft.
  - Xóa sự kiện.
- **Quản lý người tham gia (Attendee Management)**:
  - Xem danh sách người đã đăng ký theo từng sự kiện.
  - Tìm kiếm người tham gia theo tên, email, hoặc mã vé.
  - **Điểm danh check-in trực tiếp**: Nút check-in chuyển đổi trạng thái tức thì.
  - **Xuất dữ liệu ra file CSV (`Export to CSV`)** tải trực tiếp về máy tính.

### 3. Trải nghiệm Demo & Chấm Điểm Tiện Lợi (Demo Switcher)
- **Quick Demo Role Switcher**: Nút chuyển đổi nhanh vai trò `Attendee` (Sarah Parker) ⇋ `Organizer` (Alex Johnson) ngay trên thanh Navbar mà không cần phải đăng xuất/đăng ký tài khoản mới.
- **Offline / Mock Storage Engine**: Tự động lưu trữ dữ liệu vào `localStorage`, cho phép chạy thử nghiệm độc lập và thuyết trình trơn tru ngay cả khi Backend chưa triển khai xong. Nút "Reset Demo Data" giúp khôi phục dữ liệu ban đầu chỉ với 1 click.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React (Bộ icon hiện đại)
- **Routing**: React Router DOM v7
- **API Client**: Axios (Hỗ trợ JWT Token Interceptors và Mock Data Fallback)
- **Containerization**: Docker (Multi-stage build với Node 22 & Nginx Alpine)
- **Cloud Deployment**: Render Cloud (Docker Web Service & Static Site)

---

## 📂 Cấu Trúc Thư Mục

```
Event_Management_System/
├── .dockerignore                 # Danh sách file loại trừ khi build Docker
├── .env.example                  # File mẫu biến môi trường
├── Dockerfile                    # Docker multi-stage build cho React & Nginx
├── docker-compose.yml            # File chạy container cục bộ
├── nginx.conf                    # Nginx config cho SPA routing fallback
├── nginx.conf.template           # Template Nginx tự động thích ứng với biến $PORT trên Render
├── package.json                  # Dependencies và scripts
├── DEPLOY_RENDER_GUIDE.md        # Hướng dẫn chi tiết từng bước deploy Render
│
└── src/
    ├── App.tsx                   # Khởi tạo Router và Layout
    ├── main.tsx                  # Điểm bắt đầu ứng dụng React
    ├── index.css                 # Import Tailwind CSS
    │
    ├── components/               # Các UI components tái sử dụng
    │   ├── Navbar.tsx            # Thanh điều hướng và nút chuyển Demo Role
    │   ├── Footer.tsx            # Thông tin chân trang và đề tài môn học
    │   ├── EventCard.tsx         # Thẻ hiển thị sự kiện với thanh tiến độ chỗ
    │   ├── BookingModal.tsx      # Modal đặt vé kèm hiệu ứng confetti
    │   └── TicketModal.tsx       # Modal vé điện tử kèm mã QR và tính năng Print
    │
    ├── context/
    │   └── AuthContext.tsx       # Quản lý phiên đăng nhập và phân quyền (RBAC)
    │
    ├── pages/                    # Các trang màn hình chính
    │   ├── HomePage.tsx          # Trang chủ với Hero, danh mục, sự kiện nổi bật
    │   ├── EventsPage.tsx        # Trang khám phá và bộ lọc sự kiện nâng cao
    │   ├── EventDetailPage.tsx   # Trang chi tiết sự kiện và widget đăng ký
    │   ├── MyTicketsPage.tsx     # Trang xem vé đã đặt và QR code
    │   ├── OrganizerDashboardPage.tsx # Dashboard quản lý và thống kê doanh thu
    │   ├── CreateEditEventPage.tsx    # Form tạo / cập nhật sự kiện
    │   ├── EventAttendeesPage.tsx    # Trang danh sách người tham gia & check-in
    │   ├── LoginPage.tsx         # Trang đăng nhập kèm nút tài khoản mẫu
    │   ├── RegisterPage.tsx      # Trang đăng ký
    │   └── NotFoundPage.tsx      # Trang 404
    │
    ├── services/                 # Tầng tương tác dữ liệu & API
    │   ├── api.ts                # Axios client và Fallback Mock Storage
    │   └── mockData.ts           # Dữ liệu sự kiện & vé mẫu chất lượng cao
    │
    ├── types/
    │   └── index.ts              # Định nghĩa Typescript Interfaces
    │
    └── utils/
        └── formatters.ts         # Hàm format ngày giờ, tiền tệ, màu danh mục
```

---

## ⚡ Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local)

### 1. Chạy với Node.js trực tiếp:
```bash
# 1. Cài đặt các thư viện
npm install

# 2. Khởi chạy server phát triển
npm run dev

# Ứng dụng sẽ chạy tại: http://localhost:3000
```

### 2. Chạy với Docker:
```bash
# Build và khởi chạy bằng Docker Compose
docker compose up -d --build

# Mở trình duyệt: http://localhost:3000
```

---

## 🌐 Triển Khai Lên Render Cloud

Xem hướng dẫn chi tiết từng bước bằng tiếng Việt tại file:  
👉 [**DEPLOY_RENDER_GUIDE.md**](./DEPLOY_RENDER_GUIDE.md)

---

## 👥 Tài Khoản Demo Để Chấm Điểm / Thuyết Trình
- **Khách tham gia (Attendee)**:
  - Email: `sarah.parker@example.com`
  - Quyền hạn: Xem sự kiện, đặt vé, xem vé điện tử mã QR, hủy vé.
- **Ban tổ chức (Organizer)**:
  - Email: `alex.organizer@techhub.io`
  - Quyền hạn: Quản lý dashboard, tạo/sửa/xóa sự kiện, điểm danh check-in người tham gia, xuất file CSV.
