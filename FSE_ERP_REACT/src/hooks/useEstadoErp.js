import { useState } from 'react'
import {
  CDPS_INICIALES,
  CRPS_INICIALES,
  CXCS_INICIALES,
  CXPS_INICIALES,
  INSTITUCIONES_INICIALES,
  OPS_INICIALES,
  RUBROS_GASTOS_INICIALES,
  RUBROS_INGRESOS_INICIALES,
  TERCEROS_INICIALES,
  USUARIOS_INICIALES,
} from '../datos/datosInicialesErp'
import { consultarEstadoErpApi, enviarPeticionErpApi } from '../servicios/servicioApi'

/**
 * Custom Hook: useEstadoErp
 * Responsabilidad única: Centralizar la lógica de negocio del sistema FSE_ERP
 * sincronizando con los endpoints JSON de Laravel (/api/erp/*) y manteniendo
 * actualizaciones de estado inmutables en React.
 * Autor: Aprendiz ADSO
 */
export function useEstadoErp() {
  const [rubrosGastos, setRubrosGastos] = useState(RUBROS_GASTOS_INICIALES)
  const [rubrosIngresos, setRubrosIngresos] = useState(RUBROS_INGRESOS_INICIALES)
  const [cdps, setCdps] = useState(CDPS_INICIALES)
  const [crps, setCrps] = useState(CRPS_INICIALES)
  const [cxps, setCxps] = useState(CXPS_INICIALES)
  const [ops, setOps] = useState(OPS_INICIALES)
  const [cxcs, setCxcs] = useState(CXCS_INICIALES)
  const [terceros, setTerceros] = useState(TERCEROS_INICIALES)
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIALES)
  const [institucionesDisponibles, setInstitucionesDisponibles] = useState(INSTITUCIONES_INICIALES)

  const [modulosHabilitados, setModulosHabilitados] = useState({
    Presupuesto: true,
    Tesorería: true,
    Contabilidad: true,
    Administrador: true,
  })

  const [opcionesSistema, setOpcionesSistema] = useState({
    nombreInstitucion: 'Institución Educativa Departamental FSE Colombia',
    anioFiscal: '2026',
    moneda: 'COP ($)',
    limiteGasto: '10000000',
  })

  // Sincroniza los datos desde PostgreSQL/Laravel al seleccionar una institución
  const cargarDatosInstitucion = async (codigoInterno, token) => {
    const datosRemotos = await consultarEstadoErpApi(codigoInterno, token)
    if (!datosRemotos) return

    if (Array.isArray(datosRemotos.rubrosGastos) && datosRemotos.rubrosGastos.length > 0) {
      setRubrosGastos(datosRemotos.rubrosGastos)
    }
    if (Array.isArray(datosRemotos.rubrosIngresos) && datosRemotos.rubrosIngresos.length > 0) {
      setRubrosIngresos(datosRemotos.rubrosIngresos)
    }
    if (Array.isArray(datosRemotos.cdps) && datosRemotos.cdps.length > 0) {
      setCdps(datosRemotos.cdps)
    }
    if (Array.isArray(datosRemotos.crps) && datosRemotos.crps.length > 0) {
      setCrps(datosRemotos.crps)
    }
    if (Array.isArray(datosRemotos.terceros) && datosRemotos.terceros.length > 0) {
      setTerceros(datosRemotos.terceros)
    }
    if (Array.isArray(datosRemotos.usuarios) && datosRemotos.usuarios.length > 0) {
      setUsuarios(datosRemotos.usuarios)
    }
  }

  // 1. Crear CDP en estado Borrador ('B') y sincronizar con Laravel
  const guardarCdp = (nuevoCdpDatos, nombreUsuario, codigoInterno = '9999999999', token = null) => {
    enviarPeticionErpApi('/cdp', 'POST', { ...nuevoCdpDatos, codigo_interno: codigoInterno }, token)

    const siguienteConsecutivo =
      cdps.reduce((max, c) => Math.max(max, c.consecutivo), 0) + 1
    const total = nuevoCdpDatos.items.reduce((s, i) => s + i.valor_total_rubro, 0)

    const detallesNuevos = nuevoCdpDatos.items.map((item, idx) => {
      const rubroObj = rubrosGastos.find((r) => r.codigo_rubro === item.codigo_rubro)
      return {
        codigo_det_disponibilidad: Date.now() + idx,
        codigo_rubro: item.codigo_rubro,
        rubro_codigo: rubroObj?.rubro || '2.1.1',
        rubro_nombre: rubroObj?.nombre || 'RUBRO',
        valor_total_rubro: item.valor_total_rubro,
        total_crp: 0,
        total_reintegro: 0,
        saldo_rubro: item.valor_total_rubro,
      }
    })

    const nuevoCdp = {
      codigo_disponibilidad: Date.now(),
      consecutivo: siguienteConsecutivo,
      fecha_elaboracion: nuevoCdpDatos.fecha_elaboracion,
      fecha_aprobacion: null,
      estado: 'B',
      descripcion: nuevoCdpDatos.descripcion,
      valor_total: total,
      saldo_disponibilidad: total,
      elabora_nombre: nombreUsuario || 'USUARIO FSE',
      aprueba_nombre: null,
      detalles: detallesNuevos,
      cancelaciones: [],
    }

    setCdps((prev) => [nuevoCdp, ...prev])
    return `CDP #${siguienteConsecutivo} guardado en estado BORRADOR con éxito.`
  }

  // 2. Aprobar CDP y afectar disponibilidades en los rubros de gasto
  const aprobarCdp = (idCdp, nombreUsuario, token = null) => {
    const cdpObjetivo = cdps.find((c) => c.codigo_disponibilidad === idCdp)
    if (!cdpObjetivo || cdpObjetivo.estado !== 'B') return null

    enviarPeticionErpApi(`/cdp/${idCdp}/aprobar`, 'POST', {}, token)

    setCdps((prev) =>
      prev.map((c) =>
        c.codigo_disponibilidad === idCdp
          ? {
              ...c,
              estado: 'A',
              aprueba_nombre: nombreUsuario || 'RECTOR / ADMIN',
              fecha_aprobacion: new Date().toLocaleString('es-CO'),
            }
          : c
      )
    )

    setRubrosGastos((prev) =>
      prev.map((rubro) => {
        const detalle = cdpObjetivo.detalles.find((d) => d.codigo_rubro === rubro.codigo_rubro)
        if (!detalle) return rubro
        const nuevasDisp = rubro.disponibilidades + detalle.valor_total_rubro
        return {
          ...rubro,
          disponibilidades: nuevasDisp,
          total_disponible: rubro.definitivo - nuevasDisp,
        }
      })
    )

    return `CDP #${cdpObjetivo.consecutivo} APROBADO exitosamente.`
  }

  // 3. Anular CDP en estado Borrador
  const anularCdp = (idCdp, token = null) => {
    enviarPeticionErpApi(`/cdp/${idCdp}/anular`, 'POST', {}, token)
    setCdps((prev) =>
      prev.map((c) => (c.codigo_disponibilidad === idCdp ? { ...c, estado: 'X' } : c))
    )
    return 'Certificado CDP anulado correctamente.'
  }

  // 4. Liberar saldo de un CDP aprobado y reintegrar al presupuesto
  const liberarSaldoCdp = (idCdp, valorLiberar) => {
    const cdpObjetivo = cdps.find((c) => c.codigo_disponibilidad === idCdp)
    if (!cdpObjetivo) return null

    setCdps((prev) =>
      prev.map((c) => {
        if (c.codigo_disponibilidad !== idCdp) return c
        return {
          ...c,
          saldo_disponibilidad: Math.max(0, c.saldo_disponibilidad - valorLiberar),
          detalles: c.detalles.map((d, i) =>
            i === 0
              ? {
                  ...d,
                  total_reintegro: d.total_reintegro + valorLiberar,
                  saldo_rubro: Math.max(0, d.saldo_rubro - valorLiberar),
                }
              : d
          ),
        }
      })
    )

    const codigoRubroPrimero = cdpObjetivo.detalles[0]?.codigo_rubro
    if (codigoRubroPrimero) {
      setRubrosGastos((prev) =>
        prev.map((r) => {
          if (r.codigo_rubro !== codigoRubroPrimero) return r
          const nuevasDisp = Math.max(0, r.disponibilidades - valorLiberar)
          return {
            ...r,
            disponibilidades: nuevasDisp,
            total_disponible: r.definitivo - nuevasDisp,
          }
        })
      )
    }

    return 'Liberación de saldo aplicada y reintegrada al presupuesto disponible.'
  }

  // 5. Registrar nuevo CRP descontando del CDP
  const guardarCrp = (datosCrp) => {
    const nuevoCrp = {
      id: Date.now(),
      ...datosCrp,
      saldo: datosCrp.valor,
    }

    setCrps((prev) => [nuevoCrp, ...prev])

    setCdps((prev) =>
      prev.map((c) =>
        c.codigo_disponibilidad === datosCrp.codigo_disponibilidad
          ? {
              ...c,
              saldo_disponibilidad: Math.max(0, c.saldo_disponibilidad - datosCrp.valor),
            }
          : c
      )
    )

    return `Compromiso ${datosCrp.numero} registrado exitosamente.`
  }

  // 6. Registrar CXP, OP o CXC
  const guardarDocumento = (tipo, datosDoc) => {
    if (tipo === 'cxp') {
      const nuevaCxp = {
        id: Date.now(),
        numero: datosDoc.numero,
        fecha: datosDoc.fecha,
        crp_id: datosDoc.origen.id,
        crp_numero: datosDoc.origen.numero,
        rubro_codigo: datosDoc.origen.rubro_codigo,
        valor: datosDoc.valor,
      }
      setCxps((prev) => [...prev, nuevaCxp])
      return `Cuenta por Pagar ${datosDoc.numero} registrada con éxito.`
    }

    if (tipo === 'op') {
      const nuevaOp = {
        id: Date.now(),
        numero: datosDoc.numero,
        fecha: datosDoc.fecha,
        cxp_id: datosDoc.origen.id,
        cxp_numero: datosDoc.origen.numero,
        rubro_codigo: datosDoc.origen.rubro_codigo,
        valor: datosDoc.valor,
      }
      setOps((prev) => [...prev, nuevaOp])
      return `Orden de Pago ${datosDoc.numero} girada con éxito.`
    }

    const nuevaCxc = {
      id: Date.now(),
      numero: datosDoc.numero,
      fecha: datosDoc.fecha,
      rubro_id: datosDoc.origen.codigo_rubro,
      rubro_codigo: datosDoc.origen.rubro,
      rubro_nombre: datosDoc.origen.nombre,
      concepto: datosDoc.concepto,
      valor: datosDoc.valor,
    }
    setCxcs((prev) => [...prev, nuevaCxc])
    return `Recaudo ${datosDoc.numero} registrado exitosamente.`
  }

  // 7. Modificaciones y Traslados de Rubros
  const aplicarModificacionRubro = ({ tipoPresupuesto, codigoRubro, tipoOperacion, valor }) => {
    const actualizador = (lista) =>
      lista.map((r) => {
        if (r.codigo_rubro !== codigoRubro) return r
        const adiciones = tipoOperacion === 'adicion' ? r.adiciones + valor : r.adiciones
        const reducciones = tipoOperacion === 'reduccion' ? r.reducciones + valor : r.reducciones
        const definitivo =
          r.presupuesto_inicial +
          adiciones -
          reducciones +
          r.traslados_aumento -
          r.traslado_disminucion
        return {
          ...r,
          adiciones,
          reducciones,
          definitivo,
          total_disponible: definitivo - (r.disponibilidades || 0),
        }
      })

    if (tipoPresupuesto === 'G') setRubrosGastos(actualizador)
    else setRubrosIngresos(actualizador)
    return 'Modificación presupuestal aprobada y aplicada al rubro.'
  }

  const aplicarTrasladoRubros = ({ tipoPresupuesto, codigoOrigen, codigoDestino, valor }) => {
    const actualizador = (lista) =>
      lista.map((r) => {
        if (r.codigo_rubro === codigoOrigen) {
          const disminucion = r.traslado_disminucion + valor
          const definitivo = r.definitivo - valor
          return {
            ...r,
            traslado_disminucion: disminucion,
            definitivo,
            total_disponible: definitivo - (r.disponibilidades || 0),
          }
        }
        if (r.codigo_rubro === codigoDestino) {
          const aumento = r.traslados_aumento + valor
          const definitivo = r.definitivo + valor
          return {
            ...r,
            traslados_aumento: aumento,
            definitivo,
            total_disponible: definitivo - (r.disponibilidades || 0),
          }
        }
        return r
      })

    if (tipoPresupuesto === 'G') setRubrosGastos(actualizador)
    else setRubrosIngresos(actualizador)
    return 'Traslado presupuestal aplicado correctamente.'
  }

  // 8. Crear o actualizar Tercero (sincronizado con PostgreSQL vía Laravel API)
  const guardarTercero = (datosTercero, codigoInterno = '9999999999', token = null) => {
    enviarPeticionErpApi(
      '/terceros',
      'POST',
      { ...datosTercero, codigo_interno: codigoInterno },
      token
    )

    if (datosTercero.codigo_tercero) {
      setTerceros((prev) =>
        prev.map((t) =>
          t.codigo_tercero === datosTercero.codigo_tercero ? { ...t, ...datosTercero } : t
        )
      )
      return `Tercero ${datosTercero.nombre} actualizado exitosamente.`
    }
    const nuevo = { ...datosTercero, codigo_tercero: Date.now() }
    setTerceros((prev) => [...prev, nuevo])
    return `Tercero ${datosTercero.nombre} creado exitosamente.`
  }

  const eliminarTercero = (idTercero, token = null) => {
    enviarPeticionErpApi(`/terceros/${idTercero}`, 'DELETE', null, token)
    setTerceros((prev) => prev.filter((t) => t.codigo_tercero !== idTercero))
    return 'Tercero eliminado del catálogo institucional.'
  }

  // 9. Usuarios
  const crearUsuario = (datosUsuario) => {
    const nuevo = { ...datosUsuario, codigo_usuario: Date.now() }
    setUsuarios((prev) => [...prev, nuevo])
    return `Usuario ${datosUsuario.usuario} creado y asociado a las instituciones.`
  }

  const eliminarUsuario = (idUsuario) => {
    setUsuarios((prev) => prev.filter((u) => u.codigo_usuario !== idUsuario))
    return 'Usuario eliminado exitosamente.'
  }

  return {
    rubrosGastos,
    rubrosIngresos,
    cdps,
    crps,
    cxps,
    ops,
    cxcs,
    terceros,
    usuarios,
    institucionesDisponibles,
    setInstitucionesDisponibles,
    modulosHabilitados,
    setModulosHabilitados,
    opcionesSistema,
    setOpcionesSistema,
    cargarDatosInstitucion,
    guardarCdp,
    aprobarCdp,
    anularCdp,
    liberarSaldoCdp,
    guardarCrp,
    guardarDocumento,
    aplicarModificacionRubro,
    aplicarTrasladoRubros,
    guardarTercero,
    eliminarTercero,
    crearUsuario,
    eliminarUsuario,
  }
}
