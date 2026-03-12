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
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  console.log(orderDetails, "orderList");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="bg-card border-white/5 rounded-none shadow-2xl">
      <CardHeader className="border-b border-white/5">
        <CardTitle className="text-[14px] font-bold uppercase tracking-[0.2em] text-primary">Inquiry Management</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">Inquiry ID</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">Date</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">Gallery</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">Status</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">Total Price</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0
                ? orderList.map((orderItem) => (
                    <TableRow key={orderItem?._id} className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="text-foreground font-medium text-[13px]">{orderItem?._id}</TableCell>
                      <TableCell className="text-foreground font-medium text-[13px]">{orderItem?.orderDate.split("T")[0]}</TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {orderItem?.cartItems && orderItem?.cartItems.slice(0, 3).map((item, index) => (
                            <div 
                              key={index}
                              className="w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-white/5 shadow-md"
                            >
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {orderItem?.cartItems && orderItem?.cartItems.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-background bg-white/10 flex items-center justify-center text-[9px] font-bold text-foreground shadow-md backdrop-blur-sm">
                              +{orderItem?.cartItems.length - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`py-1 px-3 rounded-none text-[10px] uppercase tracking-widest font-bold shadow-lg ${
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
                      <TableCell>
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            variant="outline"
                            className="rounded-none border-white/10 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-[11px] uppercase tracking-widest h-9 px-4"
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                          >
                            Review Entry
                          </Button>
                          <AdminOrderDetailsView orderDetails={orderDetails} />
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
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Inquiry ID</span>
                      <span className="text-[12px] font-bold text-foreground">{orderItem?._id}</span>
                    </div>
                    <Badge
                      className={`py-1 px-3 rounded-none text-[9px] uppercase tracking-widest font-bold shadow-lg ${
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

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5">
                    <div className="flex flex-col gap-2">
                       <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Gallery</span>
                       <div className="flex -space-x-2">
                        {orderItem?.cartItems && orderItem?.cartItems.slice(0, 3).map((item, index) => (
                          <div 
                            key={index}
                            className="w-7 h-7 rounded-full border border-background overflow-hidden bg-white/5"
                          >
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {orderItem?.cartItems && orderItem?.cartItems.length > 3 && (
                          <div className="w-7 h-7 rounded-full border border-background bg-white/10 flex items-center justify-center text-[8px] font-bold text-foreground">
                            +{orderItem?.cartItems.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Price</span>
                      <span className="text-[12px] font-bold text-primary">Tk {orderItem?.totalAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-white/2 p-2 px-3 border border-white/5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Date</span>
                      <span className="text-[11px] font-medium text-foreground">{orderItem?.orderDate.split("T")[0]}</span>
                    </div>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        variant="outline"
                        className="rounded-none border-white/10 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-[10px] uppercase tracking-[0.2em] font-bold h-10 px-6"
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      >
                        Review
                      </Button>
                      <AdminOrderDetailsView orderDetails={orderDetails} />
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

export default AdminOrdersView;
