import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import ComprasModule from "./components/ComprasModule";
import ProduccionModule from "./components/ProduccionModule";
import AdministracionModule from "./components/AdministracionModule";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "compras", Component: ComprasModule },
      { path: "produccion", Component: ProduccionModule },
      { path: "administracion", Component: AdministracionModule },
    ],
  },
]);
