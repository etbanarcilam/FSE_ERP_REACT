import { useState } from 'react'
import { CARGOS_SISTEMA, INSTITUCIONES_INICIALES } from '../../datos/datosInicialesErp'

/**
 * Componente: VistaUsuarios
 * Responsabilidad única: Consultar las cuentas autorizadas del sistema,
 * registrar nuevos usuarios asociando cargo e instituciones, y eliminar cuentas.
 * Autor: Aprendiz ADSO
 */
function VistaUsuarios({
  usuarios,
  usuarioActivo,
  alCrearUsuario,
  alEliminarUsuario,
}) {
  const [primerNombre, setPrimerNombre] = useState('')
  const [primerApellido, setPrimerApellido] = useState('')
  const [cedula, setCedula] = useState('')
  const [usuarioLogin, setUsuarioLogin] = useState('')
  const [email, setEmail] = useState('')
  const [celular, setCelular] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [cargo, setCargo] = useState('TESORERO')

  const manejarSubmit = (evento) => {
    evento.preventDefault()
    alCrearUsuario({
      primer_nombre: primerNombre.toUpperCase(),
      primer_apellido: primerApellido.toUpperCase(),
      cedula,
      usuario: usuarioLogin.toUpperCase(),
      email,
      celular,
      cargo,
      instituciones: INSTITUCIONES_INICIALES,
    })

    setPrimerNombre('')
    setPrimerApellido('')
    setCedula('')
    setUsuarioLogin('')
    setEmail('')
    setCelular('')
    setContrasena('')
  }

  return (
    <div className="grilla-modulo grilla-modulo-dividida">
      {/* Tabla de Usuarios (2/3) */}
      <div className="panel-blanco">
        <div className="encabezado-seccion">
          <div>
            <h2 className="titulo-seccion">Gestión de Usuarios</h2>
            <p className="subtitulo-seccion">
              Cuentas autorizadas en el sistema FSE_ERP y cargos institucionales.
            </p>
          </div>
        </div>

        <div className="contenedor-tabla">
          <table className="tabla-erp">
            <thead>
              <tr>
                <th>Código</th>
                <th>Usuario</th>
                <th>Nombre Completo</th>
                <th>Cargo</th>
                <th>Celular</th>
                <th className="texto-centro">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const esMiUsuario = u.codigo_usuario === usuarioActivo?.codigo_usuario
                return (
                  <tr key={u.codigo_usuario}>
                    <td className="texto-codigo">{u.codigo_usuario}</td>
                    <td className="texto-codigo" style={{ color: '#2563eb' }}>
                      {u.usuario}
                    </td>
                    <td>
                      <strong style={{ display: 'block' }}>
                        {u.primer_nombre} {u.primer_apellido}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        CC: {u.cedula} | {u.email}
                      </span>
                    </td>
                    <td>
                      <span className="insignia insignia-contador">{u.cargo}</span>
                    </td>
                    <td>{u.celular || 'N/A'}</td>
                    <td className="texto-centro">
                      {esMiUsuario ? (
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Activo (Tú)</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => alEliminarUsuario(u.codigo_usuario)}
                          className="boton-peligro"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulario Nuevo Usuario (1/3) */}
      <div className="panel-blanco">
        <h3 className="titulo-seccion" style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>
          ➕ Nuevo Usuario
        </h3>

        <form onSubmit={manejarSubmit} className="formulario-erp">
          <div className="grilla-2-columnas">
            <div className="grupo-campo">
              <label className="etiqueta-campo">Primer Nombre</label>
              <input
                type="text"
                required
                value={primerNombre}
                onChange={(e) => setPrimerNombre(e.target.value)}
                placeholder="JUAN"
                className="entrada-erp"
              />
            </div>
            <div className="grupo-campo">
              <label className="etiqueta-campo">Primer Apellido</label>
              <input
                type="text"
                required
                value={primerApellido}
                onChange={(e) => setPrimerApellido(e.target.value)}
                placeholder="ARCILA"
                className="entrada-erp"
              />
            </div>
          </div>

          <div className="grilla-2-columnas">
            <div className="grupo-campo">
              <label className="etiqueta-campo">Cédula (NIT Tercero)</label>
              <input
                type="number"
                required
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="1000123456"
                className="entrada-erp"
              />
            </div>
            <div className="grupo-campo">
              <label className="etiqueta-campo">Usuario (Login)</label>
              <input
                type="text"
                required
                value={usuarioLogin}
                onChange={(e) => setUsuarioLogin(e.target.value)}
                placeholder="AUXILIAR"
                className="entrada-erp"
              />
            </div>
          </div>

          <div className="grupo-campo">
            <label className="etiqueta-campo">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@fse.edu.co"
              className="entrada-erp"
            />
          </div>

          <div className="grilla-2-columnas">
            <div className="grupo-campo">
              <label className="etiqueta-campo">Celular</label>
              <input
                type="text"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                placeholder="3001234567"
                className="entrada-erp"
              />
            </div>
            <div className="grupo-campo">
              <label className="etiqueta-campo">Contraseña</label>
              <input
                type="password"
                required
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••"
                className="entrada-erp"
              />
            </div>
          </div>

          <div className="grupo-campo">
            <label className="etiqueta-campo">Cargo Administrativo</label>
            <select
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="entrada-erp"
            >
              {CARGOS_SISTEMA.map((c) => (
                <option key={c.codigo_cargo} value={c.descripcion}>
                  {c.descripcion}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="boton-primario">
            Crear Usuario
          </button>
        </form>
      </div>
    </div>
  )
}

export default VistaUsuarios

