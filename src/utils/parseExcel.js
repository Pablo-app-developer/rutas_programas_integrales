import * as XLSX from 'xlsx'
import { TODAS } from '../theme.js'

// Filtra por ruta, o devuelve todos los registros si es "Todas"
function filtrarRuta(records, ruta) {
  if (!ruta || ruta === TODAS) return records
  return records.filter(r => r.ruta === ruta)
}

function parseCOP(value) {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return isNaN(value) ? 0 : value
  const cleaned = String(value).replace(/\$|\s/g, '').replace(/\./g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

function parseNum(value) {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return isNaN(value) ? 0 : value
  const cleaned = String(value).replace(/[^\d,.-]/g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

function parsePct(value) {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return value <= 1 ? value : value / 100
  const cleaned = String(value).replace('%', '').replace(',', '.').trim()
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num / 100
}

export function parseFromArrayBuffer(ab) {
  const wb = XLSX.read(ab, { type: 'array' })
  const data12 = parseSheet(wb, 'BASE12MESES', 12)
  const data18 = parseSheet(wb, 'BASE18MESES', 18)
  return { data12, data18 }
}

export async function loadDashboardData() {
  const res = await fetch('./datos.xlsx')
  const ab = await res.arrayBuffer()
  return parseFromArrayBuffer(ab)
}

function parseSheet(wb, sheetName, duracion) {
  const ws = wb.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
  const is12 = duracion === 12
  // Índices de columna (0-based) según duración
  const IDX = is12
    ? { total: 27, cant: 28, modalidad: 29, pct: 30, valor: 31, ruta: 32 }
    : { total: 39, cant: 40, modalidad: 41, pct: 42, valor: 43, ruta: 44 }

  const records = []
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    const codigo = String(r[0] || '').trim()
    const servicio = String(r[1] || '').trim()
    const categoria = String(r[2] || '').trim()
    const ruta = String(r[IDX.ruta] || '').trim()
    if (!codigo || !ruta) continue

    const cantidad = parseNum(r[IDX.cant])
    const total = parseCOP(r[IDX.total])
    const valorCosto = parseCOP(r[IDX.valor])
    const unitario = cantidad > 0 ? total / cantidad : total

    const costosMes = []
    for (let m = 0; m < duracion; m++) costosMes.push(parseCOP(r[4 + m * 2]))

    records.push({
      codigo, servicio, categoria, ruta,
      modalidad: String(r[IDX.modalidad] || '').trim(),
      pctUso: parsePct(r[IDX.pct]),
      cantidad, total, valorCosto, unitario, costosMes, duracion,
    })
  }
  return records
}

// ── Agregaciones ────────────────────────────────────────────────

export function totalesPorRuta(records) {
  const map = {}
  for (const r of records) {
    if (!map[r.ruta]) map[r.ruta] = { ruta: r.ruta, total: 0, servicios: 0, usos: 0 }
    map[r.ruta].total += r.valorCosto
    map[r.ruta].servicios++
    map[r.ruta].usos += r.cantidad
  }
  return Object.values(map).sort((a, b) => b.total - a.total)
}

export function totalRuta(records, ruta) {
  return filtrarRuta(records, ruta).reduce((s, r) => s + r.valorCosto, 0)
}

// Desglose por categoría para una ruta (fishbone / pareto)
export function categoriasDeRuta(records, ruta) {
  const filtered = filtrarRuta(records, ruta)
  const map = {}
  for (const r of filtered) {
    if (!r.categoria) continue
    if (!map[r.categoria]) map[r.categoria] = { categoria: r.categoria, total: 0, items: [] }
    map[r.categoria].total += r.valorCosto
    map[r.categoria].items.push(r)
  }
  const arr = Object.values(map).sort((a, b) => b.total - a.total)
  const suma = arr.reduce((s, c) => s + c.total, 0)
  return arr.map(c => ({ ...c, pct: suma > 0 ? c.total / suma : 0 }))
}

// Pareto: categorías ordenadas con acumulado
export function paretoCategorias(records, ruta) {
  const cats = categoriasDeRuta(records, ruta)
  const suma = cats.reduce((s, c) => s + c.total, 0)
  let acum = 0
  return cats.map(c => {
    acum += c.total
    return {
      categoria: c.categoria,
      valor: c.total,
      pct: c.pct,
      acumulado: suma > 0 ? (acum / suma) * 100 : 0,
    }
  })
}

// Tabla detallada agrupada por categoría con subtotales
export function tablaDetallada(records, ruta) {
  const cats = categoriasDeRuta(records, ruta)
  const totalRutaVal = cats.reduce((s, c) => s + c.total, 0)
  return cats.map(c => {
    const items = [...c.items]
      .sort((a, b) => b.valorCosto - a.valorCosto)
      .map(r => ({
        servicio: r.servicio,
        cantidad: r.cantidad,
        unitario: r.unitario,
        total: r.valorCosto,
        pct: totalRutaVal > 0 ? r.valorCosto / totalRutaVal : 0,
      }))
    return {
      categoria: c.categoria,
      items,
      subtotal: c.total,
      subtotalPct: totalRutaVal > 0 ? c.total / totalRutaVal : 0,
    }
  })
}

// Métricas para comparativo 12m vs 18m de una ruta
export function comparativoRuta(data12, data18, ruta) {
  const r12 = filtrarRuta(data12, ruta)
  const r18 = filtrarRuta(data18, ruta)
  const costo12 = r12.reduce((s, r) => s + r.valorCosto, 0)
  const costo18 = r18.reduce((s, r) => s + r.valorCosto, 0)
  const usos12 = r12.reduce((s, r) => s + r.cantidad, 0)
  const usos18 = r18.reduce((s, r) => s + r.cantidad, 0)
  const mensual12 = costo12 / 12
  const mensual18 = costo18 / 18
  const varPct = (a, b) => (a > 0 ? ((b - a) / a) * 100 : 0)
  return [
    { concepto: 'Costo Total por Paciente', kind: 'dollar', v12: costo12, v18: costo18, fmt: 'cop', variacion: varPct(costo12, costo18) },
    { concepto: 'Número Total de Servicios', kind: 'list', v12: usos12, v18: usos18, fmt: 'num', variacion: varPct(usos12, usos18) },
    { concepto: 'Costo Promedio Mensual', kind: 'calendar', v12: mensual12, v18: mensual18, fmt: 'cop', variacion: varPct(mensual12, mensual18) },
  ]
}

// Datos para el mapa estratégico (scatter): costo (Y) vs uso (X)
// Y por ranking de costo (separación uniforme, evita amontonar rutas de costo similar);
// X por uso real normalizado. Así cada ruta queda en su propia franja vertical.
export function mapaEstrategico(records) {
  const rutas = totalesPorRuta(records) // ya viene ordenado por costo desc
  const n = rutas.length
  const usos = rutas.map(r => r.usos)
  const minU = Math.min(...usos), maxU = Math.max(...usos)
  const normU = v => (maxU > minU ? ((v - minU) / (maxU - minU)) * 100 : 50)
  return rutas.map((r, i) => ({
    ruta: r.ruta,
    x: 10 + normU(r.usos) * 0.8,                  // 10–90% según uso real
    y: 88 - (i / Math.max(n - 1, 1)) * 76,        // 88%→12% uniforme por ranking de costo
    costo: r.total,
    usos: r.usos,
    rank: i,
  }))
}

// ── Formato ─────────────────────────────────────────────────────

export function formatCOPfull(v) {
  if (!v || isNaN(v)) return '$0'
  return '$' + Math.round(v).toLocaleString('es-CO')
}

export function formatCOP(v) {
  if (!v || isNaN(v)) return '$0'
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
  return `$${Math.round(v)}`
}

export function formatPct(v) {
  return `${(v * 100).toFixed(v < 0.1 ? 1 : 0)}%`
}
