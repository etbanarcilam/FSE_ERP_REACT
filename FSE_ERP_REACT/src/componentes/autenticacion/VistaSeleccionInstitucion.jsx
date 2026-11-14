import { useState } from 'react'

/**
 * Componente: VistaSeleccionInstitucion
 * Responsabilidad única: Permitir al usuario autenticado buscar y elegir la
 * institución educativa con la que desea operar en la sesión actual.
 * Autor: Aprendiz ADSO
 */
function VistaSeleccionInstitucion({
  usuarioActivo,
  instituciones,
  alSeleccionarInstitucion,
  alCerrarSesion,
}) {
  // Estado local para el filtro de búsqueda en tiempo real
  const [busqueda, setBusqueda] = useState('')

  const normalizarTexto = (texto) =>
    String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

  const consulta = normalizarTexto(busqueda)

  const institucionesFiltradas = instituciones.filter((inst) => {
    const nombre = normalizarTexto(inst.nombre_institucion)
    const codigo = normalizarTexto(inst.codigo_interno)
    const dane = normalizarTexto(inst.codigo_dane)
    return nombre.includes(consulta) || codigo.includes(consulta) || dane.includes(consulta)
  })

  return (
    <div className="pantalla-oscura">
      <div className="contenedor-instituciones">
        {/* Saludo superior */}
        <div className="cabecera-acceso" style={{ marginBottom: '1.5rem' }}>
          <h1 className="titulo-degradado">FSE_ERP Colombia</h1>
          <p className="subtitulo-acceso">
            Hola, <strong style={{ color: '#ffffff' }}>{usuarioActivo?.nombre}</strong>. Por favor
            seleccione la institución educativa para operar en esta sesión.
          </p>
        </div>

        {/* Tarjeta de listado y buscador */}
        <div className="tarjeta-oscura">
          <div className="grupo-campo">
            <label
              htmlFor="buscar-institucion"
              className="etiqueta-campo"
              style={{ color: '#94a3b8' }}
            >
              Buscar Institución o Código DANE
            </label>
            <input
              id="buscar-institucion"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="campo-oscuro"
              placeholder="Escriba nombre o código (ej: alvernia, 9999999999...)"
            />
          </div>

          <div className="lista-instituciones">
            {/* Usamos inst.codigo_interno como key única y estable */}
            {institucionesFiltradas.map((inst) => (
              <div
                key={inst.codigo_interno}
                onClick={() => alSeleccionarInstitucion(inst)}
                className="item-institucion"
              >
                <div>
                  <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                    {inst.nombre_institucion}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      marginTop: '0.25rem',
                    }}
                  >
                    <span>
                      Código Interno: <strong>{inst.codigo_interno}</strong>
                    </span>
                    <span>
                      Código DANE: <strong>{inst.codigo_dane || inst.codigo_interno}</strong>
                    </span>
                  </div>
                </div>

                <span style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.8rem' }}>
                  Ingresar →
                </span>
              </div>
            ))}

            {institucionesFiltradas.length === 0 && (
              <p className="texto-centro" style={{ padding: '2rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                No se encontraron instituciones educativas que coincidan con la búsqueda.
              </p>
            )}
          </div>

          <div
            style={{
              paddingTop: '1rem',
              borderTop: '1px solid rgba(51, 65, 85, 0.6)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.78rem',
            }}
          >
            <span style={{ color: '#64748b' }}>¿No es tu cuenta?</span>
            <button
              type="button"
              onClick={alCerrarSesion}
              style={{
                background: 'none',
                border: 'none',
                color: '#f87171',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VistaSeleccionInstitucion

