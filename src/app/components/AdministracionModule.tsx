import { 
  Plus, 
  Download,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  BarChart3
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const financialData = [
  { mes: "Ene", ingresos: 125000, gastos: 85000, utilidad: 40000 },
  { mes: "Feb", ingresos: 138000, gastos: 92000, utilidad: 46000 },
  { mes: "Mar", ingresos: 142000, gastos: 88000, utilidad: 54000 },
  { mes: "Abr", ingresos: 155000, gastos: 95000, utilidad: 60000 },
  { mes: "May", ingresos: 148000, gastos: 91000, utilidad: 57000 },
  { mes: "Jun", ingresos: 168000, gastos: 98000, utilidad: 70000 },
];

const reportsData = [
  { 
    nombre: "Reporte Mensual Febrero 2026",
    tipo: "Financiero",
    fecha: "2026-02-18",
    estado: "Generado",
    tamaño: "2.4 MB"
  },
  { 
    nombre: "Balance General Q1 2026",
    tipo: "Contable",
    fecha: "2026-02-15",
    estado: "En Proceso",
    tamaño: "-"
  },
  { 
    nombre: "Análisis de Costos Enero",
    tipo: "Operativo",
    fecha: "2026-02-10",
    estado: "Generado",
    tamaño: "1.8 MB"
  },
  { 
    nombre: "Estado de Resultados",
    tipo: "Financiero",
    fecha: "2026-02-05",
    estado: "Generado",
    tamaño: "3.1 MB"
  },
];

const employeesData = [
  { 
    nombre: "María González",
    puesto: "Gerente de Producción",
    departamento: "Producción",
    estado: "Activo"
  },
  { 
    nombre: "Juan Pérez",
    puesto: "Jefe de Compras",
    departamento: "Compras",
    estado: "Activo"
  },
  { 
    nombre: "Ana Martínez",
    puesto: "Contadora",
    departamento: "Administración",
    estado: "Activo"
  },
  { 
    nombre: "Carlos Rodríguez",
    puesto: "Supervisor de Línea",
    departamento: "Producción",
    estado: "Vacaciones"
  },
];

const budgetData = [
  { categoria: "Personal", presupuesto: 45000, gastado: 42300 },
  { categoria: "Materiales", presupuesto: 35000, gastado: 33800 },
  { categoria: "Servicios", presupuesto: 15000, gastado: 12500 },
  { categoria: "Mantenimiento", presupuesto: 8000, gastado: 7200 },
];

export default function AdministracionModule() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Generado":
        return "bg-green-100 text-green-800";
      case "En Proceso":
        return "bg-yellow-100 text-yellow-800";
      case "Activo":
        return "bg-green-100 text-green-800";
      case "Vacaciones":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Módulo de Administración</h2>
          <p className="text-sm text-gray-500 mt-1">Gestión financiera, reportes y recursos humanos</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Generar Reporte
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$168,000</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600 font-medium">13.5%</span>
            <span className="text-gray-500 ml-2">vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Gastos del Mes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$98,000</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Empleados Activos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">142</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reportes Generados</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">28</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen Financiero
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={financialData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="ingresos"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="gastos"
              stackId="2"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="utilidad"
              stackId="3"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Budget and Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Presupuesto Mensual
          </h3>
          <div className="space-y-4">
            {budgetData.map((item, index) => {
              const percentage = (item.gastado / item.presupuesto) * 100;
              const isOverBudget = percentage > 90;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {item.categoria}
                    </span>
                    <span className="text-sm text-gray-500">
                      ${item.gastado.toLocaleString()} / ${item.presupuesto.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOverBudget ? "bg-red-600" : "bg-blue-600"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Reportes Recientes
            </h3>
            <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
              <Calendar className="w-4 h-4 mr-1" />
              Ver todos
            </button>
          </div>
          <div className="space-y-3">
            {reportsData.map((report, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {report.nombre}
                    </h4>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{report.tipo}</span>
                      <span>•</span>
                      <span>{report.fecha}</span>
                      {report.tamaño !== "-" && (
                        <>
                          <span>•</span>
                          <span>{report.tamaño}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        report.estado
                      )}`}
                    >
                      {report.estado}
                    </span>
                    {report.estado === "Generado" && (
                      <button className="text-blue-600 hover:text-blue-800">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Personal - Vista Rápida
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puesto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeesData.map((employee, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {employee.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {employee.puesto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {employee.departamento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        employee.estado
                      )}`}
                    >
                      {employee.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Ver perfil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
