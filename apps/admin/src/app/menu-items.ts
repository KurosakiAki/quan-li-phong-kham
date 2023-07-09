import { UserRoleEnum } from "@api-interfaces";

export const menuItems = [
  { path: '/app/lich-kham-hom-nay', 
    title: 'Lịch khám hôm nay',
    roles: [UserRoleEnum.DOCTOR],
  },
  {
    path: '/quan-ly',
    title: 'Quản lý',
    children: [
      { path: '/app/users', title: 'Tài khoản', roles: [UserRoleEnum.ADMIN] },
      { path: '/app/lich-kham', title: 'Lịch khám' },
      { path: '/app/benh-nhan', title: 'Bệnh nhân' },
      { path: '/app/dich-vu', title: 'Dịch vụ'},
      { path: '/app/chuyen-khoa', title: 'Chuyên khoa'},
      { path: '/app/nha-cung-cap', title: 'Nhà cung cấp', roles: [UserRoleEnum.ADMIN, UserRoleEnum.STAFF], },
    ],
  },
  {
    path: '/thong-tin',
    title: 'Thông tin',
    children: [
      { path: '/app/bac-si', title: 'Bác sĩ' },
      { path: '/app/nhan-vien', title: 'Nhân viên' },
    ],
  },
  {
    path: '/thuoc',
    title: 'Thuốc',
    children: [
      { path: '/app/danh-sach-thuoc', title: 'Thuốc' },
      { path: '/app/nhap-kho', title: 'Nhập kho', roles: [UserRoleEnum.ADMIN, UserRoleEnum.STAFF] },
      { path: '/app/tinh-trang', title: 'Tình trạng lô thuốc', roles: [UserRoleEnum.ADMIN, UserRoleEnum.STAFF] },
    ],
  },
  {
    path: '/kham-benh',
    title: 'Khám bệnh',
    children: [
      { path: '/app/don-thuoc', title: 'Đơn thuốc' },
      { path: '/app/phieu-dich-vu', title: 'Phiếu dịch vụ' },
      { path: '/app/phieu-kham-benh', title: 'Phiếu khám bệnh' },
    ],
  },
  {
    path: '/app/hoa-don', 
    title: 'Hóa đơn',
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.STAFF],
  }
];
