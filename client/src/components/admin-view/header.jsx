import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-card border-b border-white/5 shadow-md">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block border-primary/20 bg-transparent text-primary hover:bg-primary hover:text-primary-foreground transition-all">
        <AlignJustify className="w-5 h-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end items-center gap-6">
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Session Active</span>
          <span className="text-[11px] text-foreground font-medium">Administrator Portal</span>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="rounded-none border-white/10 text-foreground hover:bg-red-900 hover:text-white hover:border-red-900 transition-all text-[11px] uppercase tracking-widest px-6 h-10 gap-3"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
