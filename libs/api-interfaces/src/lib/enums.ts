export enum UserRoleEnum {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  STAFF = "STAFF",
  PATIENT = "PATIENT",
  GUEST = "GUEST"
}

export enum SystemLogObjectTypeEnum {
  USER = 'user',
  LICH_KHAM = 'lichkham',
  DICH_VU = 'dich_vu',
  PHIEU_DICH_VU = 'phieu_dich_vu',
  CHI_TIET_PHIEU_DICH_VU = 'ct_phieu_dich_vu',
  HOA_DON = 'hoa_don',
  NHA_CUNG_CAP = 'nha_cung_cap',
  THUOC = 'thuoc',
  CHI_TIET_THUOC = 'chi_tiet_thuoc',
  DON_THUOC = 'don_thuoc',
  CHI_TIET_DON_THUOC = 'chi_tiet_don_thuoc',
  NHAP_KHO_THUOC = 'nhap_kho_thuoc',
  CHUYEN_KHOA = 'chuyen_khoa'
}

export enum WebFeatures {
    AUTH = 'auth'
};


export enum SystemLogTypeEnum {
  DELETE = 0,
  CREATE = 1,
  UPDATE = 2
}

