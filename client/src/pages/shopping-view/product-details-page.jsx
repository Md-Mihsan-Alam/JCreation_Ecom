import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Minus, Plus, ShoppingCart, ChevronDown, ArrowRight } from "lucide-react";
import { toggleWishlistItem } from "@/store/shop/wishlist-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import axios from "axios";
import { API_URL } from "@/config";

function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { items: wishlistItems } = useSelector((state) => state.shopWishlist);
  const { toast } = useToast();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0); 
  const [isHovered, setIsHovered] = useState(false);
  
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const rightPanelRef = useRef(null);

  useEffect(() => {
    const panel = rightPanelRef.current;
    if (!panel) return;

    const onWheel = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = panel;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 2;
      const atTop = scrollTop <= 0;

      if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) {
        e.preventDefault();
        e.stopPropagation();
        panel.scrollTop += e.deltaY;
      }
    };

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = panel;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? Math.round((scrollTop / maxScroll) * 100) : 100;
      setScrollProgress(progress);
    };

    panel.addEventListener("wheel", onWheel, { passive: false });
    panel.addEventListener("scroll", onScroll);
    return () => {
      panel.removeEventListener("wheel", onWheel);
      panel.removeEventListener("scroll", onScroll);
    };
  }, [productDetails]);

  const isWishlisted =
    wishlistItems && wishlistItems.findIndex((item) => item._id === productDetails?._id) > -1;

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
      setSelectedSize("");
      setQuantity(1);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (productDetails) {
      setMainImage(productDetails.image);

      // 1. Fetch Related Products
      const fetchRelated = async () => {
        try {
          const query = new URLSearchParams({
            collection: productDetails.brand,
          });
          const response = await axios.get(`${API_URL}/api/shop/products/get?${query}`);
          if (response?.data?.success) {
            setRelatedProducts(response.data.data.filter(p => p._id !== productDetails._id).slice(0, 4));
          }
        } catch (err) {
          console.error("Related fetch error:", err);
        }
      };
      fetchRelated();

      // 2. Manage Recently Viewed (Save current)
      const stored = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const filtered = stored.filter((item) => item._id !== productDetails._id);
      const updated = [productDetails, ...filtered].slice(0, 12);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    }
  }, [productDetails]);

  useEffect(() => {
    // Load recently viewed (excluding current product in list if needed, but usually we show others)
    const stored = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    setRecentlyViewed(stored.filter(p => p._id !== productId));
  }, [productId]);

  if (!productDetails) {
    return <div className="p-12 text-center text-primary uppercase tracking-[0.3em] min-h-screen bg-background">Loading Product...</div>;
  }

  const isSpecialSizing =
    productDetails?.category === "footwear" ||
    productDetails?.brand === "nagra" ||
    productDetails?.brand === "shoe";

  const sizes = [
    { label: isSpecialSizing ? "38" : "M",   stock: productDetails.stockM   ?? 0 },
    { label: isSpecialSizing ? "40" : "L",   stock: productDetails.stockL   ?? 0 },
    { label: isSpecialSizing ? "42" : "XL",  stock: productDetails.stockXL  ?? 0 },
    { label: isSpecialSizing ? "44" : "2XL", stock: productDetails.stock2XL ?? 0 },
    { label: isSpecialSizing ? "46" : "3XL", stock: productDetails.stock3XL ?? 0 },
    { label: isSpecialSizing ? "48" : "4XL", stock: productDetails.stock4XL ?? 0 },
  ];

  function handleQuantityChange(type) {
    if (type === "plus") {
      setQuantity((prev) => prev + 1);
    } else if (type === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }

  function handleAddToCart() {
    if (!user) {
      toast({ title: "Please login to proceed", variant: "destructive" });
      return;
    }
    if (productDetails.totalStock > 0 && !selectedSize) {
      toast({ title: "Please select a size first", variant: "destructive" });
      return;
    }

    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === productDetails?._id
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + quantity > productDetails?.totalStock) {
          toast({
            title: `Maximum reached (${getQuantity})`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: productDetails?._id,
        quantity: quantity,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart" });
      }
    });
  }

  function handleAddToCartFromTile(getCurrentProductId) {
    if (!user) {
      toast({ title: "Please login to proceed", variant: "destructive" });
      return;
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
        toast({ title: "Product added to cart" });
      }
    });
  }

  function handleGetProductDetails(id) {
    const prod = [...relatedProducts, ...recentlyViewed].find(p => p._id === id);
    if (prod) {
      navigate(`/shop/${prod.category}/${prod.brand || 'all'}/${id}`);
    } else {
      navigate(`/shop/collection/all/${id}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="container mx-auto px-4 md:px-8 pt-20 sm:pt-24">
        <Button 
          variant="ghost" 
          className="mb-6 sm:mb-8 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px] text-primary hover:text-primary-foreground hover:bg-primary px-3 sm:px-4 transition-all" 
          onClick={() => navigate("/shop/home")}
        >
          &larr; Home
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8 lg:gap-12 items-start max-w-[1600px] mx-auto animate-fade-in-scale">
          
          {/* IMAGE GALLERY */}
          <div className="lg:sticky lg:top-[100px] flex flex-col border border-white/5 bg-card/30 shadow-2xl overflow-hidden sm:h-[600px] lg:h-[calc(100vh-140px)] rounded-none">
            <div className="flex-1 relative bg-white/5 overflow-hidden group/main min-h-[400px]">
              <img
                src={mainImage || productDetails?.image}
                alt={productDetails?.title}
                className="w-full h-full object-contain transition-all duration-700 lg:group-hover/main:scale-110"
              />
            </div>

            {productDetails?.imageGallery && productDetails.imageGallery.length > 0 && (
              <div className="flex gap-3 sm:gap-4 p-4 sm:p-6 border-t border-white/5 overflow-x-auto custom-scrollbar bg-black/20">
                <button
                  onClick={() => setMainImage(productDetails.image)}
                  className={`relative flex-shrink-0 w-20 h-24 sm:w-24 sm:h-28 border transition-all duration-500 rounded-none
                    ${mainImage === productDetails.image ? 'border-primary scale-105 shadow-lg shadow-primary/20' : 'border-white/10 hover:border-white/40'}
                  `}
                >
                  <img src={productDetails.image} className="w-full h-full object-cover" alt="main" />
                </button>
                {productDetails.imageGallery.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`relative flex-shrink-0 w-20 h-24 sm:w-24 sm:h-28 border transition-all duration-500 rounded-none
                      ${mainImage === img ? 'border-primary scale-105 shadow-lg shadow-primary/20' : 'border-white/10 hover:border-white/40'}
                    `}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`view-${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CONTENT PANEL */}
          <div className="relative lg:sticky lg:top-[100px]">
            <div className="hidden lg:block absolute top-0 right-0 w-[2px] h-full bg-white/5 z-20 overflow-hidden">
              <div
                className="w-full bg-primary transition-all duration-300 ease-out"
                style={{ height: `${scrollProgress}%` }}
              />
            </div>

            <div
              className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-1 pointer-events-none transition-opacity duration-700"
              style={{ opacity: scrollProgress >= 95 ? 0 : 1 }}
            >
              <span className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold">Scroll Details</span>
              <ChevronDown className="w-5 h-5 text-primary animate-bounce" />
            </div>

            <div
              ref={rightPanelRef}
              className="flex flex-col bg-card border border-white/5 shadow-2xl lg:overflow-y-auto lg:max-h-[calc(100vh-140px)] scrollbar-hide rounded-none"
            >
              <div className="flex flex-col p-6 sm:p-10">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-[0.1em] sm:tracking-[0.2em] mb-4 text-foreground uppercase border-b border-primary/20 pb-4">
                  {productDetails?.title}
                </h1>

                <div className="flex items-center gap-6 mt-4 sm:mt-6">
                  <p className={`text-2xl sm:text-3xl font-bold ${productDetails?.salePrice > 0 ? "line-through text-muted-foreground/30 font-medium text-xl sm:text-2xl" : "text-primary"}`}>
                    Tk {productDetails?.price?.toLocaleString('en-IN')}
                  </p>
                  {productDetails?.salePrice > 0 && (
                    <p className="text-2xl sm:text-3xl font-bold text-primary">Tk {productDetails?.salePrice?.toLocaleString('en-IN')}</p>
                  )}
                </div>

                <Separator className="my-6 sm:my-8 bg-white/5" />

                <div className="mb-6 sm:mb-8">
                  <h3 className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold mb-4 sm:mb-5 text-muted-foreground">Select Size</h3>
                  <div className="flex gap-2 sm:gap-3 flex-wrap">
                    {sizes.map((sizeObj) => {
                      const outOfStock = sizeObj.stock <= 0;
                      const isSelected = selectedSize === sizeObj.label;
                      return (
                        <div key={sizeObj.label} className="relative">
                          <button
                            disabled={outOfStock}
                            onClick={() => !outOfStock && setSelectedSize(sizeObj.label)}
                            className={`relative min-w-[50px] sm:min-w-[60px] h-12 sm:h-14 px-3 sm:px-4 flex items-center justify-center border font-bold text-[11px] sm:text-[12px] tracking-[0.1em] sm:tracking-[0.2em] uppercase transition-all duration-300 rounded-none
                              ${isSelected ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 z-10" 
                              : outOfStock ? "border-white/5 text-muted-foreground/20 cursor-not-allowed bg-transparent" 
                              : "border-white/10 text-foreground hover:border-primary hover:text-primary bg-white/5"}`}
                          >
                            {sizeObj.label}
                            {outOfStock && (
                              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 52 48" preserveAspectRatio="none">
                                <line x1="2" y1="2" x2="50" y2="46" stroke="currentColor" strokeWidth="1" className="opacity-20" />
                              </svg>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-8 sm:mb-10">
                  <h3 className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold mb-4 sm:mb-5 text-muted-foreground">Quantity</h3>
                  <div className="flex items-center w-32 sm:w-40 border border-white/10 bg-white/5 shadow-2xl h-12 sm:h-14">
                    <button onClick={() => handleQuantityChange("minus")} className="w-10 sm:w-12 h-full flex items-center justify-center hover:bg-white/5 disabled:opacity-20 text-foreground" disabled={quantity <= 1}>
                      <Minus className="w-4 sm:w-5 h-4 sm:h-5" />
                    </button>
                    <div className="flex-1 text-center font-bold text-base sm:text-lg text-primary">{quantity}</div>
                    <button onClick={() => handleQuantityChange("plus")} className="w-10 sm:w-12 h-full flex items-center justify-center hover:bg-white/5 text-foreground">
                      <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-10">
                  {productDetails?.totalStock === 0 ? (
                    <Button className="w-full h-14 sm:h-16 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold text-[10px] sm:text-[11px] bg-white/5 text-muted-foreground/30 rounded-none border border-white/5 cursor-not-allowed">
                      Out of Stock
                    </Button>
                  ) : (
                    <Button
                      className="w-full h-14 sm:h-16 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold text-[10px] sm:text-[11px] bg-primary text-primary-foreground shadow-2xl rounded-none transition-all hover:brightness-110 flex items-center justify-center gap-3 overflow-hidden relative"
                      onClick={handleAddToCart}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div className={`flex items-center justify-center gap-3 transition-all duration-500 absolute inset-0 ${isHovered && !selectedSize ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
                        <ShoppingCart className="w-4 sm:w-5 h-4 sm:w-5" />
                        <span>Add to Cart</span>
                      </div>
                      <div className={`flex items-center justify-center gap-3 transition-all duration-500 absolute inset-0 bg-red-800 text-white ${isHovered && !selectedSize ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
                        <span>Select a Size</span>
                      </div>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full sm:w-20 h-14 sm:h-16 border border-white/10 rounded-none bg-white/5 hover:bg-white/10 hover:border-primary text-primary shadow-2xl transition-all"
                    onClick={() => dispatch(toggleWishlistItem(productDetails))}
                  >
                    <Heart className={`w-5 sm:w-6 h-5 sm:h-6 ${isWishlisted ? "fill-current" : ""}`} />
                  </Button>
                </div>

                <div className="border-t border-white/5 pt-8 sm:pt-10">
                  <h3 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-bold mb-4 sm:mb-6 text-primary flex items-center gap-3">
                    <span className="w-3 h-[1px] bg-primary mb-1"></span> Product Description
                  </h3>
                  <div className="text-muted-foreground leading-loose text-[13px] sm:text-[14px] space-y-4 sm:space-y-6 bg-white/5 p-6 sm:p-8 border-l border-primary/40 italic font-medium">
                    {productDetails?.description?.split('\n').map((paragraph, index) => (
                      <p key={index} className="last:mb-0">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-20 sm:mt-32 border-t border-white/5 pt-12 sm:pt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
              <div>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-2 sm:mb-3">
                  Complementary Selection
                </p>
                <h2 className="text-2xl sm:text-4xl font-bold text-foreground uppercase tracking-widest">
                  More {productDetails?.brand} Creations
                </h2>
              </div>
              <Button
                variant="outline"
                className="rounded-none border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 uppercase tracking-[0.2em] text-[9px] sm:text-[10px] flex items-center gap-3 px-6 sm:px-8 py-4 sm:py-6 font-bold bg-transparent sm:w-auto w-full justify-center"
                onClick={() => navigate(`/shop/product`)}
              >
                Examine All <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {relatedProducts.map((product) => (
                <ShoppingProductTile
                  key={product._id}
                  product={product}
                  handleAddtoCart={handleAddToCartFromTile}
                  handleGetProductDetails={handleGetProductDetails}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── RECENTLY VIEWED ── */}
        {recentlyViewed && recentlyViewed.length > 0 && (
          <section className="mt-20 sm:mt-32 border-t border-white/5 pt-12 sm:pt-20">
            <div className="mb-8 sm:mb-12">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-2 sm:mb-3">
                Your Style Journey
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-foreground uppercase tracking-widest">
                Recently Viewed
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {recentlyViewed.slice(0, 4).map((product) => (
                <ShoppingProductTile
                  key={product._id}
                  product={product}
                  handleAddtoCart={handleAddToCartFromTile}
                  handleGetProductDetails={handleGetProductDetails}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProductDetailsPage;
