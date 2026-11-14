import { useEffect, useState } from 'react'
import './App.css'
import VistaAdminResumen from './componentes/administrador/VistaAdminResumen'
import VistaModulosOpciones from './componentes/administrador/VistaModulosOpciones'
import VistaRubrosEstructura from './componentes/administrador/VistaRubrosEstructura'
import VistaUsuarios from './componentes/administrador/VistaUsuarios'
import VistaLogin from './componentes/autenticacion/VistaLogin'
import VistaSeleccionInstitucion from './componentes/autenticacion/VistaSeleccionInstitucion'
import VistaContabilidad from './componentes/contabilidad/VistaContabilidad'
import VistaTerceros from './componentes/contabilidad/VistaTerceros'
import BarraAcciones from './componentes/layout/BarraAcciones'
import EncabezadoSuperior from './componentes/layout/EncabezadoSuperior'
import MenuSecundario from './componentes/layout/MenuSecundario'
import PiePagina from './componentes/layout/PiePagina'
import VistaCdp from './componentes/presupuesto/VistaCdp'
import VistaCrp from './componentes/presupuesto/VistaCrp'
import VistaDashboard from './componentes/presupuesto/VistaDashboard'
import VistaDocumentosPresupuesto from './componentes/presupuesto/VistaDocumentosPresupuesto'
import VistaMovRubros from './componentes/presupuesto/VistaMovRubros'
import VistaReportes from './componentes/presupuesto/VistaReportes'
import VistaTesoreria from './componentes/tesoreria/VistaTesoreria'
import { useEstadoErp } from './hooks/useEstadoErp'
import { cerrarSesionApi, descargarArchivoCsv } from './servicios/servicioApi'

/**
 * Componente Raíz: App
 * Responsabilidad única: Orquestar el flujo de pantallas (Login -> Selección de
 * Institución -> Módulos del ERP) y la barra de herramientas global.
 * Autor: Aprendiz ADSO
 */
function App() {
  const erp = useEstadoErp()

  // Estado de sesión e institución activa
  const [etapaSesion, setEtapaSesion] = useState('login') // 'login' | 'institucion' | 'erp'
  const [usuarioActivo, setUsuarioActivo] = useState(null)
  const [tokenSesion, setTokenSesion] = useState(null)
  const [institucionActiva, setInstitucionActiva] = useState(null)

  // Estado de navegación por módulos y subvistas
  const [moduloActivo, setModuloActivo] = useState('Presupuesto')
  const [subvistaActiva, setSubvistaActiva] = useState('dashboard')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [idFilaSeleccionada, setIdFilaSeleccionada] = useState(null)
  const [mensajeExito, setMensajeExito] = useState('')

  const notificar = (texto) => {
    if (!texto) return
    setMensajeExito(texto)
  }

  // Cambio de módulo ajustando su subvista inicial por defecto
  const cambiarModulo = (nuevoModulo) => {
    setModuloActivo(nuevoModulo)
    setIdFilaSeleccionada(null)
    setMostrarFormulario(false)

    const subvistaPorDefecto = {
      Presupuesto: 'dashboard',
      Tesorería: 'resumen_caja',
      Contabilidad: 'libro_diario',
      Administrador: 'resumen_admin',
    }
    setSubvistaActiva(subvistaPorDefecto[nuevoModulo] || 'dashboard')
  }

  // Obtiene la lista de IDs de la tabla actualmente visible para los botones Primero/Anterior/Siguiente/Último
  const obtenerIdsTablaActiva = () => {
    if (moduloActivo === 'Presupuesto') {
      if (subvistaActiva === 'cdp') return erp.cdps.map((c) => c.codigo_disponibilidad)
      if (subvistaActiva === 'crp') return erp.crps.map((c) => c.id)
      if (subvistaActiva === 'cxp') return erp.cxps.map((c) => c.id)
      if (subvistaActiva === 'op') return erp.ops.map((c) => c.id)
      if (subvistaActiva === 'cxc') return erp.cxcs.map((c) => c.id)
    }
    if (moduloActivo === 'Contabilidad' && subvistaActiva === 'terceros') {
      return erp.terceros.map((t) => t.codigo_tercero)
    }
    return []
  }

  const navegarFila = (direccion) => {
    const ids = obtenerIdsTablaActiva()
    if (ids.length === 0) return
    const indiceActual = ids.indexOf(idFilaSeleccionada)

    if (direccion === 'primero') setIdFilaSeleccionada(ids[0])
    if (direccion === 'ultimo') setIdFilaSeleccionada(ids[ids.length - 1])
    if (direccion === 'anterior') {
      const nuevo = indiceActual <= 0 ? ids.length - 1 : indiceActual - 1
      setIdFilaSeleccionada(ids[nuevo])
    }
    if (direccion === 'siguiente') {
      const nuevo = indiceActual >= ids.length - 1 ? 0 : indiceActual + 1
      setIdFilaSeleccionada(ids[nuevo])
    }
  }

  // Atajos de teclado globales (Alt + N para Nuevo y Alt + S para Guardar)
  useEffect(() => {
    const manejarTeclado = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        setMostrarFormulario((prev) => !prev)
      }
    }
    window.addEventListener('keydown', manejarTeclado)
    return () => window.removeEventListener('keydown', manejarTeclado)
  }, [])

  // 1. Pantalla de Login
  if (etapaSesion === 'login') {
    return (
      <VistaLogin
        alAutenticar={(resultado) => {
          setUsuarioActivo(resultado.usuario)
          setTokenSesion(resultado.token)
          erp.setInstitucionesDisponibles(resultado.instituciones)
          setEtapaSesion('institucion')
        }}
      />
    )
  }

  // 2. Pantalla de Selección de Institución Educativa
  if (etapaSesion === 'institucion') {
    return (
      <VistaSeleccionInstitucion
        usuarioActivo={usuarioActivo}
        instituciones={erp.institucionesDisponibles}
        alSeleccionarInstitucion={(inst) => {
          setInstitucionActiva(inst)
          erp.cargarDatosInstitucion(inst.codigo_interno, tokenSesion)
          setEtapaSesion('erp')
        }}
        alCerrarSesion={() => {
          cerrarSesionApi(tokenSesion)
          setEtapaSesion('login')
        }}
      />
    )
  }

  // 3. Pantalla Principal del ERP
  return (
    <div className="contenedor-app">
      <EncabezadoSuperior
        moduloActivo={moduloActivo}
        modulosHabilitados={erp.modulosHabilitados}
        alCambiarModulo={cambiarModulo}
        institucionActiva={institucionActiva}
        opcionesSistema={erp.opcionesSistema}
        usuarioActivo={usuarioActivo}
        alCambiarInstitucion={() => setEtapaSesion('institucion')}
        alCerrarSesion={() => {
          cerrarSesionApi(tokenSesion)
          setEtapaSesion('login')
        }}
      />

      <MenuSecundario
        moduloActivo={moduloActivo}
        subvistaActiva={subvistaActiva}
        alCambiarSubvista={(nuevaSubvista) => {
          setSubvistaActiva(nuevaSubvista)
          setIdFilaSeleccionada(null)
          setMensajeExito('')
        }}
      />

      <BarraAcciones
        alNuevo={() => {
          setIdFilaSeleccionada(null)
          setMostrarFormulario((prev) => !prev)
        }}
        alEliminar={() => {
          if (moduloActivo === 'Contabilidad' && subvistaActiva === 'terceros' && idFilaSeleccionada) {
            notificar(erp.eliminarTercero(idFilaSeleccionada, tokenSesion))
            setIdFilaSeleccionada(null)
          } else {
            window.alert(
              'La eliminación directa de registros presupuestales no está permitida por políticas de auditoría FSE Colombia. Utilice anulaciones o liberaciones autorizadas.'
            )
          }
        }}
        alGuardar={() => {
          const botonSubmit = document.querySelector('main form button[type="submit"]')
          if (botonSubmit) botonSubmit.click()
        }}
        alPrimero={() => navegarFila('primero')}
        alAnterior={() => navegarFila('anterior')}
        alSiguiente={() => navegarFila('siguiente')}
        alUltimo={() => navegarFila('ultimo')}
        alDescargar={() => {
          descargarArchivoCsv(
            `reporte_${subvistaActiva}_2026.csv`,
            ['Modulo', 'Vista', 'Institucion', 'Vigencia'],
            [[moduloActivo, subvistaActiva, institucionActiva?.nombre_institucion, erp.opcionesSistema.anioFiscal]]
          )
        }}
        alImprimir={() => window.print()}
      />

      <main className="contenido-principal">
        {mensajeExito && (
          <div className="alerta-exito no-imprimir">
            <span>✓ {mensajeExito}</span>
            <button type="button" onClick={() => setMensajeExito('')} className="boton-secundario">
              ✕
            </button>
          </div>
        )}

        {/* VISTAS DEL MÓDULO DE PRESUPUESTO */}
        {moduloActivo === 'Presupuesto' && subvistaActiva === 'dashboard' && (
          <VistaDashboard
            rubrosGastos={erp.rubrosGastos}
            cdps={erp.cdps}
            crps={erp.crps}
            ops={erp.ops}
            cxcs={erp.cxcs}
            anioFiscal={erp.opcionesSistema.anioFiscal}
          />
        )}

        {moduloActivo === 'Presupuesto' && subvistaActiva === 'cdp' && (
          <VistaCdp
            cdps={erp.cdps}
            rubrosGastos={erp.rubrosGastos}
            mostrarFormulario={mostrarFormulario}
            alAlternarFormulario={() => setMostrarFormulario((p) => !p)}
            idSeleccionado={idFilaSeleccionada}
            alSeleccionarId={setIdFilaSeleccionada}
            alGuardarCdp={(datos) =>
              notificar(
                erp.guardarCdp(
                  datos,
                  usuarioActivo?.nombre,
                  institucionActiva?.codigo_interno,
                  tokenSesion
                )
              )
            }
            alAprobarCdp={(id) =>
              notificar(erp.aprobarCdp(id, usuarioActivo?.nombre, tokenSesion))
            }
            alAnularCdp={(id) => notificar(erp.anularCdp(id, tokenSesion))}
            alLiberarSaldoCdp={(id, val) => notificar(erp.liberarSaldoCdp(id, val))}
          />
        )}

        {moduloActivo === 'Presupuesto' && subvistaActiva === 'crp' && (
          <VistaCrp
            crps={erp.crps}
            cdps={erp.cdps}
            terceros={erp.terceros}
            mostrarFormulario={mostrarFormulario}
            alAlternarFormulario={() => setMostrarFormulario((p) => !p)}
            idSeleccionado={idFilaSeleccionada}
            alSeleccionarId={setIdFilaSeleccionada}
            alGuardarCrp={(datos) => notificar(erp.guardarCrp(datos))}
          />
        )}

        {moduloActivo === 'Presupuesto' && ['cxp', 'op', 'cxc'].includes(subvistaActiva) && (
          <VistaDocumentosPresupuesto
            key={subvistaActiva}
            tipoDocumento={subvistaActiva}
            registros={
              subvistaActiva === 'cxp' ? erp.cxps : subvistaActiva === 'op' ? erp.ops : erp.cxcs
            }
            documentosOrigen={
              subvistaActiva === 'cxp'
                ? erp.crps
                : subvistaActiva === 'op'
                ? erp.cxps
                : erp.rubrosIngresos
            }
            mostrarFormulario={mostrarFormulario}
            alAlternarFormulario={() => setMostrarFormulario((p) => !p)}
            idSeleccionado={idFilaSeleccionada}
            alSeleccionarId={setIdFilaSeleccionada}
            alGuardarDocumento={(tipo, datos) => notificar(erp.guardarDocumento(tipo, datos))}
          />
        )}

        {moduloActivo === 'Presupuesto' && subvistaActiva === 'reportes' && (
          <VistaReportes rubrosGastos={erp.rubrosGastos} rubrosIngresos={erp.rubrosIngresos} />
        )}

        {moduloActivo === 'Presupuesto' && subvistaActiva === 'mov_rubros' && (
          <VistaMovRubros
            rubrosGastos={erp.rubrosGastos}
            rubrosIngresos={erp.rubrosIngresos}
            alAplicarModificacionRubro={(datos) => notificar(erp.aplicarModificacionRubro(datos))}
            alAplicarTrasladoRubros={(datos) => notificar(erp.aplicarTrasladoRubros(datos))}
          />
        )}

        {/* VISTAS DEL MÓDULO DE TESORERÍA */}
        {moduloActivo === 'Tesorería' && <VistaTesoreria />}

        {/* VISTAS DEL MÓDULO DE CONTABILIDAD */}
        {moduloActivo === 'Contabilidad' && subvistaActiva !== 'terceros' && (
          <VistaContabilidad alIrATerceros={() => setSubvistaActiva('terceros')} />
        )}

        {moduloActivo === 'Contabilidad' && subvistaActiva === 'terceros' && (
          <VistaTerceros
            terceros={erp.terceros}
            idSeleccionado={idFilaSeleccionada}
            alSeleccionarId={setIdFilaSeleccionada}
            alGuardarTercero={(datos) => notificar(erp.guardarTercero(datos, tokenSesion))}
          />
        )}

        {/* VISTAS DEL MÓDULO ADMINISTRADOR */}
        {moduloActivo === 'Administrador' && subvistaActiva === 'resumen_admin' && (
          <VistaAdminResumen
            totalUsuarios={erp.usuarios.length}
            modulosHabilitados={erp.modulosHabilitados}
            opcionesSistema={erp.opcionesSistema}
            alNavegarSubvista={setSubvistaActiva}
          />
        )}

        {moduloActivo === 'Administrador' && subvistaActiva === 'usuarios' && (
          <VistaUsuarios
            usuarios={erp.usuarios}
            usuarioActivo={usuarioActivo}
            alCrearUsuario={(datos) => notificar(erp.crearUsuario(datos))}
            alEliminarUsuario={(id) => notificar(erp.eliminarUsuario(id))}
          />
        )}

        {moduloActivo === 'Administrador' &&
          (subvistaActiva === 'rubros_gastos' || subvistaActiva === 'rubros_ingresos') && (
            <VistaRubrosEstructura
              key={subvistaActiva}
              tipoRubro={subvistaActiva === 'rubros_gastos' ? 'G' : 'I'}
            />
          )}

        {moduloActivo === 'Administrador' &&
          (subvistaActiva === 'modulos' || subvistaActiva === 'opciones') && (
            <VistaModulosOpciones
              key={subvistaActiva}
              modo={subvistaActiva}
              modulosHabilitados={erp.modulosHabilitados}
              alGuardarModulos={(nuevos) => {
                erp.setModulosHabilitados(nuevos)
                notificar('Configuración de módulos guardada con éxito.')
              }}
              opcionesSistema={erp.opcionesSistema}
              alGuardarOpciones={(nuevas) => {
                erp.setOpcionesSistema(nuevas)
                notificar('Configuración general guardada con éxito.')
              }}
            />
          )}
      </main>

      <PiePagina />
    </div>
  )
}

export default App
