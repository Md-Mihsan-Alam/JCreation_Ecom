import { StarIcon, ChevronDown, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState, useRef } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useNavigate } from "react-router-dom";

function ProductDetailsDialog({ open, setOpen, productDetails, mode = "full-details" }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 100;
      setScrollProgress(progress);
    };

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [open, productDetails]);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (getTotalStock > 0 && !selectedSize) {
      toast({ title: "Please select a size first", variant: "destructive" });
      return;
    }

    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex((item) => item.productId === getCurrentProductId);
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({ title: `Maximum quantity reached (${getQuantity})`, variant: "destructive" });
          return;
        }
      }
    }
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product added to cart" });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setSelectedSize("");
    setScrollProgress(0);
  }

  function handleAddReview() {
    dispatch(addReview({ productId: productDetails?._id, userId: user?.id, userName: user?.userName, reviewMessage: reviewMsg, reviewValue: rating })).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({ title: "Review added successfully!" });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview = reviews && reviews.length > 0 ? reviews.reduce((sum, item) => sum + item.reviewValue, 0) / reviews.length : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className={`flex flex-col md:flex-row gap-0 p-0 overflow-hidden bg-card border-white/5 shadow-2xl animate-fade-in-up rounded-none 
        ${mode === "full-details" ? "max-w-[1200px] h-[90vh]" : "max-w-[900px] h-[70vh]"}`}>
        
        {/* LEFT PANEL: IMAGE */}
        <div className="md:w-1/2 h-1/2 md:h-full relative bg-white/5 flex items-center justify-center p-8 border-r border-white/5">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
          />
          {mode === "quick-shop" && (
            <div className="absolute top-6 left-6 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1">Quick Acquisition</div>
          )}
        </div>

        {/* RIGHT PANEL: CONTENT WITH SYNCED SCROLLBAR */}
        <div className="md:w-1/2 h-1/2 md:h-full relative flex flex-col">
          {/* VERTICAL PROGRESS LINE */}
          <div className="absolute top-0 right-0 w-[2px] h-full bg-white/5 z-20">
            <div className="w-full bg-primary transition-all duration-300 ease-out" style={{ height: `${scrollProgress}%` }} />
          </div>

          {/* SCROLL HINT */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none transition-opacity duration-700"
               style={{ opacity: scrollProgress >= 95 ? 0 : 1 }}>
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Scroll Details</span>
            <ChevronDown className="w-4 h-4 text-primary animate-bounce" />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide p-8 md:p-12">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-[0.1em] text-foreground uppercase border-b border-primary/20 pb-4">{productDetails?.title}</h1>
              <div className="flex items-center gap-6 mt-6">
                <p className={`text-3xl font-bold ${productDetails?.salePrice > 0 ? "line-through text-muted-foreground/30 text-2xl" : "text-primary"}`}>
                  Tk {productDetails?.price?.toLocaleString('en-IN')}
                </p>
                {productDetails?.salePrice > 0 && (
                  <p className="text-3xl font-bold text-primary">Tk {productDetails?.salePrice?.toLocaleString('en-IN')}</p>
                )}
              </div>
            </div>

            {mode !== "quick-shop" && (
              <div className="flex items-center gap-3 mb-8">
                <StarRatingComponent rating={averageReview} />
                <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">({reviews.length} Appraisals)</span>
              </div>
            )}

            {/* SIZING */}
            <div className="mb-10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-5">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {(() => {
                  const isSpecialSizing = productDetails?.category === "footwear" || productDetails?.brand === "nagra" || productDetails?.brand === "shoe";
                  const allSizes = [
                    { label: isSpecialSizing ? "38" : "M",   stock: productDetails?.stockM   ?? 0 },
                    { label: isSpecialSizing ? "40" : "L",   stock: productDetails?.stockL   ?? 0 },
                    { label: isSpecialSizing ? "42" : "XL",  stock: productDetails?.stockXL  ?? 0 },
                    { label: isSpecialSizing ? "44" : "2XL", stock: productDetails?.stock2XL ?? 0 },
                    { label: isSpecialSizing ? "46" : "3XL", stock: productDetails?.stock3XL ?? 0 },
                    { label: isSpecialSizing ? "48" : "4XL", stock: productDetails?.stock4XL ?? 0 },
                  ];
                  return allSizes.map((sizeObj) => {
                    const outOfStock = sizeObj.stock <= 0;
                    const isSelected = selectedSize === sizeObj.label;
                    return (
                      <button
                        key={sizeObj.label}
                        onClick={() => !outOfStock && setSelectedSize(sizeObj.label)}
                        disabled={outOfStock}
                        className={`relative min-w-[56px] h-12 flex items-center justify-center text-[12px] font-bold border transition-all duration-300 rounded-none
                          ${outOfStock ? "border-white/5 text-muted-foreground/20 bg-transparent cursor-not-allowed" 
                          : isSelected ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105" 
                          : "text-foreground border-white/10 hover:border-primary hover:text-primary bg-white/5"}`}
                      >
                        {sizeObj.label}
                        {outOfStock && (
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 52 48" preserveAspectRatio="none">
                            <line x1="2" y1="2" x2="50" y2="46" stroke="currentColor" strokeWidth="1" className="opacity-10" />
                          </svg>
                        )}
                      </button>
                    );
                  });
                })()}
              </div>
            </div>

            {/* ACTION */}
            <div className="mb-12">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full h-16 bg-white/5 text-muted-foreground/40 cursor-not-allowed uppercase font-bold tracking-[0.2em] rounded-none border border-white/5" disabled>Out of Stock</Button>
              ) : mode === "quick-shop" ? (
                <Button
                  className="w-full h-16 bg-primary text-primary-foreground hover:brightness-110 uppercase font-bold tracking-[0.3em] transition-all rounded-none shadow-xl text-xs"
                  onClick={() => {
                    if(!selectedSize) { toast({ title: "Please select size", variant: "destructive" }); return; }
                    handleAddToCart(productDetails?._id, productDetails?.totalStock);
                    navigate('/shop/checkout');
                    setOpen(false);
                  }}
                >Proceed to Checkout</Button>
              ) : (
                <Button
                  className="w-full h-16 relative overflow-hidden transition-all duration-300 rounded-none bg-primary text-primary-foreground hover:brightness-110 font-bold uppercase tracking-[0.3em] text-xs shadow-xl"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                >
                  <div className={`flex items-center justify-center gap-3 transition-all duration-500 absolute inset-0 ${isHovered && !selectedSize ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </div>
                  <div className={`flex items-center justify-center gap-3 transition-all duration-500 absolute inset-0 bg-red-900 text-white ${isHovered && !selectedSize ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
                    <span>Select Size</span>
                  </div>
                </Button>
              )}
            </div>

            {/* DESCRIPTION & REVIEWS */}
            <div className="space-y-12">
              <div className="border-t border-white/5 pt-10">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-3">
                  <span className="w-4 h-[1px] bg-primary"></span> Description
                </h3>
                <p className="text-muted-foreground text-[14px] leading-relaxed italic border-l border-primary/20 pl-6">{productDetails?.description}</p>
              </div>

              {mode === "full-details" && (
                <div className="border-t border-white/5 pt-10">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3">
                    <span className="w-4 h-[1px] bg-primary"></span> Client Appraisals
                  </h3>
                  <div className="space-y-8 mb-12">
                    {reviews?.length > 0 ? (
                      reviews.map((reviewItem) => (
                        <div className="flex gap-6 pb-8 border-b border-white/5 last:border-0" key={reviewItem._id}>
                          <Avatar className="w-12 h-12 border border-primary/20">
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">{reviewItem?.userName[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-bold text-foreground mb-1 uppercase tracking-widest text-[12px]">{reviewItem?.userName}</h4>
                            <StarRatingComponent rating={reviewItem?.reviewValue} />
                            <p className="text-muted-foreground text-[13px] mt-3 leading-relaxed italic">"{reviewItem.reviewMessage}"</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-muted-foreground/30 uppercase tracking-widest italic text-center py-6 border border-dashed border-white/10">Initial appraisal pending...</p>
                    )}
                  </div>

                  <div className="bg-white/5 p-8 border border-white/5">
                    <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6 block">Add an Appraisal</Label>
                    <div className="mb-6"><StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} /></div>
                    <Input value={reviewMsg} onChange={(e) => setReviewMsg(e.target.value)} placeholder="Your perspective..." 
                           className="mb-6 bg-transparent border-white/10 rounded-none focus:border-primary transition-all text-sm h-12" />
                    <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ""} 
                            className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[11px] h-12 rounded-none hover:brightness-110 shadow-lg">Submit Review</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
