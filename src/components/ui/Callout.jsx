import { COLORS } from '../../theme.js'
import { Star, Lightbulb, TrendingUp } from '../../icons.jsx'

const ICONS = { bulb: Lightbulb, star: Star, trend: TrendingUp }

// Caja de insight: fondo azul claro, borde izquierdo, ícono profesional
export default function Callout({ icon = 'bulb', children, color = COLORS.calloutBorder }) {
  const Icon = ICONS[icon] || Lightbulb
  return (
    <div className="flex items-start gap-2 px-3 py-2 rounded"
         style={{ background: COLORS.calloutBg, borderLeft: `4px solid ${color}` }}>
      <Icon size={15} color={color} strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 1 }} />
      <p className="text-xs leading-snug" style={{ color: COLORS.textDark }}>
        {children}
      </p>
    </div>
  )
}
