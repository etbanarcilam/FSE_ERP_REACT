/**
 * Componente: VistaContabilidad
 * Responsabilidad única: Presentar el panel de control del módulo de
 * Contabilidad (PUC, Libro Diario, Libro Mayor y Balances).
 * Autor: Aprendiz ADSO
 */

const ACCESOS_CONTABILIDAD = [
  {
    id: 'puc',
    titulo: 'Plan Único de Cuentas (PUC)',
    descripcion: 'Estructura parametrizable del catálogo de cuentas contables escolares.',
    colorPunto: '#3b82f6',
  },
  {
    id: 'comprobantes-diarios',
    titulo: 'Comprobantes y Asientos Diarios',
    descripcion: 'Creación y consulta de registros en el libro diario de operaciones.',
    colorPunto: '#10b981',
  },
  {
    id: 'libro-mayor',
    titulo: 'Libro Mayor y Auxiliares',
    descripcion: 'Saldos de cuentas mayorizadas e historial detallado de movimientos.',
    colorPunto: '#f97316',
  },
  {
    id: 'balances-informes',
    titulo: 'Balances e Informes Financieros',
    descripcion: 'Generación de Balance de Prueba, Balance General y Estado de Resultados.',
    colorPunto: '#f43f5e',
  },
]

function VistaContabilidad({ alIrATerceros }) {
  return (
    <div className="panel-blanco texto-centro" style={{ maxWidth: '48rem', margin: '1.5rem auto', padding: '2.5rem' }}>
      <div
        style={{
          width: '4rem',
          height: '4rem',
          background: '#eef2ff',
          color: '#4f46e5',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          fontSize: '1.75rem',
        }}
      >
        📘
      </div>

      <h2 className="titulo-seccion" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
        Módulo de Contabilidad - FSE_ERP
      </h2>

      <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '36rem', margin: '0 auto 2rem', lineHeight: 1.6 }}>
        Bienvenido al panel de control de Contabilidad. Desde aquí podrá supervisar los asientos
        del libro diario, generar balances generales de prueba, consultar el libro mayor de cuentas
        y organizar el Plan Único de Cuentas (PUC) de la institución.
      </p>

      <div className="grilla-2-columnas" style={{ textAlign: 'left', maxWidth: '40rem', margin: '0 auto 1.5rem' }}>
        {ACCESOS_CONTABILIDAD.map((item) => (
          <div key={item.id} className="tarjeta-kpi">
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 9999,
                  backgroundColor: item.colorPunto,
                  display: 'inline-block',
                }}
              />
              {item.titulo}
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.35rem' }}>
              {item.descripcion}
            </p>
          </div>
        ))}
      </div>

      <button type="button" onClick={alIrATerceros} className="boton-indigo">
        Ir al Catálogo de Terceros →
      </button>
    </div>
  )
}

export default VistaContabilidad

