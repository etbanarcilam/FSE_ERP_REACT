import { useState } from 'react'
import { formatearMoneda } from '../../servicios/servicioApi'

/**
 * Componente: VistaReportes
 * Responsabilidad única: Generar los reportes dinámicos de Ejecución y
 * Modificaciones Presupuestales tanto de Gastos (G) como de Ingresos (I).
 * Autor: Aprendiz ADSO
 */
function VistaReportes({ rubrosGastos, rubrosIngresos }) {
  const [tipoPresupuesto, setTipoPresupuesto] = useState('G')
  const [tipoReporte, setTipoReporte] = useState('ejecucion_modificaciones')
  const [ocultarSinMovimiento, setOcultarSinMovimiento] = useState(false)

  const listaBase = tipoPresupuesto === 'G' ? rubrosGastos : rubrosIngresos

  const datosFiltrados = ocultarSinMovimiento
    ? listaBase.filter((r) => Number(r.definitivo) > 0 || Number(r.presupuesto_inicial) > 0)
    : listaBase

  const mostrarModificaciones =
    tipoReporte === 'modificaciones' || tipoReporte === 'ejecucion_modificaciones'
  const mostrarEjecucion =
    tipoReporte === 'ejecucion' || tipoReporte === 'ejecucion_modificaciones'

  const sumarCampo = (campo) =>
    datosFiltrados.reduce((acc, item) => acc + (Number(item[campo]) || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Panel de Filtros del Reporte */}
      <div className="panel-blanco">
        <div className="encabezado-seccion">
          <h2 className="titulo-seccion">
            <span>📊</span>
            <span>Centro de Reportes Presupuestales</span>
          </h2>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setTipoPresupuesto('G')}
              className={tipoPresupuesto === 'G' ? 'boton-indigo' : 'boton-secundario'}
            >
              🔴 GASTOS / EGRESOS (Tipo G)
            </button>
            <button
              type="button"
              onClick={() => setTipoPresupuesto('I')}
              className={tipoPresupuesto === 'I' ? 'boton-exito' : 'boton-secundario'}
            >
              🟢 INGRESOS / RECAUDOS (Tipo I)
            </button>
          </div>
        </div>

        <div className="grilla-2-columnas" style={{ alignItems: 'end' }}>
          <div className="grupo-campo">
            <label className="etiqueta-campo">Seleccionar Reporte Presupuestal</label>
            <select
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
              className="entrada-erp"
            >
              <option value="ejecucion">1. Ejecución presupuestal (Por rubro)</option>
              <option value="modificaciones">2. Modificaciones presupuestales (Por rubro)</option>
              <option value="ejecucion_modificaciones">
                3. Ejecución y modificaciones presupuestales (Consolidado)
              </option>
            </select>
          </div>

          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '0.6rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={ocultarSinMovimiento}
              onChange={(e) => setOcultarSinMovimiento(e.target.checked)}
            />
            <span>Ocultar rubros sin movimiento ($0)</span>
          </label>
        </div>
      </div>

      {/* Tabla Dinámica de Resultados */}
      <div className="panel-blanco">
        <div className="encabezado-seccion">
          <div>
            <h3 className="titulo-seccion" style={{ fontSize: '1.05rem' }}>
              📋 Reporte Consolidado Presupuestal ({tipoPresupuesto === 'G' ? 'GASTOS' : 'INGRESOS'})
            </h3>
            <p className="subtitulo-seccion">Total Registros: {datosFiltrados.length}</p>
          </div>
        </div>

        <div className="contenedor-tabla">
          <table className="tabla-erp">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre del Rubro</th>
                <th className="texto-derecha">Pres. Inicial</th>
                {mostrarModificaciones && (
                  <>
                    <th className="texto-derecha">Adiciones (+)</th>
                    <th className="texto-derecha">Reducciones (-)</th>
                    <th className="texto-derecha">Traslados (+)</th>
                    <th className="texto-derecha">Traslados (-)</th>
                  </>
                )}
                <th className="texto-derecha">Pres. Definitivo</th>
                {mostrarEjecucion && tipoPresupuesto === 'G' && (
                  <>
                    <th className="texto-derecha">Disponibilidades (CDP)</th>
                    <th className="texto-derecha">Compromisos (CRP)</th>
                    <th className="texto-derecha">Pagos (OP)</th>
                    <th className="texto-derecha">Saldo Disponible</th>
                  </>
                )}
                {mostrarEjecucion && tipoPresupuesto === 'I' && (
                  <>
                    <th className="texto-derecha">Recaudos</th>
                    <th className="texto-derecha">Saldo CXC</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.map((fila) => (
                <tr key={fila.codigo_rubro}>
                  <td className="texto-codigo">{fila.rubro}</td>
                  <td style={{ fontWeight: 600 }}>{fila.nombre}</td>
                  <td className="texto-derecha">{formatearMoneda(fila.presupuesto_inicial)}</td>
                  {mostrarModificaciones && (
                    <>
                      <td className="texto-derecha" style={{ color: '#059669' }}>
                        {formatearMoneda(fila.adiciones)}
                      </td>
                      <td className="texto-derecha" style={{ color: '#e11d48' }}>
                        {formatearMoneda(fila.reducciones)}
                      </td>
                      <td className="texto-derecha" style={{ color: '#059669' }}>
                        {formatearMoneda(fila.traslados_aumento)}
                      </td>
                      <td className="texto-derecha" style={{ color: '#e11d48' }}>
                        {formatearMoneda(fila.traslado_disminucion)}
                      </td>
                    </>
                  )}
                  <td className="texto-derecha" style={{ fontWeight: 800 }}>
                    {formatearMoneda(fila.definitivo)}
                  </td>
                  {mostrarEjecucion && tipoPresupuesto === 'G' && (
                    <>
                      <td className="texto-derecha">{formatearMoneda(fila.disponibilidades)}</td>
                      <td className="texto-derecha">{formatearMoneda(fila.compromisos)}</td>
                      <td className="texto-derecha">{formatearMoneda(fila.egresos)}</td>
                      <td className="texto-derecha" style={{ fontWeight: 800, color: '#4f46e5' }}>
                        {formatearMoneda(fila.total_disponible)}
                      </td>
                    </>
                  )}
                  {mostrarEjecucion && tipoPresupuesto === 'I' && (
                    <>
                      <td className="texto-derecha" style={{ fontWeight: 700, color: '#059669' }}>
                        {formatearMoneda(fila.recaudos)}
                      </td>
                      <td className="texto-derecha" style={{ fontWeight: 700, color: '#d97706' }}>
                        {formatearMoneda(fila.saldo_cxc)}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="fila-totales">
                <td>TOTALES GENERALES</td>
                <td>Suma Consolidada</td>
                <td className="texto-derecha">{formatearMoneda(sumarCampo('presupuesto_inicial'))}</td>
                {mostrarModificaciones && (
                  <>
                    <td className="texto-derecha">{formatearMoneda(sumarCampo('adiciones'))}</td>
                    <td className="texto-derecha">{formatearMoneda(sumarCampo('reducciones'))}</td>
                    <td className="texto-derecha">
                      {formatearMoneda(sumarCampo('traslados_aumento'))}
                    </td>
                    <td className="texto-derecha">
                      {formatearMoneda(sumarCampo('traslado_disminucion'))}
                    </td>
                  </>
                )}
                <td className="texto-derecha">{formatearMoneda(sumarCampo('definitivo'))}</td>
                {mostrarEjecucion && tipoPresupuesto === 'G' && (
                  <>
                    <td className="texto-derecha">
                      {formatearMoneda(sumarCampo('disponibilidades'))}
                    </td>
                    <td className="texto-derecha">{formatearMoneda(sumarCampo('compromisos'))}</td>
                    <td className="texto-derecha">{formatearMoneda(sumarCampo('egresos'))}</td>
                    <td className="texto-derecha">
                      {formatearMoneda(sumarCampo('total_disponible'))}
                    </td>
                  </>
                )}
                {mostrarEjecucion && tipoPresupuesto === 'I' && (
                  <>
                    <td className="texto-derecha">{formatearMoneda(sumarCampo('recaudos'))}</td>
                    <td className="texto-derecha">{formatearMoneda(sumarCampo('saldo_cxc'))}</td>
                  </>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VistaReportes

