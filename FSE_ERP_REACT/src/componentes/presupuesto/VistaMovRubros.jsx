import { useState } from 'react'
import { formatearMoneda } from '../../servicios/servicioApi'

/**
 * Componente: VistaMovRubros
 * Responsabilidad única: Administrar los movimientos de rubros presupuestales
 * (Cargas Iniciales, Adiciones/Reducciones y Traslados Presupuestales).
 * Autor: Aprendiz ADSO
 */
function VistaMovRubros({
  rubrosGastos,
  rubrosIngresos,
  alAplicarModificacionRubro,
  alAplicarTrasladoRubros,
}) {
  const [tipoPresupuesto, setTipoPresupuesto] = useState('G')
  const [modalActivo, setModalActivo] = useState(null) // 'modificacion' | 'traslado' | null

  // Estados para Adición / Reducción
  const listaRubros = tipoPresupuesto === 'G' ? rubrosGastos : rubrosIngresos
  const [codigoRubroMod, setCodigoRubroMod] = useState(listaRubros[0]?.codigo_rubro || '')
  const [tipoOperacionMod, setTipoOperacionMod] = useState('adicion')
  const [montoMod, setMontoMod] = useState('')
  const [descripcionMod, setDescripcionMod] = useState('')

  // Estados para Traslado Presupuestal
  const [rubroOrigen, setRubroOrigen] = useState(listaRubros[0]?.codigo_rubro || '')
  const [rubroDestino, setRubroDestino] = useState(listaRubros[1]?.codigo_rubro || listaRubros[0]?.codigo_rubro || '')
  const [montoTraslado, setMontoTraslado] = useState('')

  const manejarGuardarModificacion = (evento) => {
    evento.preventDefault()
    const idRubro = Number(codigoRubroMod || listaRubros[0]?.codigo_rubro)
    const valor = Number(montoMod) || 0
    if (valor <= 0) return

    alAplicarModificacionRubro({
      tipoPresupuesto,
      codigoRubro: idRubro,
      tipoOperacion: tipoOperacionMod,
      valor,
      descripcion: descripcionMod,
    })

    setMontoMod('')
    setDescripcionMod('')
    setModalActivo(null)
  }

  const manejarGuardarTraslado = (evento) => {
    evento.preventDefault()
    const valor = Number(montoTraslado) || 0
    if (valor <= 0 || Number(rubroOrigen) === Number(rubroDestino)) return

    alAplicarTrasladoRubros({
      tipoPresupuesto,
      codigoOrigen: Number(rubroOrigen),
      codigoDestino: Number(rubroDestino),
      valor,
    })

    setMontoTraslado('')
    setModalActivo(null)
  }

  return (
    <div className="panel-blanco">
      {/* Cabecera y botonera de acciones presupuestales */}
      <div className="encabezado-seccion">
        <div>
          <h2 className="titulo-seccion">
            <span>🗂️</span>
            <span>Gestión y Movimientos de Presupuesto</span>
          </h2>
          <p className="subtitulo-seccion">
            Cargas iniciales, Adiciones, Reducciones y Traslados Presupuestales oficiales.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setTipoPresupuesto('G')}
            className={tipoPresupuesto === 'G' ? 'boton-indigo' : 'boton-secundario'}
          >
            🔴 GASTOS (G)
          </button>
          <button
            type="button"
            onClick={() => setTipoPresupuesto('I')}
            className={tipoPresupuesto === 'I' ? 'boton-exito' : 'boton-secundario'}
          >
            🟢 INGRESOS (I)
          </button>
          <button
            type="button"
            onClick={() => setModalActivo('modificacion')}
            className="boton-peligro"
          >
            + Adición / Reducción
          </button>
          <button
            type="button"
            onClick={() => setModalActivo('traslado')}
            className="boton-advertencia"
          >
            ⇄ Traslado Presupuestal
          </button>
        </div>
      </div>

      {/* Tabla de rubros y sus saldos presupuestales */}
      <div className="contenedor-tabla">
        <table className="tabla-erp">
          <thead>
            <tr>
              <th>Cód. Resumido</th>
              <th>Rubro</th>
              <th>Nombre del Rubro</th>
              <th className="texto-derecha">Pres. Inicial</th>
              <th className="texto-derecha">Adiciones (+)</th>
              <th className="texto-derecha">Reducciones (-)</th>
              <th className="texto-derecha">Traslados (+/-)</th>
              <th className="texto-derecha">Definitivo</th>
              <th className="texto-derecha">Total Disponible</th>
            </tr>
          </thead>
          <tbody>
            {listaRubros.map((r) => (
              <tr key={r.codigo_rubro}>
                <td className="texto-codigo">#{r.codigo_resumido}</td>
                <td className="texto-codigo" style={{ color: '#4f46e5' }}>
                  {r.rubro}
                </td>
                <td style={{ fontWeight: 700 }}>{r.nombre}</td>
                <td className="texto-derecha">{formatearMoneda(r.presupuesto_inicial)}</td>
                <td className="texto-derecha" style={{ color: '#059669', fontWeight: 700 }}>
                  +{formatearMoneda(r.adiciones)}
                </td>
                <td className="texto-derecha" style={{ color: '#e11d48', fontWeight: 700 }}>
                  -{formatearMoneda(r.reducciones)}
                </td>
                <td className="texto-derecha">
                  {formatearMoneda(
                    (Number(r.traslados_aumento) || 0) - (Number(r.traslado_disminucion) || 0)
                  )}
                </td>
                <td className="texto-derecha" style={{ fontWeight: 800 }}>
                  {formatearMoneda(r.definitivo)}
                </td>
                <td className="texto-derecha" style={{ fontWeight: 800, color: '#1d4ed8' }}>
                  {formatearMoneda(r.total_disponible)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal 1: Adición o Reducción Presupuestal */}
      {modalActivo === 'modificacion' && (
        <div className="modal-fondo">
          <div className="modal-caja">
            <div className="encabezado-seccion">
              <h3 className="titulo-seccion" style={{ fontSize: '1rem' }}>
                Registrar Adición o Reducción Presupuestal
              </h3>
              <button
                type="button"
                onClick={() => setModalActivo(null)}
                className="boton-secundario"
              >
                ✕
              </button>
            </div>

            <form onSubmit={manejarGuardarModificacion} className="formulario-erp">
              <div className="grupo-campo">
                <label className="etiqueta-campo">Rubro a Modificar</label>
                <select
                  value={codigoRubroMod}
                  onChange={(e) => setCodigoRubroMod(e.target.value)}
                  className="entrada-erp"
                >
                  {listaRubros.map((r) => (
                    <option key={r.codigo_rubro} value={r.codigo_rubro}>
                      {r.rubro} - {r.nombre} (Disp: {formatearMoneda(r.total_disponible)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grilla-2-columnas">
                <div className="grupo-campo">
                  <label className="etiqueta-campo">Tipo de Movimiento</label>
                  <select
                    value={tipoOperacionMod}
                    onChange={(e) => setTipoOperacionMod(e.target.value)}
                    className="entrada-erp"
                  >
                    <option value="adicion">Adición (+)</option>
                    <option value="reduccion">Reducción (-)</option>
                  </select>
                </div>

                <div className="grupo-campo">
                  <label className="etiqueta-campo">Valor ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={montoMod}
                    onChange={(e) => setMontoMod(e.target.value)}
                    className="entrada-erp"
                  />
                </div>
              </div>

              <div className="grupo-campo">
                <label className="etiqueta-campo">Resolución / Justificación</label>
                <input
                  type="text"
                  required
                  value={descripcionMod}
                  onChange={(e) => setDescripcionMod(e.target.value)}
                  placeholder="Acuerdo Directivo N° 004 de 2026..."
                  className="entrada-erp"
                />
              </div>

              <button type="submit" className="boton-indigo">
                Aplicar Modificación
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Traslado Presupuestal (Crédito y Contracrédito) */}
      {modalActivo === 'traslado' && (
        <div className="modal-fondo">
          <div className="modal-caja">
            <div className="encabezado-seccion">
              <h3 className="titulo-seccion" style={{ fontSize: '1rem' }}>
                Registrar Traslado Presupuestal
              </h3>
              <button
                type="button"
                onClick={() => setModalActivo(null)}
                className="boton-secundario"
              >
                ✕
              </button>
            </div>

            <form onSubmit={manejarGuardarTraslado} className="formulario-erp">
              <div className="grupo-campo">
                <label className="etiqueta-campo">Rubro Contracrédito (Disminuye -)</label>
                <select
                  value={rubroOrigen}
                  onChange={(e) => setRubroOrigen(e.target.value)}
                  className="entrada-erp"
                >
                  {listaRubros.map((r) => (
                    <option key={r.codigo_rubro} value={r.codigo_rubro}>
                      {r.rubro} - {r.nombre} (Disp: {formatearMoneda(r.total_disponible)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grupo-campo">
                <label className="etiqueta-campo">Rubro Crédito (Aumenta +)</label>
                <select
                  value={rubroDestino}
                  onChange={(e) => setRubroDestino(e.target.value)}
                  className="entrada-erp"
                >
                  {listaRubros.map((r) => (
                    <option key={r.codigo_rubro} value={r.codigo_rubro}>
                      {r.rubro} - {r.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grupo-campo">
                <label className="etiqueta-campo">Valor a Trasladar ($)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={montoTraslado}
                  onChange={(e) => setMontoTraslado(e.target.value)}
                  className="entrada-erp"
                />
              </div>

              <button type="submit" className="boton-advertencia">
                Confirmar Traslado
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default VistaMovRubros

