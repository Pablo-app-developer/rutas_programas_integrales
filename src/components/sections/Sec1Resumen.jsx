import { BarChart, Bar, XAxis, YAxis, Cell, LabelList, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import SectionHeader from '../ui/SectionHeader.jsx'
import { totalesPorRuta, formatCOP, formatCOPfull } from '../../utils/parseExcel.js'
import { rutaMeta, COLORS } from '../../theme.js'
import { RutaIcon } from '../../icons.jsx'

const RutaTick = ({ x, y, payload }) => {
  const m = rutaMeta(payload.value)
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx={0} cy={16} r={13} fill={m.color} />
      <foreignObject x={-9} y={7} width={18} height={18}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18 }}>
          <RutaIcon ruta={payload.value} size={14} color="#fff" strokeWidth={2.2} />
        </div>
      </foreignObject>
    </g>
  )
}

const ValueLabel = ({ x, y, width, value }) => (
  <text x={x + width / 2} y={y - 5} textAnchor="middle" fontSize={9} fontWeight="700" fill={COLORS.textDark}>
    {formatCOP(value)}
  </text>
)

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded shadow-lg" style={{ background: '#fff', border: `1px solid ${COLORS.border}`, padding: '8px 10px', fontSize: 11 }}>
      <div className="font-bold" style={{ color: rutaMeta(d.ruta).color }}>{d.ruta}</div>
      <div style={{ color: COLORS.textDark }}>Costo: <strong>{formatCOPfull(d.total)}</strong></div>
      <div style={{ color: COLORS.textMute }}>{d.usos} servicios/paciente · {d.servicios} ítems distintos</div>
    </div>
  )
}

export default function Sec1Resumen({ records, selectedRuta, onSelectRuta, baseLabel }) {
  const data = totalesPorRuta(records)

  return (
    <div className="panel flex flex-col h-full">
      <SectionHeader num="1" title="Resumen Ejecutivo – Costo Total por Programa" />
      <div className="p-3 flex-1 flex flex-col">
        <p className="text-center text-xs font-semibold mb-1" style={{ color: COLORS.navyLight }}>
          Costo promedio por paciente – {baseLabel}
        </p>
        <div className="flex-1" style={{ minHeight: 235 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 22, right: 8, left: 8, bottom: 6 }} barCategoryGap="16%">
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" vertical={false} />
              <YAxis
                tickFormatter={v => `$${(v / 1_000_000).toFixed(1)}M`}
                tick={{ fill: COLORS.textMute, fontSize: 9 }}
                axisLine={{ stroke: COLORS.border }} tickLine={false} width={42}
                label={{ value: 'Costo (COP)', angle: -90, position: 'insideLeft', fill: COLORS.textMute, fontSize: 9, dy: 30 }}
              />
              <XAxis dataKey="ruta" tick={<RutaTick />} axisLine={{ stroke: COLORS.border }} tickLine={false} interval={0} height={36} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(31,61,92,0.05)' }} />
              <Bar dataKey="total" radius={[3, 3, 0, 0]} onClick={d => onSelectRuta(d.ruta)} cursor="pointer">
                {data.map(d => (
                  <Cell key={d.ruta} fill={rutaMeta(d.ruta).color}
                        opacity={!selectedRuta || selectedRuta === d.ruta ? 1 : 0.45}
                        stroke={selectedRuta === d.ruta ? COLORS.navy : 'none'} strokeWidth={selectedRuta === d.ruta ? 2 : 0} />
                ))}
                <LabelList dataKey="total" content={<ValueLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
