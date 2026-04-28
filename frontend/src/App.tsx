import { Toaster } from "sonner";
import AppRoutes from "./routes/AppRoutes";
import { useAppSelector } from "@app/hooks";
import Loading from "@components/ui/loading";
import { bootstrapAuth } from "@app/bootstrap";
import { useEffect } from "react";

function App() {
  const isInitialized = useAppSelector((state) => state.auth.isAuthInitialized);

  useEffect(() => {
    bootstrapAuth();
  }, []);

  if (!isInitialized) {
    return <Loading />;
  }

  return (
    <>
      <AppRoutes />
      <Toaster position="top-center" expand={true} richColors />
    </>
  );
}

export default App;
