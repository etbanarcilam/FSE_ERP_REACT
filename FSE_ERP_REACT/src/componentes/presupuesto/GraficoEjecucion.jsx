import { useState } from 'react'
import { DATOS_GRAFICO_EJECUCION } from '../../datos/datosInicialesErp'
import { formatearMoneda } from '../../servicios/servicioApi'

/**
 * Componente: GraficoEjecucion
 * Responsabilidad única: Dibujar el gráfico lineal interactivo de Ejecución
 * Mensual vs. Tendencia utilizando SVG puro en React.
 * Autor: Aprendiz ADSO
 */
function GraficoEjecucion() {
  const [mesActivo, setMesActivo] = useState(null)

  const { etiquetas, ejecucion, tendencia } = DATOS_GRAFICO_EJECUCION
  const valorMaximo = 60000000
  const ancho = 900
  const alto = 280
  const margenIzq = 95
  const margenDer = 30
  const margenSup = 20
  const margenInf = 40

  const anchoUtil = ancho - margenIzq - margenDer
  const altoUtil = alto - margenSup - margenInf

  // Calcula las coordenadas X,Y de cada mes sin usar librerías pesadas externas
  const puntosEjecucion = etiquetas.map((mes, indice) => {
    const x = margenIzq + (indice / (etiquetas.length - 1)) * anchoUtil
    const y = margenSup + altoUtil - (ejecucion[indice] / valorMaximo) * altoUtil
    const yTendencia = margenSup + altoUtil - (tendencia[indice] / valorMaximo) * altoUtil
    return {
      mes,
      x,
      y,
      yTendencia,
      valorEjecucion: ejecucion[indice],
      valorTendencia: tendencia[indice],
    }
  })

  const rutaLineaEjecucion = puntosEjecucion
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const rutaAreaEjecucion = `${rutaLineaEjecucion} L ${
    puntosEjecucion[puntosEjecucion.length - 1].x
  } ${margenSup + altoUtil} L ${puntosEjecucion[0].x} ${margenSup + altoUtil} Z`

  const rutaLineaTendencia = puntosEjecucion
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yTendencia}`)
    .join(' ')

  const nivelesEjeY = [0, 15000000, 30000000, 45000000, 60000000]

  return (
    <div className="panel-blanco">
      <div className="encabezado-seccion">
        <h3 className="titulo-seccion" style={{ fontSize: '1.05rem' }}>
          <span>📈</span>
          <span>Historial de Ejecución Mensual vs. Tendencia</span>
        </h3>

        <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 14, height: 4, background: '#1d4ed8', borderRadius: 4, display: 'inline-block' }} />
            Ejecución
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 14, height: 0, borderTop: '2.5px dashed #38bdf8', display: 'inline-block' }} />
            Tendencia
          </span>
        </div>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${ancho} ${alto}`} style={{ width: '100%', height: '320px' }}>
          {/* Líneas guía horizontales del eje Y */}
          {nivelesEjeY.map((nivel) => {
            const y = margenSup + altoUtil - (nivel / valorMaximo) * altoUtil
            return (
              <g key={nivel}>
                <line
                  x1={margenIzq}
                  y1={y}
                  x2={ancho - margenDer}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1.5"
                />
                <text
                  x={margenIzq - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#64748b"
                >
                  {nivel === 0 ? '$ -' : formatearMoneda(nivel)}
                </text>
              </g>
            )
          })}

          {/* Área sombreada y línea principal de Ejecución */}
          <path d={rutaAreaEjecucion} fill="rgba(37, 99, 235, 0.06)" />
          <path d={rutaLineaEjecucion} fill="none" stroke="#1d4ed8" strokeWidth="3" />

          {/* Línea punteada de Tendencia */}
          <path
            d={rutaLineaTendencia}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />

          {/* Puntos interactivos por cada mes (key estable por nombre de mes) */}
          {puntosEjecucion.map((punto) => (
            <g
              key={punto.mes}
              onMouseEnter={() => setMesActivo(punto)}
              onMouseLeave={() => setMesActivo(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={punto.x}
                cy={punto.y}
                r={mesActivo?.mes === punto.mes ? 7 : 5}
                fill="#1d4ed8"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={punto.x}
                y={alto - 12}
                textAnchor="middle"
                fontSize="10.5"
                fill="#64748b"
              >
                {punto.mes.slice(0, 3)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Tooltip informativo al pasar el cursor sobre un mes */}
      {mesActivo && (
        <div
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem 0.9rem',
            background: '#0f172a',
            color: '#f8fafc',
            borderRadius: '0.5rem',
            fontSize: '0.78rem',
            display: 'inline-flex',
            gap: '1.25rem',
          }}
        >
          <strong>{mesActivo.mes}:</strong>
          <span>Ejecución: {formatearMoneda(mesActivo.valorEjecucion)}</span>
          <span style={{ color: '#7dd3fc' }}>
            Tendencia: {formatearMoneda(mesActivo.valorTendencia)}
          </span>
        </div>
      )}
    </div>
  )
}

export default GraficoEjecucion

