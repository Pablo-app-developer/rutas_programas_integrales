import SectionHeader from '../ui/SectionHeader.jsx'
import { mapaEstrategico, totalesPorRuta, formatCOP } from '../../utils/parseExcel.js'
import { rutaMeta, rutaLabel, impactoTier, IMPACTO, COLORS } from '../../theme.js'
import { RutaIcon } from '../../icons.jsx'

export default function Sec6Mapa({ records, selectedRuta, onSelectRuta }) {
  const puntos = mapaEstrategico(records)
  const n = puntos.length
  const ranking = totalesPorRuta(records)
  const totalGeneral = ranking.reduce((s, r) => s + r.total, 0)
  const liderCosto = ranking[0]
  const liderUso = [...ranking].sort((a, b) => b.usos - a.usos)[0]
  const pct3 = totalGeneral > 0 ? Math.round(ranking.slice(0, 3).reduce((s, r) => s + r.total, 0) / totalGeneral * 100) : 0

  // Tamaño de burbuja según nº de servicios usados
  const usosArr = puntos.map(p => p.usos)
  const minU = Math.min(...usosArr), maxU = Math.max(...usosArr)
  const sizeFor = u => 22 + (maxU > minU ? (u - minU) / (maxU - minU) : 0.5) * 12

  return (
    <div className="panel flex flex-col h-full">
      <SectionHeader num="5" title="Mapa Estratégico de Impacto Económico" />
      <div className="p-3 flex-1 flex gap-3">
        {/* Plano cartesiano */}
        <div className="relative flex-1" style={{ minHeight: 320 }}>
          <div className="absolute left-0 top-0 bottom-7 flex flex-col justify-between items-center" style={{ width: 16 }}>
            <span style={{ fontSize: 8, color: COLORS.textMute }}>Alto</span>
            <span className="font-bold uppercase" style={{ fontSize: 8, color: COLORS.navy, writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.05em' }}>
              Costo por paciente
            </span>
            <span style={{ fontSize: 8, color: COLORS.textMute }}>Bajo</span>
          </div>
          <div className="absolute left-4 right-0 top-0 bottom-7 rounded" style={{ background: 'linear-gradient(135deg,#FAFBFC,#F2F6FA)', border: `1px solid ${COLORS.border}` }}>
            <div className="absolute left-1/2 top-0 bottom-0" style={{ borderLeft: '1px dashed #E2E8F0' }} />
            <div className="absolute top-1/2 left-0 right-0" style={{ borderTop: '1px dashed #E2E8F0' }} />
            {/* etiquetas de cuadrante */}
            <span className="absolute top-1 right-2 font-semibold" style={{ fontSize: 7.5, color: '#AEBBC9' }}>Alto costo · muchos servicios</span>
            <span className="absolute bottom-1 left-2 font-semibold" style={{ fontSize: 7.5, color: '#AEBBC9' }}>Bajo costo · pocos servicios</span>
            {puntos.map(p => {
              const m = rutaMeta(p.ruta)
              const tier = impactoTier(p.rank, n)
              const sel = selectedRuta === p.ruta
              const sz = sizeFor(p.usos) + (sel ? 6 : 0)
              const labelLeft = p.x > 56 // si está a la derecha, etiqueta hacia la izquierda
              return (
                <button key={p.ruta} onClick={() => onSelectRuta(p.ruta)}
                  className="absolute"
                  style={{ left: `${p.x}%`, bottom: `${p.y}%`, transform: 'translate(-50%, 50%)',
                           width: sz, height: sz, cursor: 'pointer', zIndex: sel ? 7 : 2 }}
                  title={`${p.ruta} · ${formatCOP(p.costo)} · ${p.usos} servicios por paciente`}>
                  <div className="flex items-center justify-center rounded-full w-full h-full"
                       style={{ background: m.color,
                                boxShadow: sel ? `0 0 0 3px ${m.color}44, 0 2px 6px rgba(0,0,0,.25)` : '0 1px 3px rgba(0,0,0,0.25)',
                                transition: 'all .15s' }}>
                    <RutaIcon ruta={p.ruta} size={sz * 0.56} color="#fff" strokeWidth={2.2} />
                  </div>
                  <span className="absolute font-semibold rounded px-1 leading-tight"
                        style={{ top: '50%', transform: 'translateY(-50%)',
                                 [labelLeft ? 'right' : 'left']: '118%',
                                 whiteSpace: 'nowrap', fontSize: 8, color: COLORS.textDark,
                                 background: 'rgba(255,255,255,0.88)', boxShadow: '0 0 2px rgba(255,255,255,0.95)' }}>
                    {m.short.replace('\n', ' ')} <span style={{ color: m.color }}>{formatCOP(p.costo)}</span>
                  </span>
                </button>
              )
            })}
          </div>
          <div className="absolute right-2 bottom-0 font-bold uppercase" style={{ fontSize: 8, color: COLORS.navy, letterSpacing: '0.05em' }}>
            Nº de servicios por paciente →
          </div>
        </div>

        {/* Leyenda + insights */}
        <div className="flex flex-col gap-2" style={{ width: 150 }}>
          <div>
            <div className="font-bold uppercase mb-1" style={{ fontSize: 9, color: COLORS.navy }}>Impacto Económico</div>
            {Object.values(IMPACTO).map(t => (
              <div key={t.label} className="flex items-center gap-1.5 mb-0.5">
                <span className="rounded-full" style={{ width: 9, height: 9, background: t.color, display: 'inline-block' }} />
                <span style={{ fontSize: 9, color: COLORS.textDark }}>{t.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 mt-1 pt-1" style={{ borderTop: '1px solid #EEF1F5' }}>
              <span className="rounded-full" style={{ width: 7, height: 7, background: '#9AA7B4', display: 'inline-block' }} />
              <span className="rounded-full" style={{ width: 12, height: 12, background: '#9AA7B4', display: 'inline-block' }} />
              <span style={{ fontSize: 8, color: COLORS.textMute }}>nº de servicios</span>
            </div>
          </div>
          <div className="rounded p-2" style={{ background: COLORS.calloutBg, borderLeft: `3px solid ${COLORS.calloutBorder}` }}>
            <div className="font-bold uppercase mb-1" style={{ fontSize: 8.5, color: COLORS.navy }}>Insights Clave</div>
            <ul style={{ fontSize: 8.5, color: COLORS.textDark, lineHeight: 1.4 }}>
              <li className="mb-1">• <strong>{rutaLabel(liderCosto?.ruta)}</strong> es el de mayor costo por paciente ({formatCOP(liderCosto?.total)}).</li>
              <li className="mb-1">• <strong>{rutaLabel(liderUso?.ruta)}</strong> tiene el mayor número de servicios por paciente ({liderUso?.usos}).</li>
              <li>• Los <strong>3 programas top</strong> concentran el <strong>{pct3}%</strong> del costo total.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
