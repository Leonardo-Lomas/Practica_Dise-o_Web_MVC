import { useState } from "react";
import { useERP } from "../context/ERPContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Hammer, UserPlus, PlayCircle, PauseCircle, CheckCircle, Calendar, AlertCircle } from "lucide-react";
import { Proyecto, EstadoProduccion } from "../types";
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

export function Produccion() {
  const {
    proyectos,
    carpinteros,
    materiales,
    actualizarProyecto,
    cambiarEstadoProyecto,
    actualizarCarpintero,
    crearRequisicion,
  } = useERP();
  const [selectedProject, setSelectedProject] = useState<Proyecto | null>(null);
  const [showCarpinterosDialog, setShowCarpinterosDialog] = useState(false);

  const proyectosProduccion = proyectos.filter(
    (p) =>
      p.estado === "Listo para produccion" ||
      p.estado === "En produccion" ||
      p.estado === "En pausa" ||
      p.estado === "Terminado"
  );

  const asignarCarpintero = (proyectoId: string, carpinteroId: string) => {
    const proyecto = proyectos.find((p) => p.id === proyectoId);
    if (!proyecto) return;

    const conceptoActualizado = {
      ...proyecto.conceptos[0],
      carpinterosAsignados: [
        ...proyecto.conceptos[0].carpinterosAsignados,
        carpinteroId,
      ],
    };

    actualizarProyecto(proyectoId, {
      conceptos: [conceptoActualizado, ...proyecto.conceptos.slice(1)],
    });

    actualizarCarpintero(carpinteroId, { disponible: false });
    toast.success("Carpintero asignado al proyecto");
    setShowCarpinterosDialog(false);
  };

  const desasignarCarpintero = (proyectoId: string, carpinteroId: string) => {
    const proyecto = proyectos.find((p) => p.id === proyectoId);
    if (!proyecto) return;

    const conceptoActualizado = {
      ...proyecto.conceptos[0],
      carpinterosAsignados: proyecto.conceptos[0].carpinterosAsignados.filter(
        (id) => id !== carpinteroId
      ),
    };

    actualizarProyecto(proyectoId, {
      conceptos: [conceptoActualizado, ...proyecto.conceptos.slice(1)],
    });

    actualizarCarpintero(carpinteroId, { disponible: true });
    toast.success("Carpintero desasignado del proyecto");
  };

  const iniciarProduccion = (proyectoId: string) => {
    cambiarEstadoProyecto(proyectoId, "En produccion");
    toast.success("Producción iniciada");
  };

  const pausarProduccion = (proyectoId: string) => {
    cambiarEstadoProyecto(proyectoId, "En pausa");
    toast.warning("Producción pausada");
  };

  const reanudarProduccion = (proyectoId: string) => {
    cambiarEstadoProyecto(proyectoId, "En produccion");
    toast.success("Producción reanudada");
  };

  const actualizarEstadoConcepto = (
    proyectoId: string,
    estadoTipo: EstadoProduccion,
    completado: boolean
  ) => {
    const proyecto = proyectos.find((p) => p.id === proyectoId);
    if (!proyecto) return;

    const estadosActualizados = proyecto.conceptos[0].estados.map((estado) =>
      estado.tipo === estadoTipo
        ? {
            ...estado,
            completado,
            fechaInicio: !estado.fechaInicio && completado ? new Date() : estado.fechaInicio,
            fechaFin: completado ? new Date() : undefined,
          }
        : estado
    );

    const conceptoActualizado = {
      ...proyecto.conceptos[0],
      estados: estadosActualizados,
    };

    actualizarProyecto(proyectoId, {
      conceptos: [conceptoActualizado, ...proyecto.conceptos.slice(1)],
    });

    // Si todos los estados están completados, marcar como terminado
    const todosCompletados = estadosActualizados.every((e) => e.completado);
    if (todosCompletados) {
      cambiarEstadoProyecto(proyectoId, "Terminado");
      toast.success("¡Proyecto completado!");
    }
  };

  const solicitarMaterialFaltante = (proyectoId: string) => {
    setSelectedProject(proyectos.find((p) => p.id === proyectoId) || null);
    // En un sistema real, aquí se abriría un diálogo para seleccionar materiales
    toast.info("Funcionalidad de requisición de materiales");
  };

  const calcularProgreso = (proyecto: Proyecto) => {
    const estados = proyecto.conceptos[0]?.estados || [];
    const completados = estados.filter((e) => e.completado).length;
    return (completados / estados.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Módulo de Producción</h2>
          <p className="text-gray-600 mt-1">
            Gestión de proyectos en producción y asignación de carpinteros
          </p>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Listos para Producción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proyectos.filter((p) => p.estado === "Listo para produccion").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En Producción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {proyectos.filter((p) => p.estado === "En produccion").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En Pausa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {proyectos.filter((p) => p.estado === "En pausa").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Terminados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {proyectos.filter((p) => p.estado === "Terminado").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Proyectos */}
      <div className="grid grid-cols-1 gap-4">
        {proyectosProduccion.map((proyecto) => {
          const progreso = calcularProgreso(proyecto);
          const concepto = proyecto.conceptos[0];
          const carpinterosAsignados = concepto?.carpinterosAsignados || [];

          return (
            <Card key={proyecto.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {proyecto.nombre}
                      {proyecto.estado === "En produccion" && (
                        <Hammer className="size-5 text-purple-600 animate-pulse" />
                      )}
                    </CardTitle>
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
                {/* Progreso */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progreso General</span>
                    <span className="text-sm font-bold text-gray-900">{progreso.toFixed(0)}%</span>
                  </div>
                  <Progress value={progreso} className="h-2" />
                </div>

                {/* Estados de Producción */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Estados de Producción</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {concepto?.estados.map((estado) => (
                      <div
                        key={estado.tipo}
                        className={`border rounded-lg p-3 ${
                          estado.completado ? "bg-green-50 border-green-300" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{estado.tipo}</span>
                          {estado.completado && <CheckCircle className="size-4 text-green-600" />}
                        </div>
                        <Checkbox
                          id={`${proyecto.id}-${estado.tipo}`}
                          checked={estado.completado}
                          onCheckedChange={(checked) =>
                            actualizarEstadoConcepto(proyecto.id, estado.tipo, checked as boolean)
                          }
                          disabled={proyecto.estado !== "En produccion"}
                        />
                        <Label
                          htmlFor={`${proyecto.id}-${estado.tipo}`}
                          className="text-xs text-gray-600 ml-2 cursor-pointer"
                        >
                          {estado.completado ? "Completado" : "Pendiente"}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carpinteros Asignados */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      Carpinteros Asignados ({carpinterosAsignados.length})
                    </p>
                    {proyecto.estado !== "Terminado" && (
                      <Dialog
                        open={showCarpinterosDialog && selectedProject?.id === proyecto.id}
                        onOpenChange={(open) => {
                          setShowCarpinterosDialog(open);
                          if (open) setSelectedProject(proyecto);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            <UserPlus className="size-4" />
                            Asignar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Asignar Carpintero</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2">
                            {carpinteros
                              .filter((c) => c.disponible || carpinterosAsignados.includes(c.id))
                              .map((carpintero) => {
                                const yaAsignado = carpinterosAsignados.includes(carpintero.id);
                                return (
                                  <div
                                    key={carpintero.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                  >
                                    <div>
                                      <p className="font-medium">{carpintero.nombre}</p>
                                      <p className="text-sm text-gray-600">{carpintero.especialidad}</p>
                                    </div>
                                    {yaAsignado ? (
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => desasignarCarpintero(proyecto.id, carpintero.id)}
                                      >
                                        Desasignar
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => asignarCarpintero(proyecto.id, carpintero.id)}
                                      >
                                        Asignar
                                      </Button>
                                    )}
                                  </div>
                                );
                              })}
                            {carpinteros.filter((c) => c.disponible).length === 0 &&
                              carpinterosAsignados.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">
                                  No hay carpinteros disponibles
                                </p>
                              )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  {carpinterosAsignados.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {carpinterosAsignados.map((carpinteroId) => {
                        const carpintero = carpinteros.find((c) => c.id === carpinteroId);
                        return (
                          <Badge key={carpinteroId} variant="secondary">
                            {carpintero?.nombre}
                          </Badge>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No hay carpinteros asignados</p>
                  )}
                </div>

                {/* Fecha de Entrega */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="size-4" />
                  <span>
                    Fecha de entrega:{" "}
                    {new Date(concepto?.fechaEntrega).toLocaleDateString("es-ES")}
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 flex-wrap">
                  {proyecto.estado === "Listo para produccion" && (
                    <Button onClick={() => iniciarProduccion(proyecto.id)} className="gap-2">
                      <PlayCircle className="size-4" />
                      Iniciar Producción
                    </Button>
                  )}
                  {proyecto.estado === "En produccion" && (
                    <Button
                      onClick={() => pausarProduccion(proyecto.id)}
                      variant="destructive"
                      className="gap-2"
                    >
                      <PauseCircle className="size-4" />
                      Pausar
                    </Button>
                  )}
                  {proyecto.estado === "En pausa" && (
                    <Button onClick={() => reanudarProduccion(proyecto.id)} className="gap-2">
                      <PlayCircle className="size-4" />
                      Reanudar
                    </Button>
                  )}
                  {proyecto.estado !== "Terminado" && (
                    <Button
                      variant="outline"
                      onClick={() => solicitarMaterialFaltante(proyecto.id)}
                      className="gap-2"
                    >
                      <AlertCircle className="size-4" />
                      Solicitar Material Faltante
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {proyectosProduccion.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Hammer className="size-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No hay proyectos en producción</p>
              <p className="text-sm text-gray-500 mt-1">
                Los proyectos listos para producción aparecerán aquí
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
