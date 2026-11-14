import { useState } from 'react'
import { formatearMoneda } from '../../servicios/servicioApi'

/**
 * Componente: DetalleCdp
 * Responsabilidad única: Mostrar el panel inferior con el detalle de rubros
 * de un CDP seleccionado y sus acciones (Aprobar, Anular o Liberar Saldo).
 * Autor: Aprendiz ADSO
 */
function DetalleCdp({
  cdp,
  alCerrar,
  alAprobarCdp,
  alAnularCdp,
  alLiberarSaldoCdp,
}) {
  const [mostrarLiberacion, setMostrarLiberacion] = useState(false)
  const [montoLiberar, setMontoLiberar] = useState('')
  const [motivoLiberacion, setMotivoLiberacion] = useState('')

  if (!cdp) return null

  const manejarLiberacion = (evento) => {
    evento.preventDefault()
    const valor = Number(montoLiberar) || 0
    if (valor <= 0 || valor > cdp.saldo_disponibilidad) return

    alLiberarSaldoCdp(cdp.codigo_disponibilidad, valor, motivoLiberacion)
    setMontoLiberar('')
    setMotivoLiberacion('')
    setMostrarLiberacion(false)
  }

  return (
    <div className="panel-gris-detalle">
      <div className="encabezado-seccion" style={{ marginBottom: '0.85rem' }}>
        <h3 className="titulo-seccion" style={{ fontSize: '0.95rem' }}>
          🔍 Detalle del Registro Seleccionado:{' '}
          <span style={{ color: '#4f46e5' }}>
            CDP-#{String(cdp.consecutivo).padStart(3, '0')}
          </span>
        </h3>
        <button type="button" onClick={alCerrar} className="boton-secundario">
          ✕ Cerrar
        </button>
      </div>

      <div className="grilla-2-columnas" style={{ marginBottom: '1rem', fontSize: '0.78rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <p>
            <strong>Descripción:</strong> {cdp.descripcion}
          </p>
          <p>
            <strong>Elaborado por:</strong> {cdp.elabora_nombre} ({cdp.fecha_elaboracion})
          </p>
          <p>
            <strong>Aprobado por:</strong> {cdp.aprueba_nombre || 'Pendiente'} (
            {cdp.fecha_aprobacion || 'Sin aprobar'})
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
          {cdp.estado === 'B' && (
            <>
              <button
                type="button"
                onClick={() => alAprobarCdp(cdp.codigo_disponibilidad)}
                className="boton-exito"
              >
                ✓ Aprobar CDP
              </button>
              <button
                type="button"
                onClick={() => alAnularCdp(cdp.codigo_disponibilidad)}
                className="boton-peligro"
              >
                ✕ Anular CDP
              </button>
            </>
          )}

          {cdp.estado === 'A' && cdp.saldo_disponibilidad > 0 && (
            <button
              type="button"
              onClick={() => setMostrarLiberacion((prev) => !prev)}
              className="boton-advertencia"
            >
              💸 Crear Liberación de Saldo
            </button>
          )}

          <button type="button" onClick={() => window.print()} className="boton-secundario">
            🖨️ Imprimir
          </button>
        </div>
      </div>

      {/* Formulario rápido para liberar/reintegrar saldo de un CDP aprobado */}
      {mostrarLiberacion && (
        <form
          onSubmit={manejarLiberacion}
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '0.5rem',
            padding: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.6rem',
            alignItems: 'flex-end',
          }}
        >
          <div className="grupo-campo" style={{ flex: 1, minWidth: '160px' }}>
            <label className="etiqueta-campo">Valor a Liberar (Máx: {formatearMoneda(cdp.saldo_disponibilidad)})</label>
            <input
              type="number"
              min="1"
              max={cdp.saldo_disponibilidad}
              required
              value={montoLiberar}
              onChange={(e) => setMontoLiberar(e.target.value)}
              className="entrada-erp"
            />
          </div>
          <div className="grupo-campo" style={{ flex: 2, minWidth: '200px' }}>
            <label className="etiqueta-campo">Motivo de Liberación</label>
            <input
              type="text"
              required
              value={motivoLiberacion}
              onChange={(e) => setMotivoLiberacion(e.target.value)}
              placeholder="Ej: Saldo sobrante en liquidación..."
              className="entrada-erp"
            />
          </div>
          <button type="submit" className="boton-indigo">
            Confirmar Reintegro
          </button>
        </form>
      )}

      {/* Tabla de rubros afectados por el CDP */}
      <div className="contenedor-tabla">
        <table className="tabla-erp">
          <thead>
            <tr>
              <th>Código Rubro</th>
              <th>Nombre</th>
              <th className="texto-derecha">Valor Inicial</th>
              <th className="texto-derecha">Compromisos (CRP)</th>
              <th className="texto-derecha">Reintegros</th>
              <th className="texto-derecha">Saldo Actual</th>
            </tr>
          </thead>
          <tbody>
            {cdp.detalles.map((det) => (
              <tr key={det.codigo_det_disponibilidad}>
                <td className="texto-codigo">{det.rubro_codigo}</td>
                <td>{det.rubro_nombre}</td>
                <td className="texto-derecha">{formatearMoneda(det.valor_total_rubro)}</td>
                <td className="texto-derecha">{formatearMoneda(det.total_crp)}</td>
                <td className="texto-derecha">{formatearMoneda(det.total_reintegro)}</td>
                <td className="texto-derecha" style={{ fontWeight: 800, color: '#4f46e5' }}>
                  {formatearMoneda(det.saldo_rubro)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DetalleCdp

