import { format, parse } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const DISPLAY_TIMEZONE = 'Asia/Ho_Chi_Minh'

/**
 * Biến đổi chuỗi Date hoặc chuỗi ISO 2021-01-27T09:11:48.473Z -> 27/01/2021
 * @param isoString string|Date 2021-01-27T09:11:48.473Z
 * @param formatStr yyyy-MM-dd HH:mm
 */
export function formatDateWithTimezone(isoString: string | Date, formatStr: string) {
  try {
    return isoString ? format(utcToZonedTime(isoString, DISPLAY_TIMEZONE), formatStr) : ''
  } catch (err) {
    return ''
  }
}

export function trimSpecialString(origStr: string) {
  return origStr ? origStr.trim() : origStr
  // replace(/[^ỲÝỴỶỸÙÚỤỦŨƯỪỨỰỬỮÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÌÍỊỈĨÈÉẸẺẼÊỀẾỆỂỄàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữđĐÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ\w\s]/gi, '')
}

/**
 * Remove all vietnamese unicode characters and convert to lowerCase
 * @param str
 */
export function removeVietnamese(str: string) {
  const ret = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
    .replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
    .replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
    .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
    .replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
    .replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
    .replace(/Đ/g, 'D')
    .replace(/[^\w\s]/gi, '')
    .toLowerCase()
    //.replace(/[&]/g, "-and-")
    //.replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/[-]+/g, '-')
    .replace(/-$/, '');

  return ret;
}

export function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
};

/**
 * Convert excel date column to js date
 * @param serial number | string in 'D/M/YYYY' format
 * @returns
 */
export function excelDateToJSDate(serial: number | string) {
  if (!serial) return null;
  if (typeof serial === 'number') {
    const utc_days  = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    const fractional_day = serial - Math.floor(serial) + 0.0000001;

    let total_seconds = Math.floor(86400 * fractional_day);

    const seconds = total_seconds % 60;

    total_seconds -= seconds;

    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
  } else {
    return parse(serial, 'd/M/yyyy', new Date());
  }
}

/**
 * Convert excel date column to js date
 * @param serial number | string
 * @returns date in 'YYYY-MM-DD' format
 */
export function excelDateToSQLDate(serial: number | string) {
  if (!serial) return null;
  const date = excelDateToJSDate(serial);
  return format(date, 'yyyy-MM-dd');
}
