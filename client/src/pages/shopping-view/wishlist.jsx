import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";

function ShoppingWishlist() {
  const { items } = useSelector((state) => state.shopWishlist);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
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

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 min-h-[600px] animate-fade-in-up">
      <div className="mb-12 text-center">
        <span className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-4 block">Personal Curation</span>
        <h1 className="text-4xl font-bold uppercase tracking-[0.3em] text-foreground">Your Anthology</h1>
        <div className="h-[1px] w-24 bg-primary/20 mx-auto mt-6" />
      </div>
      
      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map((productItem) => (
            <ShoppingProductTile
              key={productItem._id}
              product={productItem}
              handleAddtoCart={handleAddtoCart}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-card/30 border border-dashed border-white/5 rounded-none animate-in fade-in zoom-in duration-700">
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/40 font-bold">Registry currently void</span>
          </div>
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-[0.2em] text-foreground/80">Anthology is Empty</h2>
          <p className="text-muted-foreground text-[12px] uppercase tracking-widest max-w-md leading-relaxed italic">Explore our masterworks and preserve the pieces that resonate with your style.</p>
        </div>
      )}
    </div>
  );
}

export default ShoppingWishlist;
