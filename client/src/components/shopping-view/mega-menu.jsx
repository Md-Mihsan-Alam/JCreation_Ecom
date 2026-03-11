import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";

const collectionsData = [
  {
    id: "sherwani",
    label: "Sherwani",
    uniqueSub: "Masterpieces of Craftsmanship",
    subCategories: [
      { id: "hand-work", label: "Pure Hand Work Embroidery", detail: "Traditional Zardosi & Resham" },
      { id: "limited-edition", label: "Limited Edition Fabrics", detail: "Authentic Banarasi & Jamawar" },
      { id: "royal-classic", label: "Royal Classic Cut", detail: "Precision Tailored Silhouettes" },
    ],
  },
  {
    id: "panjabi",
    label: "Panjabi",
    uniqueSub: "The Essence of Tradition",
    subCategories: [
      { id: "hand-work", label: "Hand Work Embroidery", detail: "Masterfully Crafted Artistry" },
      { id: "premium-cotton", label: "Premium Egyptian Cotton", detail: "High Thread Count Comfort" },
      { id: "jacquard-silk", label: "Signature Jacquard Silk", detail: "Sophisticated Pattern Play" },
      { id: "kurta-style", label: "Traditional Kurta Cut", detail: "Classic Elegance for Every Occasion" },
    ],
  },
  {
    id: "suite",
    label: "Suites",
    uniqueSub: "Bespoke Suiting & Tailoring",
    subCategories: [
      { id: "wedding-suite", label: "Wedding Selection", detail: "Exquisite Styles for Your Special Day" },
      { id: "formal-three-piece", label: "Formal Three Piece", detail: "The Pinnacle of Executive Style" },
      { id: "business-two-piece", label: "Corporate Two Piece", detail: "Sharp Lines & Premium Wool" },
      { id: "luxury-tuxedo", label: "Luxury Tuxedo", detail: "Midnight Elegance for Black Tie Events" },
    ],
  },
  {
    id: "kabli",
    label: "Kabli",
    uniqueSub: "Pathani & Frontier Styles",
    subCategories: [
      { id: "frontier", label: "Frontier Classic Kabli", detail: "Robust & Elegant Design" },
      { id: "slim-kabli", label: "Modern Slim Fit", detail: "Contemporary Aesthetic" },
    ],
  },
  { id: "achkan", label: "Achkan", uniqueSub: "Legacy of the Nobles", subCategories: [{ id: "velvet", label: "Imperial Velvet", detail: "Rich Texture & Deep Hues" }] },
  { id: "coti", label: "Coti", uniqueSub: "Accents of Elegance", subCategories: [{ id: "waistcoat", label: "Handcrafted Waistcoats", detail: "Intricate Button Detailing" }] },
  { id: "prince-coat", label: "Prince Coat", uniqueSub: "Modern Aristocracy", subCategories: [{ id: "formal", label: "Bespoke Prince Coats", detail: "Structured Formal Perfection" }] },
  { id: "blazer", label: "Blazer", uniqueSub: "Executive Precision", subCategories: [{ id: "italian", label: "Italian Cut Blazers", detail: "Lightweight & Breathable" }] },
  { id: "nagra", label: "Nagra", uniqueSub: "Traditional Step", subCategories: [{ id: "mojari", label: "Hand-stitched Mojari", detail: "Pure Leather Artistry" }] },
  { id: "payjama", label: "Payjama", uniqueSub: "Foundation of Style", subCategories: [{ id: "aligarh", label: "Aligarh Style", detail: "Classic Straight Cut" }] },
];

const footwearData = [
  {
    id: "shoe",
    label: "Shoes",
    category: "footwear",
    uniqueSub: "Step into Sophistication",
    subCategories: [
      { id: "formal-shoes", label: "Formal Leather Shoes", detail: "Hand-finished Premium Leather" },
      { id: "casual-loafers", label: "Luxury Loafers", detail: "Perfect Blend of Style & Comfort" },
      { id: "oxford", label: "Classic Oxfords", detail: "Timeless Business Elegance" },
    ],
  },
  {
    id: "nagra",
    label: "Nagra",
    category: "footwear",
    uniqueSub: "Traditional Step",
    subCategories: [
      { id: "mojari", label: "Hand-stitched Mojari", detail: "Pure Leather Artistry" },
      { id: "wedding-nagra", label: "Wedding Selection", detail: "Exquisite Traditional Designs" },
      { id: "casual-nagra", label: "Casual Traditional", detail: "Everyday Traditional Comfort" },
    ],
  },
];

function BaseMegaMenu({ isOpen, setIsOpen, data, sectionTitle }) {
  const [activeCategory, setActiveCategory] = useState(data[0]);
  const [render, setRender] = useState(isOpen);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.shopProducts);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const timer = setTimeout(() => setActive(true), 10);
      return () => clearTimeout(timer);
    } else {
      setActive(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllFilteredProducts({ 
        filterParams: {}, 
        sortParams: "price-hightolow" 
      }));
      setActiveCategory(data[0]);
    }
  }, [isOpen, dispatch, data]);

  const getFeaturedProducts = (collectionId) => {
    return productList
      .filter((item) => {
        return item.brand === collectionId;
      })
      .slice(0, 2);
  };

  function handleMegaMenuNavigate(categoryItem) {
    sessionStorage.removeItem("filters");
    
    const collectionId = categoryItem.id;
    const collectionIds = [collectionId];

    const currentFilter = {
      collection: collectionIds,
    };

    if (categoryItem.category) {
      currentFilter.category = [categoryItem.category];
    }

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    setIsOpen(false);
    
    const query = new URLSearchParams({ collection: collectionIds.join(',') });
    if (categoryItem.category) query.append('category', categoryItem.category);
    
    navigate(`/shop/product?${query.toString()}`);
  }

  if (!render) return null;

  return (
    <div 
      className="fixed inset-0 top-16 z-50 pointer-events-none"
    >
      <div 
        className={`w-full bg-popover shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out pointer-events-auto border-b border-white/5
          ${active ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        `}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="container mx-auto px-6 py-10 flex min-h-[500px]">
          {/* Left Side: Main Categories */}
          <div className="w-1/4 border-r border-white/5 pr-8">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold mb-8">{sectionTitle}</h3>
            <div className="flex flex-col gap-2">
              {data.map((category) => (
                <button
                  key={category.id}
                  onMouseEnter={() => setActiveCategory(category)}
                  onClick={() => handleMegaMenuNavigate(category)}
                  className={`flex items-center justify-between group py-3 px-4 rounded-none transition-all duration-300 border-l-2
                    ${activeCategory.id === category.id 
                      ? "bg-white/5 text-primary border-primary" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground border-transparent"}`}
                >
                  <span className="text-sm font-bold uppercase tracking-wider">{category.label}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeCategory.id === category.id ? "opacity-100" : "opacity-0"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Middle: Sub-navigation / Details */}
          <div className="w-1/4 px-10 border-r border-white/5 flex flex-col">
            <div className="mb-10">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold mb-1">
                {activeCategory.label} Series
              </h3>
              <p className="text-[11px] text-muted-foreground/60 font-medium italic mt-1 pb-4 border-b border-white/5 uppercase tracking-widest">{activeCategory.uniqueSub}</p>
            </div>
            
            <div className="flex flex-col gap-8">
              {activeCategory.subCategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleMegaMenuNavigate(activeCategory)}
                  className="group flex flex-col items-start"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[13px] text-foreground/90 font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                      {sub.label}
                    </span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-1 group-hover:text-muted-foreground/80 transition-colors">
                    {sub.detail}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="mt-auto pt-6">
              <button 
                onClick={() => handleMegaMenuNavigate(activeCategory)}
                className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-primary group w-full hover:brightness-125 pt-2"
              >
                <span>View Full Anthology</span>
                <div className="h-[1px] flex-1 bg-white/10 group-hover:bg-primary transition-colors" />
              </button>
            </div>
          </div>

          {/* Right Area: Featured Products */}
          <div className="w-2/4 pl-10">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold mb-8">Featured {activeCategory.label}</h3>
            <div className="grid grid-cols-2 gap-8">
              {getFeaturedProducts(activeCategory.id).length > 0 ? (
                getFeaturedProducts(activeCategory.id).map((item) => (
                  <div key={item._id || item.id} className="group cursor-pointer" onClick={() => {
                    setIsOpen(false);
                    navigate(`/shop/product`);
                  }}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-white/5 rounded-none mb-4 border border-white/5">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 text-[10px] uppercase font-bold tracking-widest shadow-lg">
                        {item.brand}
                      </div>
                    </div>
                    <h4 className="text-[12px] font-bold text-foreground uppercase tracking-tight truncate">{item.title}</h4>
                    <p className="text-[10px] text-primary font-bold mt-1">Tk {item.price?.toLocaleString('en-IN')}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-20 px-4 bg-white/5 border border-dashed rounded-none border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Inventory Update</p>
                  <p className="text-[11px] text-muted-foreground/60 italic mt-3 text-center opacity-70">
                    Discover our upcoming {activeCategory.label} collection soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CollectionsMegaMenu(props) {
  return <BaseMegaMenu {...props} data={collectionsData} sectionTitle="Exclusive Collections" />;
}

export function FootwearMegaMenu(props) {
  return <BaseMegaMenu {...props} data={footwearData} sectionTitle="Footwear Anthology" />;
}

export default CollectionsMegaMenu;
