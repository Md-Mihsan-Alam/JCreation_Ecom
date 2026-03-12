import { Outlet } from "react-router-dom";
import banner from "../../assets/j_banner.jpg";

function AuthLayout() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      <div className="flex items-center justify-center w-full lg:w-1/2 relative h-[250px] sm:h-[350px] lg:h-screen overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
        <img 
          src={banner} 
          alt="J Creation Banner" 
          className="absolute inset-0 w-full h-full object-cover brightness-50 lg:opacity-80"
        />
        <div className="relative z-10 bg-black/40 backdrop-blur-md lg:backdrop-blur-xl p-8 sm:p-12 lg:p-16 text-center text-primary-foreground border border-white/5 gold-glow mx-4">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 lg:mb-4">
            J Creation
          </h1>
          <div className="h-px w-16 sm:w-24 bg-primary mx-auto mb-4 lg:mb-6" />
          <p className="text-[9px] sm:text-[10px] lg:text-[12px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-bold opacity-90">
            The Anthology of Precision
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-8 sm:py-12 lg:px-8">
        <div className="w-full max-w-md">
           <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
