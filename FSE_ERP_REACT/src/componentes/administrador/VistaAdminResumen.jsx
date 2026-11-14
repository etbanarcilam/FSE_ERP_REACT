/**
 * Componente: VistaAdminResumen
 * Responsabilidad única: Mostrar el resumen administrativo global (Usuarios
 * registrados, Módulos activos, Año fiscal y accesos rápidos).
 * Autor: Aprendiz ADSO
 */
function VistaAdminResumen({
  totalUsuarios,
  modulosHabilitados,
  opcionesSistema,
  alNavegarSubvista,
}) {
  const cantidadActivos = Object.values(modulosHabilitados).filter(Boolean).length

  const enlacesRapidos = [
    {
      id: 'usuarios',
      titulo: 'Gestión de Usuarios',
      descripcion: 'Cree, modifique y elimine usuarios con privilegios de acceso en el ERP.',
      textoAccion: 'Gestionar usuarios →',
    },
    {
      id: 'modulos',
      titulo: 'Activar / Desactivar Módulos',
      descripcion:
        'Active o desactive módulos (Presupuesto, Tesorería, Contabilidad) de forma centralizada.',
      textoAccion: 'Configurar módulos →',
    },
    {
      id: 'opciones',
      titulo: 'Opciones del Sistema',
      descripcion:
        'Configure el año fiscal, el nombre oficial de la institución educativa y el límite de gasto.',
      textoAccion: 'Modificar opciones →',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 className="titulo-seccion">Resumen Administrativo</h2>
        <p className="subtitulo-seccion">
          Panel de control global de FSE_ERP para administración del sistema.
        </p>
      </div>

      {/* Tarjetas de estado administrativo */}
      <div className="grilla-tarjetas-3">
        <div className="tarjeta-kpi">
          <span className="etiqueta-kpi">Usuarios Registrados</span>
          <div className="valor-kpi" style={{ fontSize: '1.8rem' }}>
            {totalUsuarios}
          </div>
          <p className="subtitulo-seccion">Cuentas con acceso al ERP</p>
        </div>

        <div className="tarjeta-kpi">
          <span className="etiqueta-kpi">Módulos Activos</span>
          <div className="valor-kpi" style={{ fontSize: '1.8rem' }}>
            {cantidadActivos} <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>/ 4</span>
          </div>
          <p className="subtitulo-seccion">Habilitados en el selector superior</p>
        </div>

        <div className="tarjeta-kpi">
          <span className="etiqueta-kpi">Año Fiscal Activo</span>
          <div className="valor-kpi" style={{ fontSize: '1.8rem' }}>
            {opcionesSistema.anioFiscal}
          </div>
          <p className="subtitulo-seccion">Moneda: {opcionesSistema.moneda}</p>
        </div>
      </div>

      {/* Panel de enlaces administrativos */}
      <div className="panel-blanco">
        <h3 className="titulo-seccion" style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>
          🔒 Enlaces y Tareas Administrativas
        </h3>

        <div className="grilla-tarjetas-3">
          {enlacesRapidos.map((item) => (
            <div
              key={item.id}
              onClick={() => alNavegarSubvista(item.id)}
              className="tarjeta-kpi"
              style={{ cursor: 'pointer' }}
            >
              <h4 style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.35rem' }}>
                {item.titulo}
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
                {item.descripcion}
              </p>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#2563eb',
                }}
              >
                {item.textoAccion}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VistaAdminResumen

