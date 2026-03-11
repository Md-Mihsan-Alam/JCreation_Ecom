import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
  isCheckout,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all duration-300 rounded-none bg-white/5 border ${
        selectedId?._id === addressInfo?._id
          ? "border-primary shadow-lg shadow-primary/10"
          : "border-white/5 hover:border-primary/50"
      }`}
    >
      <CardContent className="grid p-6 gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-[10px] uppercase tracking-widest text-primary font-bold">Address</Label>
          <span className="text-[13px] text-foreground font-medium">{addressInfo?.address}</span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[10px] uppercase tracking-widest text-primary font-bold">City & Pincode</Label>
          <span className="text-[13px] text-foreground font-medium">{addressInfo?.city}, {addressInfo?.pincode}</span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-[10px] uppercase tracking-widest text-primary font-bold">Contact</Label>
          <span className="text-[13px] text-foreground font-medium">{addressInfo?.phone}</span>
        </div>
        {addressInfo?.notes && (
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] uppercase tracking-widest text-primary font-bold">Notes</Label>
            <span className="text-[12px] text-muted-foreground italic">"{addressInfo?.notes}"</span>
          </div>
        )}
      </CardContent>
      {!isCheckout && (
        <CardFooter className="p-4 flex gap-4 border-t border-white/5">
          <Button 
            variant="outline"
            className="flex-1 rounded-none border-white/10 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-[11px] uppercase tracking-widest h-10"
            onClick={(e) => {
              e.stopPropagation();
              handleEditAddress(addressInfo);
            }}
          >
            Edit
          </Button>
          <Button 
            variant="outline"
            className="flex-1 rounded-none border-white/10 text-foreground hover:bg-red-900 hover:text-white hover:border-red-900 transition-all text-[11px] uppercase tracking-widest h-10"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAddress(addressInfo);
            }}
          >
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default AddressCard;
