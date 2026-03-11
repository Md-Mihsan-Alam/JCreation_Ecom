import Address from "@/components/shopping-view/address";
import img from "../../assets/j_banner.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "currentSelectedAddress");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    if (cartItems.items?.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });

      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });

      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  if (approvalURL && isPaymentStart) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[240px] w-full overflow-hidden border-b border-white/5">
        <img src={img} className="h-full w-full object-cover object-center brightness-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-2">Checkout</p>
          <h1 className="text-4xl font-bold uppercase tracking-[0.3em] text-foreground">Order Summary</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 mt-10 container mx-auto px-4 pb-20">
        <div className="bg-card border border-white/5 p-6 shadow-2xl">
          <h2 className="text-[14px] font-bold uppercase tracking-[0.2em] text-primary mb-6 border-b border-primary/10 pb-4">Shipping Address</h2>
          <Address
            selectedId={currentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
            isCheckout={true}
          />
        </div>
        <div className="flex flex-col gap-6 bg-card border border-white/5 p-6 shadow-2xl h-fit">
          <h2 className="text-[14px] font-bold uppercase tracking-[0.2em] text-primary mb-2 border-b border-primary/10 pb-4">Order Summary</h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items.map((item) => (
                  <UserCartItemsContent
                    key={item.productId || item._id}
                    cartItem={item}
                  />
                ))
              : null}
          </div>
          <div className="mt-4 space-y-4 pt-4 border-t border-white/5">
            <div className="flex justify-between items-center text-foreground">
              <span className="text-[12px] uppercase tracking-widest font-bold opacity-60">Subtotal</span>
              <span className="text-[14px] font-bold">Tk {totalCartAmount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-primary pt-2 border-t border-white/5">
              <span className="text-[14px] uppercase tracking-[0.2em] font-bold">Total Amount</span>
              <span className="text-xl font-bold">Tk {totalCartAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="mt-6 w-full">
            <Button 
              onClick={handleInitiatePaypalPayment} 
              className="w-full h-14 bg-primary text-primary-foreground hover:brightness-110 font-bold uppercase tracking-[0.2em] text-[11px] rounded-none shadow-xl transition-all"
            >
              {isPaymentStart
                ? "Processing..."
                : "Complete Order"}
            </Button>
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground/30 text-center mt-4">
              Secure SSL Encryption • J Creation Guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
