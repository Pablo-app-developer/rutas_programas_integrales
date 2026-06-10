import SectionHeader from '../ui/SectionHeader.jsx'
import { comparativoRuta, formatCOPfull } from '../../utils/parseExcel.js'
import { rutaLabel, COLORS } from '../../theme.js'
import { MetricIcon, TrendingUp, TrendingDown } from '../../icons.jsx'

export default function Sec5Comparativo({ data12, data18, selectedRuta }) {
  const filas = comparativoRuta(data12, data18, selectedRuta)
  const fmt = (v, f) => (f === 'cop' ? formatCOPfull(v) : Math.round(v).toLocaleString('es-CO'))

  return (
    <div className="panel flex flex-col h-full">
      <SectionHeader num="6" title="Comparativo Ruta Normal (12m) vs Ruta Ecopetrol (18m)" />
      <div className="p-3 flex-1">
        <table className="w-full h-full" style={{ borderCollapse: 'separate', borderSpacing: 0, fontSize: 12 }}>
          <thead>
            <tr>
              <th className="text-left px-3 py-2" style={{ background: '#F1F4F8', color: COLORS.navy, fontSize: 11, borderTopLeftRadius: 6 }}>CONCEPTO</th>
              <th className="text-center px-3 py-2 text-white" style={{ background: COLORS.navy, fontSize: 11, lineHeight: 1.1 }}>RUTA NORMAL<br /><span style={{ fontWeight: 400 }}>(12 MESES)</span></th>
              <th className="text-center px-3 py-2 text-white" style={{ background: '#1E8449', fontSize: 11, lineHeight: 1.1 }}>RUTA ECOPETROL<br /><span style={{ fontWeight: 400 }}>(18 MESES)</span></th>
              <th className="text-center px-3 py-2" style={{ background: '#F1F4F8', color: COLORS.navy, fontSize: 11, borderTopRightRadius: 6 }}>VARIACIÓN</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => {
              const sube = f.variacion >= 0
              const color = sube ? COLORS.up : COLORS.down
              return (
                <tr key={i} style={{ borderBottom: '1px solid #EEF1F5' }}>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <MetricIcon kind={f.kind} size={17} color={COLORS.navyLight} strokeWidth={2} />
                      <span className="font-semibold" style={{ color: COLORS.navy, fontSize: 11 }}>{f.concepto}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center font-bold" style={{ color: COLORS.textDark }}>{fmt(f.v12, f.fmt)}</td>
                  <td className="px-3 py-3 text-center font-bold" style={{ color: COLORS.textDark }}>{fmt(f.v18, f.fmt)}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1 font-bold" style={{ color }}>
                      <span>{sube ? '+' : ''}{f.variacion.toFixed(0)}%</span>
                      {sube ? <TrendingUp size={15} color={color} strokeWidth={2.4} /> : <TrendingDown size={15} color={color} strokeWidth={2.4} />}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
