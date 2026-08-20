import type { Sector, Tag } from "./types";

function tag(t: Tag): Tag {
  return t;
}

const contabilidad: Sector = {
  id: "contabilidad",
  label: "Contabilidad",
  icon: "ti-receipt-tax",
  description: "Documentos contables e impuestos del ejercicio.",
  widgetStats: [
    { label: "Ejercicio", value: "2026" },
    { label: "Próxima obligación", value: "IVA 3T", trend: "vence 20 oct", trendDirection: "flat" },
  ],
  tags: [
    tag({
      id: "impuestos",
      label: "Impuestos",
      icon: "ti-receipt-tax",
      notifications: 1,
      summary: "Calendario fiscal y presentaciones.",
      detail: {
        intro: "Calendario de impuestos de Eonesia Learning Experiences, S.L.",
        table: {
          columns: ["Modelo", "Periodo", "Estado", "Vencimiento"],
          rows: [
            { Modelo: "IVA (303)", Periodo: "2º trimestre 2026", Estado: "Presentado", Vencimiento: "20 jul" },
            { Modelo: "IRPF (130)", Periodo: "2º trimestre 2026", Estado: "Presentado", Vencimiento: "20 jul" },
            { Modelo: "IVA (303)", Periodo: "3º trimestre 2026", Estado: "Pendiente", Vencimiento: "20 oct" },
            { Modelo: "Sociedades (200)", Periodo: "Ejercicio 2025", Estado: "Presentado", Vencimiento: "25 jul" },
          ],
        },
      },
    }),
  ],
};

const recordatorios: Sector = {
  id: "recordatorios",
  label: "Recordatorios",
  icon: "ti-bell",
  description: "Vencimientos y documentos importantes.",
  widgetStats: [{ label: "Próximos 30 días", value: "4" }],
  tags: [
    tag({
      id: "documentos-importantes",
      label: "Documentos importantes",
      icon: "ti-file-alert",
      notifications: 2,
      summary: "Vencimientos de documentos y pólizas.",
      detail: {
        intro: "Documentos con fecha de renovación o vencimiento próximo.",
        list: [
          { title: "Renovación póliza de responsabilidad civil", meta: "Vence 5 sep", status: "warn" },
          { title: "Renovación certificado digital empresa", meta: "Vence 30 nov", status: "neutral" },
          { title: "Auditoría anual de cuentas", meta: "Programada — 15 oct", status: "neutral" },
        ],
      },
    }),
  ],
};

const prevision: Sector = {
  id: "prevision",
  label: "Previsión",
  icon: "ti-trending-up",
  description: "Ingresos y gastos previstos por canal.",
  widgetStats: [
    { label: "Ingresos previstos Q3", value: "68.000 €" },
    { label: "Gastos previstos Q3", value: "41.500 €" },
    { label: "Margen previsto", value: "39%", trendDirection: "up" },
  ],
  tags: [
    tag({
      id: "ingresos",
      label: "Ingresos",
      icon: "ti-cash-banknote",
      notifications: 0,
      summary: "Previsión de ingresos por trimestre.",
      detail: {
        intro: "Previsión de ingresos actualizada manualmente por los socios cada mes.",
        table: {
          columns: ["Trimestre", "Previsto", "Real (a fecha)"],
          rows: [
            { Trimestre: "Q1 2026", Previsto: "58.000 €", "Real (a fecha)": "61.200 €" },
            { Trimestre: "Q2 2026", Previsto: "63.000 €", "Real (a fecha)": "65.400 €" },
            { Trimestre: "Q3 2026", Previsto: "68.000 €", "Real (a fecha)": "22.150 €" },
          ],
        },
      },
    }),
    tag({
      id: "gastos",
      label: "Gastos",
      icon: "ti-cash-off",
      notifications: 0,
      summary: "Previsión de gastos por trimestre.",
      detail: {
        intro: "Previsión de gastos, incluyendo nóminas, infraestructura y producción.",
        table: {
          columns: ["Trimestre", "Previsto", "Real (a fecha)"],
          rows: [
            { Trimestre: "Q1 2026", Previsto: "36.000 €", "Real (a fecha)": "34.800 €" },
            { Trimestre: "Q2 2026", Previsto: "38.500 €", "Real (a fecha)": "37.100 €" },
            { Trimestre: "Q3 2026", Previsto: "41.500 €", "Real (a fecha)": "13.020 €" },
          ],
        },
      },
    }),
    tag({
      id: "por-canal",
      label: "Por canal",
      icon: "ti-chart-pie",
      notifications: 0,
      summary: "Distribución de ingresos por canal de venta.",
      detail: {
        intro: "Peso de cada canal sobre el total de ingresos previstos.",
        stats: [
          { label: "Licencias LXP", value: "44%" },
          { label: "Encargos VR/360", value: "31%" },
          { label: "SaaS B2C", value: "18%" },
          { label: "Otros", value: "7%" },
        ],
      },
    }),
  ],
};

const banco: Sector = {
  id: "banco",
  label: "Banco",
  icon: "ti-building-bank",
  description: "Estado de cuentas y deuda bancaria.",
  widgetStats: [
    { label: "Saldo total", value: "38.240 €" },
    { label: "Deuda pendiente", value: "22.000 €" },
  ],
  tags: [
    tag({
      id: "cuentas",
      label: "Cuentas",
      icon: "ti-wallet",
      notifications: 0,
      summary: "Saldo de las cuentas bancarias operativas.",
      detail: {
        intro: "Cuentas bancarias activas de la empresa.",
        table: {
          columns: ["Cuenta", "Banco", "Saldo"],
          rows: [
            { Cuenta: "Cuenta operativa", Banco: "CaixaBank", Saldo: "29.140 €" },
            { Cuenta: "Cuenta de ahorro", Banco: "CaixaBank", Saldo: "9.100 €" },
          ],
        },
        integration: { provider: "Open Banking (PSD2)", status: "no_conectado", note: "Con acceso PSD2 estos saldos se actualizarían automáticamente en vez de introducirse a mano." },
      },
    }),
    tag({
      id: "deuda-bancaria",
      label: "Deuda bancaria",
      icon: "ti-report-money",
      notifications: 0,
      summary: "Préstamos activos: cuotas, intereses y amortización.",
      detail: {
        intro: "Seguimiento de préstamos activos — capital, cuota, interés y capital amortizado.",
        table: {
          columns: ["Préstamo", "Capital inicial", "Capital amortizado", "Cuota mensual", "Interés", "Fin de pago"],
          rows: [
            { Préstamo: "Equipamiento VR", "Capital inicial": "22.000 €", "Capital amortizado": "34% (7.480 €)", "Cuota mensual": "610 €", Interés: "5,2% TAE", "Fin de pago": "mar 2029" },
            { Préstamo: "ICO Liquidez 2023", "Capital inicial": "15.000 €", "Capital amortizado": "61% (9.150 €)", "Cuota mensual": "420 €", Interés: "4,1% TAE", "Fin de pago": "jun 2027" },
          ],
        },
      },
    }),
  ],
};

const facturacion: Sector = {
  id: "facturacion",
  label: "Facturación",
  icon: "ti-file-invoice",
  description: "Presupuestos y facturas — \"Holded propio\" del panel.",
  widgetStats: [
    { label: "Facturado (mes)", value: "22.150 €", trend: "+8%", trendDirection: "up" },
    { label: "Pendiente de cobro", value: "5.500 €" },
  ],
  tags: [
    tag({
      id: "presupuestos",
      label: "Presupuestos",
      icon: "ti-file-dollar",
      notifications: 1,
      summary: "Presupuestos enviados a clientes.",
      detail: {
        intro: "Presupuestos enviados pendientes de aprobación o rechazo.",
        table: {
          columns: ["Nº", "Cliente", "Importe", "Estado"],
          rows: [
            { "Nº": "P-2026-018", Cliente: "Fundación Aprende+", Importe: "5.600 €", Estado: "Pendiente" },
            { "Nº": "P-2026-019", Cliente: "Cámara de Comercio", Importe: "9.200 €", Estado: "Pendiente" },
          ],
        },
      },
    }),
    tag({
      id: "facturas",
      label: "Facturas",
      icon: "ti-file-invoice",
      notifications: 1,
      summary: "Facturas emitidas por categoría de gasto/ingreso.",
      detail: {
        intro: "Tu \"Holded propio\": añade y elimina facturas directamente desde aquí. Migración del histórico completo desde Excel pendiente (spec §8).",
        ledger: {
          addLabel: "Nueva factura",
          totalField: "Importe",
          fields: [
            { id: "Nº", label: "Nº", type: "text", placeholder: "F-2026-043" },
            { id: "Cliente", label: "Cliente", type: "text", placeholder: "Colegio Alameda" },
            { id: "Categoría", label: "Categoría", type: "text", placeholder: "Licencia LXP" },
            { id: "Importe", label: "Importe", type: "text", placeholder: "3.400 €" },
            { id: "Estado", label: "Estado", type: "text", placeholder: "Pendiente" },
          ],
          seedRows: [
            { "Nº": "F-2026-041", Cliente: "Colegio Alameda", Categoría: "Licencia LXP", Importe: "3.400 €", Estado: "Cobrada" },
            { "Nº": "F-2026-042", Cliente: "IES Sierra Nevada", Categoría: "Encargo VR", Importe: "2.100 €", Estado: "Pendiente" },
            { "Nº": "F-2026-040", Cliente: "Fundación Aprende+", Categoría: "Mundos360", Importe: "3.400 €", Estado: "Cobrada" },
          ],
        },
        note: "Importar histórico completo desde Excel: función pendiente de construir en apps/api.",
      },
    }),
  ],
};

const crmClientes: Sector = {
  id: "crm-clientes",
  label: "CRM clientes",
  icon: "ti-address-book",
  description: "Contactos y contratos de clientes.",
  widgetStats: [{ label: "Clientes activos", value: "31" }],
  tags: [
    tag({
      id: "contactos",
      label: "Contactos",
      icon: "ti-users",
      notifications: 0,
      summary: "Personas de contacto por cliente.",
      detail: {
        intro: "Contactos principales de cada cuenta activa.",
        table: {
          columns: ["Cliente", "Contacto", "Cargo", "Email"],
          rows: [
            { Cliente: "Colegio Alameda", Contacto: "Marisa Ortega", Cargo: "Directora", Email: "direccion@colegioalameda.example" },
            { Cliente: "IES Sierra Nevada", Contacto: "Javier Roldán", Cargo: "Jefe de estudios", Email: "jefatura@iessierranevada.example" },
          ],
        },
      },
    }),
    tag({
      id: "contratos",
      label: "Contratos",
      icon: "ti-signature",
      notifications: 0,
      summary: "Contratos activos y su vigencia.",
      detail: {
        intro: "Contratos activos con clientes, con fecha de renovación.",
        table: {
          columns: ["Cliente", "Tipo", "Renovación"],
          rows: [
            { Cliente: "Colegio Alameda", Tipo: "Licencia LXP anual", Renovación: "1 sep 2026" },
            { Cliente: "IES Sierra Nevada", Tipo: "Licencia LXP anual", Renovación: "15 nov 2026" },
          ],
        },
      },
    }),
  ],
};

const legal: Sector = {
  id: "legal",
  label: "Legal",
  icon: "ti-scale",
  description: "Consejos y aspectos legales de la empresa.",
  widgetStats: [{ label: "Modelos disponibles", value: "6" }],
  tags: [
    tag({
      id: "consejos-legales",
      label: "Consejos legales",
      icon: "ti-gavel",
      notifications: 0,
      summary: "Notas y recomendaciones legales para el equipo.",
      detail: {
        intro: "Recomendaciones legales relevantes para el día a día (no sustituye asesoría profesional).",
        list: [
          { title: "Protección de datos de menores (RGPD + LOPDGDD)", meta: "Aplica a todo contenido con estudiantes", status: "neutral" },
          { title: "Cesión de derechos de imagen en grabaciones 360°", meta: "Revisar antes de cada rodaje en centro", status: "warn" },
        ],
      },
    }),
    tag({
      id: "modelos",
      label: "Modelos",
      icon: "ti-template",
      notifications: 0,
      summary: "Plantillas legales reutilizables.",
      detail: {
        intro: "Plantillas de documentos legales para uso interno.",
        list: [
          { title: "Modelo de contrato de licencia LXP", status: "ok" },
          { title: "Modelo de acuerdo de confidencialidad (NDA)", status: "ok" },
          { title: "Modelo de cesión de derechos de imagen", status: "ok" },
        ],
      },
    }),
  ],
};

export const finanzasSectors: Sector[] = [contabilidad, recordatorios, prevision, banco, facturacion, crmClientes, legal];
