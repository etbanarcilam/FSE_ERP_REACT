// ============================================================================
// SERVICIO DE CONEXIÓN AL BACKEND LARAVEL Y UTILIDADES DE FORMATO
// Autor: Aprendiz ADSO (Análisis y Desarrollo de Software)
// Descripción: Consume los endpoints de routes/api.php en Laravel (/api/login,
// /api/logout y /api/erp/*) con respaldo local automático.
// ============================================================================

import { INSTITUCIONES_INICIALES, USUARIOS_INICIALES } from '../datos/datosInicialesErp'

/**
 * Formatea un número al estándar de moneda colombiana (COP).
 */
export function formatearMoneda(valor) {
  const numero = Number(valor) || 0
  return '$' + new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(numero)
}

/**
 * Autentica al usuario contra el endpoint POST /api/login de Laravel.
 */
export async function iniciarSesionApi(usuario, contrasena) {
  try {
    const respuesta = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ usuario, contrasena }),
    })

    if (respuesta.ok) {
      const datos = await respuesta.json()
      return {
        exito: true,
        origen: 'laravel',
        usuario: {
          codigo_usuario: datos.user.codigo_usuario,
          usuario: datos.user.usuario,
          nombre:
            `${datos.user.primer_nombre || ''} ${datos.user.primer_apellido || ''}`.trim() ||
            datos.user.usuario,
          cargo: 'ADMINISTRADOR',
        },
        token: datos.token,
        instituciones:
          Array.isArray(datos.institutions) && datos.institutions.length > 0
            ? datos.institutions
            : INSTITUCIONES_INICIALES,
      }
    }

    if (respuesta.status === 401) {
      return {
        exito: false,
        mensaje: 'Las credenciales proporcionadas no son correctas.',
      }
    }
  } catch {
    // Respaldo local cuando el servidor PHP no está encendido
  }

  const usuarioEncontrado = USUARIOS_INICIALES.find(
    (u) => u.usuario.toUpperCase() === usuario.trim().toUpperCase()
  )

  if (usuarioEncontrado && contrasena.trim().length >= 4) {
    return {
      exito: true,
      origen: 'local',
      usuario: {
        codigo_usuario: usuarioEncontrado.codigo_usuario,
        usuario: usuarioEncontrado.usuario,
        nombre: `${usuarioEncontrado.primer_nombre} ${usuarioEncontrado.primer_apellido}`,
        cargo: usuarioEncontrado.cargo,
      },
      token: 'token-sesion-fse-adso',
      instituciones: usuarioEncontrado.instituciones || INSTITUCIONES_INICIALES,
    }
  }

  return {
    exito: false,
    mensaje:
      'Las credenciales proporcionadas no son correctas. (Prueba con usuario: ADMIN y contraseña: admin123)',
  }
}

/**
 * Consulta el estado real de la institución activa en PostgreSQL vía Laravel API.
 */
export async function consultarEstadoErpApi(codigoInterno, token) {
  try {
    const cabeceras = { Accept: 'application/json' }
    if (token && token !== 'token-sesion-fse-adso') {
      cabeceras.Authorization = `Bearer ${token}`
    }

    const respuesta = await fetch(
      `/api/erp/estado?codigo_interno=${encodeURIComponent(codigoInterno)}`,
      { headers: cabeceras }
    )
    if (respuesta.ok) {
      return await respuesta.json()
    }
  } catch {
    // Continúa con los datos iniciales si no hay conexión al servidor PHP
  }
  return null
}

/**
 * Envía peticiones POST o DELETE al backend de Laravel en /api/erp/*.
 */
export async function enviarPeticionErpApi(ruta, metodo = 'POST', cuerpo = null, token = null) {
  try {
    const cabeceras = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    if (token && token !== 'token-sesion-fse-adso') {
      cabeceras.Authorization = `Bearer ${token}`
    }

    const opciones = { method: metodo, headers: cabeceras }
    if (cuerpo) opciones.body = JSON.stringify(cuerpo)

    const respuesta = await fetch(`/api/erp${ruta}`, opciones)
    if (respuesta.ok) {
      return await respuesta.json()
    }
  } catch {
    // Respaldo en memoria de React si el servidor PHP está apagado
  }
  return null
}

/**
 * Cierra la sesión en el backend de Laravel si hay token Sanctum activo.
 */
export async function cerrarSesionApi(token) {
  if (!token || token === 'token-sesion-fse-adso') return
  try {
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
  } catch {
    // Se ignora error de red al cerrar sesión
  }
}

/**
 * Genera y descarga un archivo CSV compatible con Excel (UTF-8 con BOM).
 */
export function descargarArchivoCsv(nombreArchivo, encabezados, filas) {
  const separador = ';'
  const contenidoCsv = [
    encabezados.join(separador),
    ...filas.map((fila) =>
      fila.map((celda) => `"${String(celda ?? '').replace(/"/g, '""')}"`).join(separador)
    ),
  ].join('\n')

  const blob = new Blob(['\uFEFF' + contenidoCsv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.setAttribute('download', nombreArchivo)
  document.body.appendChild(enlace)
  enlace.click()
  document.body.removeChild(enlace)
  URL.revokeObjectURL(url)
}
