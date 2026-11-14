/**
 * Componente: BarraAcciones
 * Responsabilidad única: Mostrar la barra de herramientas de registro
 * (Nuevo, Eliminar, Guardar, Primero, Anterior, Siguiente, Último, Descargar e Imprimir).
 * Autor: Aprendiz ADSO
 */
function BarraAcciones({
  alNuevo,
  alEliminar,
  alGuardar,
  alPrimero,
  alAnterior,
  alSiguiente,
  alUltimo,
  alDescargar,
  alImprimir,
}) {
  return (
    <div className="contenedor-barra-acciones no-imprimir">
      <div className="barra-acciones">
        {/* Grupo 1: Acciones del Registro */}
        <div className="grupo-botones-barra">
          <button
            type="button"
            onClick={alNuevo}
            className="boton-icono-barra boton-icono-nuevo"
            title="Nuevo registro (Alt + N)"
          >
            <span className="etiqueta-new">NEW</span>
          </button>

          <button
            type="button"
            onClick={alEliminar}
            className="boton-icono-barra"
            title="Eliminar registro"
          >
            <span style={{ fontSize: '1rem' }}>🗑️</span>
          </button>

          <button
            type="button"
            onClick={alGuardar}
            className="boton-icono-barra"
            title="Guardar cambios (Alt + S)"
          >
            <span style={{ fontSize: '1rem' }}>💾</span>
          </button>
        </div>

        <div className="separador-barra" />

        {/* Grupo 2: Navegación entre filas de la tabla activa */}
        <div className="grupo-botones-barra">
          <button
            type="button"
            onClick={alPrimero}
            className="boton-icono-barra"
            title="Primer registro"
          >
            <span className="cuadro-azul-icono">|◀</span>
          </button>

          <button
            type="button"
            onClick={alAnterior}
            className="boton-icono-barra"
            title="Registro anterior"
          >
            <span className="cuadro-azul-icono">◀</span>
          </button>

          <button
            type="button"
            onClick={alSiguiente}
            className="boton-icono-barra"
            title="Registro siguiente"
          >
            <span className="cuadro-azul-icono">▶</span>
          </button>

          <button
            type="button"
            onClick={alUltimo}
            className="boton-icono-barra"
            title="Último registro"
          >
            <span className="cuadro-azul-icono">▶|</span>
          </button>
        </div>

        <div className="separador-barra" />

        {/* Grupo 3: Salidas, Descarga CSV e Impresión */}
        <div className="grupo-botones-barra">
          <button
            type="button"
            onClick={alDescargar}
            className="boton-icono-barra"
            title="Descargar reporte en CSV / Excel"
          >
            <span className="cuadro-azul-icono">⬇</span>
          </button>

          <button
            type="button"
            onClick={alImprimir}
            className="boton-icono-barra"
            title="Imprimir pantalla"
          >
            <span style={{ fontSize: '1rem' }}>🖨️</span>
          </button>
        </div>

        {/* Indicador de atajos de teclado */}
        <div className="atajos-barra">
          Atajos: <kbd className="tecla-atajo">Alt + N</kbd> Nuevo |{' '}
          <kbd className="tecla-atajo">Alt + S</kbd> Guardar
        </div>
      </div>
    </div>
  )
}

export default BarraAcciones

