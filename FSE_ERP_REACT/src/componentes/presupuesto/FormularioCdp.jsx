import { useState } from 'react'
import { formatearMoneda } from '../../servicios/servicioApi'

/**
 * Componente: FormularioCdp
 * Responsabilidad única: Gestionar el formulario de creación de un Certificado
 * de Disponibilidad Presupuestal (CDP) multirrubro en estado Borrador.
 * Autor: Aprendiz ADSO
 */
function FormularioCdp({ rubrosGastos, alGuardarCdp, alCerrar }) {
  const fechaHoy = new Date().toISOString().slice(0, 10)
  const primerRubroId = rubrosGastos[0]?.codigo_rubro || ''

  // Estado local del formulario (estado lo más cerca posible de donde se usa)
  const [fechaElaboracion, setFechaElaboracion] = useState(fechaHoy)
  const [descripcion, setDescripcion] = useState('')
  const [filasRubros, setFilasRubros] = useState([
    { idFila: 'fila-inicial-1', codigo_rubro: primerRubroId, valor_total_rubro: '' },
  ])
  const [errorValidacion, setErrorValidacion] = useState('')

  // Agregar fila sin mutar el estado directamente (usando copia inmutable)
  const agregarFilaRubro = () => {
    const nuevaFila = {
      idFila: `fila-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      codigo_rubro: primerRubroId,
      valor_total_rubro: '',
    }
    setFilasRubros((previas) => [...previas, nuevaFila])
  }

  const eliminarFilaRubro = (idFila) => {
    if (filasRubros.length <= 1) return
    setFilasRubros((previas) => previas.filter((f) => f.idFila !== idFila))
  }

  const actualizarFilaRubro = (idFila, campo, valor) => {
    setFilasRubros((previas) =>
      previas.map((fila) => (fila.idFila === idFila ? { ...fila, [campo]: valor } : fila))
    )
  }

  const totalCdp = filasRubros.reduce(
    (suma, f) => suma + (Number(f.valor_total_rubro) || 0),
    0
  )

  const manejarSubmit = (evento) => {
    evento.preventDefault()
    setErrorValidacion('')

    // Validar saldo disponible en cada rubro antes de crear el CDP
    for (const fila of filasRubros) {
      const rubro = rubrosGastos.find((r) => Number(r.codigo_rubro) === Number(fila.codigo_rubro))
      const monto = Number(fila.valor_total_rubro) || 0

      if (!rubro || monto <= 0) {
        setErrorValidacion('Todos los rubros deben tener un valor mayor a $0.')
        return
      }

      if (monto > rubro.total_disponible) {
        setErrorValidacion(
          `El rubro "${rubro.nombre}" (${rubro.rubro}) no tiene suficiente saldo disponible (${formatearMoneda(
            rubro.total_disponible
          )}).`
        )
        return
      }
    }

    alGuardarCdp({
      fecha_elaboracion: fechaElaboracion,
      descripcion,
      items: filasRubros.map((f) => ({
        codigo_rubro: Number(f.codigo_rubro),
        valor_total_rubro: Number(f.valor_total_rubro),
      })),
    })

    setDescripcion('')
    setFilasRubros([{ idFila: `fila-${Date.now()}`, codigo_rubro: primerRubroId, valor_total_rubro: '' }])
  }

  return (
    <div className="panel-blanco">
      <div className="encabezado-seccion">
        <h3 className="titulo-seccion" style={{ fontSize: '1.05rem' }}>
          Elaborar Nuevo CDP
        </h3>
        <button type="button" onClick={alCerrar} className="boton-secundario">
          ✕ Cerrar
        </button>
      </div>

      {errorValidacion && <div className="alerta-error">{errorValidacion}</div>}

      <form onSubmit={manejarSubmit} className="formulario-erp">
        <div className="grupo-campo">
          <label htmlFor="cdp-fecha" className="etiqueta-campo">
            Fecha de Elaboración
          </label>
          <input
            id="cdp-fecha"
            type="date"
            required
            value={fechaElaboracion}
            onChange={(e) => setFechaElaboracion(e.target.value)}
            className="entrada-erp"
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="cdp-descripcion" className="etiqueta-campo">
            Objeto / Concepto
          </label>
          <textarea
            id="cdp-descripcion"
            rows="2"
            required
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción clara del objeto del gasto..."
            className="entrada-erp"
          />
        </div>

        <div className="grupo-campo">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="etiqueta-campo">Rubros Presupuestales y Valores</span>
            <button
              type="button"
              onClick={agregarFilaRubro}
              style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
            >
              + Agregar Rubro
            </button>
          </div>

          {/* Usamos fila.idFila como key única y estable, nunca el índice */}
          {filasRubros.map((fila) => (
            <div
              key={fila.idFila}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                padding: '0.6rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <select
                value={fila.codigo_rubro}
                onChange={(e) => actualizarFilaRubro(fila.idFila, 'codigo_rubro', e.target.value)}
                className="entrada-erp"
              >
                {rubrosGastos.map((r) => (
                  <option key={r.codigo_rubro} value={r.codigo_rubro}>
                    {r.rubro} - {r.nombre} (Disp: {formatearMoneda(r.total_disponible)})
                  </option>
                ))}
              </select>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Valor a comprometer ($)"
                  value={fila.valor_total_rubro}
                  onChange={(e) =>
                    actualizarFilaRubro(fila.idFila, 'valor_total_rubro', e.target.value)
                  }
                  className="entrada-erp"
                />
                {filasRubros.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarFilaRubro(fila.idFila)}
                    className="boton-peligro"
                    title="Quitar rubro"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '0.6rem',
            borderTop: '1px solid #e2e8f0',
            fontWeight: 800,
          }}
        >
          <span style={{ fontSize: '0.78rem', color: '#475569' }}>TOTAL CDP:</span>
          <span>{formatearMoneda(totalCdp)}</span>
        </div>

        <button type="submit" className="boton-indigo">
          Crear Borrador de CDP
        </button>
      </form>
    </div>
  )
}

export default FormularioCdp

