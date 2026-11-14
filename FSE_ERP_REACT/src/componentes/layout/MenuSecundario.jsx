/**
 * Componente: MenuSecundario
 * Responsabilidad única: Renderizar las pestañas de navegación propias de cada
 * módulo (Presupuesto, Tesorería, Contabilidad o Administrador).
 * Autor: Aprendiz ADSO
 */

const OPCIONES_POR_MODULO = {
  Presupuesto: [
    { id: 'dashboard', etiqueta: 'Dashboard' },
    { id: 'cdp', etiqueta: 'CDP' },
    { id: 'crp', etiqueta: 'CRP' },
    { id: 'cxp', etiqueta: 'CXP' },
    { id: 'op', etiqueta: 'OP' },
    { id: 'cxc', etiqueta: 'CXC' },
    { id: 'reportes', etiqueta: 'Reportes' },
    { id: 'mov_rubros', etiqueta: 'Mov Rubros' },
  ],
  Tesorería: [
    { id: 'resumen_caja', etiqueta: 'Resumen Caja' },
    { id: 'ingresos', etiqueta: 'Ingresos' },
    { id: 'egresos', etiqueta: 'Egresos' },
    { id: 'bancos', etiqueta: 'Bancos' },
    { id: 'conciliacion', etiqueta: 'Conciliación' },
  ],
  Contabilidad: [
    { id: 'libro_diario', etiqueta: 'Libro Diario' },
    { id: 'libro_mayor', etiqueta: 'Libro Mayor' },
    { id: 'balances', etiqueta: 'Balances' },
    { id: 'puc', etiqueta: 'Plan de Cuentas (PUC)' },
    { id: 'terceros', etiqueta: 'Terceros' },
  ],
  Administrador: [
    { id: 'resumen_admin', etiqueta: 'Resumen' },
    { id: 'usuarios', etiqueta: 'Usuarios' },
    { id: 'rubros_gastos', etiqueta: 'Rubros Gastos' },
    { id: 'rubros_ingresos', etiqueta: 'Rubros Ingresos' },
    { id: 'modulos', etiqueta: 'Módulos' },
    { id: 'opciones', etiqueta: 'Opciones' },
  ],
}

function MenuSecundario({ moduloActivo, subvistaActiva, alCambiarSubvista }) {
  const pestanas = OPCIONES_POR_MODULO[moduloActivo] || OPCIONES_POR_MODULO.Presupuesto

  return (
    <nav className="menu-secundario no-imprimir">
      <div className="lista-pestanas">
        {/* Se usa opcion.id como key única y estable siguiendo las buenas prácticas de React */}
        {pestanas.map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            onClick={() => alCambiarSubvista(opcion.id)}
            className={`pestana-menu ${
              subvistaActiva === opcion.id ? 'pestana-menu-activa' : ''
            }`}
          >
            {opcion.etiqueta}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default MenuSecundario

