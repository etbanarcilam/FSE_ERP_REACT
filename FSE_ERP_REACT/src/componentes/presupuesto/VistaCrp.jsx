import { useState } from 'react'
import { formatearMoneda } from '../../servicios/servicioApi'

/**
 * Componente: VistaCrp
 * Responsabilidad única: Listar los Certificados de Registro Presupuestal (CRP),
 * mostrar su detalle y registrar nuevos compromisos afectando CDPs aprobados.
 * Autor: Aprendiz ADSO
 */
function VistaCrp({
  crps,
  cdps,
  terceros,
  mostrarFormulario,
  alAlternarFormulario,
  idSeleccionado,
  alSeleccionarId,
  alGuardarCrp,
}) {
  const cdpsDisponibles = cdps.filter((c) => c.estado === 'A' && c.saldo_disponibilidad > 0)
  const fechaHoy = new Date().toISOString().slice(0, 10)

  // Estado local del formulario de CRP
  const [fecha, setFecha] = useState(fechaHoy)
  const [codigoTercero, setCodigoTercero] = useState(terceros[0]?.codigo_tercero || '')
  const [codigoCdp, setCodigoCdp] = useState(cdpsDisponibles[0]?.codigo_disponibilidad || '')
  const [objeto, setObjeto] = useState('')
  const [valor, setValor] = useState('')
  const [errorForm, setErrorForm] = useState('')

  const crpSeleccionado = crps.find((c) => c.id === idSeleccionado) || null
  const numeroSugerido = `CRP-2026-${String(crps.length + 1).padStart(3, '0')}`

  const manejarSubmit = (evento) => {
    evento.preventDefault()
    setErrorForm('')

    const cdpElegido = cdpsDisponibles.find(
      (c) => Number(c.codigo_disponibilidad) === Number(codigoCdp)
    )
    const terceroElegido = terceros.find(
      (t) => Number(t.codigo_tercero) === Number(codigoTercero)
    )
    const monto = Number(valor) || 0

    if (!cdpElegido) {
      setErrorForm('Debe seleccionar un CDP aprobado con saldo disponible.')
      return
    }
    if (!terceroElegido) {
      setErrorForm('Es obligatorio seleccionar un tercero beneficiario.')
      return
    }
    if (monto <= 0 || monto > cdpElegido.saldo_disponibilidad) {
      setErrorForm(
        `El valor debe ser mayor a $0 y no superar el saldo del CDP (${formatearMoneda(
          cdpElegido.saldo_disponibilidad
        )}).`
      )
      return
    }

    alGuardarCrp({
      numero: numeroSugerido,
      fecha,
      codigo_tercero: terceroElegido.codigo_tercero,
      tercero_nombre: terceroElegido.nombre,
      tercero_nit: terceroElegido.nit,
      codigo_disponibilidad: cdpElegido.codigo_disponibilidad,
      cdp_consecutivo: cdpElegido.consecutivo,
      rubro_codigo: cdpElegido.detalles[0]?.rubro_codigo || '2.1.1',
      rubro_nombre: cdpElegido.detalles[0]?.rubro_nombre || 'RUBRO PRESUPUESTAL',
      objeto,
      valor: monto,
    })

    setObjeto('')
    setValor('')
  }

  return (
    <div className={`grilla-modulo ${mostrarFormulario ? 'grilla-modulo-dividida' : ''}`}>
      {/* Tabla de CRPs */}
      <div className="panel-blanco">
        <div className="encabezado-seccion">
          <h2 className="titulo-seccion">
            <span>📋</span>
            <span>Certificados de Registro Presupuestal (CRP)</span>
          </h2>
          <span className="insignia insignia-contador">{crps.length} Registros</span>
        </div>

        <div className="contenedor-tabla">
          <table className="tabla-erp">
            <thead>
              <tr>
                <th>Número</th>
                <th>Fecha</th>
                <th>Tercero / Beneficiario</th>
                <th>CDP Afectado</th>
                <th>Objeto / Compromiso</th>
                <th className="texto-derecha">Valor Total</th>
                <th className="texto-derecha">Saldo CRP</th>
              </tr>
            </thead>
            <tbody>
              {crps.map((crp) => (
                <tr
                  key={crp.id}
                  onClick={() => alSeleccionarId(crp.id)}
                  className={idSeleccionado === crp.id ? 'fila-seleccionada' : ''}
                >
                  <td style={{ fontWeight: 800 }}>{crp.numero}</td>
                  <td>{crp.fecha}</td>
                  <td>
                    <strong style={{ display: 'block' }}>{crp.tercero_nombre}</strong>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      NIT: {crp.tercero_nit}
                    </span>
                  </td>
                  <td>
                    <span className="insignia insignia-contador">
                      CDP-#{String(crp.cdp_consecutivo).padStart(3, '0')}
                    </span>
                  </td>
                  <td>{crp.objeto}</td>
                  <td className="texto-derecha" style={{ fontWeight: 800 }}>
                    {formatearMoneda(crp.valor)}
                  </td>
                  <td className="texto-derecha" style={{ fontWeight: 800, color: '#059669' }}>
                    {formatearMoneda(crp.saldo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detalle del CRP seleccionado */}
        {crpSeleccionado && (
          <div className="panel-gris-detalle">
            <div className="encabezado-seccion" style={{ marginBottom: '0.6rem' }}>
              <h3 className="titulo-seccion" style={{ fontSize: '0.95rem' }}>
                🔍 Detalle del CRP:{' '}
                <span style={{ color: '#4f46e5' }}>{crpSeleccionado.numero}</span>
              </h3>
              <button
                type="button"
                onClick={() => alSeleccionarId(null)}
                className="boton-secundario"
              >
                ✕ Cerrar
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>
              <strong>Beneficiario:</strong> {crpSeleccionado.tercero_nombre} (NIT:{' '}
              {crpSeleccionado.tercero_nit})
            </p>
            <p style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>
              <strong>Rubro Afectado:</strong> {crpSeleccionado.rubro_codigo} -{' '}
              {crpSeleccionado.rubro_nombre}
            </p>
            <p style={{ fontSize: '0.8rem' }}>
              <strong>Objeto:</strong> {crpSeleccionado.objeto}
            </p>
          </div>
        )}
      </div>

      {/* Formulario de nuevo CRP */}
      {mostrarFormulario && (
        <div className="panel-blanco">
          <div className="encabezado-seccion">
            <h3 className="titulo-seccion" style={{ fontSize: '1.05rem' }}>
              Registrar Nuevo CRP
            </h3>
            <button type="button" onClick={alAlternarFormulario} className="boton-secundario">
              ✕ Cerrar
            </button>
          </div>

          {errorForm && <div className="alerta-error">{errorForm}</div>}

          <form onSubmit={manejarSubmit} className="formulario-erp">
            <div className="grilla-2-columnas">
              <div className="grupo-campo">
                <label className="etiqueta-campo">Número de CRP</label>
                <input type="text" readOnly value={numeroSugerido} className="entrada-erp" />
              </div>
              <div className="grupo-campo">
                <label className="etiqueta-campo">Fecha de Registro</label>
                <input
                  type="date"
                  required
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="entrada-erp"
                />
              </div>
            </div>

            <div className="grupo-campo">
              <label className="etiqueta-campo">Tercero / Beneficiario *</label>
              <select
                value={codigoTercero}
                onChange={(e) => setCodigoTercero(e.target.value)}
                required
                className="entrada-erp"
              >
                {terceros.map((t) => (
                  <option key={t.codigo_tercero} value={t.codigo_tercero}>
                    {t.nit} - {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="grupo-campo">
              <label className="etiqueta-campo">CDP Aprobado a Afectar *</label>
              <select
                value={codigoCdp}
                onChange={(e) => setCodigoCdp(e.target.value)}
                required
                className="entrada-erp"
              >
                <option value="">-- Seleccione CDP --</option>
                {cdpsDisponibles.map((c) => (
                  <option key={c.codigo_disponibilidad} value={c.codigo_disponibilidad}>
                    CDP-#{String(c.consecutivo).padStart(3, '0')} - Saldo:{' '}
                    {formatearMoneda(c.saldo_disponibilidad)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grupo-campo">
              <label className="etiqueta-campo">Objeto del Compromiso</label>
              <textarea
                rows="2"
                required
                value={objeto}
                onChange={(e) => setObjeto(e.target.value)}
                placeholder="Describa el contrato u orden de compra..."
                className="entrada-erp"
              />
            </div>

            <div className="grupo-campo">
              <label className="etiqueta-campo">Valor a Comprometer ($)</label>
              <input
                type="number"
                min="1"
                required
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ej: 5000000"
                className="entrada-erp"
              />
            </div>

            <button type="submit" className="boton-indigo">
              Guardar Compromiso (CRP)
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default VistaCrp

