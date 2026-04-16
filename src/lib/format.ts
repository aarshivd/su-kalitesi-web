import { format, formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

/** Türkçe kısa tarih: 15 Nis 2026 */
export function formatDateTR(date: string | Date): string {
  return format(new Date(date), 'd MMM yyyy', { locale: tr })
}

/** Türkçe tarih + saat: 15 Nis 2026, 14:32 */
export function formatDateTimeTR(date: string | Date): string {
  return format(new Date(date), 'd MMM yyyy, HH:mm', { locale: tr })
}

/** "3 dakika önce", "2 saat önce" vb. */
export function formatRelativeTR(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { locale: tr, addSuffix: true })
}

/** Sayıyı Türkçe locale'e göre biçimlendir, isteğe bağlı ondalık basamak */
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = { maximumFractionDigits: 2 }
): string {
  return new Intl.NumberFormat('tr-TR', options).format(value)
}
