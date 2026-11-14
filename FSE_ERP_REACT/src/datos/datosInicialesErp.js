// ============================================================================
// DATOS INICIALES DEL SISTEMA FSE_ERP
// Autor: Aprendiz ADSO (Análisis y Desarrollo de Software)
// Descripción: Contiene la estructura base que replica las tablas de
// PostgreSQL/Laravel (instituciones, usuarios, rubros, CDP, CRP, CXP, OP, CXC y terceros).
// ============================================================================

export const INSTITUCIONES_INICIALES = [
  {
    codigo_interno: '9999999999',
    codigo_dane: '105001999999',
    nombre_institucion: 'INSTITUCIÓN EDUCATIVA DEPARTAMENTAL FSE COLOMBIA',
    cargo_nombre: 'ADMINISTRADOR',
  },
  {
    codigo_interno: '105001001234',
    codigo_dane: '105001001234',
    nombre_institucion: 'INSTITUCIÓN EDUCATIVA ALVERNIA - SEDE PRINCIPAL',
    cargo_nombre: 'RECTOR',
  },
  {
    codigo_interno: '205001005678',
    codigo_dane: '205001005678',
    nombre_institucion: 'COLEGIO TÉCNICO INDUSTRIAL SAN JOSÉ',
    cargo_nombre: 'TESORERO',
  },
]

export const CARGOS_SISTEMA = [
  { codigo_cargo: 1, descripcion: 'ADMINISTRADOR' },
  { codigo_cargo: 2, descripcion: 'RECTOR' },
  { codigo_cargo: 3, descripcion: 'TESORERO' },
  { codigo_cargo: 4, descripcion: 'CONSULTA' },
]

export const USUARIOS_INICIALES = [
  {
    codigo_usuario: 1,
    usuario: 'ADMIN',
    primer_nombre: 'ADMINISTRADOR',
    segundo_nombre: '',
    primer_apellido: 'SISTEMA',
    segundo_apellido: 'FSE',
    cedula: '1000123456',
    email: 'admin@fse.edu.co',
    celular: '3001234567',
    cargo: 'ADMINISTRADOR',
    instituciones: INSTITUCIONES_INICIALES,
  },
  {
    codigo_usuario: 2,
    usuario: 'TESORERO',
    primer_nombre: 'CARLOS',
    segundo_nombre: 'ANDRÉS',
    primer_apellido: 'GÓMEZ',
    segundo_apellido: 'PÉREZ',
    cedula: '987654321',
    email: 'tesoreria@fse.edu.co',
    celular: '3109876543',
    cargo: 'TESORERO',
    instituciones: [INSTITUCIONES_INICIALES[0], INSTITUCIONES_INICIALES[2]],
  },
]

export const RUBROS_GASTOS_INICIALES = [
  {
    codigo_rubro: 101,
    codigo_resumido: '1',
    rubro: '2.1.1',
    nombre: 'GASTOS DE PERSONAL Y APOYO A LA GESTIÓN',
    tipo: 'G',
    presupuesto_inicial: 200000000,
    adiciones: 50000000,
    reducciones: 0,
    traslados_aumento: 0,
    traslado_disminucion: 0,
    definitivo: 250000000,
    disponibilidades: 12800000,
    compromisos: 0,
    egresos: 0,
    total_disponible: 237200000,
    vigencia: 2026,
  },
  {
    codigo_rubro: 102,
    codigo_resumido: '2',
    rubro: '2.1.2',
    nombre: 'ADQUISICIÓN DE BIENES Y SERVICIOS GENERALES',
    tipo: 'G',
    presupuesto_inicial: 100000000,
    adiciones: 0,
    reducciones: 5000000,
    traslados_aumento: 0,
    traslado_disminucion: 0,
    definitivo: 95000000,
    disponibilidades: 15000000,
    compromisos: 15000000,
    egresos: 2500000,
    total_disponible: 80000000,
    vigencia: 2026,
  },
  {
    codigo_rubro: 103,
    codigo_resumido: '3',
    rubro: '2.1.3',
    nombre: 'MANTENIMIENTO DE INFRAESTRUCTURA EDUCATIVA',
    tipo: 'G',
    presupuesto_inicial: 80000000,
    adiciones: 10000000,
    reducciones: 0,
    traslados_aumento: 0,
    traslado_disminucion: 0,
    definitivo: 90000000,
    disponibilidades: 0,
    compromisos: 0,
    egresos: 0,
    total_disponible: 90000000,
    vigencia: 2026,
  },
]

export const RUBROS_INGRESOS_INICIALES = [
  {
    codigo_rubro: 201,
    codigo_resumido: '10',
    rubro: '1.1.1',
    nombre: 'TRANSFERENCIAS DE GRATUIDAD SGP - MEN',
    tipo: 'I',
    presupuesto_inicial: 500000000,
    adiciones: 120000000,
    reducciones: 0,
    traslados_aumento: 0,
    traslado_disminucion: 0,
    definitivo: 620000000,
    recaudos: 620000000,
    saldo_cxc: 0,
    total_disponible: 620000000,
    vigencia: 2026,
  },
  {
    codigo_rubro: 202,
    codigo_resumido: '11',
    rubro: '1.1.2',
    nombre: 'RECURSOS PROPIOS Y CERTIFICADOS ESCOLARES',
    tipo: 'I',
    presupuesto_inicial: 45000000,
    adiciones: 0,
    reducciones: 0,
    traslados_aumento: 0,
    traslado_disminucion: 0,
    definitivo: 45000000,
    recaudos: 15000000,
    saldo_cxc: 30000000,
    total_disponible: 45000000,
    vigencia: 2026,
  },
]

export const TERCEROS_INICIALES = [
  {
    codigo_tercero: 1,
    nit: '901234567',
    dig_ver: '8',
    tipo_identificacion: 'NIT',
    tipo_documento: 'J',
    nombre: 'SOLUCIONES TECNOLÓGICAS EDUCATIVAS SAS',
    nombre1: '',
    nombre2: '',
    apellido1: '',
    apellido2: '',
    direccion: 'Cra 45 # 12-34 Medellín',
    telefono: '6043214567',
    celular: '3004567890',
    email: 'ventas@solucionestec.co',
    representante_legal: 'MARÍA FERNANDA LÓPEZ',
    tipo_regimen: 'Responsable de IVA',
    proveedor: true,
    cliente: false,
    responsable_iva: true,
    retiene_ica: true,
    estado: 'A',
  },
  {
    codigo_tercero: 2,
    nit: '1000123456',
    dig_ver: '1',
    tipo_identificacion: 'CC',
    tipo_documento: 'N',
    nombre: 'JUAN CAMILO ARCILA RESTREPO',
    nombre1: 'JUAN',
    nombre2: 'CAMILO',
    apellido1: 'ARCILA',
    apellido2: 'RESTREPO',
    direccion: 'Calle 10 # 20-30',
    telefono: '6042223344',
    celular: '3112223344',
    email: 'jcarcila@correo.co',
    representante_legal: '',
    tipo_regimen: 'No Responsable de IVA',
    proveedor: true,
    cliente: false,
    responsable_iva: false,
    retiene_ica: false,
    estado: 'A',
  },
]

export const CDPS_INICIALES = [
  {
    codigo_disponibilidad: 1,
    consecutivo: 1,
    fecha_elaboracion: '2026-02-10',
    fecha_aprobacion: '2026-02-11 09:30',
    estado: 'A',
    descripcion: 'Servicios Profesionales de Apoyo a la Gestión Contable y Presupuestal',
    valor_total: 12800000,
    saldo_disponibilidad: 12800000,
    elabora_nombre: 'CARLOS GÓMEZ',
    aprueba_nombre: 'ADMINISTRADOR SISTEMA',
    detalles: [
      {
        codigo_det_disponibilidad: 11,
        codigo_rubro: 101,
        rubro_codigo: '2.1.1',
        rubro_nombre: 'GASTOS DE PERSONAL Y APOYO A LA GESTIÓN',
        valor_total_rubro: 12800000,
        total_crp: 0,
        total_reintegro: 0,
        saldo_rubro: 12800000,
      },
    ],
    cancelaciones: [],
  },
  {
    codigo_disponibilidad: 2,
    consecutivo: 2,
    fecha_elaboracion: '2026-05-15',
    fecha_aprobacion: '2026-05-16 14:15',
    estado: 'A',
    descripcion: 'Adquisición de Equipos Tecnológicos y de Cómputo para Aulas',
    valor_total: 15000000,
    saldo_disponibilidad: 0,
    elabora_nombre: 'CARLOS GÓMEZ',
    aprueba_nombre: 'ADMINISTRADOR SISTEMA',
    detalles: [
      {
        codigo_det_disponibilidad: 21,
        codigo_rubro: 102,
        rubro_codigo: '2.1.2',
        rubro_nombre: 'ADQUISICIÓN DE BIENES Y SERVICIOS GENERALES',
        valor_total_rubro: 15000000,
        total_crp: 15000000,
        total_reintegro: 0,
        saldo_rubro: 0,
      },
    ],
    cancelaciones: [],
  },
]

export const CRPS_INICIALES = [
  {
    id: 1,
    numero: 'CRP-2026-001',
    fecha: '2026-05-20',
    codigo_tercero: 1,
    tercero_nombre: 'SOLUCIONES TECNOLÓGICAS EDUCATIVAS SAS',
    tercero_nit: '901234567',
    cdp_consecutivo: 2,
    rubro_codigo: '2.1.2',
    rubro_nombre: 'ADQUISICIÓN DE BIENES Y SERVICIOS GENERALES',
    objeto: 'Contrato de Suministro de Equipos de Cómputo y Portátiles Escolares',
    valor: 15000000,
    saldo: 12500000,
  },
]

export const CXPS_INICIALES = [
  {
    id: 1,
    numero: 'CXP-2026-001',
    fecha: '2026-06-01',
    crp_id: 1,
    crp_numero: 'CRP-2026-001',
    rubro_codigo: '2.1.2',
    valor: 2500000,
  },
]

export const OPS_INICIALES = [
  {
    id: 1,
    numero: 'OP-2026-001',
    fecha: '2026-06-05',
    cxp_id: 1,
    cxp_numero: 'CXP-2026-001',
    rubro_codigo: '2.1.2',
    valor: 2500000,
  },
]

export const CXCS_INICIALES = [
  {
    id: 1,
    numero: 'CXC-2026-001',
    fecha: '2026-01-15',
    rubro_id: 201,
    rubro_codigo: '1.1.1',
    rubro_nombre: 'TRANSFERENCIAS DE GRATUIDAD SGP - MEN',
    concepto: 'Recaudo de Transferencias del Ministerio de Educación Nacional',
    valor: 620000000,
  },
]

export const DATOS_GRAFICO_EJECUCION = {
  etiquetas: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ],
  ejecucion: [
    1000000, 22000000, 15000000, 8000000, 28000000, 31000000,
    15000000, 12000000, 5000000, 42000000, 53000000, 6000000,
  ],
  tendencia: [
    11000000, 12500000, 14000000, 15500000, 17000000, 18500000,
    20000000, 21500000, 23000000, 24500000, 26000000, 28000000,
  ],
}

