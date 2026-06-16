import { useState, useRef, useEffect } from 'react'
import { useData } from './hooks/useData.js'
import { parseFromArrayBuffer } from './utils/parseExcel.js'
import { RUTAS, TODAS, COLORS, modLabel } from './theme.js'
import Sec1Resumen from './components/sections/Sec1Resumen.jsx'
import Sec2Fishbone from './components/sections/Sec2Fishbone.jsx'
import Sec3Pareto from './components/sections/Sec3Pareto.jsx'
import Sec4Tabla from './components/sections/Sec4Tabla.jsx'
import Sec5Comparativo from './components/sections/Sec5Comparativo.jsx'
import Sec6Mapa from './components/sections/Sec6Mapa.jsx'
import Sec7Politicas from './components/sections/Sec7Politicas.jsx'
import { LayoutGrid } from './icons.jsx'

const BASES = {
  '12': { label: 'Ruta Normal (12 meses)', short: 'Ruta Normal', meses: '12 meses', color: COLORS.navyLight },
  '18': { label: 'Ruta Ecopetrol (18 meses)', short: 'Ruta Ecopetrol', meses: '18 meses', color: '#1E8449' },
}

const TODAS_MOD = '__TODAS_MOD__'

const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'politicas', label: 'Políticas' },
]

export default function App() {
  const { data12, data18, loading, error, reemplazarDatos } = useData()
  const [selectedRuta, setSelectedRuta] = useState('ASMA')
  const [baseActiva, setBaseActiva] = useState('12')
  const [selectedModalidad, setSelectedModalidad] = useState(TODAS_MOD)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [uploadStatus, setUploadStatus] = useState(null)
  const [showGuia, setShowGuia] = useState(false)
  const fileInputRef = useRef(null)
  const guiaRef = useRef(null)

  useEffect(() => {
    if (!showGuia) return
    const handler = (e) => {
      if (guiaRef.current && !guiaRef.current.contains(e.target)) setShowGuia(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showGuia])

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

  const modalidades = [...new Set([...data12, ...data18].map(r => r.modalidad).filter(Boolean))].sort()

  function filtrarMod(arr) {
    if (selectedModalidad === TODAS_MOD) return arr
    return arr.filter(r => r.modalidad === selectedModalidad)
  }

  const data12Fil = filtrarMod(data12)
  const data18Fil = filtrarMod(data18)
  const recordsBase = baseActiva === '12' ? data12 : data18
  const records = filtrarMod(recordsBase)

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh' }}>

      {/* ── Header ── */}
      <header className="flex items-center px-6 py-3 gap-4" style={{ background: COLORS.navy }}>

        {/* Logo + título — izquierda */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <img src="./logo-ino.png" alt="Logo INO" style={{ height: 52, width: 'auto', objectFit: 'contain', flexShrink: 0, filter: 'brightness(0) invert(1)' }} />
          <div className="min-w-0">
            <h1 className="text-white font-bold uppercase leading-tight" style={{ fontSize: 22, letterSpacing: '0.01em' }}>
              Estructura del Costo por Programa y Uso de Recursos Médicos
            </h1>
            <p className="text-slate-300" style={{ fontSize: 12 }}>
              Análisis por ruta UN: Programas integrales 2026
            </p>
          </div>
        </div>

        {/* Pestañas — centro fijo */}
        <div className="flex rounded-md overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(255,255,255,0.25)' }}>
          {TABS.map(tab => {
            const on = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-3 py-1.5 font-semibold transition-colors"
                style={{
                  background: on ? 'rgba(255,255,255,0.22)' : 'transparent',
                  color: on ? '#fff' : '#cbd5e1',
                  fontSize: 11,
                  borderRight: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Filtros — derecha (solo en dashboard, ocupa flex-1 para empujar desde la derecha) */}
        <div className="flex items-center gap-4 flex-wrap flex-1 justify-end">
          {activeTab === 'dashboard' && (
            <>
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

              {/* Selector de modalidad */}
              {modalidades.length > 0 && (
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 11 }} className="text-slate-300">Elegible:</span>
                  <select
                    value={selectedModalidad}
                    onChange={e => setSelectedModalidad(e.target.value)}
                    className="rounded px-2 py-1 font-semibold"
                    style={{ background: '#fff', color: COLORS.navy, fontSize: 12, border: 'none', maxWidth: 160 }}
                  >
                    <option value={TODAS_MOD}>★ Todos</option>
                    {modalidades.map(m => (
                      <option key={m} value={m}>{modLabel(m)}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Toggle base 12/18 meses */}
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

              {/* Botón actualizar datos Excel + guía */}
              <div className="relative flex items-center gap-1" ref={guiaRef}>
                <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleFileUpload} />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadStatus === 'loading'}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-l font-semibold transition-all"
                  style={{
                    background: uploadStatus === 'ok' ? '#1E8449'
                               : uploadStatus === 'error' ? '#C0392B'
                               : 'rgba(255,255,255,0.15)',
                    color: '#fff', fontSize: 11,
                    border: '1px solid rgba(255,255,255,0.3)', borderRight: 'none',
                    cursor: uploadStatus === 'loading' ? 'wait' : 'pointer',
                  }}
                >
                  {uploadStatus === 'loading' && <span style={{ fontSize: 12 }}>⟳</span>}
                  {uploadStatus === 'ok' && <span style={{ fontSize: 12 }}>✓</span>}
                  {uploadStatus === 'error' && <span style={{ fontSize: 12 }}>✗</span>}
                  {!uploadStatus && <span style={{ fontSize: 12 }}>↑</span>}
                  {uploadStatus === 'loading' ? 'Cargando…'
                   : uploadStatus === 'ok' ? 'Actualizados'
                   : uploadStatus === 'error' ? 'Error al leer'
                   : 'Actualizar Excel'}
                </button>

                <button
                  onClick={() => setShowGuia(v => !v)}
                  className="flex items-center justify-center font-bold rounded-r"
                  style={{
                    width: 26, height: 30,
                    background: showGuia ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
                    color: '#fff', fontSize: 13,
                    border: '1px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                  }}
                  title="Ver estructura requerida del archivo Excel"
                >?</button>

                {/* Panel de guía desplegable */}
                {showGuia && (
                  <div className="absolute right-0 z-50 rounded-lg shadow-2xl"
                       style={{ top: 'calc(100% + 8px)', width: 360, background: '#fff', border: `1px solid ${COLORS.border}`, color: COLORS.textDark }}>
                    <div className="flex items-center justify-between px-4 py-2 rounded-t-lg" style={{ background: COLORS.navy }}>
                      <span className="text-white font-bold uppercase" style={{ fontSize: 11 }}>
                        Estructura requerida del archivo Excel
                      </span>
                      <button onClick={() => setShowGuia(false)}
                              style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>
                        ✕
                      </button>
                    </div>
                    <div className="p-4 flex flex-col gap-3" style={{ fontSize: 11 }}>
                      <div>
                        <div className="font-bold uppercase mb-1" style={{ color: COLORS.navyLight, fontSize: 10 }}>Formato</div>
                        <div className="flex items-center gap-2 rounded px-2 py-1.5" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
                          <span style={{ fontSize: 16 }}>📄</span>
                          <span>Archivo <strong>.xlsx</strong> (Excel 2007 o superior)</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold uppercase mb-1" style={{ color: COLORS.navyLight, fontSize: 10 }}>Pestañas (hojas) requeridas</div>
                        <div className="flex gap-2">
                          {[
                            { name: 'BASE12MESES', desc: 'Ruta Normal — 12 meses', color: COLORS.navyLight },
                            { name: 'BASE18MESES', desc: 'Ruta Ecopetrol — 18 meses', color: '#1E8449' },
                          ].map(h => (
                            <div key={h.name} className="flex-1 rounded px-2 py-1.5"
                                 style={{ background: COLORS.calloutBg, border: `1px solid ${COLORS.calloutBorder}22` }}>
                              <div className="font-bold" style={{ color: h.color, fontSize: 10.5 }}>{h.name}</div>
                              <div style={{ color: COLORS.textMute, fontSize: 10 }}>{h.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold uppercase mb-1" style={{ color: COLORS.navyLight, fontSize: 10 }}>Columnas obligatorias (fila 1 = encabezado)</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
                          <thead>
                            <tr style={{ background: COLORS.bg }}>
                              <th className="text-left px-2 py-1" style={{ color: COLORS.textMute, fontWeight: 600 }}>Col</th>
                              <th className="text-left px-2 py-1" style={{ color: COLORS.textMute, fontWeight: 600 }}>Contenido</th>
                              <th className="text-left px-2 py-1" style={{ color: COLORS.textMute, fontWeight: 600 }}>12m</th>
                              <th className="text-left px-2 py-1" style={{ color: COLORS.textMute, fontWeight: 600 }}>18m</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ['A (1)', 'Código del servicio', '—', '—'],
                              ['B (2)', 'Nombre del servicio', '—', '—'],
                              ['C (3)', 'Categoría', '—', '—'],
                              ['AB (28)', 'Costo total por paciente', 'AB', 'AN'],
                              ['AC (29)', 'Cantidad de servicios', 'AC', 'AO'],
                              ['AE (31)', 'Valor costo unitario', 'AE', 'AR'],
                              ['AG (33)', 'Nombre de la ruta', 'AG', 'AS'],
                            ].map(([col, desc, c12, c18]) => (
                              <tr key={col} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                                <td className="px-2 py-1 font-mono font-bold" style={{ color: COLORS.navy, fontSize: 9.5 }}>{col}</td>
                                <td className="px-2 py-1" style={{ color: COLORS.textDark }}>{desc}</td>
                                <td className="px-2 py-1 text-center font-mono" style={{ color: COLORS.navyLight, fontSize: 9 }}>{c12}</td>
                                <td className="px-2 py-1 text-center font-mono" style={{ color: '#1E8449', fontSize: 9 }}>{c18}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <div className="font-bold uppercase mb-1" style={{ color: COLORS.navyLight, fontSize: 10 }}>
                          Nombres de ruta válidos (columna AG / AS — exactos)
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {RUTAS.map(r => (
                            <span key={r} className="rounded px-1.5 py-0.5 font-mono"
                                  style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, fontSize: 9, color: COLORS.textDark }}>
                              {r}
                            </span>
                          ))}
                        </div>
                        <p className="mt-1" style={{ color: COLORS.textMute, fontSize: 9.5 }}>
                          Los nombres deben coincidir exactamente (mayúsculas incluidas). Filas con ruta no reconocida se ignorarán.
                        </p>
                      </div>
                      <div className="rounded px-3 py-2" style={{ background: '#FFFBEB', border: '1px solid #FCD34D', fontSize: 10 }}>
                        <strong>Consejo:</strong> El cambio aplica solo a esta sesión del navegador. Para actualizar permanentemente, reemplaza el archivo{' '}
                        <code style={{ background: '#FEF3C7', padding: '0 3px', borderRadius: 2 }}>public/datos.xlsx</code> en el repositorio y haz push.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </header>

      {/* ── Contenido según pestaña activa ── */}
      {activeTab === 'politicas' && <Sec7Politicas />}

      {activeTab === 'dashboard' && (
        <main className="p-4" style={{ display: 'grid', gridTemplateColumns: '4fr 5fr 3fr', gap: 16, alignItems: 'stretch' }}>
          <div className="flex flex-col gap-4">
            <Sec1Resumen data12={data12Fil} data18={data18Fil} selectedRuta={selectedRuta} onSelectRuta={setSelectedRuta} />
            <Sec4Tabla records={records} selectedRuta={selectedRuta} />
          </div>
          <div className="flex flex-col gap-4">
            <Sec2Fishbone records={records} recordsBase={recordsBase} selectedRuta={selectedRuta} />
            <Sec6Mapa records={records} selectedRuta={selectedRuta} onSelectRuta={setSelectedRuta} />
          </div>
          <div className="flex flex-col gap-4">
            <Sec3Pareto records={records} selectedRuta={selectedRuta} />
            <Sec5Comparativo data12={data12Fil} data18={data18Fil} selectedRuta={selectedRuta} />
          </div>
        </main>
      )}

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
