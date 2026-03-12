import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, Search, User, Heart, ChevronRight } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import CollectionsMegaMenu, { FootwearMegaMenu } from "./mega-menu";
import logo from "@/assets/j_creation.png";

function MenuItems({ setOpenMenu }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("product") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div 
          key={menuItem.id} 
          onMouseEnter={() => {
            if (menuItem.id === 'men') setOpenMenu('men');
            else if (menuItem.id === 'footwear') setOpenMenu('footwear');
            else setOpenMenu(null);
          }}
          className="relative group"
        >
          <Label
            onClick={() => handleNavigate(menuItem)}
            className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors uppercase tracking-widest text-[11px] flex items-center gap-1 text-foreground/90"
          >
            {menuItem.label}
            {(menuItem.id === 'men' || menuItem.id === 'footwear') && (
              <span className="text-[10px] opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all">▼</span>
            )}
          </Label>
        </div>
      ))}
    </nav>
  );
}

function HeaderRightContent({ setOpenMenu, isMobile = false, setIsMobileMenuOpen, setOpenCartSheet }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  }

  function handleNavigation(path) {
    navigate(path);
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch, user]);

  return (
    <div className={`flex ${isMobile ? "flex-col gap-2 w-full" : "lg:items-center lg:flex-row gap-4"}`} onMouseEnter={() => !isMobile && setOpenMenu(null)}>
      {/* Search Toggle */}
      {!isMobile ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="text-foreground/80 hover:text-primary hover:bg-white/5"
        >
          <Search className="w-5 h-5" />
          <span className="sr-only">Search</span>
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="justify-start rounded-none h-12 uppercase tracking-[0.2em] text-[11px] font-bold border-b border-white/5"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <Search className="w-4 h-4 mr-3 text-primary" />
          Search Gallery
        </Button>
      )}

      {/* Wishlist Link */}
      {!isMobile ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/shop/wishlist")}
          className="text-foreground/80 hover:text-primary hover:bg-white/5"
        >
          <Heart className="w-5 h-5" />
          <span className="sr-only">Wishlist</span>
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="justify-start rounded-none h-12 uppercase tracking-[0.2em] text-[11px] font-bold border-b border-white/5"
          onClick={() => handleNavigation("/shop/wishlist")}
        >
          <Heart className="w-4 h-4 mr-3 text-primary" />
          My Favorites
        </Button>
      )}

      {/* Search Overlay/Drawer */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 top-16 z-40 bg-black/40"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      <div 
        className={`fixed top-16 left-0 w-full bg-popover/98 backdrop-blur-2xl z-50 transition-all duration-500 ease-in-out overflow-hidden shadow-2xl border-b border-white/5 ${isSearchOpen ? 'max-h-[220px]' : 'max-h-0'}`}
      >
        <div className="container mx-auto px-4 flex justify-center items-center h-full">
          {isSearchOpen && (
            <div className="relative w-full max-w-xl py-12 animate-fade-in-up">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary w-5 h-5 sm:w-6 sm:h-6" />
              <Input 
                placeholder="Exhibiting your desires..."
                autoFocus
                className="w-full pl-14 sm:pl-16 pr-6 py-5 sm:py-7 text-sm sm:text-base border border-white/10 rounded-full shadow-2xl bg-card text-foreground focus-visible:ring-primary/40 focus-visible:border-primary transition-all uppercase tracking-[0.2em] font-bold placeholder:text-[10px] sm:placeholder:text-[11px] placeholder:tracking-[0.1em] placeholder:font-medium"
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && e.target.value.trim() !== '') {
                    setIsSearchOpen(false);
                    handleNavigation(`/shop/search?keyword=${e.target.value}`);
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* User Profile / Account */}
      {!isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-primary hover:bg-white/5">
              <User className="w-5 h-5" />
              <span className="sr-only">User profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-64 bg-popover border border-white/5 shadow-2xl rounded-none animate-slide-down p-2">
            <DropdownMenuLabel className="text-[11px] uppercase tracking-widest text-primary font-bold px-3 py-4">Logged in as {user?.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="cursor-pointer py-3 focus:bg-white/5 group" onClick={() => navigate("/shop/account")}>
              <UserCog className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[12px] uppercase tracking-wider font-bold">Account Registry</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="cursor-pointer py-3 focus:bg-red-900/20 group" onClick={handleLogout}>
              <LogOut className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
              <span className="text-[12px] uppercase tracking-wider font-bold group-hover:text-red-500">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="ghost"
          className="justify-start rounded-none h-12 uppercase tracking-[0.2em] text-[11px] font-bold border-b border-white/5"
          onClick={() => handleNavigation("/shop/account")}
        >
          <UserCog className="w-4 h-4 mr-3 text-primary" />
          Account Profile
        </Button>
      )}

      {/* Cart Button */}
      {!isMobile ? (
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="ghost"
          size="icon"
          className="relative text-foreground/80 hover:text-primary hover:bg-white/5"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute top-[-2px] right-[-2px] bg-primary text-primary-foreground font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="justify-between rounded-none h-12 uppercase tracking-[0.2em] text-[11px] font-bold border-b border-white/5"
          onClick={() => {
            setOpenCartSheet(true);
            if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
          }}
        >
          <div className="flex items-center">
             <ShoppingCart className="w-4 h-4 mr-3 text-primary" />
             Shopping Cart
          </div>
          <span className="bg-primary text-primary-foreground font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
            {cartItems?.items?.length || 0}
          </span>
        </Button>
      )}
    </div>
  );
}

function ShoppingHeader() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openMenu, setOpenMenu] = useState(null); 
  const [openMobileSheet, setOpenMobileSheet] = useState(false);
  const [openMobileCollections, setOpenMobileCollections] = useState(false);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  function handleLogout() {
    dispatch(logoutUser());
    setOpenMobileSheet(false);
  }

  function handleMobileNavigate(path, filters = null) {
    if (filters) {
      sessionStorage.setItem("filters", JSON.stringify(filters));
    } else {
      sessionStorage.removeItem("filters");
    }
    setOpenMobileSheet(false);
    navigate(path);
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-card/95 backdrop-blur-md shadow-lg">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-[1600px] mx-auto">
        <Link 
          to="/shop/home" 
          className="flex items-center gap-3 group"
          onMouseEnter={() => setOpenMenu(null)}
        >
          <div className="relative overflow-hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-primary/20 p-1 bg-white/5">
            <img src={logo} alt="J Creation" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
          </div>
          <span className="font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-base sm:text-lg text-primary group-hover:brightness-125 transition-all">J Creation</span>
        </Link>
        
        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
           <Sheet open={openMobileSheet} onOpenChange={setOpenMobileSheet}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-none text-primary ml-auto">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[310px] bg-card border-l border-white/5 p-0 flex flex-col">
              <div className="p-6 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg overflow-hidden">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[13px] font-bold uppercase tracking-widest text-foreground truncate">
                      {user?.userName || "Guest Guest"}
                    </h2>
                    <p className="text-[10px] text-primary/70 uppercase tracking-tighter italic font-medium">L'Elite Member</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <nav className="flex flex-col px-4">
                  <Button 
                    variant="ghost" 
                    className="justify-start rounded-none h-14 uppercase tracking-[0.2em] text-[11px] font-bold border-b border-white/5"
                    onClick={() => handleMobileNavigate("/shop/home")}
                  >
                    Home Gallery
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start rounded-none h-14 uppercase tracking-[0.2em] text-[11px] font-bold border-b border-white/5"
                    onClick={() => handleMobileNavigate("/shop/product")}
                  >
                    All Creations
                  </Button>
                  
                  <div className="flex flex-col">
                    <Button 
                      variant="ghost" 
                      className="justify-between rounded-none h-14 uppercase tracking-[0.2em] text-[11px] font-bold border-b border-white/5"
                      onClick={() => setOpenMobileCollections(!openMobileCollections)}
                    >
                      Collections
                      <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${openMobileCollections ? 'rotate-90' : ''}`} />
                    </Button>
                    <div className={`overflow-hidden transition-all duration-500 bg-white/2 ${openMobileCollections ? 'max-h-[400px]' : 'max-h-0'}`}>
                      {[
                        { label: 'Sherwani', id: 'sherwani', target: 'collection' },
                        { label: 'Panjabi', id: 'panjabi', target: 'collection' },
                        { label: 'Suites', id: 'suite', target: 'collection' },
                        { label: 'Footwear', id: 'footwear', target: 'category' },
                        { label: 'Accessories', id: 'accessories', target: 'category' }
                      ].map((item) => (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className="w-full justify-start pl-10 h-10 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary rounded-none transition-colors"
                          onClick={() => handleMobileNavigate("/shop/product", { [item.target]: [item.id] })}
                        >
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Integrated HeaderRightContent for Mobile */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <HeaderRightContent isMobile={true} setIsMobileMenuOpen={setOpenMobileSheet} setOpenCartSheet={setOpenCartSheet} />
                  </div>
                </nav>
              </div>

              <div className="p-4 mt-auto border-t border-white/5 bg-white/5">
                <Button 
                  onClick={handleLogout}
                  className="w-full rounded-none bg-red-900/10 hover:bg-red-900/30 text-red-500 border border-red-500/20 uppercase tracking-[0.3em] text-[10px] font-bold h-12 transition-all"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out Registry
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          <MenuItems setOpenMenu={setOpenMenu} />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent setOpenMenu={setOpenMenu} setOpenCartSheet={setOpenCartSheet} />
        </div>
      </div>
      
      <CollectionsMegaMenu isOpen={openMenu === 'men'} setIsOpen={() => setOpenMenu(null)} />
      <FootwearMegaMenu isOpen={openMenu === 'footwear'} setIsOpen={() => setOpenMenu(null)} />

      {/* Global Cart Sheet - Moved outside any other sheet content */}
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>
    </header>
  );
}

export default ShoppingHeader;
