import { useState } from "react";
import { useERP } from "../context/ERPContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Plus, Package, Calendar, ArrowRight, AlertCircle } from "lucide-react";
import { Proyecto, Material, EstadoProduccion } from "../types";
import { toast } from "sonner";

const ESTADO_COLORS: Record<string, string> = {
  Creado: "#94a3b8",
  "Pendiente de materiales": "#f59e0b",
  "Listo para produccion": "#3b82f6",
  "En produccion": "#8b5cf6",
  "En pausa": "#ef4444",
  Terminado: "#10b981",
  Entregado: "#059669",
};

export function Compras() {
  const { proyectos, materiales, crearProyecto, actualizarProyecto, cambiarEstadoProyecto, crearRequisicion } = useERP();
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Proyecto | null>(null);
  const [showMaterialesDialog, setShowMaterialesDialog] = useState(false);

  // Form states
  const [nombre, setNombre] = useState("");
  const [numeroPiezas, setNumeroPiezas] = useState("");
  const [responsable, setResponsable] = useState("");
  const [descripcionConcepto, setDescripcionConcepto] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState<
    { materialId: string; cantidadRequerida: number }[]
  >([]);

  const handleCrearProyecto = () => {
    if (!nombre || !numeroPiezas || !responsable || !descripcionConcepto || !fechaEntrega) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    const nuevoProyecto: Omit<Proyecto, "id" | "fechaCreacion"> = {
      nombre,
      numeroPiezas: parseInt(numeroPiezas),
      responsable,
      conceptos: [
        {
          id: Date.now().toString(),
          descripcion: descripcionConcepto,
          fechaInicio: new Date(),
          fechaEntrega: new Date(fechaEntrega),
          estados: [
            { tipo: "Fabricacion" as EstadoProduccion, completado: false },
            { tipo: "Pintura" as EstadoProduccion, completado: false },
            { tipo: "Instalacion" as EstadoProduccion, completado: false },
            { tipo: "Barniz" as EstadoProduccion, completado: false },
          ],
          carpinterosAsignados: [],
        },
      ],
      materiales: materialesSeleccionados,
      estado: "Creado",
      documentos: [],
      observaciones,
    };

    crearProyecto(nuevoProyecto);
    toast.success("Proyecto creado exitosamente");
    resetForm();
    setIsCreatingProject(false);
  };

  const resetForm = () => {
    setNombre("");
    setNumeroPiezas("");
    setResponsable("");
    setDescripcionConcepto("");
    setFechaEntrega("");
    setObservaciones("");
    setMaterialesSeleccionados([]);
  };

  const agregarMaterial = (materialId: string) => {
    if (!materialesSeleccionados.find((m) => m.materialId === materialId)) {
      setMaterialesSeleccionados([
        ...materialesSeleccionados,
        { materialId, cantidadRequerida: 1 },
      ]);
    }
  };

  const actualizarCantidadMaterial = (materialId: string, cantidad: number) => {
    setMaterialesSeleccionados(
      materialesSeleccionados.map((m) =>
        m.materialId === materialId ? { ...m, cantidadRequerida: cantidad } : m
      )
    );
  };

  const eliminarMaterial = (materialId: string) => {
    setMaterialesSeleccionados(materialesSeleccionados.filter((m) => m.materialId !== materialId));
  };

  const validarMateriales = (proyecto: Proyecto) => {
    const materialesFaltantes: { materialId: string; cantidad: number }[] = [];

    proyecto.materiales.forEach((mat) => {
      const material = materiales.find((m) => m.id === mat.materialId);
      if (material && material.stockActual < mat.cantidadRequerida) {
        materialesFaltantes.push({
          materialId: mat.materialId,
          cantidad: mat.cantidadRequerida - material.stockActual,
        });
      }
    });

    return materialesFaltantes;
  };

  const solicitarMateriales = (proyectoId: string) => {
    const proyecto = proyectos.find((p) => p.id === proyectoId);
    if (!proyecto) return;

    const materialesFaltantes = validarMateriales(proyecto);

    if (materialesFaltantes.length > 0) {
      materialesFaltantes.forEach((mat) => {
        crearRequisicion({
          proyectoId,
          materialId: mat.materialId,
          cantidad: mat.cantidad,
          recibido: false,
        });
      });
      cambiarEstadoProyecto(proyectoId, "Pendiente de materiales");
      toast.success("Requisiciones de materiales creadas");
    } else {
      cambiarEstadoProyecto(proyectoId, "Listo para produccion");
      toast.success("Proyecto listo para producción");
    }
  };

  const proyectosCompras = proyectos.filter(
    (p) => p.estado === "Creado" || p.estado === "Pendiente de materiales"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Módulo de Compras</h2>
          <p className="text-gray-600 mt-1">
            Gestión de proyectos, materiales y requisiciones
          </p>
        </div>
        <Dialog open={isCreatingProject} onOpenChange={setIsCreatingProject}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              Crear Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Proyecto *</Label>
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Cocina Integral"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroPiezas">Número de Piezas *</Label>
                  <Input
                    id="numeroPiezas"
                    type="number"
                    value={numeroPiezas}
                    onChange={(e) => setNumeroPiezas(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsable">Responsable *</Label>
                <Input
                  id="responsable"
                  value={responsable}
                  onChange={(e) => setResponsable(e.target.value)}
                  placeholder="Nombre del responsable"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción del Concepto *</Label>
                <Textarea
                  id="descripcion"
                  value={descripcionConcepto}
                  onChange={(e) => setDescripcionConcepto(e.target.value)}
                  placeholder="Descripción detallada del proyecto"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaEntrega">Fecha de Entrega *</Label>
                <Input
                  id="fechaEntrega"
                  type="date"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Observaciones adicionales"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Materiales Requeridos</Label>
                <Dialog open={showMaterialesDialog} onOpenChange={setShowMaterialesDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Plus className="size-4 mr-2" />
                      Agregar Material
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Seleccionar Material</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      {materiales.map((material) => (
                        <Button
                          key={material.id}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            agregarMaterial(material.id);
                            setShowMaterialesDialog(false);
                          }}
                        >
                          {material.nombre} ({material.stockActual} {material.unidad} disponibles)
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                {materialesSeleccionados.length > 0 && (
                  <div className="border rounded-lg p-3 space-y-2">
                    {materialesSeleccionados.map((mat) => {
                      const material = materiales.find((m) => m.id === mat.materialId);
                      return (
                        <div key={mat.materialId} className="flex items-center gap-2">
                          <span className="flex-1 text-sm">{material?.nombre}</span>
                          <Input
                            type="number"
                            value={mat.cantidadRequerida}
                            onChange={(e) =>
                              actualizarCantidadMaterial(mat.materialId, parseInt(e.target.value))
                            }
                            className="w-20"
                            min="1"
                          />
                          <span className="text-sm text-gray-600">{material?.unidad}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => eliminarMaterial(mat.materialId)}
                          >
                            ×
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <Button onClick={handleCrearProyecto} className="w-full">
                Crear Proyecto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Proyectos en Compras */}
      <div className="grid grid-cols-1 gap-4">
        {proyectosCompras.map((proyecto) => {
          const materialesFaltantes = validarMateriales(proyecto);
          return (
            <Card key={proyecto.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{proyecto.nombre}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {proyecto.numeroPiezas} piezas · Responsable: {proyecto.responsable}
                    </p>
                  </div>
                  <Badge
                    style={{
                      backgroundColor: ESTADO_COLORS[proyecto.estado],
                      color: "white",
                    }}
                  >
                    {proyecto.estado}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Concepto</p>
                    <p className="text-sm text-gray-600">{proyecto.conceptos[0]?.descripcion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Fecha de Entrega</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="size-4" />
                      {new Date(proyecto.conceptos[0]?.fechaEntrega).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>

                {/* Materiales */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Materiales Requeridos ({proyecto.materiales.length})
                  </p>
                  <div className="space-y-1">
                    {proyecto.materiales.map((mat) => {
                      const material = materiales.find((m) => m.id === mat.materialId);
                      const faltante = materialesFaltantes.find((f) => f.materialId === mat.materialId);
                      return (
                        <div
                          key={mat.materialId}
                          className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                        >
                          <span>
                            {material?.nombre} - {mat.cantidadRequerida} {material?.unidad}
                          </span>
                          {faltante && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="size-3 mr-1" />
                              Falta {faltante.cantidad} {material?.unidad}
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  {proyecto.estado === "Creado" && (
                    <Button
                      onClick={() => solicitarMateriales(proyecto.id)}
                      className="gap-2"
                    >
                      <ArrowRight className="size-4" />
                      Validar Materiales
                    </Button>
                  )}
                  {proyecto.estado === "Pendiente de materiales" && materialesFaltantes.length === 0 && (
                    <Button
                      onClick={() => cambiarEstadoProyecto(proyecto.id, "Listo para produccion")}
                      className="gap-2"
                    >
                      <Package className="size-4" />
                      Enviar a Producción
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {proyectosCompras.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="size-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No hay proyectos en proceso de compras</p>
              <p className="text-sm text-gray-500 mt-1">
                Crea un nuevo proyecto para comenzar
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
