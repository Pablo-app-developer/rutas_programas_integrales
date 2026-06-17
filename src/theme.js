// Sistema de diseño — réplica fiel de la infografía gerencial (tema claro)

export const COLORS = {
  navy: '#1F3D5C',
  navyDark: '#16314A',
  navyLight: '#2C5582',
  bg: '#EEF1F5',
  panel: '#FFFFFF',
  border: '#D8DEE6',
  textDark: '#1F2D3D',
  textMute: '#64748B',
  calloutBg: '#EAF2F9',
  calloutBorder: '#1F6FB2',
  up: '#E03A3A',     // variación al alza (rojo)
  down: '#1E8449',   // variación a la baja (verde)
  star: '#F2B705',
}

// Categorías reales del Excel → color e ícono (estilo fishbone de la referencia)
export const CATEGORIAS = {
  'Terapias': { color: '#CA6510', icon: '🩺', label: 'TERAPIAS' },
  'Consultas': { color: '#1F6FB2', icon: '🩺', label: 'CONSULTAS' },
  'Diagnosticos': { color: '#1E8449', icon: '🔬', label: 'DIAGNÓSTICOS' },
  'Educacion': { color: '#138086', icon: '📚', label: 'EDUCACIÓN' },
  'Gestion y seguimiento': { color: '#7D3C98', icon: '📋', label: 'GESTIÓN Y SEGUIMIENTO' },
  'Medicamentos': { color: '#C0392B', icon: '💊', label: 'MEDICAMENTOS' },
}

export function catMeta(cat) {
  return CATEGORIAS[cat] || { color: '#64748B', icon: '•', label: (cat || '').toUpperCase() }
}

// Valor especial para "todas las rutas agregadas"
export const TODAS = '__TODAS__'

// Metadatos de cada ruta clínica: nombre corto, color de marca (el ícono vive en icons.jsx)
export const RUTAS_META = {
  'CESACION TABAQUICA':    { short: 'Cesación\nTabáquica',     color: '#1E8449' },
  'NODULO PULMONAR':       { short: 'Nódulo\nPulmonar',        color: '#7D3C98' },
  'HIPERTENCION PULMONAR': { short: 'Hipertensión\nPulmonar',  color: '#E03A3A' },
  'ASMA':                  { short: 'Asma',                    color: '#1F6FB2' },
  'EPI':                   { short: 'EPI',                      color: '#16A085' },
  'EPOC':                  { short: 'EPOC',                     color: '#D35400' },
  'DISNEA - OBESIDAD':     { short: 'Disnea\nObesidad',        color: '#C0392B' },
  'TRASTORNOS DE SUEÑO':   { short: 'Trastornos\ndel Sueño',   color: '#8E44AD' },
  'EJERCICIO FISICO':      { short: 'Ejercicio\nFísico',       color: '#2E86C1' },
  'CUIDADO RESPIRATORIO':  { short: 'Cuidado\nRespiratorio',   color: '#117A65' },
}

export function rutaMeta(ruta) {
  return RUTAS_META[ruta] || { short: ruta, color: '#1F6FB2' }
}

// Etiqueta legible de la ruta (o "Todas las Rutas")
export function rutaLabel(ruta) {
  if (!ruta || ruta === TODAS) return 'Todas las Rutas'
  return ruta.charAt(0) + ruta.slice(1).toLowerCase()
}

// Orden canónico de rutas (como aparece en la infografía / selector)
export const RUTAS = [
  'CESACION TABAQUICA', 'NODULO PULMONAR', 'HIPERTENCION PULMONAR', 'ASMA', 'EPI',
  'EPOC', 'DISNEA - OBESIDAD', 'TRASTORNOS DE SUEÑO', 'EJERCICIO FISICO', 'CUIDADO RESPIRATORIO',
]

const MOD_LABELS = {
  'FIJO': 'Fijos', 'Fijo': 'Fijos', 'fijo': 'Fijos',
  'PROBABILISTICO': 'Probabilísticos', 'Probabilistico': 'Probabilísticos',
  'probabilistico': 'Probabilísticos', 'PROBABILÍSTICO': 'Probabilísticos',
}
export function modLabel(v) {
  return MOD_LABELS[v] || (v.charAt(0).toUpperCase() + v.slice(1).toLowerCase())
}

// Nivel de impacto económico por cuartil de costo → color del mapa estratégico
export const IMPACTO = {
  muyAlto: { color: '#E03A3A', label: 'Muy Alto' },
  alto:    { color: '#E67E22', label: 'Alto' },
  medio:   { color: '#1E8449', label: 'Medio' },
  bajo:    { color: '#2E86C1', label: 'Bajo' },
}

export function impactoTier(rank, total) {
  const p = rank / total
  if (p <= 0.25) return IMPACTO.muyAlto
  if (p <= 0.5) return IMPACTO.alto
  if (p <= 0.75) return IMPACTO.medio
  return IMPACTO.bajo
}
