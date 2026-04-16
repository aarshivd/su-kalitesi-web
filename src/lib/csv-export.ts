import Papa from 'papaparse'

/**
 * Veriyi CSV string'e dönüştürür.
 * @param data  Dizi içinde sıralı obje dizisi
 * @param fields Sütun sırası ve başlık eşlemesi
 */
export function toCsv<T extends Record<string, unknown>>(
  data: T[],
  fields?: string[]
): string {
  return Papa.unparse(data, { columns: fields })
}

/**
 * CSV dosyasını tarayıcıda indirir.
 */
export function downloadCsv(csvString: string, filename: string): void {
  const blob = new Blob(['\uFEFF' + csvString], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
