import { CursorSparkles } from "@components/common/cursor-sparkles";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-violet-100 px-4">
      <CursorSparkles />
      {/* Background blur */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 h-112 w-md rounded-full bg-violet-300/30 blur-3xl" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/40 bg-background/90 p-8 shadow-2xl backdrop-blur-xl">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
