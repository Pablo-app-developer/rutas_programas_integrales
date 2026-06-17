// Iconografía profesional (lucide-react + iconos clínicos custom en estilo line)
import {
  CigaretteOff, HeartPulse, Wind, Moon, Dumbbell, Scale,
  Target, Layers, AirVent,
  Stethoscope, Microscope, Activity, GraduationCap, ClipboardList, Pill,
  DollarSign, ListChecks, CalendarDays, Star, Lightbulb,
  TrendingUp, TrendingDown, LayoutGrid, Minus,
} from 'lucide-react'

// Pulmones — no existe en lucide, lo dibujamos en el mismo estilo (stroke 2, 24x24)
export function Lungs({ size = 24, color = 'currentColor', strokeWidth = 1.8, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M12 3v7" />
      <path d="M9.6 9.4C8.4 11.1 7.4 13 7.2 16c-.1 1.5-1.2 2.5-2.6 2.2C3.4 17.9 2.9 16.8 3.1 15.4c.4-2.6 1.3-5 2.9-7 .8-1 2.3-.7 2.7.6 0 .1 0 .3-.1.4z" />
      <path d="M14.4 9.4c1.2 1.7 2.2 3.6 2.4 6.6.1 1.5 1.2 2.5 2.6 2.2 1.2-.3 1.7-1.4 1.5-2.8-.4-2.6-1.3-5-2.9-7-.8-1-2.3-.7-2.7.6 0 .1 0 .3.1.4z" />
      <path d="M9.7 9.6C10.5 9 11.2 8.8 12 8.8s1.5.2 2.3.8" />
    </svg>
  )
}

// Mapa ruta → componente de icono (uno DISTINTO por cada ruta)
const RUTA_ICONS = {
  'CESACION TABAQUICA': CigaretteOff,    // cigarrillo tachado
  'NODULO PULMONAR': Target,             // nódulo = foco localizado
  'HIPERTENCION PULMONAR': HeartPulse,   // corazón con pulso
  'ASMA': Wind,                          // flujo de aire
  'EPI': Layers,                         // enf. intersticial = capas de tejido
  'EPOC': AirVent,                       // obstrucción de la vía aérea
  'DISNEA - OBESIDAD': Scale,            // peso / balanza
  'TRASTORNOS DE SUEÑO': Moon,           // sueño
  'EJERCICIO FISICO': Dumbbell,          // actividad física
  'CUIDADO RESPIRATORIO': Lungs,         // pulmones (icono custom)
}

export function RutaIcon({ ruta, size = 22, color = '#fff', strokeWidth = 2 }) {
  const Cmp = RUTA_ICONS[ruta] || Activity
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} />
}

// Mapa categoría → componente de icono
const CAT_ICONS = {
  'Consultas': Stethoscope,
  'Diagnosticos': Microscope,
  'Terapias': Activity,
  'Educacion': GraduationCap,
  'Gestion y seguimiento': ClipboardList,
  'Medicamentos': Pill,
}

export function CatIcon({ cat, size = 16, color = 'currentColor', strokeWidth = 2 }) {
  const Cmp = CAT_ICONS[cat] || Activity
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} />
}

// Iconos de métricas del comparativo
const METRIC_ICONS = { dollar: DollarSign, list: ListChecks, calendar: CalendarDays }
export function MetricIcon({ kind, size = 18, color = 'currentColor', strokeWidth = 2 }) {
  const Cmp = METRIC_ICONS[kind] || DollarSign
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} />
}

export { Star, Lightbulb, TrendingUp, TrendingDown, LayoutGrid, Minus }
