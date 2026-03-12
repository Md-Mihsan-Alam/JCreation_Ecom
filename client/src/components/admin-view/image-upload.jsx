import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { API_URL } from "@/config";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  id = "image-upload",
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);

  console.log(isEditMode, "isEditMode");

  function handleImageFileChange(event) {
    console.log(event.target.files, "event.target.files");
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);

    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    const response = await axios.post(
      `${API_URL}/api/admin/products/upload-image`,
      data
    );
    console.log(response, "response");

    if (response?.data?.success) {
      setUploadedImageUrl(response.data.result.url);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div
      className={`w-full ${isCustomStyling ? "" : "max-w-md mx-auto mt-4"}`}
    >
      {!isCustomStyling && <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id={id}
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
        />
        {imageLoadingState ? (
          <Skeleton className="h-32 w-full bg-gray-100" />
        ) : !imageFile && !uploadedImageUrl ? (
          <Label
            htmlFor={id}
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-50 border">
              <img 
                src={imageFile ? URL.createObjectURL(imageFile) : uploadedImageUrl} 
                className="w-full h-full object-contain"
                alt="Product Preview"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove File</span>
              </Button>
            </div>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <FileIcon className="w-4 h-4 text-primary" />
                <p className="text-xs font-semibold truncate max-w-[200px] uppercase tracking-tighter">
                  {imageFile ? imageFile.name : "Current Anthology Image"}
                </p>
              </div>
              {isEditMode && !imageFile && (
                <Label
                  htmlFor={id}
                  className="text-[10px] font-bold uppercase tracking-widest cursor-pointer text-primary hover:underline"
                >
                  Replace Image
                </Label>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
