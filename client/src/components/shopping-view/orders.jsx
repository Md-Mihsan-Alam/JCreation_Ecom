import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  console.log(orderDetails, "orderDetails");

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-[14px] font-bold uppercase tracking-[0.2em] text-primary">Purchase History</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">Inquiry ID</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">Date</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">Status</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">Investment</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0
                ? orderList.map((orderItem) => (
                    <TableRow key={orderItem?._id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="text-foreground font-medium text-[13px]">{orderItem?._id}</TableCell>
                      <TableCell className="text-foreground font-medium text-[13px]">{orderItem?.orderDate.split("T")[0]}</TableCell>
                      <TableCell>
                        <Badge
                          className={`py-1 px-3 rounded-none text-[10px] uppercase tracking-widest ${
                            orderItem?.orderStatus === "confirmed"
                              ? "bg-primary text-primary-foreground"
                              : orderItem?.orderStatus === "rejected"
                              ? "bg-red-900 text-white"
                              : "bg-white/10 text-foreground"
                          }`}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground font-bold text-[13px]">Tk {orderItem?.totalAmount?.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right">
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            if (openDetailsDialog) {
                               setOpenDetailsDialog(false);
                               dispatch(resetOrderDetails());
                            }
                          }}
                        >
                          <Button
                            variant="outline"
                            className="rounded-none border-white/10 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-[11px] uppercase tracking-widest"
                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                          >
                            View Gallery
                          </Button>
                          <ShoppingOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="flex flex-col gap-4 md:hidden">
          {orderList && orderList.length > 0
            ? orderList.map((orderItem) => (
                <div key={orderItem?._id} className="bg-white/5 border border-white/5 p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Archive ID</span>
                      <span className="text-[12px] font-bold text-foreground">{orderItem?._id}</span>
                    </div>
                    <Badge
                      className={`py-1 px-3 rounded-none text-[9px] uppercase tracking-widest ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-primary text-primary-foreground"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-900 text-white"
                          : "bg-white/10 text-foreground"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Registry Date</span>
                      <span className="text-[12px] font-medium text-foreground/80">{orderItem?.orderDate.split("T")[0]}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Investment</span>
                      <span className="text-[12px] font-bold text-primary">Tk {orderItem?.totalAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        if (openDetailsDialog) {
                           setOpenDetailsDialog(false);
                           dispatch(resetOrderDetails());
                        }
                      }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full rounded-none bg-white/5 border border-white/10 text-foreground hover:bg-primary hover:text-primary-foreground transition-all text-[11px] uppercase tracking-[0.2em] font-bold h-12"
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      >
                        Examine Gallery
                      </Button>
                      <ShoppingOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </div>
                </div>
              ))
            : null}
        </div>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
