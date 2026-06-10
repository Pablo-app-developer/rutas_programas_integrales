import { useState, useRef } from 'react'
import { useData } from './hooks/useData.js'
import { parseFromArrayBuffer } from './utils/parseExcel.js'
import { RUTAS, TODAS, COLORS } from './theme.js'
import Sec1Resumen from './components/sections/Sec1Resumen.jsx'
import Sec2Fishbone from './components/sections/Sec2Fishbone.jsx'
import Sec3Pareto from './components/sections/Sec3Pareto.jsx'
import Sec4Tabla from './components/sections/Sec4Tabla.jsx'
import Sec5Comparativo from './components/sections/Sec5Comparativo.jsx'
import Sec6Mapa from './components/sections/Sec6Mapa.jsx'
import { LayoutGrid } from './icons.jsx'

const BASES = {
  '12': { label: 'Ruta Normal (12 meses)', short: 'Ruta Normal', meses: '12 meses', color: COLORS.navyLight },
  '18': { label: 'Ruta Ecopetrol (18 meses)', short: 'Ruta Ecopetrol', meses: '18 meses', color: '#1E8449' },
}

export default function App() {
  const { data12, data18, loading, error, reemplazarDatos } = useData()
  const [selectedRuta, setSelectedRuta] = useState('ASMA')
  const [baseActiva, setBaseActiva] = useState('12')
  const [uploadStatus, setUploadStatus] = useState(null) // null | 'loading' | 'ok' | 'error'
  const fileInputRef = useRef(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadStatus('loading')
    try {
      const ab = await file.arrayBuffer()
      const parsed = parseFromArrayBuffer(ab)
      reemplazarDatos(parsed)
      setUploadStatus('ok')
      setTimeout(() => setUploadStatus(null), 2500)
    } catch {
      setUploadStatus('error')
      setTimeout(() => setUploadStatus(null), 3000)
    }
    e.target.value = ''
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse" style={{ color: COLORS.navy }}>⟳</div>
          <div className="text-sm" style={{ color: COLORS.textMute }}>Cargando datos…</div>
        </div>
      </div>
    )
  }
  if (error) return <div className="flex items-center justify-center h-screen text-red-600 text-sm">⚠ {error}</div>

  const records = baseActiva === '12' ? data12 : data18
  const baseLabel = BASES[baseActiva].label

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh' }}>
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-3 gap-4 flex-wrap" style={{ background: COLORS.navy }}>
        <div>
          <h1 className="text-white font-bold uppercase leading-tight" style={{ fontSize: 22, letterSpacing: '0.01em' }}>
            Estructura del Costo por Programa y Uso de Recursos Médicos
          </h1>
          <p className="text-slate-300" style={{ fontSize: 12 }}>
            Análisis por ruta clínica – Cifras promedio por paciente
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Selector de ruta */}
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 11 }} className="text-slate-300">Ruta:</span>
            <select
              value={selectedRuta}
              onChange={e => setSelectedRuta(e.target.value)}
              className="rounded px-2 py-1 font-semibold"
              style={{ background: '#fff', color: COLORS.navy, fontSize: 12, border: 'none', maxWidth: 200 }}
            >
              <option value={TODAS}>★ Todas las Rutas</option>
              {RUTAS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Toggle de base 12/18 meses */}
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 11 }} className="text-slate-300">Base:</span>
            <div className="flex rounded-md overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.25)' }}>
              {Object.entries(BASES).map(([key, b]) => {
                const on = baseActiva === key
                return (
                  <button key={key} onClick={() => setBaseActiva(key)}
                    className="flex items-center gap-1.5 px-3 py-1.5 font-semibold transition-colors"
                    style={{ background: on ? b.color : 'transparent', color: on ? '#fff' : '#cbd5e1', fontSize: 11 }}>
                    <span style={{ width: 11, height: 11, borderRadius: 2, background: on ? '#fff' : b.color, display: 'inline-block' }} />
                    {b.short}<span style={{ opacity: 0.8 }}>({b.meses})</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Botón actualizar datos Excel */}
          <div className="flex items-center gap-2">
            <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleFileUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadStatus === 'loading'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition-all"
              style={{
                background: uploadStatus === 'ok' ? '#1E8449'
                           : uploadStatus === 'error' ? '#C0392B'
                           : 'rgba(255,255,255,0.15)',
                color: '#fff', fontSize: 11,
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: uploadStatus === 'loading' ? 'wait' : 'pointer',
              }}
              title="Cargar un nuevo archivo datos.xlsx para actualizar el dashboard"
            >
              {uploadStatus === 'loading' && <span style={{ fontSize: 12, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>}
              {uploadStatus === 'ok' && <span style={{ fontSize: 12 }}>✓</span>}
              {uploadStatus === 'error' && <span style={{ fontSize: 12 }}>✗</span>}
              {!uploadStatus && <span style={{ fontSize: 12 }}>↑</span>}
              {uploadStatus === 'loading' ? 'Cargando…'
               : uploadStatus === 'ok' ? 'Datos actualizados'
               : uploadStatus === 'error' ? 'Error al leer'
               : 'Actualizar Excel'}
            </button>
          </div>
        </div>
      </header>

      {/* ── 3 columnas de anchos distintos (cada sección con el espacio que necesita) ── */}
      <main className="p-4" style={{ display: 'grid', gridTemplateColumns: '4fr 5fr 3fr', gap: 16, alignItems: 'stretch' }}>
        {/* Columna izquierda: barras + tabla detallada */}
        <div className="flex flex-col gap-4">
          <Sec1Resumen records={records} selectedRuta={selectedRuta} onSelectRuta={setSelectedRuta} baseLabel={baseLabel} />
          <Sec4Tabla records={records} selectedRuta={selectedRuta} />
        </div>
        {/* Columna central (más ancha): fishbone + mapa estratégico (necesitan espacio) */}
        <div className="flex flex-col gap-4">
          <Sec2Fishbone records={records} selectedRuta={selectedRuta} />
          <Sec6Mapa records={records} selectedRuta={selectedRuta} onSelectRuta={setSelectedRuta} />
        </div>
        {/* Columna derecha (compacta): pareto + comparativo */}
        <div className="flex flex-col gap-4">
          <Sec3Pareto records={records} selectedRuta={selectedRuta} />
          <Sec5Comparativo data12={data12} data18={data18} selectedRuta={selectedRuta} />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="px-6 py-3 flex items-center justify-between gap-4 flex-wrap" style={{ background: COLORS.navy }}>
        <p className="text-slate-200 flex items-center gap-2" style={{ fontSize: 11 }}>
          <LayoutGrid size={14} color="#cbd5e1" />
          Estos análisis permiten identificar oportunidades de optimización, priorizar recursos y mejorar el uso en salud.
        </p>
        <p className="text-slate-400" style={{ fontSize: 10 }}>
          Fuente: Costos por Programa y Uso de Recursos Médicos
        </p>
      </footer>
    </div>
  )
}
