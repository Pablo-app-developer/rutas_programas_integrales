# Rutas Programas Integrales — Dashboard

Dashboard web que replica la infografía gerencial **"Estructura del Costo por Programa y Uso de Recursos Médicos"**, construido sobre la base de datos de costos de los programas integrales (rutas clínicas).

## Características

- **6 secciones** que reproducen fielmente la infografía gerencial:
  1. Resumen Ejecutivo — costo total por programa (barras)
  2. Anatomía del Costo — diagrama de espina de pescado (Ishikawa)
  3. Pareto de Costos — barras + % acumulado
  4. Estructura Detallada de Servicios — tabla agrupada con subtotales
  5. Mapa Estratégico de Impacto Económico — scatter de costo vs. nº de servicios
  6. Comparativo Ruta Normal (12m) vs Ruta Ecopetrol (18m)
- **Selector de ruta** (las 10 rutas clínicas + "Todas las Rutas" agregadas).
- **Selector de base**: 12 meses (Ruta Normal) / 18 meses (Ruta Ecopetrol).
- Iconografía clínica profesional (lucide-react + icono de pulmones a medida).
- Lee los datos directamente del Excel (`public/datos.xlsx`, hojas `BASE12MESES` y `BASE18MESES`) con SheetJS.

## Stack

- **React 19** + **Vite**
- **Recharts** — gráficas
- **Tailwind CSS v4** — estilos
- **SheetJS (xlsx)** — lectura del Excel en el navegador
- **lucide-react** — iconografía

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción → dist/
npm run preview  # previsualizar el build
```

## Datos

La fuente es `public/datos.xlsx`, con dos hojas:
- `BASE12MESES` — proyección a 12 meses (Ruta Normal)
- `BASE18MESES` — proyección a 18 meses (Ruta Ecopetrol)

Cada fila es un servicio con su categoría, ruta, cantidad, costo unitario, costo total y % de uso. Las cifras son **promedio por paciente**.
