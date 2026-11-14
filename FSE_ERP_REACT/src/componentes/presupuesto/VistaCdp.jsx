import { formatearMoneda } from '../../servicios/servicioApi'
import DetalleCdp from './DetalleCdp'
import FormularioCdp from './FormularioCdp'

/**
 * Componente: VistaCdp
 * Responsabilidad única: Mostrar el listado de Certificados de Disponibilidad
 * Presupuestal (CDP) y coordinar su selección con el detalle y el formulario.
 * Autor: Aprendiz ADSO
 */
function VistaCdp({
  cdps,
  rubrosGastos,
  mostrarFormulario,
  alAlternarFormulario,
  idSeleccionado,
  alSeleccionarId,
  alGuardarCdp,
  alAprobarCdp,
  alAnularCdp,
  alLiberarSaldoCdp,
}) {
  const cdpSeleccionado =
    cdps.find((c) => c.codigo_disponibilidad === idSeleccionado) || null

  const renderizarEstado = (estado) => {
    if (estado === 'A') return <span className="insignia insignia-aprobado">Aprobado</span>
    if (estado === 'B') return <span className="insignia insignia-borrador">Borrador</span>
    return <span className="insignia insignia-anulado">Anulado</span>
  }

  return (
    <div className={`grilla-modulo ${mostrarFormulario ? 'grilla-modulo-dividida' : ''}`}>
      {/* Columna principal: Tabla de CDPs */}
      <div className="panel-blanco">
        <div className="encabezado-seccion">
          <h2 className="titulo-seccion">
            <span>📄</span>
            <span>Certificados de Disponibilidad Presupuestal (CDP)</span>
          </h2>
          <span className="insignia insignia-contador">{cdps.length} Registros</span>
        </div>

        <div className="contenedor-tabla">
          <table className="tabla-erp">
            <thead>
              <tr>
                <th>Consecutivo</th>
                <th>Fecha</th>
                <th>Descripción</th>
                <th className="texto-derecha">Valor Total</th>
                <th className="texto-derecha">Saldo Disponible</th>
                <th className="texto-centro">Estado</th>
              </tr>
            </thead>
            <tbody>
              {/* Key única y estable: cdp.codigo_disponibilidad */}
              {cdps.map((cdp) => (
                <tr
                  key={cdp.codigo_disponibilidad}
                  onClick={() => alSeleccionarId(cdp.codigo_disponibilidad)}
                  className={
                    idSeleccionado === cdp.codigo_disponibilidad ? 'fila-seleccionada' : ''
                  }
                >
                  <td style={{ fontWeight: 800 }}>
                    CDP-#{String(cdp.consecutivo).padStart(3, '0')}
                  </td>
                  <td>{cdp.fecha_elaboracion}</td>
                  <td>{cdp.descripcion}</td>
                  <td className="texto-derecha" style={{ fontWeight: 800 }}>
                    {formatearMoneda(cdp.valor_total)}
                  </td>
                  <td className="texto-derecha" style={{ fontWeight: 800, color: '#4338ca' }}>
                    {formatearMoneda(cdp.saldo_disponibilidad)}
                  </td>
                  <td className="texto-centro">{renderizarEstado(cdp.estado)}</td>
                </tr>
              ))}

              {cdps.length === 0 && (
                <tr>
                  <td colSpan="6" className="texto-centro" style={{ padding: '2rem', color: '#94a3b8' }}>
                    No hay certificados CDP registrados para esta vigencia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Panel de Detalle Expandido al seleccionar una fila */}
        <DetalleCdp
          cdp={cdpSeleccionado}
          alCerrar={() => alSeleccionarId(null)}
          alAprobarCdp={alAprobarCdp}
          alAnularCdp={alAnularCdp}
          alLiberarSaldoCdp={alLiberarSaldoCdp}
        />
      </div>

      {/* Columna lateral: Formulario de nuevo CDP */}
      {mostrarFormulario && (
        <FormularioCdp
          rubrosGastos={rubrosGastos}
          alGuardarCdp={alGuardarCdp}
          alCerrar={alAlternarFormulario}
        />
      )}
    </div>
  )
}

export default VistaCdp

