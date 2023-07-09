import { UserRoleEnum } from "@api-interfaces";

export const menuItems = [
  { path: '/app/dang-ky-kham', 
    title: 'Đăng ký lịch khám',
    roles: [UserRoleEnum.GUEST, UserRoleEnum.PATIENT],
  },
  { path: '/app/ho-so', 
    title: 'Sổ khám chữa bệnh',
    roles: [UserRoleEnum.PATIENT],
  },
  {
    path: '/danh-sach',
    title: 'Danh sách',
    roles: [UserRoleEnum.PATIENT],
    children: [
      { path: '/app/lich-kham', title: 'Lịch khám' },
      { path: '/app/hoa-don', title: 'Hóa Đơn' },
    ],
  }
];
