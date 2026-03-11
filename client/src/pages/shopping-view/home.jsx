import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import { ChevronLeftIcon, ChevronRightIcon, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { getFeatureImages } from "@/store/common-slice";
import axios from "axios";
import ProductDetailsDialog from "@/components/shopping-view/product-details";

const BRAND_SECTIONS = [
  { key: "sherwani", label: "Sherwani",  filterType: "collection", filterValue: "sherwani" },
  { key: "panjabi",  label: "Panjabi",   filterType: "collection", filterValue: "panjabi"  },
  { key: "suite",    label: "Suites",    filterType: "collection", filterValue: "suite"    },
  { key: "nagra",    label: "Nagra",     filterType: "collection", filterValue: "nagra", categoryValue: "footwear" },
  { key: "shoe",     label: "Shoes",     filterType: "collection", filterValue: "shoe", categoryValue: "footwear" },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [brandProducts, setBrandProducts] = useState({});
  const [newArrivals, setNewArrivals] = useState([]);

  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [detailsMode, setDetailsMode] = useState("full-details");
  const { productDetails } = useSelector((state) => state.shopProducts);

  // ── Slide auto-play ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!featureImageList?.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  // ── Fetch feature images ───────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  // ── Fetch 4 products per brand section + New Arrivals ─────────────────────
  useEffect(() => {
    async function loadAllHomeData() {
      const results = {};
      
      // Fetch New Arrivals first
      try {
        const naQuery = new URLSearchParams({ isNewArrival: true, sortBy: "price-lowtohigh" });
        const naRes = await axios.get(`https://jcreation-ecom.onrender.com/api/shop/products/get?${naQuery}`);
        setNewArrivals(naRes?.data?.data || []);
      } catch (err) {
        console.error("Failed to load new arrivals:", err);
      }

      // Fetch Brand Sections
      await Promise.all(
        BRAND_SECTIONS.map(async (section) => {
          try {
            const queryParams = {
              [section.filterType]: section.filterValue,
              sortBy: "price-lowtohigh",
            };
            if (section.categoryValue) {
              queryParams.category = section.categoryValue;
            }
            const query = new URLSearchParams(queryParams);
            const res = await axios.get(
              `https://jcreation-ecom.onrender.com/api/shop/products/get?${query}`
            );
            results[section.key] = (res?.data?.data || []).slice(0, 4);
          } catch {
            results[section.key] = [];
          }
        })
      );
      setBrandProducts(results);
    }
    loadAllHomeData();
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleAddtoCart(getCurrentProductId) {
    if (!user) {
      toast({ title: "Please login to add to cart", variant: "destructive" });
      return;
    }
    dispatch(
      addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId, mode = "full-details") {
    dispatch(fetchProductDetails(getCurrentProductId));
    setDetailsMode(mode);
    setOpenDetailsDialog(true);
  }

  // Removed automatic effect to prevent modal pop-up on back-navigation

  function navigateToBrand(section) {
    sessionStorage.removeItem("filters");
    const filters = {
      [section.filterType]: [section.filterValue],
    };

    if (section.categoryValue) {
      filters.category = [section.categoryValue];
    }

    sessionStorage.setItem("filters", JSON.stringify(filters));
    navigate(`/shop/product`);
  }

  // ── Shared section renderer ────────────────────────────────────────────────
  function ProductSection({ title, products, onViewAll }) {
    if (!products || products.length === 0) return null;
    return (
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          {/* Header row */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-2">
                Curated Anthology
              </p>
              <h2 className="text-3xl font-bold text-foreground uppercase tracking-widest">
                {title}
              </h2>
            </div>
            <Button
              variant="outline"
              className="rounded-none border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 uppercase tracking-widest text-[10px] flex items-center gap-3 px-8 py-6 font-bold bg-transparent"
              onClick={onViewAll}
            >
              Examine All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* 4-column product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleAddtoCart={handleAddtoCart}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero Slider ── */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList?.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + featureImageList.length) % featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-card/40 border-white/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all backdrop-blur-sm w-12 h-12 rounded-none"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % featureImageList.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-card/40 border-white/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all backdrop-blur-sm w-12 h-12 rounded-none"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </Button>
      </div>

      {/* ── New Arrivals ── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-2">
                Just Unveiled
              </p>
              <h2 className="text-3xl font-bold text-foreground uppercase tracking-widest">
                New Arrivals
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals?.length > 0
              ? newArrivals.map((product) => (
                  <ShoppingProductTile
                    key={product._id}
                    product={product}
                    handleAddtoCart={handleAddtoCart}
                    handleGetProductDetails={handleGetProductDetails}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      {/* ── Brand Sections ── */}
      {BRAND_SECTIONS.map((section) => (
        <ProductSection
          key={section.key}
          title={section.label}
          products={brandProducts[section.key]}
          onViewAll={() => navigateToBrand(section)}
        />
      ))}

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        mode={detailsMode}
      />
    </div>
  );
}

export default ShoppingHome;
