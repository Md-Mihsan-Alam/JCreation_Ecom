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
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">Inquiry ID</TableHead>
              <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">Date</TableHead>
              <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">Status</TableHead>
              <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">Investment</TableHead>
              <TableHead className="text-primary font-bold uppercase tracking-wider text-[11px]">
                <span className="sr-only">Actions</span>
              </TableHead>
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
                          className="rounded-none border-white/10 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-[11px] uppercase tracking-widest"
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
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
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
