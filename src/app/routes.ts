import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Compras } from "./pages/Compras";
import { Produccion } from "./pages/Produccion";
import { Administracion } from "./pages/Administracion";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "compras", Component: Compras },
      { path: "produccion", Component: Produccion },
      { path: "administracion", Component: Administracion },
    ],
  },
]);
