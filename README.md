# KIT Attendance System (Frontend)

Hệ thống quản lý chấm công và điểm danh (Attendance System) được xây dựng trên nền tảng **TanStack Start (React 19)** kết hợp với **Supabase** cho phần Backend và Database.

---

## 🛠️ Công nghệ sử dụng

- **Frontend Core**: React 19, TypeScript
- **Framework & Routing**: [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (TanStack Router & Nitro server engine)
- **Styling**: Tailwind CSS v4 (sử dụng `@tailwindcss/vite`)
- **UI Components**: Radix UI (Shadcn-based)
- **Database & Auth**: Supabase (@supabase/supabase-js)
- **Charts**: Recharts (vẽ biểu đồ thống kê chấm công)
- **Build Tool**: Vite

---

## ⚙️ Hướng dẫn cài đặt & Chạy dự án

### 1. Yêu cầu hệ thống
Đảm bảo bạn đã cài đặt:
- **Node.js** (Phiên bản v18 trở lên được khuyên dùng)
- Trình quản lý gói: **npm** hoặc **bun**

### 2. Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
# Hoặc sử dụng Bun
bun install
```

### 3. Cấu hình Biến môi trường (Environment Variables)
Tạo file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
```
Mở file `.env` và cập nhật thông tin dự án Supabase của bạn:
- `VITE_SUPABASE_URL` / `SUPABASE_URL`: Đường dẫn URL của Supabase project.
- `VITE_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_PUBLISHABLE_KEY`: Anon key dùng cho phía client.
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (chỉ dùng ở phía server-side, bảo mật cao).

---

## 🗄️ Cấu hình và Đẩy Database Schema (Supabase)

Dự án có sẵn các migration SQL để định nghĩa cấu trúc bảng (schema) trong thư mục `supabase/migrations`. Để đẩy các bảng này lên Supabase của bạn, hãy làm theo các bước:

1. **Đăng nhập vào Supabase CLI**:
   ```bash
   npx supabase login
   ```
2. **Liên kết thư mục dự án với Supabase project của bạn**:
   ```bash
   npx supabase link --project-ref <YOUR_PROJECT_REF_ID>
   ```
   *(Ví dụ Project Ref ID của bạn: `zrqqfzfumxjcovkmpfcr`)*
3. **Đẩy cấu trúc Database lên Cloud**:
   ```bash
   npx supabase db push
   ```

---

## 🚀 Chạy ứng dụng

Sau khi đã hoàn tất cài đặt và cấu hình môi trường, bạn có thể khởi động Server Development:

```bash
npm run dev
# Hoặc nếu sử dụng Bun
bun run dev
```

Ứng dụng sẽ được chạy tại: [http://localhost:3000](http://localhost:3000) (hoặc cổng được hiển thị trong terminal).

---

## 📁 Cấu trúc thư mục dự án

```text
├── public/                 # Các tài nguyên tĩnh (Favicon, v.v...)
├── src/
│   ├── components/ui       # Các component UI tái sử dụng (Button, Card, Select...)
│   ├── integrations/       # Tích hợp với Supabase (Client, Types, Middleware...)
│   ├── lib/                # Thư viện dùng chung, config server, helpers
│   ├── routes/             # Cấu trúc Routing (TanStack Router file-based routing)
│   ├── styles.css          # File style chính cấu hình Tailwind v4
│   ├── router.tsx          # Điểm cấu hình router chính
│   ├── server.ts           # Cấu hình entry point cho server side
│   └── start.ts            # Entry point chính của ứng dụng
├── supabase/
│   ├── migrations/         # Các file SQL thiết lập bảng Database
│   └── config.toml         # File cấu hình Supabase
├── .env.example            # Bản mẫu cấu hình biến môi trường
├── package.json            # Các script và dependencies
└── vite.config.ts          # Cấu hình Vite & TanStack Router
```
