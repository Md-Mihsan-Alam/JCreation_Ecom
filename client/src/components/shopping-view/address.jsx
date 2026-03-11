import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonForm from "../common/form";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId, isCheckout }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });

      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast({
              title: "Address updated successfully",
            });
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            toast({
              title: "Address added successfully",
            });
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({
          title: "Address deleted successfully",
        });
      }
    });
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      ...formData,
      address: getCuurentAddress?.address,
      city: getCuurentAddress?.city,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  console.log(addressList, "addressList");

  return (
    <Card className="bg-card border-white/5 rounded-none shadow-2xl">
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addressList && addressList.length > 0
            ? addressList.map((singleAddressItem) => (
                <AddressCard
                  key={singleAddressItem._id}
                  selectedId={selectedId}
                  handleDeleteAddress={handleDeleteAddress}
                  addressInfo={singleAddressItem}
                  handleEditAddress={handleEditAddress}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                  isCheckout={isCheckout}
                />
              ))
            : null}
      </div>
      {!isCheckout && (
        <>
          <CardHeader className="border-t border-white/5 pt-8">
            <CardTitle className="text-[14px] font-bold uppercase tracking-[0.2em] text-primary">
              {currentEditedId !== null ? "Edit Address" : "Add New Address"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CommonForm
              formControls={addressFormControls}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              onSubmit={handleManageAddress}
              isBtnDisabled={!isFormValid()}
            />
          </CardContent>
        </>
      )}
      {isCheckout && addressList.length === 0 && (
        <div className="p-10 text-center border-t border-white/5">
            <p className="text-muted-foreground/60 text-[12px] uppercase tracking-widest mb-6 italic">No addresses found in your account.</p>
            <Button 
              className="rounded-none bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] px-8 py-6 h-auto shadow-xl hover:brightness-110"
              onClick={()=> navigate('/shop/account')}
            >
              Add Address
            </Button>
        </div>
      )}
    </Card>
  );
}

export default Address;
