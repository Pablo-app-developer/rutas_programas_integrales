import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  LabelList, ResponsiveContainer,
} from 'recharts'
import SectionHeader from '../ui/SectionHeader.jsx'
import Callout from '../ui/Callout.jsx'
import { paretoCategorias, formatCOPfull, formatPct } from '../../utils/parseExcel.js'
import { catMeta, rutaLabel, COLORS } from '../../theme.js'

const CAT_SHORT = {
  'Gestion y seguimiento': 'Gestión',
  'Diagnosticos': 'Diagnóst.',
  'Educacion': 'Educación',
}

const BarLabel = ({ x, y, width, value }) => (
  <text x={x + width / 2} y={y - 4} textAnchor="middle" fontSize={9} fontWeight="700" fill={COLORS.textDark}>
    {formatCOPfull(value)}
  </text>
)

const LineLabel = ({ x, y, value }) => (
  <text x={x} y={y - 8} textAnchor="middle" fontSize={9} fontWeight="700" fill={COLORS.down}>
    {value.toFixed(0)}%
  </text>
)

export default function Sec3Pareto({ records, selectedRuta }) {
  const data = paretoCategorias(records, selectedRuta).map(d => ({
    ...d,
    label: CAT_SHORT[d.categoria] || catMeta(d.categoria).label.split(' ')[0],
  }))
  // dos categorías que concentran el grueso
  const dosPrimeras = data.slice(0, 2)
  const pct2 = dosPrimeras.reduce((s, d) => s + d.pct, 0)

  return (
    <div className="panel flex flex-col h-full">
      <SectionHeader num="3" title={`Pareto de Costos – ${rutaLabel(selectedRuta)}`} />
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex-1" style={{ minHeight: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 22, right: 36, left: 6, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: COLORS.textMute, fontSize: 9 }} axisLine={{ stroke: COLORS.border }} tickLine={false} interval={0} />
              <YAxis yAxisId="l" tickFormatter={v => `$${(v / 1_000_000).toFixed(1)}M`} tick={{ fill: COLORS.textMute, fontSize: 8 }} axisLine={{ stroke: COLORS.border }} tickLine={false} width={40} />
              <YAxis yAxisId="r" orientation="right" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fill: COLORS.down, fontSize: 8 }} axisLine={{ stroke: COLORS.border }} tickLine={false} width={32} />
              <Bar yAxisId="l" dataKey="valor" fill={COLORS.navy} radius={[2, 2, 0, 0]} barSize={32}>
                <LabelList dataKey="valor" content={<BarLabel />} />
              </Bar>
              <Line yAxisId="r" type="monotone" dataKey="acumulado" stroke={COLORS.down} strokeWidth={2}
                    dot={{ r: 3, fill: COLORS.down }}>
                <LabelList dataKey="acumulado" content={<LineLabel />} />
              </Line>
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Leyenda */}
        <div className="flex items-center justify-center gap-4 mt-1 mb-2" style={{ fontSize: 10 }}>
          <span className="flex items-center gap-1"><span style={{ width: 12, height: 10, background: COLORS.navy, display: 'inline-block', borderRadius: 2 }} />Costo por categoría</span>
          <span className="flex items-center gap-1"><span style={{ width: 14, height: 2, background: COLORS.down, display: 'inline-block' }} />% Acumulado</span>
        </div>

        <Callout icon="trend">
          El <strong>{formatPct(pct2)}</strong> del costo total se concentra en{' '}
          {dosPrimeras.map((d, i) => (
            <span key={d.categoria}>{i > 0 ? ' y ' : ''}<strong>{catMeta(d.categoria).label.toLowerCase()}</strong></span>
          ))}.
        </Callout>
      </div>
    </div>
  )
}
