import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export function exportCSV(data, filename = 'data.csv') {
  if (!data.length) return
  const csv = [Object.keys(data[0]).join(','), ...data.map(r => Object.values(r).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function exportXLSX(data, filename = 'data.xlsx') {
  if (!data.length) return
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, filename)
}

export function exportPDF(data, filename = 'data.pdf') {
  if (!data.length) return
  const doc = new jsPDF()
  const head = [Object.keys(data[0])]
  const body = data.map(r => Object.values(r))
  autoTable(doc, { head, body })
  doc.save(filename)
}
