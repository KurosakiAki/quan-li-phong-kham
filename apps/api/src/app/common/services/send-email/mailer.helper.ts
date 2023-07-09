import { formatDateWithTimezone } from '../util.service'

const helpers = {
  eq: (v1, v2) => v1 === v2,
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and() {
    return Array.prototype.every.call(arguments, Boolean);
  },
  or() {
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  },
  inc: (value) => (parseInt(value) + 1),
  formatDate: (dateString: string, formatString: string) => formatDateWithTimezone(dateString, formatString),
  formatCurrency: (num: number) => new Intl.NumberFormat('en-US', { style: 'decimal', }).format(num)
}

export default helpers;
