import { useState } from 'react'

/**
 * Componente: FormularioTercero
 * Responsabilidad única: Administrar el formulario por pestañas (Identificación,
 * Contacto, Régimen y Otros/FE) para crear o actualizar un Tercero.
 * Autor: Aprendiz ADSO
 */
function FormularioTercero({ terceroActual, alGuardarTercero, alLimpiarSeleccion }) {
  const [pestana, setPestana] = useState('identificacion')

  // Se inicializa con los valores del tercero seleccionado o vacío para uno nuevo
  const [datos, setDatos] = useState(() => ({
    nit: terceroActual?.nit || '',
    dig_ver: terceroActual?.dig_ver || '0',
    tipo_identificacion: terceroActual?.tipo_identificacion || 'CC',
    tipo_documento: terceroActual?.tipo_documento || 'N',
    nombre: terceroActual?.nombre || '',
    representante_legal: terceroActual?.representante_legal || '',
    direccion: terceroActual?.direccion || '',
    telefono: terceroActual?.telefono || '',
    celular: terceroActual?.celular || '',
    email: terceroActual?.email || '',
    tipo_regimen: terceroActual?.tipo_regimen || 'No Responsable de IVA',
    responsable_iva: Boolean(terceroActual?.responsable_iva),
    retiene_ica: Boolean(terceroActual?.retiene_ica),
    proveedor: terceroActual ? Boolean(terceroActual.proveedor) : true,
    cliente: Boolean(terceroActual?.cliente),
    estado: terceroActual?.estado || 'A',
  }))

  const actualizarCampo = (campo, valor) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }))
  }

  const manejarEnvio = (evento) => {
    evento.preventDefault()
    alGuardarTercero({
      ...datos,
      codigo_tercero: terceroActual?.codigo_tercero || null,
    })
  }

  const listaPestanas = [
    { id: 'identificacion', etiqueta: 'Identificación' },
    { id: 'contacto', etiqueta: 'Contacto' },
    { id: 'regimen', etiqueta: 'Régimen' },
    { id: 'otros', etiqueta: 'Otros / FE' },
  ]

  return (
    <div className="panel-blanco">
      <div className="encabezado-seccion" style={{ marginBottom: '0.85rem' }}>
        <h3 className="titulo-seccion" style={{ fontSize: '1rem' }}>
          {terceroActual ? `Editar: ${terceroActual.nombre}` : 'Crear Nuevo Tercero'}
        </h3>
        {terceroActual && (
          <button type="button" onClick={alLimpiarSeleccion} className="boton-secundario">
            + Nuevo
          </button>
        )}
      </div>

      {/* Pestañas del formulario (key única por p.id) */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '0.5rem' }}>
        {listaPestanas.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPestana(p.id)}
            style={{
              flex: 1,
              padding: '0.4rem',
              borderRadius: '0.35rem',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: pestana === p.id ? '#ffffff' : 'transparent',
              color: pestana === p.id ? '#4f46e5' : '#64748b',
            }}
          >
            {p.etiqueta}
          </button>
        ))}
      </div>

      <form onSubmit={manejarEnvio} className="formulario-erp">
        {pestana === 'identificacion' && (
          <>
            <div className="grilla-2-columnas">
              <div className="grupo-campo">
                <label className="etiqueta-campo">NIT / Identificación *</label>
                <input
                  type="text"
                  required
                  value={datos.nit}
                  onChange={(e) => actualizarCampo('nit', e.target.value)}
                  placeholder="Ej: 901234567"
                  className="entrada-erp"
                />
              </div>
              <div className="grupo-campo">
                <label className="etiqueta-campo">Dígito Verificación (DV)</label>
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={datos.dig_ver}
                  onChange={(e) => actualizarCampo('dig_ver', e.target.value)}
                  className="entrada-erp"
                />
              </div>
            </div>

            <div className="grilla-2-columnas">
              <div className="grupo-campo">
                <label className="etiqueta-campo">Tipo Identificación</label>
                <select
                  value={datos.tipo_identificacion}
                  onChange={(e) => actualizarCampo('tipo_identificacion', e.target.value)}
                  className="entrada-erp"
                >
                  <option value="NIT">NIT - Persona Jurídica</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                </select>
              </div>
              <div className="grupo-campo">
                <label className="etiqueta-campo">Tipo Persona</label>
                <select
                  value={datos.tipo_documento}
                  onChange={(e) => actualizarCampo('tipo_documento', e.target.value)}
                  className="entrada-erp"
                >
                  <option value="N">Persona Natural</option>
                  <option value="J">Persona Jurídica</option>
                </select>
              </div>
            </div>

            <div className="grupo-campo">
              <label className="etiqueta-campo">Nombre o Razón Social *</label>
              <input
                type="text"
                required
                value={datos.nombre}
                onChange={(e) => actualizarCampo('nombre', e.target.value.toUpperCase())}
                placeholder="Ej: JUAN PÉREZ o PROVEEDOR SAS"
                className="entrada-erp"
              />
            </div>

            <div className="grupo-campo">
              <label className="etiqueta-campo">Representante Legal</label>
              <input
                type="text"
                value={datos.representante_legal}
                onChange={(e) => actualizarCampo('representante_legal', e.target.value)}
                className="entrada-erp"
              />
            </div>
          </>
        )}

        {pestana === 'contacto' && (
          <>
            <div className="grupo-campo">
              <label className="etiqueta-campo">Dirección Principal</label>
              <input
                type="text"
                value={datos.direccion}
                onChange={(e) => actualizarCampo('direccion', e.target.value)}
                className="entrada-erp"
              />
            </div>
            <div className="grilla-2-columnas">
              <div className="grupo-campo">
                <label className="etiqueta-campo">Teléfono Fijo</label>
                <input
                  type="text"
                  value={datos.telefono}
                  onChange={(e) => actualizarCampo('telefono', e.target.value)}
                  className="entrada-erp"
                />
              </div>
              <div className="grupo-campo">
                <label className="etiqueta-campo">Celular</label>
                <input
                  type="text"
                  value={datos.celular}
                  onChange={(e) => actualizarCampo('celular', e.target.value)}
                  className="entrada-erp"
                />
              </div>
            </div>
            <div className="grupo-campo">
              <label className="etiqueta-campo">Correo Electrónico</label>
              <input
                type="email"
                value={datos.email}
                onChange={(e) => actualizarCampo('email', e.target.value)}
                className="entrada-erp"
              />
            </div>
          </>
        )}

        {pestana === 'regimen' && (
          <>
            <div className="grupo-campo">
              <label className="etiqueta-campo">Régimen Tributario</label>
              <select
                value={datos.tipo_regimen}
                onChange={(e) => actualizarCampo('tipo_regimen', e.target.value)}
                className="entrada-erp"
              >
                <option value="No Responsable de IVA">No Responsable de IVA (Simplificado)</option>
                <option value="Responsable de IVA">Responsable de IVA (Común)</option>
                <option value="Regimen Especial">Régimen Especial / No Contribuyente</option>
              </select>
            </div>
            <label style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={datos.responsable_iva}
                onChange={(e) => actualizarCampo('responsable_iva', e.target.checked)}
              />
              <span>Responsable de IVA</span>
            </label>
            <label style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={datos.retiene_ica}
                onChange={(e) => actualizarCampo('retiene_ica', e.target.checked)}
              />
              <span>Aplica Retención ICA</span>
            </label>
          </>
        )}

        {pestana === 'otros' && (
          <>
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', gap: '0.4rem', cursor: 'pointer', fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={datos.proveedor}
                  onChange={(e) => actualizarCampo('proveedor', e.target.checked)}
                />
                <span>Es Proveedor</span>
              </label>
              <label style={{ display: 'flex', gap: '0.4rem', cursor: 'pointer', fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={datos.cliente}
                  onChange={(e) => actualizarCampo('cliente', e.target.checked)}
                />
                <span>Es Cliente</span>
              </label>
            </div>
            <div className="grupo-campo">
              <label className="etiqueta-campo">Estado del Tercero</label>
              <select
                value={datos.estado}
                onChange={(e) => actualizarCampo('estado', e.target.value)}
                className="entrada-erp"
              >
                <option value="A">Activo</option>
                <option value="I">Inactivo</option>
              </select>
            </div>
          </>
        )}

        <button type="submit" className="boton-indigo">
          {terceroActual ? 'Actualizar Tercero' : 'Guardar Tercero'}
        </button>
      </form>
    </div>
  )
}

export default FormularioTercero

