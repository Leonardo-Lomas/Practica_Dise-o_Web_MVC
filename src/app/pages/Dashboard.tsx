import { useERP } from "../context/ERPContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Package, Users, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";

const ESTADO_COLORS: Record<string, string> = {
  Creado: "#94a3b8",
  "Pendiente de materiales": "#f59e0b",
  "Listo para produccion": "#3b82f6",
  "En produccion": "#8b5cf6",
  "En pausa": "#ef4444",
  Terminado: "#10b981",
  Entregado: "#059669",
};

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#94a3b8", "#059669"];

export function Dashboard() {
  const { proyectos, materiales, carpinteros, notificaciones } = useERP();

  // Estadísticas generales
  const totalProyectos = proyectos.length;
  const proyectosActivos = proyectos.filter(
    (p) => p.estado === "En produccion" || p.estado === "Listo para produccion"
  ).length;
  const materialesBajoStock = materiales.filter(
    (m) => m.stockActual < m.stockMinimo
  ).length;
  const carpinterosDisponibles = carpinteros.filter((c) => c.disponible).length;

  // Distribución de proyectos por estado
  const estadosData = Object.keys(ESTADO_COLORS).map((estado) => ({
    name: estado,
    value: proyectos.filter((p) => p.estado === estado).length,
  })).filter(d => d.value > 0);

  // Proyectos por mes (últimos 6 meses)
  const proyectosPorMes = Array.from({ length: 6 }, (_, i) => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - (5 - i));
    const mes = fecha.toLocaleDateString("es-ES", { month: "short" });
    const proyectosMes = proyectos.filter((p) => {
      const fechaProyecto = new Date(p.fechaCreacion);
      return (
        fechaProyecto.getMonth() === fecha.getMonth() &&
        fechaProyecto.getFullYear() === fecha.getFullYear()
      );
    }).length;
    return { mes, proyectos: proyectosMes };
  });

  // Notificaciones recientes
  const notificacionesRecientes = notificaciones.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Vista general del sistema ERP</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Proyectos
            </CardTitle>
            <Package className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProyectos}</div>
            <p className="text-xs text-gray-500 mt-1">
              {proyectosActivos} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Carpinteros Disponibles
            </CardTitle>
            <Users className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carpinterosDisponibles}</div>
            <p className="text-xs text-gray-500 mt-1">
              de {carpinteros.length} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Materiales Bajo Stock
            </CardTitle>
            <AlertTriangle className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materialesBajoStock}</div>
            <p className="text-xs text-gray-500 mt-1">
              de {materiales.length} materiales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Notificaciones
            </CardTitle>
            <CheckCircle className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notificaciones.filter((n) => !n.leida).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">sin leer</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Proyectos por Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={proyectosPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="proyectos" fill="#3b82f6" name="Proyectos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5" />
              Distribución por Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={estadosData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {estadosData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Proyectos Recientes y Notificaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Proyectos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proyectos.slice(0, 5).map((proyecto) => (
                <div key={proyecto.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{proyecto.nombre}</p>
                    <p className="text-sm text-gray-500">
                      Responsable: {proyecto.responsable}
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
              ))}
              {proyectos.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay proyectos creados
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificaciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notificacionesRecientes.map((notif) => (
                <div key={notif.id} className="border-l-2 border-blue-600 pl-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{notif.tipo}</p>
                    {!notif.leida && (
                      <Badge variant="secondary" className="text-xs">
                        Nueva
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notif.mensaje}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notif.fecha).toLocaleDateString("es-ES")}
                  </p>
                </div>
              ))}
              {notificaciones.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay notificaciones
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Materiales Bajo Stock */}
      {materialesBajoStock > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-orange-600" />
              Alerta: Materiales Bajo Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {materiales
                .filter((m) => m.stockActual < m.stockMinimo)
                .map((material) => (
                  <div key={material.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{material.nombre}</span>
                      <span className="text-sm text-gray-600">
                        {material.stockActual} / {material.stockMinimo} {material.unidad}
                      </span>
                    </div>
                    <Progress
                      value={(material.stockActual / material.stockMinimo) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
