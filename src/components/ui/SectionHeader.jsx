import { COLORS } from '../../theme.js'

// Cabecera de panel: badge numerado azul marino + título en barra navy
export default function SectionHeader({ num, title }) {
  return (
    <div className="flex items-stretch" style={{ background: COLORS.navy }}>
      <div
        className="flex items-center justify-center font-bold text-white text-xl shrink-0"
        style={{ width: 44, background: COLORS.navyDark }}
      >
        {num}
      </div>
      <div className="flex items-center px-3 py-2">
        <h2 className="text-white font-bold uppercase tracking-wide leading-tight"
            style={{ fontSize: 13, letterSpacing: '0.04em' }}>
          {title}
        </h2>
      </div>
    </div>
  )
}
