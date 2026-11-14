import { useState } from 'react'
import { iniciarSesionApi } from '../../servicios/servicioApi'

/**
 * Componente: VistaLogin
 * Responsabilidad única: Gestionar el inicio de sesión del usuario y la
 * alternancia entre los paneles Ingresar, Registrarse y Recuperar.
 * Autor: Aprendiz ADSO
 */
function VistaLogin({ alAutenticar }) {
  // Estado cercano al formulario de acceso siguiendo las buenas prácticas de React
  const [panelActivo, setPanelActivo] = useState('login')
  const [usuario, setUsuario] = useState('ADMIN')
  const [contrasena, setContrasena] = useState('')
  const [recordarme, setRecordarme] = useState(false)
  const [errorAcceso, setErrorAcceso] = useState('')
  const [cargando, setCargando] = useState(false)

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setErrorAcceso('')
    setCargando(true)

    const resultado = await iniciarSesionApi(usuario, contrasena)
    setCargando(false)

    if (resultado.exito) {
      alAutenticar(resultado)
    } else {
      setErrorAcceso(resultado.mensaje)
    }
  }

  return (
    <div className="pantalla-oscura">
      {/* Cabecera Institucional */}
      <header className="cabecera-acceso">
        <h1 className="titulo-degradado">FSE_ERP Colombia</h1>
        <p className="subtitulo-acceso">Institución Educativa Departamental FSE</p>
      </header>

      {/* Tarjeta Central de Acceso */}
      <main className="contenedor-login">
        <div className="tarjeta-oscura">
          {panelActivo === 'login' && (
            <section>
              <div className="encabezado-tarjeta-oscura">
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  <span className="punto-pulso" />
                  Ingresar
                </h2>
                <span className="insignia insignia-contador">Activo</span>
              </div>

              {errorAcceso && <div className="alerta-error">{errorAcceso}</div>}

              <form onSubmit={manejarEnvio} className="formulario-erp">
                <div className="grupo-campo">
                  <label htmlFor="usuario" className="etiqueta-campo" style={{ color: '#94a3b8' }}>
                    Usuario
                  </label>
                  <input
                    id="usuario"
                    type="text"
                    required
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    className="campo-oscuro"
                    placeholder="ADMIN"
                  />
                </div>

                <div className="grupo-campo">
                  <label htmlFor="contrasena" className="etiqueta-campo" style={{ color: '#94a3b8' }}>
                    Contraseña
                  </label>
                  <input
                    id="contrasena"
                    type="password"
                    required
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    className="campo-oscuro"
                    placeholder="••••••••"
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#94a3b8', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={recordarme}
                    onChange={(e) => setRecordarme(e.target.checked)}
                  />
                  <span>Recordarme</span>
                </label>

                <button type="submit" disabled={cargando} className="boton-primario" style={{ marginTop: '0.5rem', padding: '0.85rem' }}>
                  {cargando ? 'Verificando credenciales...' : 'Ingresar al Sistema'}
                </button>
              </form>
            </section>
          )}

          {panelActivo === 'registro' && (
            <section className="formulario-erp">
              <div className="encabezado-tarjeta-oscura">
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Registrarse</h2>
                <span className="insignia insignia-anulado">Restringido</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#93c5fd', background: 'rgba(30, 58, 138, 0.35)', padding: '0.85rem', borderRadius: '0.75rem' }}>
                <strong>Registro Cerrado:</strong> Solo se permite el acceso con el usuario maestro o cuentas creadas desde el módulo Administrador.
              </p>
              <input disabled className="campo-oscuro" placeholder="Juan Pérez" />
              <input disabled className="campo-oscuro" placeholder="usuario@correo.com" />
              <button type="button" onClick={() => setPanelActivo('login')} className="boton-secundario">
                ← Volver a Ingresar
              </button>
            </section>
          )}

          {panelActivo === 'recuperar' && (
            <section className="formulario-erp">
              <div className="encabezado-tarjeta-oscura">
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recuperar</h2>
                <span className="insignia insignia-borrador">Mantenimiento</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#fde68a', background: 'rgba(120, 53, 15, 0.35)', padding: '0.85rem', borderRadius: '0.75rem' }}>
                <strong>Mantenimiento:</strong> Contacte a soporte técnico para restablecer su contraseña institucional.
              </p>
              <input disabled className="campo-oscuro" placeholder="usuario@correo.com" />
              <button type="button" onClick={() => setPanelActivo('login')} className="boton-secundario">
                ← Volver a Ingresar
              </button>
            </section>
          )}

          {/* Enlaces inferiores igual que en el diseño original de Laravel */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(51, 65, 85, 0.6)', display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.78rem' }}>
            <button
              type="button"
              onClick={() => setPanelActivo('login')}
              style={{ background: 'none', border: 'none', color: '#60a5fa', fontWeight: 700, cursor: 'pointer' }}
            >
              Ingresar
            </button>
            <span style={{ color: '#475569' }}>•</span>
            <button
              type="button"
              onClick={() => setPanelActivo('registro')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: 600, cursor: 'pointer' }}
            >
              Registrarse
            </button>
            <span style={{ color: '#475569' }}>•</span>
            <button
              type="button"
              onClick={() => setPanelActivo('recuperar')}
              style={{ background: 'none', border: 'none', color: '#fbbf24', fontWeight: 600, cursor: 'pointer' }}
            >
              Recuperar
            </button>
          </div>
        </div>
      </main>

      <footer className="cabecera-acceso" style={{ fontSize: '0.75rem', color: '#64748b' }}>
        &copy; 2026 FSE_ERP Colombia - Todos los derechos reservados
      </footer>
    </div>
  )
}

export default VistaLogin

