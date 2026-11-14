/**
 * Componente: PiePagina
 * Responsabilidad única: Mostrar el pie de página institucional del sistema FSE_ERP.
 * Autor: Aprendiz ADSO
 */
function PiePagina() {
  return (
    <footer className="pie-pagina no-imprimir">
      <div className="barra-interna">
        <span>FSE_ERP Colombia - Todos los derechos reservados &copy; 2026</span>
        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
          Desarrollado en React para la gestión eficiente de Fondos de Servicios Educativos
        </span>
      </div>
    </footer>
  )
}

export default PiePagina

