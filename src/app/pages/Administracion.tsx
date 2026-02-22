import { useState } from "react";
import { useERP } from "../context/ERPContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import {
  Plus,
  Settings,
  FileText,
  Package,
  Users,
  Download,
  Calendar,
  TrendingUp,
} from "lucide-react";
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

export function Administracion() {
  const {
    proyectos,
    materiales,
    carpinteros,
    agregarMaterial,
    actualizarMaterial,
    agregarCarpintero,
    actualizarCarpintero,
  } = useERP();

  const [showAddMaterialDialog, setShowAddMaterialDialog] = useState(false);
  const [showAddCarpinteroDialog, setShowAddCarpinteroDialog] = useState(false);

  // Form states para material
  const [nuevoMaterialNombre, setNuevoMaterialNombre] = useState("");
  const [nuevoMaterialUnidad, setNuevoMaterialUnidad] = useState("");
  const [nuevoMaterialStock, setNuevoMaterialStock] = useState("");
  const [nuevoMaterialStockMin, setNuevoMaterialStockMin] = useState("");
  const [nuevoMaterialProveedor, setNuevoMaterialProveedor] = useState("");

  // Form states para carpintero
  const [nuevoCarpinteroNombre, setNuevoCarpinteroNombre] = useState("");
  const [nuevoCarpinteroEspecialidad, setNuevoCarpinteroEspecialidad] = useState("");

  const handleAgregarMaterial = () => {
    if (!nuevoMaterialNombre || !nuevoMaterialUnidad || !nuevoMaterialStock || !nuevoMaterialStockMin) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    agregarMaterial({
      nombre: nuevoMaterialNombre,
      unidad: nuevoMaterialUnidad,
      stockActual: parseFloat(nuevoMaterialStock),
      stockMinimo: parseFloat(nuevoMaterialStockMin),
      cantidad: parseFloat(nuevoMaterialStock),
      proveedor: nuevoMaterialProveedor,
    });

    toast.success("Material agregado exitosamente");
    setNuevoMaterialNombre("");
    setNuevoMaterialUnidad("");
    setNuevoMaterialStock("");
    setNuevoMaterialStockMin("");
    setNuevoMaterialProveedor("");
    setShowAddMaterialDialog(false);
  };

  const handleAgregarCarpintero = () => {
    if (!nuevoCarpinteroNombre || !nuevoCarpinteroEspecialidad) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    agregarCarpintero({
      nombre: nuevoCarpinteroNombre,
      especialidad: nuevoCarpinteroEspecialidad,
      disponible: true,
    });

    toast.success("Carpintero agregado exitosamente");
    setNuevoCarpinteroNombre("");
    setNuevoCarpinteroEspecialidad("");
    setShowAddCarpinteroDialog(false);
  };

  const generarReporteSemanal = () => {
    const fechaActual = new Date();
    const semanaAtras = new Date(fechaActual.getTime() - 7 * 24 * 60 * 60 * 1000);

    const proyectosSemanales = proyectos.filter(
      (p) => new Date(p.fechaCreacion) >= semanaAtras
    );

    const reporte = {
      fecha: fechaActual.toLocaleDateString("es-ES"),
      totalProyectos: proyectos.length,
      proyectosNuevos: proyectosSemanales.length,
      enProduccion: proyectos.filter((p) => p.estado === "En produccion").length,
      terminados: proyectos.filter((p) => p.estado === "Terminado").length,
      entregados: proyectos.filter((p) => p.estado === "Entregado").length,
      carpinterosActivos: carpinteros.filter((c) => !c.disponible).length,
      materialesBajoStock: materiales.filter((m) => m.stockActual < m.stockMinimo).length,
    };

    console.log("Reporte Semanal:", reporte);
    toast.success("Reporte generado (ver consola)");
  };

  const generarReporteCarpinteros = () => {
    const reporteCarpinteros = carpinteros.map((carpintero) => {
      const proyectosAsignados = proyectos.filter((p) =>
        p.conceptos[0]?.carpinterosAsignados.includes(carpintero.id)
      );

      return {
        nombre: carpintero.nombre,
        especialidad: carpintero.especialidad,
        proyectosActivos: proyectosAsignados.length,
        disponible: carpintero.disponible,
      };
    });

    console.log("Reporte de Carpinteros:", reporteCarpinteros);
    toast.success("Reporte de carpinteros generado (ver consola)");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Módulo de Administración</h2>
        <p className="text-gray-600 mt-1">
          Gestión de catálogos, vista global y reportes
        </p>
      </div>

      <Tabs defaultValue="proyectos" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full lg:w-auto">
          <TabsTrigger value="proyectos">
            <Package className="size-4 mr-2" />
            Proyectos
          </TabsTrigger>
          <TabsTrigger value="materiales">
            <Settings className="size-4 mr-2" />
            Materiales
          </TabsTrigger>
          <TabsTrigger value="carpinteros">
            <Users className="size-4 mr-2" />
            Carpinteros
          </TabsTrigger>
          <TabsTrigger value="reportes">
            <FileText className="size-4 mr-2" />
            Reportes
          </TabsTrigger>
        </TabsList>

        {/* Vista Global de Proyectos */}
        <TabsContent value="proyectos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vista Global de Proyectos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Piezas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead>Progreso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proyectos.map((proyecto) => {
                    const estados = proyecto.conceptos[0]?.estados || [];
                    const completados = estados.filter((e) => e.completado).length;
                    const progreso = estados.length > 0 ? (completados / estados.length) * 100 : 0;

                    return (
                      <TableRow key={proyecto.id}>
                        <TableCell className="font-medium">{proyecto.nombre}</TableCell>
                        <TableCell>{proyecto.responsable}</TableCell>
                        <TableCell>{proyecto.numeroPiezas}</TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor: ESTADO_COLORS[proyecto.estado],
                              color: "white",
                            }}
                          >
                            {proyecto.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(proyecto.fechaCreacion).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${progreso}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{progreso.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {proyectos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        No hay proyectos registrados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Catálogo de Materiales */}
        <TabsContent value="materiales" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Catálogo de Materiales</h3>
            <Dialog open={showAddMaterialDialog} onOpenChange={setShowAddMaterialDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="size-4" />
                  Agregar Material
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Material</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mat-nombre">Nombre *</Label>
                    <Input
                      id="mat-nombre"
                      value={nuevoMaterialNombre}
                      onChange={(e) => setNuevoMaterialNombre(e.target.value)}
                      placeholder="Ej: Madera MDF 18mm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mat-unidad">Unidad *</Label>
                      <Input
                        id="mat-unidad"
                        value={nuevoMaterialUnidad}
                        onChange={(e) => setNuevoMaterialUnidad(e.target.value)}
                        placeholder="Ej: m², litros, piezas"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mat-stock">Stock Actual *</Label>
                      <Input
                        id="mat-stock"
                        type="number"
                        value={nuevoMaterialStock}
                        onChange={(e) => setNuevoMaterialStock(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mat-stock-min">Stock Mínimo *</Label>
                    <Input
                      id="mat-stock-min"
                      type="number"
                      value={nuevoMaterialStockMin}
                      onChange={(e) => setNuevoMaterialStockMin(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mat-proveedor">Proveedor</Label>
                    <Input
                      id="mat-proveedor"
                      value={nuevoMaterialProveedor}
                      onChange={(e) => setNuevoMaterialProveedor(e.target.value)}
                      placeholder="Nombre del proveedor"
                    />
                  </div>
                  <Button onClick={handleAgregarMaterial} className="w-full">
                    Agregar Material
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Stock Actual</TableHead>
                    <TableHead>Stock Mínimo</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materiales.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.nombre}</TableCell>
                      <TableCell>{material.stockActual}</TableCell>
                      <TableCell>{material.stockMinimo}</TableCell>
                      <TableCell>{material.unidad}</TableCell>
                      <TableCell>{material.proveedor || "-"}</TableCell>
                      <TableCell>
                        {material.stockActual < material.stockMinimo ? (
                          <Badge variant="destructive">Bajo Stock</Badge>
                        ) : (
                          <Badge variant="secondary">OK</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Catálogo de Carpinteros */}
        <TabsContent value="carpinteros" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Catálogo de Carpinteros</h3>
            <Dialog open={showAddCarpinteroDialog} onOpenChange={setShowAddCarpinteroDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="size-4" />
                  Agregar Carpintero
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Carpintero</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="carp-nombre">Nombre *</Label>
                    <Input
                      id="carp-nombre"
                      value={nuevoCarpinteroNombre}
                      onChange={(e) => setNuevoCarpinteroNombre(e.target.value)}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carp-especialidad">Especialidad *</Label>
                    <Input
                      id="carp-especialidad"
                      value={nuevoCarpinteroEspecialidad}
                      onChange={(e) => setNuevoCarpinteroEspecialidad(e.target.value)}
                      placeholder="Ej: Carpintería general, Acabados"
                    />
                  </div>
                  <Button onClick={handleAgregarCarpintero} className="w-full">
                    Agregar Carpintero
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Proyectos Asignados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carpinteros.map((carpintero) => {
                    const proyectosAsignados = proyectos.filter((p) =>
                      p.conceptos[0]?.carpinterosAsignados.includes(carpintero.id)
                    );

                    return (
                      <TableRow key={carpintero.id}>
                        <TableCell className="font-medium">{carpintero.nombre}</TableCell>
                        <TableCell>{carpintero.especialidad}</TableCell>
                        <TableCell>
                          {carpintero.disponible ? (
                            <Badge variant="secondary">Disponible</Badge>
                          ) : (
                            <Badge>En Proyecto</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {proyectosAsignados.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {proyectosAsignados.map((p) => (
                                <Badge key={p.id} variant="outline" className="text-xs">
                                  {p.nombre}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reportes */}
        <TabsContent value="reportes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-5" />
                  Reporte Semanal de Proyectos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Genera un reporte con el avance de todos los proyectos durante la última semana
                </p>
                <Button onClick={generarReporteSemanal} className="w-full gap-2">
                  <Download className="size-4" />
                  Generar Reporte Semanal
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5" />
                  Reporte de Trabajo por Carpintero
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Genera un reporte del trabajo asignado a cada carpintero durante la semana
                </p>
                <Button onClick={generarReporteCarpinteros} className="w-full gap-2">
                  <Download className="size-4" />
                  Generar Reporte de Carpinteros
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resumen de Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5" />
                Estadísticas Generales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{proyectos.length}</p>
                  <p className="text-sm text-gray-600">Total Proyectos</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {proyectos.filter((p) => p.estado === "En produccion").length}
                  </p>
                  <p className="text-sm text-gray-600">En Producción</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {proyectos.filter((p) => p.estado === "Terminado" || p.estado === "Entregado").length}
                  </p>
                  <p className="text-sm text-gray-600">Completados</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {materiales.filter((m) => m.stockActual < m.stockMinimo).length}
                  </p>
                  <p className="text-sm text-gray-600">Materiales Bajo Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
