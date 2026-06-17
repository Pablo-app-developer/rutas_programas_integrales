import SectionHeader from '../ui/SectionHeader.jsx'
import Callout from '../ui/Callout.jsx'
import { categoriasDeRuta, totalRuta, formatCOPfull, formatPct } from '../../utils/parseExcel.js'
import { catMeta, rutaLabel, modLabel, TODAS, COLORS } from '../../theme.js'
import { CatIcon } from '../../icons.jsx'

function shortServicio(s) {
  return s.replace(/\s*\/\s*PROGRAMAS.*$/i, '').replace(/\s*\(.*?\)\s*/g, ' ').trim()
}

// Posiciones x equiespaciadas dentro del rango útil [start, start+span]
function reparte(count, start, span) {
  return Array.from({ length: count }, (_, i) => start + (i + 0.5) * (span / count))
}

// Geometría del diagrama (coordenadas en viewBox 0–100)
const SPINE_Y = 50          // espina centrada verticalmente
const TOP_ANCHOR = 33       // donde nacen las costillas superiores
const BOT_ANCHOR = 67       // donde nacen las costillas inferiores
const RIB_LEAN = 7          // inclinación de la costilla hacia la cabeza
const X_START = 9, X_SPAN = 73, HEAD_X = 86

export default function Sec2Fishbone({ records, recordsBase, selectedRuta }) {
  const cats = categoriasDeRuta(records, selectedRuta).slice(0, 6)
  const total = totalRuta(records, selectedRuta)

  // Totales fijo / probabilístico desde los records sin filtro de modalidad
  const recsRuta = (recordsBase || []).filter(r =>
    !selectedRuta || selectedRuta === TODAS || r.ruta === selectedRuta
  )
  const modTotales = {}
  for (const r of recsRuta) {
    if (!r.modalidad) continue
    modTotales[r.modalidad] = (modTotales[r.modalidad] || 0) + r.valorCosto
  }
  const modalidades = Object.entries(modTotales).sort((a, b) => b[1] - a[1])
  const top = cats.filter((_, i) => i % 2 === 0)
  const bottom = cats.filter((_, i) => i % 2 === 1)
  // Cada fila se reparte de forma independiente en todo el ancho útil.
  // Si arriba y abajo tienen distinta cantidad, quedan naturalmente intercaladas;
  // si tienen la misma, quedan pareadas (sin comprimirse al centro).
  const topX = reparte(top.length, X_START, X_SPAN)
  const botX = reparte(bottom.length, X_START, X_SPAN)
  const principal = cats[0]
  const label = rutaLabel(selectedRuta)
  // ancho de caja según la fila más poblada, para que nunca se solapen horizontalmente
  const boxW = Math.min(30, (X_SPAN / Math.max(top.length, bottom.length, 1)) * 0.94)

  const Branch = ({ cat, x, side }) => {
    const m = catMeta(cat.categoria)
    const items = cat.items.slice().sort((a, b) => b.valorCosto - a.valorCosto).slice(0, 3)
    return (
      <div
        className="absolute flex flex-col"
        style={{
          left: `${x}%`, transform: 'translateX(-50%)', width: `${boxW}%`,
          [side === 'top' ? 'top' : 'bottom']: '1%', height: '32%',
          justifyContent: 'flex-start',
        }}
      >
        <div className="flex items-center gap-1" style={{ color: m.color }}>
          <CatIcon cat={cat.categoria} size={12} color={m.color} strokeWidth={2.4} />
          <span className="font-bold uppercase leading-tight truncate" style={{ fontSize: 10 }}>{m.label}</span>
        </div>
        <div className="font-semibold" style={{ color: COLORS.textDark, fontSize: 10.5 }}>
          {formatCOPfull(cat.total)} <span style={{ color: m.color }}>({formatPct(cat.pct)})</span>
        </div>
        <ul style={{ fontSize: 9, color: COLORS.textMute, lineHeight: 1.3 }}>
          {items.map((it, i) => (
            <li key={i} className="truncate">• {shortServicio(it.servicio)} {it.cantidad > 0 ? `(${it.cantidad})` : ''}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="panel flex flex-col h-full">
      <SectionHeader num="2" title={`Anatomía del Costo – ${label}`} />
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-center mb-3">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.navyLight }}>
            Costo Total {label}
          </div>
          <div className="font-bold" style={{ color: COLORS.navy, fontSize: 24 }}>{formatCOPfull(total)}</div>
          {modalidades.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-1 flex-wrap">
              {modalidades.map(([mod, val]) => (
                <div key={mod} className="flex items-center gap-1.5">
                  <span className="rounded-full" style={{
                    width: 7, height: 7, display: 'inline-block', flexShrink: 0,
                    background: mod.toLowerCase().includes('fijo') ? COLORS.navyLight : '#E67E22',
                  }} />
                  <span style={{ fontSize: 10, color: COLORS.textMute }}>{modLabel(mod)}:</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textDark }}>{formatCOPfull(val)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative" style={{ flex: '1 1 0', minHeight: 0 }}>
          {/* SVG: espina + cabeza + costillas (zona central 34–66%) */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ pointerEvents: 'none' }}>
            {/* espina principal */}
            <line x1="2" y1={SPINE_Y} x2={HEAD_X} y2={SPINE_Y} stroke={COLORS.navy} strokeWidth="0.7" />
            {/* cabeza del pez */}
            <polygon points={`${HEAD_X},${SPINE_Y - 6} 98,${SPINE_Y} ${HEAD_X},${SPINE_Y + 6}`} fill={COLORS.navy} />
            {/* costillas superiores */}
            {top.map((c, i) => (
              <line key={'t' + i} x1={topX[i]} y1={TOP_ANCHOR} x2={Math.min(topX[i] + RIB_LEAN, HEAD_X - 2)} y2={SPINE_Y}
                    stroke={catMeta(c.categoria).color} strokeWidth="1" strokeLinecap="round" />
            ))}
            {/* costillas inferiores */}
            {bottom.map((c, i) => (
              <line key={'b' + i} x1={botX[i]} y1={BOT_ANCHOR} x2={Math.min(botX[i] + RIB_LEAN, HEAD_X - 2)} y2={SPINE_Y}
                    stroke={catMeta(c.categoria).color} strokeWidth="1" strokeLinecap="round" />
            ))}
          </svg>
          {/* Bloques de texto: superior (1–33%) e inferior (67–99%) */}
          {top.map((c, i) => <Branch key={c.categoria} cat={c} x={topX[i]} side="top" />)}
          {bottom.map((c, i) => <Branch key={c.categoria} cat={c} x={botX[i]} side="bottom" />)}
        </div>

        {principal && (
          <div className="mt-1">
            <Callout icon="bulb">
              El <strong>{formatPct(principal.pct)}</strong> del costo {selectedRuta && selectedRuta !== TODAS ? `de la ruta de ${label}` : 'total'} está explicado por{' '}
              <strong>{catMeta(principal.categoria).label.toLowerCase()}</strong>
              {cats[1] && <>, seguido por {catMeta(cats[1].categoria).label.toLowerCase()} ({formatPct(cats[1].pct)})</>}.
            </Callout>
          </div>
        )}
      </div>
    </div>
  )
}
