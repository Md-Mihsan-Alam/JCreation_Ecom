import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(orderDetails, "orderDetailsorderDetails");

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[600px] bg-card border-white/5 rounded-none shadow-2xl animate-fade-in-up">
      <div className="grid gap-6 pt-6 animate-fade-in-up">
        <div className="grid gap-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Inquiry ID</p>
            <Label className="text-foreground font-bold tracking-wider">{orderDetails?._id}</Label>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Date of Origin</p>
            <Label className="text-foreground font-medium">{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Total Investment</p>
            <Label className="text-primary font-bold">Tk {orderDetails?.totalAmount?.toLocaleString('en-IN')}</Label>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Transaction Method</p>
            <Label className="text-foreground uppercase tracking-widest text-[10px] font-bold">{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Transaction Status</p>
            <Label className="text-foreground uppercase tracking-widest text-[10px] font-bold">{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Inquiry Status</p>
            <Label>
              <Badge
                className={`py-1 px-4 rounded-none text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-primary text-primary-foreground"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-900 text-white"
                    : "bg-white/10 text-foreground"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-primary font-bold">Creation Anthology</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li className="flex items-center justify-between bg-white/5 p-3 border border-white/5 transition-all hover:border-primary/20" key={item.productId}>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold uppercase tracking-wider text-foreground">{item.title}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Quantity: {item.quantity}</span>
                      </div>
                      <span className="text-[12px] font-bold text-primary">Tk {item.price?.toLocaleString('en-IN')}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="text-[11px] uppercase tracking-[0.2em] text-primary font-bold">Consignment Destination</div>
            <div className="grid gap-2 text-[12px] leading-relaxed text-foreground bg-white/5 p-4 border border-white/5">
              <div className="flex justify-between"><span className="text-muted-foreground uppercase tracking-tighter">Recipient:</span> <span className="font-bold">{user.userName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground uppercase tracking-tighter">Address:</span> <span className="font-medium text-right max-w-[250px]">{orderDetails?.addressInfo?.address}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground uppercase tracking-tighter">City:</span> <span className="font-medium">{orderDetails?.addressInfo?.city}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground uppercase tracking-tighter">Phone/Registry:</span> <span className="font-medium">{orderDetails?.addressInfo?.phone}</span></div>
              {orderDetails?.addressInfo?.notes && (
                <div className="mt-2 pt-2 border-t border-white/5 italic text-muted-foreground">"{orderDetails?.addressInfo?.notes}"</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-6 border border-white/5 mt-4">
          <CommonForm
            formControls={[
              {
                label: "Inquiry Status Lifecycle",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending Anthology" },
                  { id: "inProcess", label: "In Preparation" },
                  { id: "inShipping", label: "In Transit" },
                  { id: "delivered", label: "Consigned" },
                  { id: "rejected", label: "Declined" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
