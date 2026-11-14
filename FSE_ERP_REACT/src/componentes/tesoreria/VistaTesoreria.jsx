/**
 * Componente: VistaTesoreria
 * Responsabilidad única: Presentar el panel de control del módulo de Tesorería
 * con sus tarjetas de acceso rápido igual al diseño de Laravel.
 * Autor: Aprendiz ADSO
 */

const ACCESOS_TESORERIA = [
  {
    id: 'caja-recaudos',
    titulo: 'Control de Caja y Recaudos',
    descripcion: 'Supervisión y control de efectivo diario y cierres de caja.',
    colorPunto: '#10b981',
  },
  {
    id: 'cuentas-bancarias',
    titulo: 'Cuentas Bancarias',
    descripcion: 'Administración de cuentas corrientes y de ahorros de la institución.',
    colorPunto: '#6366f1',
  },
  {
    id: 'conciliacion-bancaria',
    titulo: 'Conciliación Bancaria',
    descripcion: 'Comparación automatizada de extractos bancarios vs. contabilidad.',
    colorPunto: '#f59e0b',
  },
  {
    id: 'programacion-egresos',
    titulo: 'Programación de Egresos',
    descripcion: 'Control de pagos programados a proveedores y contratistas.',
    colorPunto: '#a855f7',
  },
]

function VistaTesoreria() {
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
        🏦
      </div>

      <h2 className="titulo-seccion" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
        Módulo de Tesorería - FSE_ERP
      </h2>

      <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '36rem', margin: '0 auto 2rem', lineHeight: 1.6 }}>
        Bienvenido al panel de control de Tesorería. Desde aquí podrá gestionar el flujo de caja,
        las cuentas bancarias institucionales, la programación de egresos, conciliaciones y el
        control de ingresos recaudados en tiempo real.
      </p>

      <div className="grilla-2-columnas" style={{ textAlign: 'left', maxWidth: '40rem', margin: '0 auto' }}>
        {ACCESOS_TESORERIA.map((item) => (
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
    </div>
  )
}

export default VistaTesoreria

