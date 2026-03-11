import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XIcon } from "lucide-react";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  console.log(uploadedImageUrl, "uploadedImageUrl");

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  console.log(featureImageList, "featureImageList");

  function handleDeleteFeatureImage(id) {
    if (!id) return;
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  return (
    <div className="space-y-8 animate-fade-in-scale">
      <div className="bg-card border border-white/5 p-8 shadow-2xl">
        <h2 className="text-[14px] font-bold uppercase tracking-[0.3em] text-primary mb-8 border-b border-white/5 pb-4">Curation: Hero Exhibits</h2>
        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling={true}
        />
        <Button 
          onClick={handleUploadFeatureImage} 
          className="mt-8 w-full rounded-none bg-primary text-primary-foreground font-bold uppercase tracking-[0.2em] text-[11px] h-12 hover:brightness-110 shadow-xl transition-all"
          disabled={!imageFile || uploadedImageUrl === "" || imageLoadingState}
        >
          {imageLoadingState ? "Uploading Asset..." : "Induct into Exhibit"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div className="relative group overflow-hidden border border-white/5 bg-white/5 shadow-2xl" key={featureImgItem._id}>
                <img
                  src={featureImgItem.image}
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="w-12 h-12 rounded-none bg-red-900 border border-red-800 hover:bg-red-800 transition-all text-white shadow-2xl"
                    onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                  >
                    <XIcon className="h-5 w-5" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold bg-black/40 px-3 py-1 backdrop-blur-md">Featured Asset</span>
                </div>
              </div>
            ))
          : <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/30 font-bold">The Anthology is Currently Vacant</p>
            </div>}
      </div>
    </div>
  );
}

export default AdminDashboard;
