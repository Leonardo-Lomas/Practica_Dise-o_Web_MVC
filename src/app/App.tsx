import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ERPProvider } from "./context/ERPContext";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <ERPProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </ERPProvider>
  );
}
