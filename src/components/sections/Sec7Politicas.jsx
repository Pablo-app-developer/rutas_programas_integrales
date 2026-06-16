import { COLORS } from '../../theme.js'

const POLITICAS = [
  {
    categoria: 'Terapias y Rehabilitación',
    color: '#CA6510',
    icon: '🩺',
    items: [
      {
        titulo: 'Estándar de sesiones de rehabilitación',
        descripcion: 'Se establece como estándar 8 sesiones mensuales (2 por semana) para los servicios de rehabilitación incluidos en los programas integrales.',
        aplica: 'Todas las rutas',
      },
    ],
  },
  {
    categoria: 'Actualización de Costos',
    color: '#1F6FB2',
    icon: '💰',
    items: [
      {
        titulo: 'Fecha de referencia de tarifas',
        descripcion: 'Los costos unitarios de todos los servicios están actualizados a febrero de 2026, tomando como base las tarifas vigentes a esa fecha.',
        aplica: 'Todas las rutas',
      },
    ],
  },
]

function PolicyCard({ politica }) {
  return (
    <div className="panel" style={{ borderTop: `3px solid ${politica.color}` }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <span style={{ fontSize: 18 }}>{politica.icon}</span>
        <span className="font-bold uppercase" style={{ color: politica.color, fontSize: 11, letterSpacing: '0.05em' }}>
          {politica.categoria}
        </span>
      </div>
      <div className="flex flex-col gap-0">
        {politica.items.map((item, i) => (
          <div key={i} className="px-4 py-3" style={{ borderBottom: i < politica.items.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-semibold mb-1" style={{ color: COLORS.textDark, fontSize: 13 }}>
                  {item.titulo}
                </div>
                <div style={{ color: COLORS.textMute, fontSize: 12, lineHeight: 1.6 }}>
                  {item.descripcion}
                </div>
              </div>
              <div className="flex-shrink-0 rounded px-2 py-0.5 text-center"
                   style={{ background: COLORS.calloutBg, border: `1px solid ${COLORS.calloutBorder}22`, minWidth: 90 }}>
                <div style={{ fontSize: 9, color: COLORS.textMute, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Aplica a</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.navyLight }}>{item.aplica}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Sec7Politicas() {
  return (
    <div className="p-6" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Encabezado */}
      <div className="mb-6">
        <h2 className="font-bold uppercase" style={{ color: COLORS.navy, fontSize: 18, letterSpacing: '0.02em' }}>
          Políticas de Cálculo
        </h2>
        <p style={{ color: COLORS.textMute, fontSize: 12, marginTop: 4 }}>
          Criterios y supuestos establecidos para el cálculo del costo de los programas integrales de rutas de atención.
        </p>
      </div>

      {/* Tarjetas por categoría */}
      <div className="flex flex-col gap-4">
        {POLITICAS.map(p => (
          <PolicyCard key={p.categoria} politica={p} />
        ))}
      </div>

      {/* Nota al pie */}
      <div className="mt-6 rounded-lg px-4 py-3 flex items-start gap-2"
           style={{ background: '#FFFBEB', border: '1px solid #FCD34D', fontSize: 11 }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
        <span style={{ color: '#78350F' }}>
          Estas políticas son los supuestos base del modelo de costos. Cualquier ajuste debe reflejarse en el archivo Excel fuente
          y documentarse aquí para mantener trazabilidad del criterio aplicado.
        </span>
      </div>
    </div>
  )
}
