import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useBaShift } from '../../context/BaShiftContext'

type FieldDef = { key: string; label: string }

const interceptionFields: FieldDef[] = [
  { key: 'totalInterceptions', label: 'Total Interceptions' },
  { key: 'productiveCalls', label: 'Productive Calls' },
  { key: 'nonProductiveCalls', label: 'Non-Productive Calls' },
  { key: 'totalSalesKg', label: 'Total Sales (Kg)' },
]

const competitiveFields: FieldDef[] = [
  { key: 'lipton', label: 'Lipton' },
  { key: 'vital', label: 'Vital' },
  { key: 'supreme', label: 'Supreme' },
  { key: 'others', label: 'Others' },
]

const whyNotFields: FieldDef[] = [
  { key: 'taste', label: 'Taste' },
  { key: 'price', label: 'Price' },
  { key: 'packaging', label: 'Packaging' },
]

const danedarSalesFields: FieldDef[] = [
  { key: 'danedar90', label: 'Danedar 90g' },
  { key: 'danedar190', label: 'Danedar 190g' },
  { key: 'danedar475', label: 'Danedar 475g' },
  { key: 'danedar900', label: 'Danedar 900g' },
  { key: 'familyPack900', label: 'Family Pack 900g' },
  { key: 'familyCarton5', label: 'Family Carton 5x475g' },
  { key: 'bulkTea25', label: 'Bulk Tea 2.5kg' },
  { key: 'salesDanedar', label: 'Sales-Danedar (Kg)' },
]

const teaBagSalesFields: FieldDef[] = [
  { key: 'teaBags25', label: 'Tea Bags 25s' },
  { key: 'teaBags50', label: 'Tea Bags 50s' },
  { key: 'teaBags100', label: 'Tea Bags 100s' },
  { key: 'teaBags200', label: 'Tea Bags 200s' },
  { key: 'salesTeaBags', label: 'Sales-Tea Bags (packs)' },
]

const specialtySalesFields: FieldDef[] = [
  { key: 'greenTea100', label: 'Green Tea 100g' },
  { key: 'greenTea200', label: 'Green Tea 200g' },
  { key: 'tezdum250', label: 'Tezdum 250g' },
  { key: 'flavored150', label: 'Flavored Tea 150g' },
  { key: 'salesSpecialty', label: 'Sales-Specialty (Kg)' },
]

const stockDanedarFields: FieldDef[] = [
  { key: 'stockDanedar90', label: 'Danedar 90g' },
  { key: 'stockDanedar190', label: 'Danedar 190g' },
  { key: 'stockDanedar475', label: 'Danedar 475g' },
  { key: 'stockDanedar900', label: 'Danedar 900g' },
  { key: 'stockFamilyPack900', label: 'Family Pack 900g' },
  { key: 'stockFamilyCarton5', label: 'Family Carton 5x475g' },
  { key: 'stockBulkTea25', label: 'Bulk Tea 2.5kg' },
]

const stockTeaBagFields: FieldDef[] = [
  { key: 'stockTeaBags25', label: 'Tea Bags 25s' },
  { key: 'stockTeaBags50', label: 'Tea Bags 50s' },
  { key: 'stockTeaBags100', label: 'Tea Bags 100s' },
  { key: 'stockTeaBags200', label: 'Tea Bags 200s' },
  { key: 'stockGreenTea100', label: 'Green Tea 100g' },
  { key: 'stockTezdum250', label: 'Tezdum 250g' },
]

const STOCK_OPTIONS = ['In Stock', 'Out of Stock', 'New Out of Stock'] as const

function emptyNumeric(fields: FieldDef[]) {
  return Object.fromEntries(fields.map((f) => [f.key, ''])) as Record<string, string>
}

function emptyStock(fields: FieldDef[]) {
  return Object.fromEntries(fields.map((f) => [f.key, ''])) as Record<string, string>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <h3 className="border-b border-slate-100 pb-2 text-sm font-bold text-navy-900">{title}</h3>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      <input
        type="number"
        min={0}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-full rounded-xl border border-slate-200 bg-[#faf6ee] px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
      />
    </label>
  )
}

function StockCheckboxes({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-[#faf6ee] px-3 py-3">
      <div className="text-xs font-semibold text-slate-700">{label}</div>
      <div className="mt-2.5 flex flex-col gap-2.5">
        {STOCK_OPTIONS.map((opt) => {
          const checked = value === opt
          return (
            <label key={opt} className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onChange(checked ? '' : opt)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 accent-brand-600 focus:ring-brand-500/30"
              />
              <span className={checked ? 'font-semibold text-brand-700' : 'font-medium'}>{opt}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

function PageChrome({
  title,
  subtitle,
  onBack,
}: {
  title: string
  subtitle?: string
  onBack?: () => void
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600"
          aria-label="Back"
        >
          <ArrowLeft size={16} />
        </button>
      )}
      <div className="min-w-0">
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
  )
}

export function BaDailySalesPage() {
  const navigate = useNavigate()
  const { city } = useBaShift()

  const allFields = useMemo(
    () => [
      ...interceptionFields,
      ...competitiveFields,
      ...whyNotFields,
      ...danedarSalesFields,
      ...teaBagSalesFields,
      ...specialtySalesFields,
    ],
    [],
  )

  const [values, setValues] = useState(() => emptyNumeric(allFields))

  function setField(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleContinue(e: FormEvent) {
    e.preventDefault()
    sessionStorage.setItem('ba-daily-sales', JSON.stringify(values))
    navigate('/ba/other-brands')
  }

  return (
    <form onSubmit={handleContinue} className="space-y-4 bg-[#f7f4ec] p-4 pb-8">
      <PageChrome
        title="Daily Sales"
        subtitle={`${city} · enter today's interceptions & SKU sales`}
        onBack={() => navigate('/ba/stock-report')}
      />

      <Section title="Interceptions">
        {interceptionFields.map((f) => (
          <NumberField
            key={f.key}
            label={f.label}
            value={values[f.key]}
            onChange={(v) => setField(f.key, v)}
          />
        ))}
      </Section>

      <Section title="Competitive User">
        {competitiveFields.map((f) => (
          <NumberField
            key={f.key}
            label={f.label}
            value={values[f.key]}
            onChange={(v) => setField(f.key, v)}
          />
        ))}
      </Section>

      <Section title="Why Not Tapal">
        {whyNotFields.map((f) => (
          <NumberField
            key={f.key}
            label={f.label}
            value={values[f.key]}
            onChange={(v) => setField(f.key, v)}
          />
        ))}
      </Section>

      <Section title="Tapal Danedar">
        {danedarSalesFields.map((f) => (
          <NumberField
            key={f.key}
            label={f.label}
            value={values[f.key]}
            onChange={(v) => setField(f.key, v)}
          />
        ))}
      </Section>

      <Section title="Tea Bags">
        {teaBagSalesFields.map((f) => (
          <NumberField
            key={f.key}
            label={f.label}
            value={values[f.key]}
            onChange={(v) => setField(f.key, v)}
          />
        ))}
      </Section>

      <Section title="Specialty">
        {specialtySalesFields.map((f) => (
          <NumberField
            key={f.key}
            label={f.label}
            value={values[f.key]}
            onChange={(v) => setField(f.key, v)}
          />
        ))}
      </Section>

      <button
        type="submit"
        className="w-full rounded-2xl bg-navy-900 py-3.5 text-base font-semibold text-white shadow-md shadow-navy-900/20 transition hover:bg-brand-600"
      >
        Next · Other Brands
      </button>
    </form>
  )
}

export function BaStockReportPage() {
  const navigate = useNavigate()
  const { checkOut } = useBaShift()
  const [stock, setStock] = useState(() =>
    emptyStock([...stockDanedarFields, ...stockTeaBagFields]),
  )

  function setField(key: string, value: string) {
    setStock((prev) => ({ ...prev, [key]: value }))
  }

  const allFilled = [...stockDanedarFields, ...stockTeaBagFields].every((f) => stock[f.key])

  function handleContinue(e: FormEvent) {
    e.preventDefault()
    if (!allFilled) return
    checkOut()
    sessionStorage.setItem('ba-stock-report', JSON.stringify(stock))
    navigate('/ba/daily-sales')
  }

  return (
    <form onSubmit={handleContinue} className="space-y-4 bg-[#f7f4ec] p-4 pb-8">
      <PageChrome
        title="Stock Report"
        subtitle="Mark In Stock, Out of Stock, or New Out of Stock for each SKU"
        onBack={() => navigate('/ba/home')}
      />

      <Section title="Tapal Danedar">
        {stockDanedarFields.map((f) => (
          <StockCheckboxes
            key={f.key}
            label={f.label}
            value={stock[f.key]}
            onChange={(v) => setField(f.key, v)}
          />
        ))}
      </Section>

      <Section title="Tea Bags & Specialty">
        {stockTeaBagFields.map((f) => (
          <StockCheckboxes
            key={f.key}
            label={f.label}
            value={stock[f.key]}
            onChange={(v) => setField(f.key, v)}
          />
        ))}
      </Section>

      <button
        type="submit"
        disabled={!allFilled}
        className="w-full rounded-2xl bg-navy-900 py-3.5 text-base font-semibold text-white shadow-md shadow-navy-900/20 transition enabled:hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-45"
      >
        Next · Daily Sales
      </button>
    </form>
  )
}

type OtherBrandRow = { id: string; name: string; price: string }

const DEFAULT_OTHER_BRANDS: OtherBrandRow[] = [
  { id: '1', name: 'Lipton 190g', price: '' },
  { id: '2', name: 'Lipton 475g', price: '' },
  { id: '3', name: 'Vital 190g', price: '' },
  { id: '4', name: 'Vital 475g', price: '' },
  { id: '5', name: 'Supreme 190g', price: '' },
  { id: '6', name: 'Supreme Tea Bags 50s', price: '' },
]

export function BaOtherBrandsPage() {
  const navigate = useNavigate()
  const { markReportSubmitted } = useBaShift()
  const [rows, setRows] = useState<OtherBrandRow[]>(DEFAULT_OTHER_BRANDS)
  const [submitted, setSubmitted] = useState(false)

  function updateRow(id: string, patch: Partial<OtherBrandRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const canSubmit = rows.some((r) => r.name.trim() && r.price.trim())

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    const payload = rows.filter((r) => r.name.trim() || r.price.trim())
    sessionStorage.setItem('ba-other-brands', JSON.stringify(payload))
    markReportSubmitted()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#f7f4ec] p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">Your Data has been Submitted</h2>
        <p className="mt-2 max-w-xs text-sm text-slate-500">
          Stock report, daily sales, and other brand prices were saved for today&apos;s shift.
        </p>
        <button
          type="button"
          onClick={() => navigate('/ba/home')}
          className="mt-6 w-full max-w-xs rounded-2xl bg-navy-900 py-3.5 text-base font-semibold text-white shadow-md shadow-navy-900/20 transition hover:bg-brand-600"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-[#f7f4ec] p-4 pb-8">
      <PageChrome
        title="Other Brands"
        subtitle="Enter selling price for each competitor brand / pack"
        onBack={() => navigate('/ba/daily-sales')}
      />

      <Section title="Competitor prices">
        {rows.map((row, index) => (
          <div
            key={row.id}
            className="rounded-xl border border-slate-100 bg-[#faf6ee] p-3 space-y-2.5"
          >
            <span className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              Brand {index + 1}
            </span>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">
                Brand / pack name
              </span>
              <input
                type="text"
                value={row.name}
                disabled
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-600">Price (Rs.)</span>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={row.price}
                onChange={(e) => updateRow(row.id, { price: e.target.value })}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
              />
            </label>
          </div>
        ))}
      </Section>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-2xl bg-navy-900 py-3.5 text-base font-semibold text-white shadow-md shadow-navy-900/20 transition enabled:hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-45"
      >
        Submit
      </button>
    </form>
  )
}
