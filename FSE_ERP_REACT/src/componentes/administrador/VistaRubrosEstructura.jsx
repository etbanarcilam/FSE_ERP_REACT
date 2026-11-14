import { useState } from 'react'

/**
 * Componente: VistaRubrosEstructura
 * Responsabilidad única: Administrar la estructura jerárquica de niveles y
 * códigos de rubros para Gastos (G) o Ingresos (I) en el módulo Administrador.
 * Autor: Aprendiz ADSO
 */
function VistaRubrosEstructura({ tipoRubro }) {
  const esGasto = tipoRubro === 'G'

  const [niveles, setNiveles] = useState([
    { codigo_nivel: 1, orden: 1, vigencia: 2026, descripcion: 'GRUPO PRINCIPAL', longitud: 1, fuente: 'N' },
    { codigo_nivel: 2, orden: 2, vigencia: 2026, descripcion: 'SUBGRUPO PRESUPUESTAL', longitud: 2, fuente: 'S' },
  ])

  const [codigos, setCodigos] = useState([
    {
      codigo: esGasto ? '2' : '1',
      codigo_completo: esGasto ? '2' : '1',
      nivel_orden: 1,
      descripcion: esGasto ? 'PRESUPUESTO DE GASTOS' : 'PRESUPUESTO DE INGRESOS',
      movimiento: 'N',
    },
    {
      codigo: '01',
      codigo_completo: esGasto ? '201' : '101',
      nivel_orden: 2,
      descripcion: esGasto ? 'GASTOS DE FUNCIONAMIENTO' : 'INGRESOS CORRIENTES SGP',
      movimiento: 'S',
    },
  ])

  const [descripcionNivel, setDescripcionNivel] = useState('')
  const [longitudNivel, setLongitudNivel] = useState(2)
  const [segmentoCodigo, setSegmentoCodigo] = useState('')
  const [descripcionCodigo, setDescripcionCodigo] = useState('')
  const [movimientoCodigo, setMovimientoCodigo] = useState('S')

  const agregarNivel = (evento) => {
    evento.preventDefault()
    const nuevoOrden = niveles.length + 1
    setNiveles((prev) => [
      ...prev,
      {
        codigo_nivel: Date.now(),
        orden: nuevoOrden,
        vigencia: 2026,
        descripcion: descripcionNivel.toUpperCase(),
        longitud: Number(longitudNivel) || 2,
        fuente: 'N',
      },
    ])
    setDescripcionNivel('')
  }

  const agregarCodigo = (evento) => {
    evento.preventDefault()
    const prefijo = esGasto ? '2' : '1'
    setCodigos((prev) => [
      ...prev,
      {
        codigo: segmentoCodigo,
        codigo_completo: `${prefijo}${segmentoCodigo}`,
        nivel_orden: 2,
        descripcion: descripcionCodigo.toUpperCase(),
        movimiento: movimientoCodigo,
      },
    ])
    setSegmentoCodigo('')
    setDescripcionCodigo('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 className="titulo-seccion">
          Estructura de Rubros de {esGasto ? 'Gastos' : 'Ingresos'}
        </h2>
        <p className="subtitulo-seccion">
          Defina la estructura jerárquica de niveles y códigos de {esGasto ? 'gastos' : 'ingresos'}.
        </p>
      </div>

      {/* Sección 1: Niveles */}
      <div className="grilla-modulo grilla-modulo-dividida">
        <div className="panel-blanco">
          <h3 className="titulo-seccion" style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>
            Niveles de Estructura Creados
          </h3>
          <div className="contenedor-tabla">
            <table className="tabla-erp">
              <thead>
                <tr>
                  <th className="texto-centro">Nivel</th>
                  <th>Vigencia</th>
                  <th>Descripción</th>
                  <th className="texto-centro">Longitud Dígitos</th>
                </tr>
              </thead>
              <tbody>
                {niveles.map((n) => (
                  <tr key={n.codigo_nivel}>
                    <td className="texto-centro">
                      <span className="insignia insignia-contador">NIVEL {n.orden}</span>
                    </td>
                    <td className="texto-codigo">{n.vigencia}</td>
                    <td style={{ fontWeight: 700 }}>{n.descripcion}</td>
                    <td className="texto-centro texto-codigo">{n.longitud}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-blanco">
          <h3 className="titulo-seccion" style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>
            Crear Nuevo Nivel
          </h3>
          <form onSubmit={agregarNivel} className="formulario-erp">
            <div className="grupo-campo">
              <label className="etiqueta-campo">Descripción del Nivel</label>
              <input
                type="text"
                required
                value={descripcionNivel}
                onChange={(e) => setDescripcionNivel(e.target.value)}
                placeholder="PROGRAMA, SUBPROGRAMA..."
                className="entrada-erp"
              />
            </div>
            <div className="grupo-campo">
              <label className="etiqueta-campo">Longitud de Código (Dígitos)</label>
              <input
                type="number"
                min="1"
                required
                value={longitudNivel}
                onChange={(e) => setLongitudNivel(e.target.value)}
                className="entrada-erp"
              />
            </div>
            <button type="submit" className="boton-primario">
              Agregar Nivel ({niveles.length + 1})
            </button>
          </form>
        </div>
      </div>

      {/* Sección 2: Códigos */}
      <div className="grilla-modulo grilla-modulo-dividida">
        <div className="panel-blanco">
          <h3 className="titulo-seccion" style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>
            Códigos de Estructura
          </h3>
          <div className="contenedor-tabla">
            <table className="tabla-erp">
              <thead>
                <tr>
                  <th>Código Completo</th>
                  <th>Nivel</th>
                  <th>Descripción</th>
                  <th className="texto-centro">Movimiento</th>
                </tr>
              </thead>
              <tbody>
                {codigos.map((c) => (
                  <tr key={c.codigo_completo}>
                    <td className="texto-codigo" style={{ color: '#2563eb' }}>
                      {c.codigo_completo}
                    </td>
                    <td>Nivel {c.nivel_orden}</td>
                    <td style={{ fontWeight: 700 }}>{c.descripcion}</td>
                    <td className="texto-centro">
                      <span
                        className={`insignia ${
                          c.movimiento === 'S' ? 'insignia-aprobado' : 'insignia-borrador'
                        }`}
                      >
                        {c.movimiento === 'S' ? 'SÍ (Detalle)' : 'NO (Agrupador)'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-blanco">
          <h3 className="titulo-seccion" style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>
            Crear Nuevo Código
          </h3>
          <form onSubmit={agregarCodigo} className="formulario-erp">
            <div className="grupo-campo">
              <label className="etiqueta-campo">Dígitos del Código</label>
              <input
                type="text"
                required
                value={segmentoCodigo}
                onChange={(e) => setSegmentoCodigo(e.target.value)}
                placeholder="Ej: 02"
                className="entrada-erp"
              />
            </div>
            <div className="grupo-campo">
              <label className="etiqueta-campo">Descripción</label>
              <input
                type="text"
                required
                value={descripcionCodigo}
                onChange={(e) => setDescripcionCodigo(e.target.value)}
                placeholder="INVERSIÓN EDUCATIVA..."
                className="entrada-erp"
              />
            </div>
            <div className="grupo-campo">
              <label className="etiqueta-campo">Permite Movimiento</label>
              <select
                value={movimientoCodigo}
                onChange={(e) => setMovimientoCodigo(e.target.value)}
                className="entrada-erp"
              >
                <option value="S">Sí (Permite transacciones)</option>
                <option value="N">No (Solo acumula/agrupa)</option>
              </select>
            </div>
            <button type="submit" className="boton-primario">
              Agregar Código
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VistaRubrosEstructura

