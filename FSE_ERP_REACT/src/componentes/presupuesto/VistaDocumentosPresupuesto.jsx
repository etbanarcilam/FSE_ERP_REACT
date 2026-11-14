import { useState } from 'react'
import { formatearMoneda } from '../../servicios/servicioApi'

/**
 * Componente: VistaDocumentosPresupuesto
 * Responsabilidad única: Gestionar las vistas de Cuentas por Pagar (CXP),
 * Órdenes de Pago (OP) y Cuentas por Cobrar / Recaudos (CXC).
 * Autor: Aprendiz ADSO
 */
function VistaDocumentosPresupuesto({
  tipoDocumento, // 'cxp' | 'op' | 'cxc'
  registros,
  documentosOrigen, // crps para CXP, cxps para OP, rubrosIngresos para CXC
  mostrarFormulario,
  alAlternarFormulario,
  idSeleccionado,
  alSeleccionarId,
  alGuardarDocumento,
}) {
  const fechaHoy = new Date().toISOString().slice(0, 10)
  const [fecha, setFecha] = useState(fechaHoy)
  const [origenId, setOrigenId] = useState('')
  const [valor, setValor] = useState('')
  const [concepto, setConcepto] = useState('')

  const configuracion = {
    cxp: {
      prefijo: 'CXP',
      titulo: 'Cuentas por Pagar (CXP)',
      tituloForm: 'Obligación / Registrar CXP',
      etiquetaOrigen: 'CRP Asociado',
      icono: '🧾',
    },
    op: {
      prefijo: 'OP',
      titulo: 'Órdenes de Pago (OP)',
      tituloForm: 'Girar Nueva Orden de Pago',
      etiquetaOrigen: 'Cuenta por Pagar Asociada',
      icono: '💳',
    },
    cxc: {
      prefijo: 'CXC',
      titulo: 'Cuentas por Cobrar (CXC) / Recaudos',
      tituloForm: 'Registrar Nuevo Recaudo / CXC',
      etiquetaOrigen: 'Rubro de Ingreso',
      icono: '💰',
    },
  }[tipoDocumento]

  const numeroSugerido = `${configuracion.prefijo}-2026-${String(registros.length + 1).padStart(
    3,
    '0'
  )}`

  const manejarSubmit = (evento) => {
    evento.preventDefault()
    const idElegido = origenId || documentosOrigen[0]?.id || documentosOrigen[0]?.codigo_rubro
    const origen = documentosOrigen.find(
      (d) => Number(d.id || d.codigo_rubro) === Number(idElegido)
    )
    if (!origen) return

    alGuardarDocumento(tipoDocumento, {
      numero: numeroSugerido,
      fecha,
      origen,
      valor: Number(valor) || 0,
      concepto,
    })

    setValor('')
    setConcepto('')
  }

  return (
    <div className={`grilla-modulo ${mostrarFormulario ? 'grilla-modulo-dividida' : ''}`}>
      {/* Tabla de registros */}
      <div className="panel-blanco">
        <div className="encabezado-seccion">
          <h2 className="titulo-seccion">
            <span>{configuracion.icono}</span>
            <span>{configuracion.titulo}</span>
          </h2>
          <span className="insignia insignia-contador">{registros.length} Registros</span>
        </div>

        <div className="contenedor-tabla">
          <table className="tabla-erp">
            <thead>
              <tr>
                <th>Número</th>
                <th>Fecha</th>
                <th>{tipoDocumento === 'cxc' ? 'Rubro de Ingreso' : 'Documento Relacionado'}</th>
                <th>{tipoDocumento === 'cxc' ? 'Concepto' : 'Rubro'}</th>
                <th className="texto-derecha">Valor</th>
              </tr>
            </thead>
            <tbody>
              {/* Key única y estable por registro.id */}
              {registros.map((reg) => (
                <tr
                  key={reg.id}
                  onClick={() => alSeleccionarId(reg.id)}
                  className={idSeleccionado === reg.id ? 'fila-seleccionada' : ''}
                >
                  <td style={{ fontWeight: 800 }}>{reg.numero}</td>
                  <td>{reg.fecha}</td>
                  <td style={{ fontWeight: 700, color: '#4f46e5' }}>
                    {tipoDocumento === 'cxp' && reg.crp_numero}
                    {tipoDocumento === 'op' && reg.cxp_numero}
                    {tipoDocumento === 'cxc' && `${reg.rubro_codigo} - ${reg.rubro_nombre}`}
                  </td>
                  <td>{tipoDocumento === 'cxc' ? reg.concepto : reg.rubro_codigo}</td>
                  <td className="texto-derecha" style={{ fontWeight: 800, color: '#059669' }}>
                    {formatearMoneda(reg.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulario lateral */}
      {mostrarFormulario && (
        <div className="panel-blanco">
          <div className="encabezado-seccion">
            <h3 className="titulo-seccion" style={{ fontSize: '1.05rem' }}>
              {configuracion.tituloForm}
            </h3>
            <button type="button" onClick={alAlternarFormulario} className="boton-secundario">
              ✕ Cerrar
            </button>
          </div>

          <form onSubmit={manejarSubmit} className="formulario-erp">
            <div className="grupo-campo">
              <label className="etiqueta-campo">Número Consecutivo</label>
              <input type="text" readOnly value={numeroSugerido} className="entrada-erp" />
            </div>

            <div className="grupo-campo">
              <label className="etiqueta-campo">Fecha</label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="entrada-erp"
              />
            </div>

            <div className="grupo-campo">
              <label className="etiqueta-campo">{configuracion.etiquetaOrigen}</label>
              <select
                value={origenId}
                onChange={(e) => setOrigenId(e.target.value)}
                className="entrada-erp"
              >
                {documentosOrigen.map((doc) => {
                  const clave = doc.id || doc.codigo_rubro
                  const etiqueta =
                    tipoDocumento === 'cxc'
                      ? `${doc.rubro} - ${doc.nombre} (Def: ${formatearMoneda(doc.definitivo)})`
                      : `${doc.numero} - Valor: ${formatearMoneda(doc.valor)} (Rubro: ${doc.rubro_codigo})`
                  return (
                    <option key={clave} value={clave}>
                      {etiqueta}
                    </option>
                  )
                })}
              </select>
            </div>

            <div className="grupo-campo">
              <label className="etiqueta-campo">Valor ($)</label>
              <input
                type="number"
                min="1"
                required
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ej: 2500000"
                className="entrada-erp"
              />
            </div>

            {tipoDocumento === 'cxc' && (
              <div className="grupo-campo">
                <label className="etiqueta-campo">Concepto / Detalle del Ingreso</label>
                <textarea
                  rows="2"
                  required
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value)}
                  placeholder="Descripción del origen del recaudo..."
                  className="entrada-erp"
                />
              </div>
            )}

            <button type="submit" className="boton-indigo">
              Guardar y Aprobar
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default VistaDocumentosPresupuesto

