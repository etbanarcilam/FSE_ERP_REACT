import { formatearMoneda } from '../../servicios/servicioApi'

/**
 * Componente: TarjetaIndicador
 * Responsabilidad única: Mostrar una tarjeta de métrica financiera (KPI)
 * en el panel principal de ejecución presupuestal.
 * Autor: Aprendiz ADSO
 */
function TarjetaIndicador({ titulo, subtitulo, valor, icono, esDestacada = false }) {
  if (esDestacada) {
    return (
      <div className="tarjeta-kpi-recaudos">
        <div className="cabecera-kpi">
          <span className="etiqueta-kpi" style={{ color: '#d1fae5' }}>
            {titulo}
          </span>
          <span style={{ fontSize: '1.2rem' }}>{icono}</span>
        </div>
        <h4 style={{ fontSize: '0.75rem', color: '#a7f3d0', fontWeight: 500 }}>{subtitulo}</h4>
        <p className="valor-kpi" style={{ color: '#ffffff' }}>
          {formatearMoneda(valor)}
        </p>
      </div>
    )
  }

  return (
    <div className="tarjeta-kpi">
      <div className="cabecera-kpi">
        <span className="etiqueta-kpi">{titulo}</span>
        <span style={{ fontSize: '1.2rem' }}>{icono}</span>
      </div>
      <h4 style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{subtitulo}</h4>
      <p className="valor-kpi">{formatearMoneda(valor)}</p>
    </div>
  )
}

export default TarjetaIndicador

