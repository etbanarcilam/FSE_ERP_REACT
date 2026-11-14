import { useState } from 'react'

/**
 * Componente: EncabezadoSuperior
 * Responsabilidad única: Mostrar la barra superior oscura con el selector de
 * módulos activos, el nombre de la institución educativa y los datos de sesión.
 * Autor: Aprendiz ADSO
 */
function EncabezadoSuperior({
  moduloActivo,
  modulosHabilitados,
  alCambiarModulo,
  institucionActiva,
  opcionesSistema,
  usuarioActivo,
  alCambiarInstitucion,
  alCerrarSesion,
}) {
  // Estado local únicamente para abrir o cerrar el menú desplegable de módulos
  const [menuAbierto, setMenuAbierto] = useState(false)

  const fechaHoy = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const listaModulos = ['Presupuesto', 'Tesorería', 'Contabilidad', 'Administrador'].filter(
    (nombre) => modulosHabilitados[nombre] !== false
  )

  const manejarSeleccionModulo = (nombreModulo) => {
    alCambiarModulo(nombreModulo)
    setMenuAbierto(false)
  }

  return (
    <header className="encabezado-superior no-imprimir">
      <div className="barra-interna">
        {/* Selector desplegable de módulos (Izquierda) */}
        <div className="selector-modulo-caja">
          <button
            type="button"
            className="boton-selector-modulo"
            onClick={() => setMenuAbierto((previo) => !previo)}
          >
            <span>{moduloActivo}</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>▼</span>
          </button>

          {menuAbierto && (
            <div className="menu-modulos">
              {listaModulos.map((nombreModulo) => (
                <button
                  key={nombreModulo}
                  type="button"
                  onClick={() => manejarSeleccionModulo(nombreModulo)}
                  className={`opcion-modulo ${
                    moduloActivo === nombreModulo ? 'opcion-modulo-activa' : ''
                  }`}
                >
                  <span>{nombreModulo}</span>
                  {moduloActivo === nombreModulo && <span className="punto-activo" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nombre de la Institución Educativa Activa (Centro) */}
        <div className="texto-centro" style={{ flex: 1 }}>
          <h1 className="titulo-degradado" style={{ fontSize: '1.35rem' }}>
            {institucionActiva?.nombre_institucion || opcionesSistema.nombreInstitucion}
          </h1>
        </div>

        {/* Datos de sesión, fecha y botón salir (Derecha) */}
        <div className="info-sesion">
          <div className="datos-usuario-header">
            <span>
              Fecha: <strong style={{ color: '#ffffff' }}>{fechaHoy}</strong>
            </span>
            <span>
              Usuario: <strong style={{ color: '#ffffff' }}>{usuarioActivo?.nombre || 'Admin FSE'}</strong>
            </span>
            <button
              type="button"
              onClick={alCambiarInstitucion}
              className="enlace-cambiar-inst"
            >
              Cambiar Inst.
            </button>
          </div>

          <button type="button" onClick={alCerrarSesion} className="boton-salir">
            <span>↪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default EncabezadoSuperior

