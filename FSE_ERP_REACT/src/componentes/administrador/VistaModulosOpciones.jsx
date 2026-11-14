import { useState } from 'react'

/**
 * Componente: VistaModulosOpciones
 * Responsabilidad única: Permitir activar/desactivar módulos del selector ERP
 * y configurar las opciones globales de la institución educativa.
 * Autor: Aprendiz ADSO
 */
function VistaModulosOpciones({
  modo, // 'modulos' | 'opciones'
  modulosHabilitados,
  alGuardarModulos,
  opcionesSistema,
  alGuardarOpciones,
}) {
  const [estadoModulos, setEstadoModulos] = useState(modulosHabilitados)
  const [datosOpciones, setDatosOpciones] = useState(opcionesSistema)

  if (modo === 'modulos') {
    const alternarModulo = (nombre) => {
      if (nombre === 'Administrador') return
      setEstadoModulos((prev) => ({ ...prev, [nombre]: !prev[nombre] }))
    }

    const enviarModulos = (e) => {
      e.preventDefault()
      alGuardarModulos(estadoModulos)
    }

    const descripciones = [
      {
        nombre: 'Presupuesto',
        detalle: 'Gestión de CDP, CRP, CXP, órdenes de pago (OP) y reportes de ejecución.',
      },
      {
        nombre: 'Tesorería',
        detalle: 'Control de caja y bancos, conciliación bancaria e informes de ingresos y egresos.',
      },
      {
        nombre: 'Contabilidad',
        detalle: 'Libros contables diario y mayor, balances oficiales y plan único de cuentas (PUC).',
      },
      {
        nombre: 'Administrador',
        detalle: 'Módulo obligatorio de configuración global, seguridad y privilegios.',
      },
    ]

    return (
      <div className="panel-blanco" style={{ maxWidth: '42rem', margin: '0 auto' }}>
        <h2 className="titulo-seccion" style={{ marginBottom: '0.35rem' }}>
          ⚙️ Configuración de Módulos
        </h2>
        <p className="subtitulo-seccion" style={{ marginBottom: '1.25rem' }}>
          Habilite o deshabilite la visibilidad de los módulos en el selector superior del ERP.
        </p>

        <form onSubmit={enviarModulos} className="formulario-erp">
          {descripciones.map((mod) => (
            <div
              key={mod.nombre}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 0',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.9rem' }}>Módulo de {mod.nombre}</h4>
                <p style={{ fontSize: '0.76rem', color: '#64748b' }}>{mod.detalle}</p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(estadoModulos[mod.nombre])}
                disabled={mod.nombre === 'Administrador'}
                onChange={() => alternarModulo(mod.nombre)}
                style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
              />
            </div>
          ))}

          <button type="submit" className="boton-primario">
            Guardar Configuración de Módulos
          </button>
        </form>
      </div>
    )
  }

  const enviarOpciones = (e) => {
    e.preventDefault()
    alGuardarOpciones(datosOpciones)
  }

  return (
    <div className="panel-blanco" style={{ maxWidth: '42rem', margin: '0 auto' }}>
      <h2 className="titulo-seccion" style={{ marginBottom: '0.35rem' }}>
        🏛️ Opciones del Sistema
      </h2>
      <p className="subtitulo-seccion" style={{ marginBottom: '1.25rem' }}>
        Configure los valores globales y reglas de negocio del ERP de la institución.
      </p>

      <form onSubmit={enviarOpciones} className="formulario-erp">
        <div className="grupo-campo">
          <label className="etiqueta-campo">Nombre Oficial de la Institución</label>
          <input
            type="text"
            required
            value={datosOpciones.nombreInstitucion}
            onChange={(e) =>
              setDatosOpciones((prev) => ({ ...prev, nombreInstitucion: e.target.value }))
            }
            className="entrada-erp"
          />
        </div>

        <div className="grilla-2-columnas">
          <div className="grupo-campo">
            <label className="etiqueta-campo">Año Fiscal Activo</label>
            <input
              type="text"
              required
              value={datosOpciones.anioFiscal}
              onChange={(e) =>
                setDatosOpciones((prev) => ({ ...prev, anioFiscal: e.target.value }))
              }
              className="entrada-erp"
            />
          </div>

          <div className="grupo-campo">
            <label className="etiqueta-campo">Moneda del Sistema</label>
            <select
              value={datosOpciones.moneda}
              onChange={(e) =>
                setDatosOpciones((prev) => ({ ...prev, moneda: e.target.value }))
              }
              className="entrada-erp"
            >
              <option value="COP ($)">Peso Colombiano - COP ($)</option>
              <option value="USD ($)">Dólar Americano - USD ($)</option>
              <option value="EUR (€)">Euro - EUR (€)</option>
            </select>
          </div>
        </div>

        <div className="grupo-campo">
          <label className="etiqueta-campo">Límite de Gasto Directo (CDP)</label>
          <input
            type="number"
            min="0"
            required
            value={datosOpciones.limiteGasto}
            onChange={(e) =>
              setDatosOpciones((prev) => ({ ...prev, limiteGasto: e.target.value }))
            }
            className="entrada-erp"
          />
        </div>

        <button type="submit" className="boton-primario">
          Guardar Opciones Generales
        </button>
      </form>
    </div>
  )
}

export default VistaModulosOpciones

