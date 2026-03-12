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
import { API_URL } from "@/config";
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
        const naRes = await axios.get(`${API_URL}/api/shop/products/get?${naQuery}`);
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
              `${API_URL}/api/shop/products/get?${query}`
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
      <section className="py-10 sm:py-16 border-t border-white/5">
        <div className="container mx-auto px-4">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] text-primary font-bold mb-2">
                Curated Anthology
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-widest">
                {title}
              </h2>
            </div>
            <Button
              variant="outline"
              className="rounded-none border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 uppercase tracking-widest text-[9px] sm:text-[10px] flex items-center gap-3 px-6 sm:px-8 py-4 sm:py-6 font-bold bg-transparent sm:w-auto w-full justify-center"
              onClick={onViewAll}
            >
              Examine All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* 2-column or 4-column product grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
      <div className="relative w-full h-[350px] sm:h-[500px] lg:h-[650px] overflow-hidden mt-16 sm:mt-0">
        {featureImageList?.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
                } absolute top-0 left-0 w-full h-full object-cover transition-all duration-[2000ms] ease-out`}
              />
            ))
          : null}
        
        {/* Luxury Overlay for Hero */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20 z-0" />

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + featureImageList.length) % featureImageList.length
            )
          }
          className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-card/40 border-white/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all backdrop-blur-sm w-10 h-10 sm:w-12 sm:h-12 rounded-none"
        >
          <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % featureImageList.length)
          }
          className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-card/40 border-white/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all backdrop-blur-sm w-10 h-10 sm:w-12 sm:h-12 rounded-none"
        >
          <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>

        {/* Hero Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
          {featureImageList?.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-0.5 transition-all duration-500 ${idx === currentSlide ? 'w-12 bg-primary' : 'w-6 bg-white/20'}`}
            />
          ))}
        </div>
      </div>

      {/* ── New Arrivals ── */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.6em] text-primary font-bold mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
              Just Unveiled
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold text-foreground uppercase tracking-[0.2em] mb-6">
              New Arrivals
            </h2>
            <div className="w-20 h-0.5 bg-primary/30" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
      <div className="space-y-4">
        {BRAND_SECTIONS.map((section) => (
          <ProductSection
            key={section.key}
            title={section.label}
            products={brandProducts[section.key]}
            onViewAll={() => navigateToBrand(section)}
          />
        ))}
      </div>

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
