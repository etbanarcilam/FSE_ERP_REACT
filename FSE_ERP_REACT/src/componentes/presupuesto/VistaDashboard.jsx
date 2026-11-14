import GraficoEjecucion from './GraficoEjecucion'
import TarjetaIndicador from './TarjetaIndicador'

/**
 * Componente: VistaDashboard
 * Responsabilidad única: Presentar el tablero principal de Ejecución
 * Presupuestal con el gráfico mensual y las 5 tarjetas de saldos en tiempo real.
 * Autor: Aprendiz ADSO
 */
function VistaDashboard({ rubrosGastos, cdps, crps, ops, cxcs, anioFiscal }) {
  // Cálculos consolidados en tiempo real igual que en BudgetController@dashboard
  const disponibleRubros = rubrosGastos.reduce(
    (suma, r) => suma + (Number(r.total_disponible) || 0),
    0
  )

  const saldoCdp = cdps
    .filter((c) => c.estado === 'A')
    .reduce((suma, c) => suma + (Number(c.valor_total) || 0), 0)

  const saldoCrp = crps.reduce((suma, c) => suma + (Number(c.valor) || 0), 0)
  const saldoOp = ops.reduce((suma, o) => suma + (Number(o.valor) || 0), 0)
  const totalRecaudos = cxcs.reduce((suma, x) => suma + (Number(x.valor) || 0), 0)

  const indicadores = [
    {
      id: 'disponible-rubros',
      titulo: 'Disponible Rubros',
      subtitulo: 'Presupuesto Gasto',
      valor: disponibleRubros,
      icono: '🗂️',
      esDestacada: false,
    },
    {
      id: 'saldo-cdp',
      titulo: 'Saldo CDP',
      subtitulo: 'Disponibilidades Emitidas',
      valor: saldoCdp,
      icono: '📄',
      esDestacada: false,
    },
    {
      id: 'saldo-crp',
      titulo: 'Saldo CRP',
      subtitulo: 'Compromisos Registrados',
      valor: saldoCrp,
      icono: '📋',
      esDestacada: false,
    },
    {
      id: 'saldo-op',
      titulo: 'Saldo OP',
      subtitulo: 'Órdenes de Pago Generadas',
      valor: saldoOp,
      icono: '💳',
      esDestacada: false,
    },
    {
      id: 'total-recaudos',
      titulo: 'Total Recaudos',
      subtitulo: 'Ingresos Recaudados (CXC)',
      valor: totalRecaudos,
      icono: '📈',
      esDestacada: true,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Encabezado del Dashboard */}
      <div className="encabezado-seccion" style={{ marginBottom: 0 }}>
        <div>
          <h2 className="titulo-seccion" style={{ fontSize: '1.5rem' }}>
            Ejecución Presupuestal {anioFiscal || '2026'}
          </h2>
          <p className="subtitulo-seccion">
            Resumen consolidado del Fondo de Servicios Educativos (FSE) actual en tiempo real.
          </p>
        </div>

        <span className="insignia insignia-contador" style={{ padding: '0.4rem 0.85rem' }}>
          ● Conexión en línea
        </span>
      </div>

      {/* Gráfico de Ejecución Mensual */}
      <GraficoEjecucion />

      {/* Tarjetas de Indicadores Financieros (key única y estable por id) */}
      <div className="grilla-kpi-5">
        {indicadores.map((item) => (
          <TarjetaIndicador
            key={item.id}
            titulo={item.titulo}
            subtitulo={item.subtitulo}
            valor={item.valor}
            icono={item.icono}
            esDestacada={item.esDestacada}
          />
        ))}
      </div>
    </div>
  )
}

export default VistaDashboard

