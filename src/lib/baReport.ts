/**
 * BA end-of-shift report: field definitions shared by the manual checkout forms
 * and the Excel template (download → fill → upload).
 */

export type FieldDef = { key: string; label: string }

export type ReportSection = { title: string; fields: FieldDef[] }

export type OtherBrandRow = { id: string; name: string; price: string }

export const interceptionFields: FieldDef[] = [
  { key: 'totalInterceptions', label: 'Total Interceptions' },
  { key: 'productiveCalls', label: 'Productive Calls' },
  { key: 'nonProductiveCalls', label: 'Non-Productive Calls' },
  { key: 'totalSalesKg', label: 'Total Sales (Litres)' },
]

export const competitiveFields: FieldDef[] = [
  { key: 'lipton', label: 'Milkpak' },
  { key: 'vital', label: 'Nestlé' },
  { key: 'supreme', label: 'Haleeb' },
  { key: 'others', label: 'Others' },
]

export const whyNotFields: FieldDef[] = [
  { key: 'taste', label: 'Taste' },
  { key: 'price', label: 'Price' },
  { key: 'packaging', label: 'Packaging' },
]

export const danedarSalesFields: FieldDef[] = [
  { key: 'danedar90', label: 'Olpers 250ml' },
  { key: 'danedar190', label: 'Olpers 1L' },
  { key: 'danedar475', label: 'Olpers 1.5L' },
  { key: 'danedar900', label: 'Family Pack 6×250ml' },
  { key: 'familyPack900', label: 'Family Pack 6×1L' },
  { key: 'familyCarton5', label: 'Carton 12×1L' },
  { key: 'bulkTea25', label: 'Case 12×1.5L' },
  { key: 'salesDanedar', label: 'Sales — Olpers Milk (L)' },
]

export const teaBagSalesFields: FieldDef[] = [
  { key: 'teaBags25', label: 'Olpers Cream 200ml' },
  { key: 'teaBags50', label: 'Olpers Dairy Cream 200ml' },
  { key: 'teaBags100', label: 'Flavoured Milk 180ml' },
  { key: 'teaBags200', label: 'Chocolate Milk 180ml' },
  { key: 'salesTeaBags', label: 'Sales — Cream (packs)' },
]

export const specialtySalesFields: FieldDef[] = [
  { key: 'greenTea100', label: 'Strawberry Milk 180ml' },
  { key: 'greenTea200', label: 'Mango Milk 180ml' },
  { key: 'tezdum250', label: 'Badam Milk 180ml' },
  { key: 'flavored150', label: 'Olpers Kids 180ml' },
  { key: 'salesSpecialty', label: 'Sales — Flavours (packs)' },
]

export const stockDanedarFields: FieldDef[] = [
  { key: 'stockDanedar90', label: 'Olpers 250ml' },
  { key: 'stockDanedar190', label: 'Olpers 1L' },
  { key: 'stockDanedar475', label: 'Olpers 1.5L' },
  { key: 'stockDanedar900', label: 'Family Pack 6×250ml' },
  { key: 'stockFamilyPack900', label: 'Family Pack 6×1L' },
  { key: 'stockFamilyCarton5', label: 'Carton 12×1L' },
  { key: 'stockBulkTea25', label: 'Case 12×1.5L' },
]

export const stockTeaBagFields: FieldDef[] = [
  { key: 'stockTeaBags25', label: 'Olpers Cream 200ml' },
  { key: 'stockTeaBags50', label: 'Olpers Dairy Cream 200ml' },
  { key: 'stockTeaBags100', label: 'Flavoured Milk 180ml' },
  { key: 'stockTeaBags200', label: 'Chocolate Milk 180ml' },
  { key: 'stockGreenTea100', label: 'Strawberry Milk 180ml' },
  { key: 'stockTezdum250', label: 'Olpers Kids 180ml' },
]

export const STOCK_OPTIONS = ['In Stock', 'Out of Stock', 'Near Out of Stock'] as const

export const DEFAULT_OTHER_BRANDS: OtherBrandRow[] = [
  { id: '1', name: 'Milkpak 1L', price: '' },
  { id: '2', name: 'Milkpak 1.5L', price: '' },
  { id: '3', name: 'Nestlé Milk 1L', price: '' },
  { id: '4', name: 'Nestlé Milk 1.5L', price: '' },
  { id: '5', name: 'Haleeb 1L', price: '' },
  { id: '6', name: 'Haleeb Cream 200ml', price: '' },
]

/** Sections in the same order as the checkout flow: Stock → Daily Sales → Other Brands. */
const stockSections: ReportSection[] = [
  { title: 'Olpers Milk', fields: stockDanedarFields },
  { title: 'Olpers Cream & Flavours', fields: stockTeaBagFields },
]

const salesSections: ReportSection[] = [
  { title: 'Interceptions', fields: interceptionFields },
  { title: 'Competitive User', fields: competitiveFields },
  { title: 'Why Not Olpers', fields: whyNotFields },
  { title: 'Olpers Milk', fields: danedarSalesFields },
  { title: 'Olpers Cream', fields: teaBagSalesFields },
  { title: 'Flavoured Milk', fields: specialtySalesFields },
]

export const SESSION_KEYS = {
  stock: 'ba-stock-report',
  sales: 'ba-daily-sales',
  otherBrands: 'ba-other-brands',
  excelName: 'ba-reports-excel',
} as const

const TEMPLATE_SHEET = 'BA Report'
const HEADERS = ['Section', 'Item', 'Value', 'Notes', 'Key'] as const
const COL = { value: 2, key: 4 } as const

const NOTE_STOCK = `Type one of: ${STOCK_OPTIONS.join(' / ')}`
const NOTE_NUMBER = 'Number (0 or more) — leave blank if none'
const NOTE_PRICE = 'Selling price in Rs.'

const brandKey = (row: OtherBrandRow) => `brand-${row.id}`

/** Builds and downloads the .xlsx template with every field of the checkout forms. */
export async function downloadBaReportTemplate() {
  const XLSX = await import('xlsx')

  const rows: (string | number)[][] = [[...HEADERS]]
  for (const s of stockSections) {
    for (const f of s.fields) rows.push([`Stock Report – ${s.title}`, f.label, '', NOTE_STOCK, f.key])
  }
  for (const s of salesSections) {
    for (const f of s.fields) rows.push([`Daily Sales – ${s.title}`, f.label, '', NOTE_NUMBER, f.key])
  }
  for (const b of DEFAULT_OTHER_BRANDS) {
    rows.push(['Other Brands', b.name, '', `${NOTE_PRICE} — at least one required`, brandKey(b)])
  }

  const sheet = XLSX.utils.aoa_to_sheet(rows)
  sheet['!cols'] = [{ wch: 34 }, { wch: 26 }, { wch: 20 }, { wch: 52 }, { wch: 22 }]

  const instructions = XLSX.utils.aoa_to_sheet([
    ['Olpers BA Daily Report — how to fill'],
    [],
    [`1. Fill only the "Value" column (column C) on the "${TEMPLATE_SHEET}" sheet.`],
    [`2. Stock Report: every item is required. Type: ${STOCK_OPTIONS.join(' / ')}.`],
    ['3. Daily Sales: numbers only (0 or more). Leave an item blank if it does not apply.'],
    ['4. Other Brands: enter the selling price in Rs. for at least one pack.'],
    ['5. Do not rename, move or delete rows, and do not edit the "Key" column.'],
    ['6. Save the file, then upload it from the BA app home screen after check-in.'],
  ])
  instructions['!cols'] = [{ wch: 96 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, sheet, TEMPLATE_SHEET)
  XLSX.utils.book_append_sheet(wb, instructions, 'Instructions')

  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `Olpers_BA_Daily_Report_Template_${date}.xlsx`)
}

export type ParsedBaReport = {
  stock: Record<string, string>
  sales: Record<string, string>
  otherBrands: OtherBrandRow[]
}

export type ParseResult = { ok: true; data: ParsedBaReport } | { ok: false; errors: string[] }

/** "in stock", "Out-of-Stock", "NEAR OUT OF STOCK" → canonical option. */
function normalizeStock(raw: string) {
  const squashed = raw.toLowerCase().replace(/[^a-z]/g, '')
  return STOCK_OPTIONS.find((o) => o.toLowerCase().replace(/[^a-z]/g, '') === squashed) ?? null
}

/** Reads a filled template. Returns every problem found so the BA can fix them in one go. */
export async function parseBaReportFile(file: File): Promise<ParseResult> {
  const XLSX = await import('xlsx')

  let table: unknown[][]
  try {
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' })
    const name = wb.SheetNames.includes(TEMPLATE_SHEET) ? TEMPLATE_SHEET : wb.SheetNames[0]
    table = XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[name], { header: 1, defval: '', raw: true })
  } catch {
    return { ok: false, errors: ['This file could not be read. Please upload the downloaded .xlsx template.'] }
  }

  const headerAt = table.findIndex((r) => String(r[COL.key] ?? '').trim().toLowerCase() === 'key')
  if (headerAt === -1) {
    return {
      ok: false,
      errors: ['This is not the BA report template (Key column not found). Download the template and fill that.'],
    }
  }

  const cells = new Map<string, { value: string; row: number; item: string }>()
  table.slice(headerAt + 1).forEach((r, i) => {
    const key = String(r[COL.key] ?? '').trim()
    if (!key) return
    const raw = r[COL.value]
    cells.set(key, {
      value: typeof raw === 'number' ? String(raw) : String(raw ?? '').trim(),
      row: headerAt + i + 2,
      item: String(r[1] ?? key),
    })
  })

  const errors: string[] = []
  const at = (key: string, label: string) => {
    const c = cells.get(key)
    if (!c) errors.push(`Row for "${label}" is missing — do not delete rows from the template.`)
    return c
  }

  const stock: Record<string, string> = {}
  for (const s of stockSections) {
    for (const f of s.fields) {
      const c = at(f.key, `Stock – ${f.label}`)
      if (!c) continue
      const status = c.value ? normalizeStock(c.value) : null
      if (!status) {
        errors.push(
          `Row ${c.row} (Stock – ${s.title} – ${f.label}): choose ${STOCK_OPTIONS.join(', ')}${c.value ? ` (found "${c.value}")` : ''}.`,
        )
      } else {
        stock[f.key] = status
      }
    }
  }

  const parseNumber = (c: { value: string; row: number }, where: string) => {
    if (!c.value) return ''
    const n = Number(c.value.replace(/,/g, ''))
    if (!Number.isFinite(n) || n < 0) {
      errors.push(`Row ${c.row} (${where}): enter a number 0 or more (found "${c.value}").`)
      return ''
    }
    return String(n)
  }

  const sales: Record<string, string> = {}
  for (const s of salesSections) {
    for (const f of s.fields) {
      const c = at(f.key, `Daily Sales – ${f.label}`)
      if (c) sales[f.key] = parseNumber(c, `Daily Sales – ${s.title} – ${f.label}`)
    }
  }

  const otherBrands = DEFAULT_OTHER_BRANDS.map((b) => {
    const c = at(brandKey(b), `Other Brands – ${b.name}`)
    return { ...b, price: c ? parseNumber(c, `Other Brands – ${b.name}`) : '' }
  })
  if (otherBrands.every((b) => !b.price)) {
    errors.push('Other Brands: enter the price for at least one pack.')
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, data: { stock, sales, otherBrands } }
}

/** Saves a parsed report where the manual checkout flow keeps it. */
export function saveBaReport(data: ParsedBaReport, fileName: string) {
  sessionStorage.setItem(SESSION_KEYS.stock, JSON.stringify(data.stock))
  sessionStorage.setItem(SESSION_KEYS.sales, JSON.stringify(data.sales))
  sessionStorage.setItem(SESSION_KEYS.otherBrands, JSON.stringify(data.otherBrands))
  sessionStorage.setItem(SESSION_KEYS.excelName, fileName)
}
