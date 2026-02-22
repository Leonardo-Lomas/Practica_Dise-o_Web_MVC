import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Proyecto,
  Material,
  Carpintero,
  Notificacion,
  RequisicionMaterial,
  EstadoProyecto,
  TipoNotificacion,
} from "../types";

interface ERPContextType {
  proyectos: Proyecto[];
  materiales: Material[];
  carpinteros: Carpintero[];
  notificaciones: Notificacion[];
  requisiciones: RequisicionMaterial[];
  crearProyecto: (proyecto: Omit<Proyecto, "id" | "fechaCreacion">) => void;
  actualizarProyecto: (id: string, proyecto: Partial<Proyecto>) => void;
  cambiarEstadoProyecto: (id: string, estado: EstadoProyecto) => void;
  agregarMaterial: (material: Omit<Material, "id">) => void;
  actualizarMaterial: (id: string, material: Partial<Material>) => void;
  agregarCarpintero: (carpintero: Omit<Carpintero, "id">) => void;
  actualizarCarpintero: (id: string, carpintero: Partial<Carpintero>) => void;
  crearRequisicion: (requisicion: Omit<RequisicionMaterial, "id" | "fechaSolicitud">) => void;
  marcarRequisicionRecibida: (id: string) => void;
  crearNotificacion: (tipo: TipoNotificacion, mensaje: string, proyectoId: string) => void;
  marcarNotificacionLeida: (id: string) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

const STORAGE_KEYS = {
  proyectos: "erp_proyectos",
  materiales: "erp_materiales",
  carpinteros: "erp_carpinteros",
  notificaciones: "erp_notificaciones",
  requisiciones: "erp_requisiciones",
};

// Datos iniciales de ejemplo
const materialesIniciales: Material[] = [
  { id: "1", nombre: "Madera MDF 18mm", cantidad: 100, unidad: "m²", stockMinimo: 20, stockActual: 100, proveedor: "Maderera Central" },
  { id: "2", nombre: "Madera Pino", cantidad: 50, unidad: "m²", stockMinimo: 10, stockActual: 50, proveedor: "Maderera Central" },
  { id: "3", nombre: "Barniz transparente", cantidad: 30, unidad: "litros", stockMinimo: 5, stockActual: 30, proveedor: "Pinturas SA" },
  { id: "4", nombre: "Pintura blanca", cantidad: 25, unidad: "litros", stockMinimo: 5, stockActual: 25, proveedor: "Pinturas SA" },
  { id: "5", nombre: "Bisagras metálicas", cantidad: 200, unidad: "piezas", stockMinimo: 50, stockActual: 200, proveedor: "Ferreterías Unidos" },
  { id: "6", nombre: "Tornillos", cantidad: 500, unidad: "piezas", stockMinimo: 100, stockActual: 500, proveedor: "Ferreterías Unidos" },
];

const carpinterosIniciales: Carpintero[] = [
  { id: "1", nombre: "Juan Pérez", especialidad: "Carpintería general", disponible: true },
  { id: "2", nombre: "María García", especialidad: "Acabados y barniz", disponible: true },
  { id: "3", nombre: "Carlos López", especialidad: "Instalación", disponible: true },
  { id: "4", nombre: "Ana Martínez", especialidad: "Pintura", disponible: true },
];

export function ERPProvider({ children }: { children: ReactNode }) {
  const [proyectos, setProyectos] = useState<Proyecto[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.proyectos);
    return stored ? JSON.parse(stored) : [];
  });

  const [materiales, setMateriales] = useState<Material[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.materiales);
    return stored ? JSON.parse(stored) : materialesIniciales;
  });

  const [carpinteros, setCarpinteros] = useState<Carpintero[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.carpinteros);
    return stored ? JSON.parse(stored) : carpinterosIniciales;
  });

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.notificaciones);
    return stored ? JSON.parse(stored) : [];
  });

  const [requisiciones, setRequisiciones] = useState<RequisicionMaterial[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.requisiciones);
    return stored ? JSON.parse(stored) : [];
  });

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.proyectos, JSON.stringify(proyectos));
  }, [proyectos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.materiales, JSON.stringify(materiales));
  }, [materiales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.carpinteros, JSON.stringify(carpinteros));
  }, [carpinteros]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notificaciones, JSON.stringify(notificaciones));
  }, [notificaciones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.requisiciones, JSON.stringify(requisiciones));
  }, [requisiciones]);

  const crearProyecto = (proyecto: Omit<Proyecto, "id" | "fechaCreacion">) => {
    const nuevoProyecto: Proyecto = {
      ...proyecto,
      id: Date.now().toString(),
      fechaCreacion: new Date(),
    };
    setProyectos((prev) => [...prev, nuevoProyecto]);
    crearNotificacion("Cambio de estado", `Proyecto "${proyecto.nombre}" creado`, nuevoProyecto.id);
  };

  const actualizarProyecto = (id: string, proyecto: Partial<Proyecto>) => {
    setProyectos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...proyecto } : p))
    );
  };

  const cambiarEstadoProyecto = (id: string, estado: EstadoProyecto) => {
    const proyecto = proyectos.find((p) => p.id === id);
    if (proyecto) {
      actualizarProyecto(id, { estado });
      crearNotificacion("Cambio de estado", `Proyecto "${proyecto.nombre}" cambió a ${estado}`, id);
    }
  };

  const agregarMaterial = (material: Omit<Material, "id">) => {
    const nuevoMaterial: Material = {
      ...material,
      id: Date.now().toString(),
    };
    setMateriales((prev) => [...prev, nuevoMaterial]);
  };

  const actualizarMaterial = (id: string, material: Partial<Material>) => {
    setMateriales((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...material } : m))
    );
  };

  const agregarCarpintero = (carpintero: Omit<Carpintero, "id">) => {
    const nuevoCarpintero: Carpintero = {
      ...carpintero,
      id: Date.now().toString(),
    };
    setCarpinteros((prev) => [...prev, nuevoCarpintero]);
  };

  const actualizarCarpintero = (id: string, carpintero: Partial<Carpintero>) => {
    setCarpinteros((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...carpintero } : c))
    );
  };

  const crearRequisicion = (requisicion: Omit<RequisicionMaterial, "id" | "fechaSolicitud">) => {
    const nuevaRequisicion: RequisicionMaterial = {
      ...requisicion,
      id: Date.now().toString(),
      fechaSolicitud: new Date(),
      recibido: false,
    };
    setRequisiciones((prev) => [...prev, nuevaRequisicion]);

    const material = materiales.find((m) => m.id === requisicion.materialId);
    const proyecto = proyectos.find((p) => p.id === requisicion.proyectoId);
    if (material && proyecto) {
      crearNotificacion(
        "Material faltante",
        `Se requieren ${requisicion.cantidad} ${material.unidad} de ${material.nombre} para proyecto "${proyecto.nombre}"`,
        requisicion.proyectoId
      );
    }
  };

  const marcarRequisicionRecibida = (id: string) => {
    const requisicion = requisiciones.find((r) => r.id === id);
    if (requisicion) {
      setRequisiciones((prev) =>
        prev.map((r) => (r.id === id ? { ...r, recibido: true } : r))
      );

      const material = materiales.find((m) => m.id === requisicion.materialId);
      const proyecto = proyectos.find((p) => p.id === requisicion.proyectoId);

      if (material) {
        actualizarMaterial(material.id, {
          stockActual: material.stockActual + requisicion.cantidad,
        });
      }

      if (material && proyecto) {
        crearNotificacion(
          "Material recibido",
          `Recibidos ${requisicion.cantidad} ${material.unidad} de ${material.nombre} para proyecto "${proyecto.nombre}"`,
          requisicion.proyectoId
        );
      }
    }
  };

  const crearNotificacion = (tipo: TipoNotificacion, mensaje: string, proyectoId: string) => {
    const nuevaNotificacion: Notificacion = {
      id: Date.now().toString(),
      tipo,
      mensaje,
      proyectoId,
      fecha: new Date(),
      leida: false,
    };
    setNotificaciones((prev) => [nuevaNotificacion, ...prev]);
  };

  const marcarNotificacionLeida = (id: string) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  return (
    <ERPContext.Provider
      value={{
        proyectos,
        materiales,
        carpinteros,
        notificaciones,
        requisiciones,
        crearProyecto,
        actualizarProyecto,
        cambiarEstadoProyecto,
        agregarMaterial,
        actualizarMaterial,
        agregarCarpintero,
        actualizarCarpintero,
        crearRequisicion,
        marcarRequisicionRecibida,
        crearNotificacion,
        marcarNotificacionLeida,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
}

export function useERP() {
  const context = useContext(ERPContext);
  if (context === undefined) {
    throw new Error("useERP debe ser usado dentro de un ERPProvider");
  }
  return context;
}
