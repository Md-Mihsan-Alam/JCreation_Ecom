import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md bg-card border-white/5 p-6 shadow-2xl">
      <SheetHeader className="border-b border-white/5 pb-4">
        <SheetTitle className="text-[16px] font-bold uppercase tracking-[0.2em] text-foreground">Anthology Review</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => (
              <UserCartItemsContent
                key={item.productId || item._id}
                cartItem={item}
              />
            ))
          : null}
      </div>
      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex justify-between items-center">
          <span className="text-[12px] uppercase tracking-widest font-bold text-muted-foreground">Investment Total</span>
          <span className="text-xl font-bold text-primary">Tk {totalCartAmount?.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full h-14 bg-primary text-primary-foreground hover:brightness-110 font-bold uppercase tracking-[0.2em] text-[11px] rounded-none shadow-xl transition-all mt-8"
      >
        Proceed to Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
