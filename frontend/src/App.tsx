import { Toaster } from "sonner";
import AppRoutes from "./routes/AppRoutes";
import { useAppSelector } from "@app/hooks";
import { selectIsLoading } from "@features/loading/loading.slice";
import Loading from "@components/ui/loading";

function App() {
  const isLoading = useAppSelector(selectIsLoading);
  return (
    <>
      <AppRoutes />
      <Toaster position="top-center" expand={true} richColors />
      {isLoading && <Loading />}
    </>
  );
}

export default App;
