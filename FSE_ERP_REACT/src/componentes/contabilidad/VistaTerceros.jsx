import { useState } from 'react'
import FormularioTercero from './FormularioTercero'

/**
 * Componente: VistaTerceros
 * Responsabilidad única: Mostrar el catálogo maestro de terceros con filtro
 * en tiempo real y sincronizar la selección con el formulario lateral.
 * Autor: Aprendiz ADSO
 */
function VistaTerceros({
  terceros,
  idSeleccionado,
  alSeleccionarId,
  alGuardarTercero,
}) {
  const [busqueda, setBusqueda] = useState('')

  const consulta = busqueda.toLowerCase().trim()
  const tercerosFiltrados = terceros.filter(
    (t) =>
      t.nombre.toLowerCase().includes(consulta) ||
      t.nit.toLowerCase().includes(consulta) ||
      String(t.celular || t.telefono || '').includes(consulta)
  )

  const terceroActual =
    terceros.find((t) => t.codigo_tercero === idSeleccionado) || null

  return (
    <div className="grilla-modulo grilla-modulo-dividida">
      {/* Tabla de Terceros (2/3 de ancho) */}
      <div className="panel-blanco">
        <div className="encabezado-seccion">
          <h2 className="titulo-seccion">
            <span>👥</span>
            <span>Catálogo de Terceros</span>
          </h2>

          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por Nombre, NIT o Teléfono..."
            className="entrada-erp"
            style={{ maxWidth: '17rem' }}
          />
        </div>

        <div className="contenedor-tabla">
          <table className="tabla-erp">
            <thead>
              <tr>
                <th>NIT / Identificación</th>
                <th>Nombre / Razón Social</th>
                <th>Contacto</th>
                <th>Tipo</th>
                <th className="texto-centro">Estado</th>
              </tr>
            </thead>
            <tbody>
              {/* Key única y estable: t.codigo_tercero */}
              {tercerosFiltrados.map((t) => (
                <tr
                  key={t.codigo_tercero}
                  onClick={() => alSeleccionarId(t.codigo_tercero)}
                  className={idSeleccionado === t.codigo_tercero ? 'fila-seleccionada' : ''}
                >
                  <td className="texto-codigo">
                    {t.nit}
                    {t.dig_ver !== '' ? `-${t.dig_ver}` : ''}
                    <span style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8' }}>
                      {t.tipo_identificacion}
                    </span>
                  </td>
                  <td>
                    <strong style={{ display: 'block' }}>{t.nombre}</strong>
                    {t.representante_legal && (
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Rep: {t.representante_legal}
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ display: 'block' }}>{t.email || 'Sin Correo'}</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {t.celular || t.telefono}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {t.proveedor && <span className="insignia insignia-contador">Prov</span>}
                      {t.cliente && <span className="insignia insignia-aprobado">Cli</span>}
                    </div>
                  </td>
                  <td className="texto-centro">
                    <span
                      className={`insignia ${
                        t.estado === 'A' ? 'insignia-aprobado' : 'insignia-anulado'
                      }`}
                    >
                      {t.estado === 'A' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Usamos key={terceroActual?.codigo_tercero || 'nuevo'} para reiniciar el estado interno del formulario sin copiar props en useEffect */}
      <FormularioTercero
        key={terceroActual?.codigo_tercero || 'nuevo'}
        terceroActual={terceroActual}
        alGuardarTercero={alGuardarTercero}
        alLimpiarSeleccion={() => alSeleccionarId(null)}
      />
    </div>
  )
}

export default VistaTerceros

