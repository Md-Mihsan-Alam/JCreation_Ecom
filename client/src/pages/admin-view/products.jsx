import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  stockM: "",
  stockL: "",
  stockXL: "",
  stock2XL: "",
  stock3XL: "",
  stock4XL: "",
  averageReview: 0,
  isNewArrival: false,
  imageGallery: [],
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [galleryImageFile, setGalleryImageFile] = useState(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData: uploadedImageUrl !== "" ? { ...formData, image: uploadedImageUrl } : formData,
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            setUploadedImageUrl("");
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            setUploadedImageUrl("");
            toast({
              title: "Product add successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter(
        (currentKey) =>
          currentKey !== "averageReview" &&
          currentKey !== "salePrice" &&
          currentKey !== "stockM" &&
          currentKey !== "stockL" &&
          currentKey !== "stockXL" &&
          currentKey !== "stock2XL" &&
          currentKey !== "stock3XL" &&
          currentKey !== "stock4XL"
      )
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  console.log(formData, "productList");

  return (
    <Fragment>
      <div className="mb-8 w-full flex justify-between items-center border-b border-white/5 pb-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-primary">Inventory Master</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Management & Oversight</p>
        </div>
        <Button 
          onClick={() => setOpenCreateProductsDialog(true)}
          className="rounded-none bg-primary text-primary-foreground font-bold uppercase tracking-[0.2em] text-[11px] h-11 px-8 hover:brightness-110 shadow-xl transition-all"
        >
          Add New Creation
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
                setUploadedImageUrl={setUploadedImageUrl}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setUploadedImageUrl("");
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader className="border-b border-white/5 pb-4">
            <SheetTitle className="text-[14px] font-bold uppercase tracking-[0.2em] text-primary">
              {currentEditedId !== null ? "Refine Creation" : "New Creation Entry"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
            id="main-image-upload"
          />
          <div className="mt-8 mb-8 border-t border-white/5 pt-8">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-[12px] uppercase tracking-widest font-bold text-foreground">Gallery Preview</Label>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary bg-primary/10 px-3 py-1">
                {formData.imageGallery?.length || 0} / 10 Assets
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.imageGallery && formData.imageGallery.map((img, index) => (
                <div key={index} className="relative group aspect-[4/5] border border-white/5 rounded-none overflow-hidden bg-white/5 shadow-2xl hover:border-primary transition-all">
                  <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                      onClick={() => setFormData({
                        ...formData,
                        imageGallery: formData.imageGallery.filter((_, i) => i !== index)
                      })}
                      className="bg-red-600 text-white rounded-none w-10 h-10 flex items-center justify-center hover:bg-red-700 transition-colors shadow-2xl"
                      title="Remove Image"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {(!formData.imageGallery || formData.imageGallery.length < 10) && (
                <div className="relative aspect-[4/5] border-2 border-dashed border-white/10 rounded-none hover:border-primary transition-colors bg-white/5 flex items-center justify-center group/add">
                  <ProductImageUpload
                    imageFile={galleryImageFile}
                    setImageFile={setGalleryImageFile}
                    uploadedImageUrl={""}
                    setUploadedImageUrl={(url) => {
                      setFormData({
                        ...formData,
                        imageGallery: [...(formData.imageGallery || []), url]
                      });
                      setGalleryImageFile(null);
                    }}
                    setImageLoadingState={setImageLoadingState}
                    imageLoadingState={imageLoadingState}
                    isEditMode={false}
                    isCustomStyling={true}
                    id="gallery-image-upload"
                  />
                </div>
              )}
            </div>
            {formData.imageGallery?.length >= 10 && <p className="text-[10px] text-primary/40 italic mt-3 tracking-widest uppercase">Max Capacity Reached.</p>}
            <p className="mt-4 text-[10px] text-muted-foreground/40 italic uppercase tracking-[0.1em]">
              * Secure high-resolution vertical captures for exhibition excellence.
            </p>
          </div>
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={
                formData.category === "footwear" ||
                formData.brand === "nagra" ||
                formData.brand === "shoe"
                  ? addProductFormElements.map((control) => {
                      if (control.name === "stockM")
                        return {
                          ...control,
                          label: "Stock (Size 38)",
                          placeholder: "Enter stock for size 38",
                        };
                      if (control.name === "stockL")
                        return {
                          ...control,
                          label: "Stock (Size 40)",
                          placeholder: "Enter stock for size 40",
                        };
                      if (control.name === "stockXL")
                        return {
                          ...control,
                          label: "Stock (Size 42)",
                          placeholder: "Enter stock for size 42",
                        };
                      if (control.name === "stock2XL")
                        return {
                          ...control,
                          label: "Stock (Size 44)",
                          placeholder: "Enter stock for size 44",
                        };
                      if (control.name === "stock3XL")
                        return {
                          ...control,
                          label: "Stock (Size 46)",
                          placeholder: "Enter stock for size 46",
                        };
                      if (control.name === "stock4XL")
                        return {
                          ...control,
                          label: "Stock (Size 48)",
                          placeholder: "Enter stock for size 48",
                        };
                      return control;
                    })
                  : addProductFormElements
              }
              isBtnDisabled={
                !isFormValid() ||
                imageLoadingState ||
                (imageFile !== null && uploadedImageUrl === "")
              }
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
