import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon, Filter, HomeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  console.log(queryParams, "queryParams");

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [detailsMode, setDetailsMode] = useState("full-details");
  const [openFilterSheet, setOpenFilterSheet] = useState(false);

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId, mode = "full-details") {
    dispatch(fetchProductDetails(getCurrentProductId));
    setDetailsMode(mode);
    setOpenDetailsDialog(true);
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  // 1. Initial Load: Load sort and filters from URL or Session
  useEffect(() => {
    setSort("title-atoz");
    const categoryFromUrl = searchParams.get("category");
    const collectionFromUrl = searchParams.get("collection");
    
    let initialFilters = {};
    if (categoryFromUrl || collectionFromUrl) {
      if (categoryFromUrl) initialFilters.category = categoryFromUrl.split(",");
      if (collectionFromUrl) initialFilters.collection = collectionFromUrl.split(",");
    } else {
      const storedFilters = sessionStorage.getItem("filters");
      if (storedFilters) {
        initialFilters = JSON.parse(storedFilters);
      } else {
        // Default to Men's collection if nothing is selected
        initialFilters = { category: ['men'] };
      }
    }
    
    setFilters(initialFilters);
  }, []); // Only on mount

  // 2. When filters/sort change, fetch data and update URL
  useEffect(() => {
    if (filters !== null && sort !== null) {
      // Fetch products
      dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
      
      // Update URL and SessionStorage
      const createQueryString = createSearchParamsHelper(filters);
      if (createQueryString) {
        setSearchParams(new URLSearchParams(createQueryString));
      } else {
        setSearchParams(new URLSearchParams());
      }
      sessionStorage.setItem("filters", JSON.stringify(filters));
    }
  }, [filters, sort, dispatch]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] gap-6 p-4 md:p-6 lg:max-w-[1600px] lg:mx-auto">
      {/* Desktop Filter Sidebar */}
      <aside className="hidden md:block">
        <ProductFilter filters={filters} handleFilter={handleFilter} />
      </aside>

      <div className="bg-background w-full">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-card/30 backdrop-blur-sm sticky top-16 z-10 sm:relative sm:top-0 h-14 md:h-16">
          <div className="flex items-center gap-2 sm:gap-3">
             {/* Mobile Filter Trigger */}
             <Sheet open={openFilterSheet} onOpenChange={setOpenFilterSheet}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden border-primary/20 bg-transparent text-primary hover:bg-primary hover:text-primary-foreground rounded-none uppercase tracking-widest text-[10px] font-bold">
                    <Filter className="h-4 w-4 mr-1" />
                    <span>Filter</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] bg-card p-0">
                   <div className="p-6">
                      <ProductFilter filters={filters} handleFilter={handleFilter} />
                      <Button 
                        className="w-full mt-6 rounded-none uppercase tracking-widest text-[10px] font-bold h-12"
                        onClick={() => setOpenFilterSheet(false)}
                      >
                        Examine Anthology
                      </Button>
                   </div>
                </SheetContent>
             </Sheet>

            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-1 font-bold text-primary hover:text-primary hover:bg-white/10 uppercase tracking-widest text-[11px] transition-all"
              onClick={() => navigate("/shop/home")}
            >
              <HomeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              Home
            </Button>
            <span className="hidden sm:inline text-white/10">|</span>
            <h2 className="text-[11px] sm:text-[14px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-foreground">Our Selection</h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-[12px] text-muted-foreground uppercase tracking-widest">
              {productList?.length} Pieces
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 sm:gap-2 border-white/10 bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground transition-all rounded-none uppercase tracking-widest text-[9px] sm:text-[10px] font-bold px-2 sm:px-4"
                >
                  <ArrowUpDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] sm:w-[200px] bg-card border-white/5 rounded-none shadow-2xl">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                      className="text-[11px] uppercase tracking-widest py-3 cursor-pointer focus:bg-white/5 font-bold"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {(filters.category &&
          filters.category.length > 0 &&
          (filters.category.includes("women") ||
            filters.category.includes("kids") ||
            filters.category.includes("accessories"))) ||
        ["women", "kids", "accessories"].includes(categorySearchParam) ? (
          <div className="w-full animate-in fade-in zoom-in duration-700">
            <div className="flex flex-col items-center justify-center min-h-[400px] sm:min-h-[700px] w-full bg-card/30 rounded-none border border-dashed border-white/5 p-6 sm:p-12 text-center">
              <div className="mb-4 sm:mb-8">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.6em] text-primary font-bold">
                  Exquisite Selection
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 leading-tight">
                Coming Soon
              </h2>
              <div className="h-[1px] w-16 sm:w-24 bg-primary/20 mb-6 sm:mb-8" />
              <p className="text-muted-foreground text-[10px] sm:text-[12px] uppercase tracking-[0.2em] font-medium max-w-lg leading-relaxed italic opacity-80">
                We are currently curating the{" "}
                <span className="text-primary font-bold">
                  {categorySearchParam === "women" || filters?.category?.includes("women") 
                    ? "Women's" 
                    : categorySearchParam === "kids" || filters?.category?.includes("kids") 
                    ? "Kids'" 
                    : "Accessories"}
                </span>{" "}
                anthology. Our artisans are crafting pieces where heritage meets modern grace.
              </p>
              <div className="mt-8 sm:mt-12">
                <Button 
                  variant="outline" 
                  className="rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] px-6 sm:px-10 py-5 sm:py-7 shadow-2xl shadow-primary/10"
                  onClick={() => {
                    setFilters({ category: ['men'] });
                    sessionStorage.setItem("filters", JSON.stringify({ category: ['men'] }));
                    setSearchParams(new URLSearchParams("category=men"));
                  }}
                >
                  Inaugurate Men's Gallery
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {productList && productList.length > 0
                ? productList.map((productItem) => (
                    <ShoppingProductTile
                      key={productItem._id}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                      handleGetProductDetails={handleGetProductDetails}
                    />
                  ))
              : null}
          </div>
        )}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        mode={detailsMode}
      />
    </div>
  );
}

export default ShoppingListing;
