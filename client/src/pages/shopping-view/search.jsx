import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";

function SearchProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [detailsMode, setDetailsMode] = useState("full-details");
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);

  const { user } = useSelector((state) => state.auth);

  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");
    if (urlKeyword && urlKeyword !== keyword) {
      setKeyword(urlKeyword);
    }
  }, [searchParams]);

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);

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

  function handleGetProductDetails(getCurrentProductId, mode = "full-details") {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
    setDetailsMode(mode);
    setOpenDetailsDialog(true);
  }

  console.log(searchResults, "searchResults");

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-2xl flex items-center relative group">
          <Search className="absolute left-6 text-primary w-5 h-5 group-focus-within:scale-110 transition-transform" />
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-8 text-center text-lg pl-14 pr-14 shadow-2xl bg-card border-white/5 focus-visible:ring-primary/30 rounded-full placeholder:text-muted-foreground/30 tracking-widest font-bold uppercase transition-all"
            placeholder="Reflections of Style..."
          />
          {keyword && keyword.trim() !== "" && (
            <X 
              className="absolute right-6 text-muted-foreground cursor-pointer hover:text-primary w-5 h-5 transition-colors" 
              onClick={() => setKeyword("")} 
            />
          )}
        </div>
      </div>
      {!searchResults.length && keyword && keyword.length > 3 ? (
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold uppercase tracking-[0.3em] text-muted-foreground/30">No Creations Found</h1>
          <p className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground/20 mt-4 italic">Refine your inquiry for further discovery</p>
        </div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            key={item._id}
            handleAddtoCart={handleAddtoCart}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
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

export default SearchProducts;
