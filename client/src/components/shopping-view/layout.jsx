import { Outlet, useLocation } from "react-router-dom";
import ShoppingHeader from "./header";
import ShoppingFooter from "./footer";

function ShoppingLayout() {
  const location = useLocation();
  return (
    <div className="flex flex-col bg-background overflow-hidden relative min-h-screen">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full pt-[64px] flex-grow">
        <Outlet />
      </main>
      {!location.pathname.includes('/collection/') && <ShoppingFooter />}
    </div>
  );
}

export default ShoppingLayout;
