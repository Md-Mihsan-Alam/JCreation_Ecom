import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-background overflow-hidden">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full pt-[64px]">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
