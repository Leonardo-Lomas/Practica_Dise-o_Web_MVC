export type EstadoProyecto =
  | "Creado"
  | "Pendiente de materiales"
  | "Listo para produccion"
  | "En produccion"
  | "En pausa"
  | "Terminado"
  | "Entregado";

export type EstadoProduccion = "Fabricacion" | "Pintura" | "Instalacion" | "Barniz";

export type TipoNotificacion =
  | "Material faltante"
  | "Material recibido"
  | "Fecha de entrega próxima"
  | "Cambio de estado";

export interface Material {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  stockMinimo: number;
  stockActual: number;
  proveedor?: string;
}

export interface Carpintero {
  id: string;
  nombre: string;
  especialidad: string;
  disponible: boolean;
}

export interface Documento {
  id: string;
  nombre: string;
  tipo: "Plano" | "Diseño" | "Especificación" | "Otro";
  url: string;
  fechaSubida: Date;
}

export interface EstadoConcepto {
  tipo: EstadoProduccion;
  completado: boolean;
  fechaInicio?: Date;
  fechaFin?: Date;
}

export interface Concepto {
  id: string;
  descripcion: string;
  fechaInicio: Date;
  fechaEntrega: Date;
  estados: EstadoConcepto[];
  carpinterosAsignados: string[];
}

export interface Proyecto {
  id: string;
  nombre: string;
  numeroPiezas: number;
  responsable: string;
  conceptos: Concepto[];
  materiales: { materialId: string; cantidadRequerida: number }[];
  estado: EstadoProyecto;
  documentos: Documento[];
  fechaCreacion: Date;
  fechaEstimadaMateriales?: Date;
  observaciones?: string;
}

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  mensaje: string;
  proyectoId: string;
  fecha: Date;
  leida: boolean;
}

export interface RequisicionMaterial {
  id: string;
  proyectoId: string;
  materialId: string;
  cantidad: number;
  fechaSolicitud: Date;
  fechaEstimadaLlegada?: Date;
  recibido: boolean;
}
