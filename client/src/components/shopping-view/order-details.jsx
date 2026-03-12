import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="w-[95vw] max-w-[700px] max-h-[90vh] overflow-y-auto bg-card border border-white/5 p-0 rounded-none shadow-2xl scrollbar-hide">
      <div className="p-6 sm:p-10 space-y-8">
        {/* Header Section */}
        <div className="border-b border-white/5 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-1">Detailed Inquiry</p>
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-foreground">AESTHETIC REPORT</h2>
             </div>
             <Badge
                className={`w-fit py-1.5 px-4 rounded-none text-[10px] uppercase tracking-[0.2em] font-bold ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-primary text-primary-foreground"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-900 text-white"
                    : "bg-white/10 text-foreground"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
          </div>
        </div>

        {/* Order Meta Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
            {[
              { label: "Archive ID", value: orderDetails?._id },
              { label: "Date of Registry", value: orderDetails?.orderDate.split("T")[0] },
              { label: "Total Investment", value: `Tk ${orderDetails?.totalAmount?.toLocaleString('en-IN')}`, highlight: true },
              { label: "Payment Channel", value: orderDetails?.paymentMethod },
              { label: "Transaction State", value: orderDetails?.paymentStatus },
            ].map((info) => (
              <div key={info.label} className="flex flex-col gap-1 border-b border-white/5 sm:border-none pb-2 sm:pb-0">
                <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-medium">{info.label}</span>
                <span className={`text-[13px] font-bold uppercase tracking-wider ${info.highlight ? 'text-primary' : 'text-foreground/90'}`}>
                  {info.value}
                </span>
              </div>
            ))}
        </div>

        <Separator className="bg-white/5" />

        {/* Cart Evolution (Items) */}
        <div className="space-y-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Curated Selections</h3>
          <div className="space-y-4">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
              orderDetails?.cartItems.map((item) => (
                <div key={item.id} className="group flex items-start justify-between bg-white/2 hover:bg-white/5 p-4 border border-white/5 transition-all">
                  <div className="flex flex-col gap-1 max-w-[70%]">
                    <span className="text-[12px] font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Quantity: {item.quantity}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[12px] font-bold text-primary">
                      Tk {item.price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </div>

        <Separator className="bg-white/5" />

        {/* Destination Info */}
        <div className="space-y-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Shipping Log</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/2 p-6 border border-white/5">
            <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Consignee</span>
                  <span className="text-[13px] font-bold uppercase tracking-wider text-foreground">{user.userName}</span>
               </div>
               <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Coordinates</span>
                  <div className="flex flex-col text-[12px] text-foreground/80 lowercase italic font-medium">
                    <span>{orderDetails?.addressInfo?.address}</span>
                    <span>{orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}</span>
                  </div>
               </div>
            </div>
            <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Registry Phone</span>
                  <span className="text-[13px] font-bold tracking-widest text-foreground">{orderDetails?.addressInfo?.phone}</span>
               </div>
               {orderDetails?.addressInfo?.notes && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Special Directives</span>
                    <p className="text-[11px] text-muted-foreground/80 italic leading-relaxed">"{orderDetails?.addressInfo?.notes}"</p>
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
