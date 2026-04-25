import { Toaster } from "sonner";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position="top-center" expand={true} richColors />
    </>
  );
}

export default App;
