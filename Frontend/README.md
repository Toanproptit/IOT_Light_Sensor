# Lumina IoT Dashboard

Frontend React/Vite mô phỏng hệ thống điều khiển đèn và theo dõi cảm biến IoT.

## Cấu trúc thư mục

```text
src/
├── components/
│   ├── common/          # Component dùng lại: table, toggle, toast, page intro
│   └── layout/          # Sidebar, topbar và dashboard layout
├── config/              # Navigation và cấu hình ứng dụng
├── features/            # Mỗi nghiệp vụ là một module độc lập
│   ├── activity/        # Lịch sử bật/tắt
│   ├── devices/         # Điều khiển thiết bị
│   ├── overview/        # Dashboard tổng quan và biểu đồ
│   ├── profile/         # Hồ sơ và tài nguyên dự án
│   └── sensors/         # Lịch sử cảm biến
├── hooks/               # Custom hooks dùng chung
├── mocks/               # Dữ liệu giả lập cho giao diện
├── styles/              # CSS chia theo phạm vi trách nhiệm
├── App.jsx              # State dùng chung và điều phối các màn hình
└── main.jsx             # Entry point
```

## Vị trí thường chỉnh sửa

- Thay mock data: `src/mocks/iotData.js`
- Thêm/sửa menu: `src/config/navigation.js`
- Sửa trang tổng quan: `src/features/overview/OverviewPage.jsx`
- Sửa điều khiển đèn: `src/features/devices/DeviceControlPage.jsx`
- Sửa profile và các liên kết: `src/features/profile/ProfilePage.jsx`
- Xem/chỉnh API backend dự kiến: `public/docs/API_DOCUMENTATION.md`
- Sửa màu, token và reset: `src/styles/globals.css`
- Sửa responsive: `src/styles/responsive.css`

## Chạy dự án

```bash
npm install
npm run dev
```

Kiểm tra trước khi bàn giao:

```bash
npm run lint
npm run build
```
