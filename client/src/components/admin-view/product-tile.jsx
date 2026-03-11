import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { useState } from "react";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
  setUploadedImageUrl,
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <Card className="w-full max-w-sm mx-auto shadow-2xl bg-card border-white/5 rounded-none overflow-hidden hover:border-primary transition-all duration-300 group">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover bg-white/5 rounded-none transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-5">
          <h2 className="text-[14px] font-bold uppercase tracking-widest text-foreground truncate mb-3">{product?.title}</h2>
          <div className="flex justify-between items-center bg-white/5 p-3">
            <span
              className={`${
                product?.salePrice > 0 ? "text-muted-foreground/50 line-through" : "text-primary"
              } text-[13px] font-bold uppercase tracking-widest`}
            >
              Tk {product?.price?.toLocaleString('en-IN')}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-[13px] font-bold text-primary uppercase tracking-widest">Tk {product?.salePrice?.toLocaleString('en-IN')}</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center gap-4 p-5 pt-0">
          <Button
            variant="outline"
            className="flex-1 rounded-none border-white/10 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-[11px] uppercase tracking-widest h-10"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData({
                ...product,
                imageGallery: product.imageGallery || [],
              });
              setUploadedImageUrl(product.image);
            }}
          >
            Refine
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-none border-white/10 text-foreground hover:bg-red-900 hover:text-white hover:border-red-900 transition-all text-[11px] uppercase tracking-widest h-10"
            onClick={() => setShowDeleteDialog(true)}
          >
            Expunge
          </Button>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent className="sm:max-w-[400px] bg-card border border-white/5 rounded-none shadow-2xl animate-fade-in-up">
              <DialogHeader>
                <DialogTitle className="text-[14px] font-bold uppercase tracking-[0.2em] text-primary">
                  Inquiry: Permanent Removal
                </DialogTitle>
                <DialogDescription className="py-6 text-[12px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                  Are you absolutely certain you wish to expunge <span className="text-foreground font-bold">"{product?.title}"</span> from the permanent anthology? This action is irreversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-4 sm:gap-0">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1 rounded-none border-white/10 text-foreground hover:bg-white/5 transition-all text-[11px] uppercase tracking-widest h-11"
                >
                  Retain
                </Button>
                <Button 
                  onClick={() => {
                    handleDelete(product?._id);
                    setShowDeleteDialog(false);
                  }}
                  className="flex-1 bg-red-900 text-white rounded-none hover:bg-red-800 transition-all text-[11px] uppercase tracking-widest h-11"
                >
                  Expunge
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
