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
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HomeIcon } from "lucide-react";

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

  useEffect(() => {
    setSort("title-atoz");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [searchParams]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-card/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 font-bold text-primary hover:text-primary hover:bg-white/10 uppercase tracking-widest text-[11px] transition-all"
              onClick={() => navigate("/shop/home")}
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </Button>
            <span className="text-white/10">|</span>
            <h2 className="text-[14px] font-bold uppercase tracking-[0.2em] text-foreground">Our Selection</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-white/10 bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground transition-all rounded-none uppercase tracking-widest text-[10px] font-bold"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
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
            filters.category.includes("kids"))) ||
        categorySearchParam === "women" ||
        categorySearchParam === "kids" ? (
          <div className="flex flex-col items-center justify-center min-h-[600px] w-full bg-card/50 rounded-none border border-dashed border-white/5 p-12 text-center animate-in fade-in zoom-in duration-700">
            <div className="mb-8">
              <span className="text-[10px] uppercase tracking-[0.6em] text-primary font-bold">
                Exquisite Collection
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground uppercase tracking-[0.3em] mb-6">
              Coming Soon
            </h2>
            <div className="h-[1px] w-24 bg-primary/20 mb-8" />
            <p className="text-muted-foreground text-[12px] uppercase tracking-[0.2em] font-medium max-w-lg leading-relaxed italic opacity-80">
              We are currently curating the{" "}
              <span className="text-primary">
                {(filters?.category?.includes("women") || categorySearchParam === "women") ? "Women's" : "Kids'"}
              </span>{" "}
              anthology. Our artisans are crafting pieces where heritage meets modern grace.
            </p>
            <div className="mt-12">
              <Button 
                variant="outline" 
                className="rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 uppercase tracking-[0.3em] text-[10px] px-10 py-7 shadow-2xl shadow-primary/10"
                onClick={() => {
                  setFilters({ category: ['men'] });
                  sessionStorage.setItem("filters", JSON.stringify({ category: ['men'] }));
                }}
              >
                Inaugurate Men's Gallery
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
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
