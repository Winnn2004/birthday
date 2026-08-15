# Thiệp Sinh Nhật — Midnight Gold ✦

Trang web mời sinh nhật cao cấp phong cách **Midnight Gold** (Xanh Navy Đậm / Đen & Vàng Champagne Metallics), tích hợp Cổng xác nhận RSVP thông minh, nút hài hước "Tôi không tham gia", lời nhắn riêng tư và trang quản trị Admin.

## 🌟 Tính năng nổi bật

- **Thiết kế Midnight Gold**: Giao diện sang trọng, nam tính với tone xanh đêm navy, viền vàng ánh kim, hiệu ứng glassmorphic và phông chữ Serif/Sans đẳng cấp.
- **Cổng RSVP trước khi vào thiệp**: Khách mời bắt buộc điền tên thật (max 50 ký tự), biệt danh (max 30 ký tự) và xác nhận tham gia để nhận thiệp.
- **Nút "Không tham gia" né tương tác**: Thiết kế nút tương tác hài hước né con trỏ/chạm/focus trong thẻ và đưa ra các câu trêu đùa bouncer vui nhộn (không lưu trạng thái từ chối).
- **Ghi chú riêng cho chủ tiệc**: Sau khi qua cổng, khách mời có thể gửi/cập nhật ghi chú riêng (tối đa 200 ký tự) hoàn toàn bảo mật.
- **Hiệu ứng Gold Confetti**: Pháo hoa màu vàng ánh kim nổ chúc mừng ngay khi xác nhận tham gia thành công.
- **Tự động ghi nhớ khách mời**: Đọc `localStorage` khi quay lại trình duyệt để hiển thị ngay thiệp home cá nhân hóa cùng nút chuyển đổi danh tính ("Không phải bạn?").
- **Trang quản trị Admin `/admin`**: Đăng nhập Firebase Auth, xem thống kê số lượng tham gia & ghi chú, bảng dữ liệu chi tiết và tính năng xóa RSVP.

---

## 🚀 Cài đặt & Chạy Local

```bash
cd d:\Birthday
npm install
copy .env.example .env
npm run dev
```

- Trang thiệp mời: `http://localhost:5173`
- Trang quản trị admin: `http://localhost:5173/admin`

---

## ⚙️ Cấu hình thông tin tiệc

Chỉnh sửa file [`src/config/party.js`](src/config/party.js):

```javascript
export const partyConfig = {
  hostName: 'Tên Của Bạn',
  birthdayDate: '2026-08-20T18:00:00',
  venue: '123 Đường ABC, Quận 1, TP.HCM',
  venueMapUrl: 'https://maps.google.com',
  message: 'Hãy đến chung vui một đêm đáng nhớ cùng mình nhé!',
};
```

---

## 🔥 Setup Firebase Console

### Bước 1: Tạo Project & Firestore Database
1. Truy cập [Firebase Console](https://console.firebase.google.com/).
2. Tạo Web App và copy các thông số cấu hình vào file `.env`.
3. Bật **Firestore Database** ở chế độ Production.

### Bước 2: Bật Firebase Authentication (Admin)
1. **Authentication** → **Sign-in method** → Bật **Email/Password**.
2. Tab **Users** → **Add user** (Tạo email/mật khẩu quản trị viên).

### Bước 3: Cấu hình `.env`
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_ADMIN_EMAIL=admin@example.com
```

### Bước 4: Firestore Security Rules (Copy & Paste vào Firebase Console)
Vào **Firestore Database** → tab **Rules**, dán đoạn rules sau rồi nhấn **Publish**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /guests/{guestId} {
      // 1. Cho phép khách tạo RSVP với Tên và Biệt danh
      allow create: if request.resource.data.keys().hasOnly(['name', 'nickname', 'note', 'status', 'createdAt'])
                    && request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 50
                    && request.resource.data.nickname is string
                    && request.resource.data.nickname.size() > 0
                    && request.resource.data.nickname.size() <= 30
                    && request.resource.data.note is string
                    && request.resource.data.note.size() <= 200
                    && request.resource.data.status == 'attending';

      // 2. Cho phép khách cập nhật field 'note' của mình (hoặc admin đăng nhập)
      allow update: if (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['note'])
                        && request.resource.data.note is string
                        && request.resource.data.note.size() <= 200)
                    || request.auth != null;

      // 3. Đọc dữ liệu
      allow read: if true;

      // 4. Chỉ admin đăng nhập mới có quyền xóa
      allow delete: if request.auth != null;
    }
  }
}
```

---

## 📊 Cấu trúc Dữ liệu Firestore (`guests` collection)

| Field | Type | Quy định & Mô tả |
|---|---|---|
| `name` | string | Tên thật của khách (Bắt buộc, 1 - 50 ký tự) |
| `nickname` | string | Biệt danh thân mật (Bắt buộc, 1 - 30 ký tự) |
| `status` | string | Luôn ghi nhận `'attending'` |
| `note` | string | Ghi chú riêng cho chủ tiệc (Tuỳ chọn, tối đa 200 ký tự) |
| `createdAt` | timestamp | Thời điểm hoàn tất xác nhận ở Cổng RSVP |

---

## 📦 Build Production

```bash
npm run build
npm run preview
```
