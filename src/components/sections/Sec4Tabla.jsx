import { Fragment } from 'react'
import SectionHeader from '../ui/SectionHeader.jsx'
import { tablaDetallada, formatCOPfull, formatPct } from '../../utils/parseExcel.js'
import { catMeta, rutaLabel, COLORS } from '../../theme.js'
import { CatIcon } from '../../icons.jsx'

function shortServicio(s) {
  return s.replace(/\s*\/\s*PROGRAMAS.*$/i, '').replace(/\s*\(.*?\)\s*/g, ' ').trim()
}

export default function Sec4Tabla({ records, selectedRuta }) {
  const grupos = tablaDetallada(records, selectedRuta)

  return (
    <div className="panel flex flex-col h-full">
      <SectionHeader num="4" title={`Estructura Detallada de Servicios – ${rutaLabel(selectedRuta)}`} />
      <div className="flex-1 overflow-auto" style={{ maxHeight: 360 }}>
        <table className="w-full" style={{ fontSize: 11, borderCollapse: 'collapse' }}>
          <thead className="sticky top-0 z-10">
            <tr style={{ background: '#F1F4F8', color: COLORS.navy }}>
              <th className="text-left px-2 py-1.5 font-bold">CATEGORÍA</th>
              <th className="text-left px-2 py-1.5 font-bold">SERVICIO</th>
              <th className="text-center px-1 py-1.5 font-bold">CANT.</th>
              <th className="text-right px-2 py-1.5 font-bold">C. UNITARIO</th>
              <th className="text-right px-2 py-1.5 font-bold">C. TOTAL</th>
              <th className="text-right px-2 py-1.5 font-bold">% TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {grupos.map(g => {
              const m = catMeta(g.categoria)
              return (
                <Fragment key={g.categoria}>
                  {g.items.map((it, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F0F3F7' }}>
                      {i === 0 && (
                        <td rowSpan={g.items.length + 1} className="px-2 align-top" style={{ borderRight: '1px solid #EEF1F5' }}>
                          <div className="flex items-center gap-1.5 pt-1" style={{ color: m.color }}>
                            <CatIcon cat={g.categoria} size={15} color={m.color} strokeWidth={2.2} />
                            <span className="font-bold uppercase leading-tight" style={{ fontSize: 10 }}>{m.label}</span>
                          </div>
                        </td>
                      )}
                      <td className="px-2 py-1" style={{ color: COLORS.textDark }}>
                        <span className="block truncate" style={{ maxWidth: 180 }} title={it.servicio}>{shortServicio(it.servicio)}</span>
                      </td>
                      <td className="px-1 py-1 text-center" style={{ color: COLORS.textMute }}>{it.cantidad || '—'}</td>
                      <td className="px-2 py-1 text-right" style={{ color: COLORS.textMute }}>{formatCOPfull(it.unitario)}</td>
                      <td className="px-2 py-1 text-right font-semibold" style={{ color: COLORS.textDark }}>{formatCOPfull(it.total)}</td>
                      <td className="px-2 py-1 text-right" style={{ color: COLORS.textMute }}>{formatPct(it.pct)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: '#EAF2F9', borderBottom: `2px solid ${COLORS.border}` }}>
                    <td className="px-2 py-1 font-bold" style={{ color: COLORS.navy }}>Subtotal {m.label.charAt(0) + m.label.slice(1).toLowerCase()}</td>
                    <td></td><td></td>
                    <td className="px-2 py-1 text-right font-bold" style={{ color: COLORS.navy }}>{formatCOPfull(g.subtotal)}</td>
                    <td className="px-2 py-1 text-right font-bold" style={{ color: COLORS.navy }}>{formatPct(g.subtotalPct)}</td>
                  </tr>
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
