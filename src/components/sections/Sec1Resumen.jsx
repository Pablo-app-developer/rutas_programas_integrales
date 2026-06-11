import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import SectionHeader from '../ui/SectionHeader.jsx'
import { totalesPorRuta, formatCOP, formatCOPfull } from '../../utils/parseExcel.js'
import { rutaMeta, COLORS } from '../../theme.js'
import { RutaIcon } from '../../icons.jsx'

const COLOR12 = COLORS.navyLight
const COLOR18 = '#1E8449'

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

const BulletShape = ({ x, y, width, height, payload, opacity = 1 }) => {
  if (!payload || payload.maxTotal === 0) return null
  const h18 = height * (payload.total18 / payload.maxTotal)
  const h12 = height * (payload.total12 / payload.maxTotal)
  const y18 = y + height - h18
  const y12 = y + height - h12
  const thinW = Math.max(width * 0.52, 4)
  const xThin = x + (width - thinW) / 2
  const cx = x + width / 2

  return (
    <g opacity={opacity}>
      {/* 18m — fondo ancho semitransparente */}
      <rect x={x} y={y18} width={width} height={h18} fill={COLOR18} opacity={0.28} rx={3} ry={3} />
      {/* 12m — barra delgada al frente */}
      <rect x={xThin} y={y12} width={thinW} height={h12} fill={COLOR12} rx={2} ry={2} />
      {/* Etiqueta 18m */}
      <text x={cx} y={y18 - 11} textAnchor="middle" fontSize={8} fill={COLOR18} fontWeight="700">
        {formatCOP(payload.total18)}
      </text>
      {/* Etiqueta 12m */}
      <text x={cx} y={y12 - 3} textAnchor="middle" fontSize={8} fill={COLOR12} fontWeight="700">
        {formatCOP(payload.total12)}
      </text>
    </g>
  )
}

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded shadow-lg" style={{ background: '#fff', border: `1px solid ${COLORS.border}`, padding: '8px 10px', fontSize: 11 }}>
      <div className="font-bold mb-1" style={{ color: rutaMeta(d.ruta).color }}>{d.ruta}</div>
      <div style={{ color: COLOR12 }}>12 meses: <strong>{formatCOPfull(d.total12)}</strong></div>
      <div style={{ color: COLOR18 }}>18 meses: <strong>{formatCOPfull(d.total18)}</strong></div>
    </div>
  )
}

export default function Sec1Resumen({ data12, data18, selectedRuta, onSelectRuta }) {
  const map12 = Object.fromEntries(totalesPorRuta(data12).map(r => [r.ruta, r]))
  const map18 = Object.fromEntries(totalesPorRuta(data18).map(r => [r.ruta, r]))
  const rutas = [...new Set([...Object.keys(map12), ...Object.keys(map18)])]

  const data = rutas.map(ruta => {
    const total12 = map12[ruta]?.total ?? 0
    const total18 = map18[ruta]?.total ?? 0
    return { ruta, total12, total18, maxTotal: Math.max(total12, total18) }
  }).sort((a, b) => b.maxTotal - a.maxTotal)

  return (
    <div className="panel flex flex-col h-full">
      <SectionHeader num="1" title="Resumen Ejecutivo – Costo Total por Programa" />
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-center justify-center gap-5 mb-1">
          <div className="flex items-center gap-1.5">
            <div style={{ width: 10, height: 14, background: COLOR12, borderRadius: 2 }} />
            <span style={{ fontSize: 9, color: COLORS.textMute }}>Ruta Normal (12 meses)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: 14, height: 14, background: COLOR18, opacity: 0.35, borderRadius: 2 }} />
            <span style={{ fontSize: 9, color: COLORS.textMute }}>Ruta Ecopetrol (18 meses)</span>
          </div>
        </div>
        <div className="flex-1" style={{ minHeight: 235 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 28, right: 8, left: 8, bottom: 6 }} barCategoryGap="16%">
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F6" vertical={false} />
              <YAxis
                tickFormatter={v => `$${(v / 1_000_000).toFixed(1)}M`}
                tick={{ fill: COLORS.textMute, fontSize: 9 }}
                axisLine={{ stroke: COLORS.border }} tickLine={false} width={42}
                label={{ value: 'Costo (COP)', angle: -90, position: 'insideLeft', fill: COLORS.textMute, fontSize: 9, dy: 30 }}
              />
              <XAxis dataKey="ruta" tick={<RutaTick />} axisLine={{ stroke: COLORS.border }} tickLine={false} interval={0} height={36} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(31,61,92,0.05)' }} />
              <Bar dataKey="maxTotal" shape={<BulletShape />} onClick={d => onSelectRuta(d.ruta)} cursor="pointer" isAnimationActive={false}>
                {data.map(d => (
                  <Cell key={d.ruta}
                    opacity={!selectedRuta || selectedRuta === d.ruta ? 1 : 0.12}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
