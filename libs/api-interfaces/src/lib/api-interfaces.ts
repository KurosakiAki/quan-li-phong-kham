export interface ISystemLogChangeData {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface IPaginateResponse<T> {
  data: T[];
  count: number;
  currentPage: number;
  nextPage?: number;
  prevPage?: number;
  lastPage?: number;
}

export interface BaseModelFields {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  updatedUser: number;
  deletedUser: number;
}

export interface IUserRole {
  id: number;
  name: string;
  code: string;
}

export interface BasePerson extends BaseModelFields{
  userId: number;
  referenceId: number;
  birthday: string;
  gender: string;
  email: string;
  fullname: string;
  phone: string;
  address: string;
}

export interface IUser extends BasePerson {
  roleId: number;
  specialistId?: string;
  userRole: IUserRole;
  userRoleCode: string;
  username: string;
}

export interface INhanVien extends BasePerson {}

export interface IBenhNhan extends BasePerson {
  tienSuBenh: string;
}

export interface IBacSi extends BasePerson {
  specialistId: number;
}

export interface INhaCungCap extends BaseModelFields{
  email: string;
  fullname: string;
  phone: string;
  address: string;
}

export interface IChangePassword {
  password: string;
  confirmPassword: string;
}

export interface ILichKham extends BaseModelFields {
  tenBenhNhan: string;
  tenBenhNhanLowerCase?: string;
  soDienThoai: string;
  diaChi: string;
  thoiGianKham: Date;
  lyDo: string;
}

export interface IChuyenKhoa extends BaseModelFields {
  tenChuyenKhoa: string;
}

export interface IThuoc extends BaseModelFields {
  tenThuoc: string;
  donVi: string;
  donGia: number;
  tonKho: number;
}

export interface IDonThuoc extends BaseModelFields {
  lichKhamId: number;
  loiDan: string;
}

export interface IChiTietDonThuoc extends BaseModelFields {
  donThuocId: number;
  thuocId: number;
  soLuong: number;
  cachDung: string;
}

export interface INhapKhoThuoc extends BaseModelFields {
  nhaCungCapId: number;
  maNhapKho: string;
  tongTien: number;
}

export interface IChiTietThuoc extends BaseModelFields {
  nhapKhoThuocId: number;
  thuocId: number;
  maNhapKho: string;
  soLuong: number;
  soLuongConLai: number;
  giaNhap: number;
  ngayHetHan: Date;
  tongNhap: number;
  tongTien: number;
}

export interface IDichVu extends BaseModelFields {
  tenDichVu: string;
  donVi: string;
  loai: string;
  donGia: number;
}

export interface IPhieuDichVu extends BaseModelFields {
  lichKhamId: number;
}

export interface IChiTietPhieuDichVu extends BaseModelFields {
  phieuDichVuId: number;
  dichVuId: number;
}

export interface IHoaDon extends BaseModelFields {
  khachHangId: number;
  maHoaDon: string;
  tongTien: number;
  trangThai: string;
}

export interface IChiTietHoaDon extends BaseModelFields {
  hoaDonId: number;
  thuocId: number;
  dichVuId: number;
  soLuong: number;
  thanhTien: number;
}