import { Outlet } from "react-router-dom";
import banner from "../../assets/j_banner.jpg";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center justify-center w-1/2 relative overflow-hidden">
        <img 
          src={banner} 
          alt="J Creation Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-10 bg-black/40 backdrop-blur-xl p-16 text-center text-primary-foreground border border-white/5 gold-glow">
          <h1 className="text-6xl font-extrabold tracking-[0.3em] uppercase mb-4">
            J Creation
          </h1>
          <div className="h-px w-24 bg-primary mx-auto mb-6" />
          <p className="text-[12px] uppercase tracking-[0.4em] font-bold opacity-90">
            The Anthology of Precision
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
