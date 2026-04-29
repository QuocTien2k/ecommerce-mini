import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

type FlashState = {
  message?: string;
  type?: "success" | "error" | "info";
};

export const useFlashMessage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasShownRef = useRef(false);

  useEffect(() => {
    const state = location.state as FlashState | null;

    if (state?.message && !hasShownRef.current) {
      hasShownRef.current = true;

      toast[state.type || "success"](state.message);

      navigate(location.pathname, { replace: true }); //clear tránh duplicate
    }
  }, [location.state, navigate]);
};
