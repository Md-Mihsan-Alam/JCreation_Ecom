import { Card, CardContent, CardFooter } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistItem } from "@/store/shop/wishlist-slice";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.shopWishlist);

  const isWishlisted =
    wishlistItems && wishlistItems.findIndex((item) => item._id === product?._id) > -1;

  const getAvailableSizes = () => {
    const isSpecialSizing =
      product?.category === "footwear" ||
      product?.brand === "nagra" ||
      product?.brand === "shoe";
    const sizes = [];
    if (product?.stockM > 0) sizes.push(isSpecialSizing ? "38" : "M");
    if (product?.stockL > 0) sizes.push(isSpecialSizing ? "40" : "L");
    if (product?.stockXL > 0) sizes.push(isSpecialSizing ? "42" : "XL");
    if (product?.stock2XL > 0) sizes.push(isSpecialSizing ? "44" : "2XL");
    if (product?.stock3XL > 0) sizes.push(isSpecialSizing ? "46" : "3XL");
    if (product?.stock4XL > 0) sizes.push(isSpecialSizing ? "48" : "4XL");
    return sizes.join(", ");
  };

  return (
    <Card className="w-full max-w-sm mx-auto group border-0 shadow-none bg-transparent">
      <div>
        <div 
          className="relative overflow-hidden cursor-pointer h-[350px] sm:h-[400px] lg:h-[450px]" 
          onClick={() => navigate(`/shop/${product?.category || 'collection'}/${product?.brand || 'all'}/${product?._id}`)}
        >
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-full object-cover rounded-none transition-transform duration-700 lg:group-hover:scale-110"
          />

          {/* Right Action Buttons */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10">
            <Button
              variant="outline"
              className="bg-card/90 hover:bg-primary hover:text-primary-foreground text-foreground w-9 h-9 sm:w-10 sm:h-10 rounded-none border-white/5 shadow-lg flex items-center justify-center p-0 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleWishlistItem(product));
              }}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isWishlisted ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="outline"
              className="bg-card/90 hover:bg-primary hover:text-primary-foreground text-foreground w-9 h-9 sm:w-10 sm:h-10 rounded-none border-white/5 shadow-lg flex items-center justify-center p-0 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleGetProductDetails(product?._id, "full-details");
              }}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          {/* Bottom Quick Shop & Sizes Hover Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10 flex flex-col items-center justify-end gap-2 sm:gap-3 h-1/2 rounded-none pointer-events-none">
            
            <div className="text-white text-[13px] sm:text-[15px] font-semibold tracking-wider drop-shadow-md pb-1 pointer-events-auto bg-black/20 px-2 py-0.5 backdrop-blur-sm lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-none">
                {getAvailableSizes() || "Out of Stock"}
            </div>

            {product?.totalStock > 0 ? (
              <Button
                className="w-full sm:w-3/4 max-w-[200px] bg-primary text-primary-foreground hover:brightness-110 font-bold pointer-events-auto rounded-none shadow-xl transition-all active:scale-95 uppercase tracking-widest text-[10px] sm:text-[11px] h-9 sm:h-11"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGetProductDetails(product?._id, "quick-shop");
                }}
              >
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Quick Shop
              </Button>
            ) : (
               <Button className="w-full sm:w-3/4 max-w-[200px] opacity-70 cursor-not-allowed bg-black text-white pointer-events-auto rounded-none text-[10px] sm:text-[11px] h-9 sm:h-11" variant="outline">
                 Out Of Stock
               </Button>
            )}
          </div>

          {product?.totalStock === 0 && (
            <Badge className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-red-500 hover:bg-red-600 rounded-none text-[10px] uppercase tracking-tighter">
              Out Of Stock
            </Badge>
          )}
        </div>
        <CardContent className="p-0 pt-4 relative">
          <h2 className="text-[14px] font-bold mb-1 truncate text-left text-foreground uppercase tracking-wider">{product?.title}</h2>
          
          <div className="flex justify-start items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through mr-2 opacity-40" : "text-primary font-bold"
              } text-[14px] text-left`}
            >
              Tk {product?.price?.toLocaleString('en-IN')}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-[14px] font-bold text-left text-primary">
                Tk {product?.salePrice?.toLocaleString('en-IN')}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default ShoppingProductTile;
