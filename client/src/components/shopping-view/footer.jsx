import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

function ShoppingFooter() {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Newsletter logic
  };

  return (
    <footer className="bg-[#030408] border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* ── TOP SECTION: BRAND & NEWSLETTER ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 mb-20">
          <div className="flex flex-col gap-6">
            <Link to="/shop/home" className="flex items-center gap-2 group w-fit">
              <span className="text-3xl font-black tracking-[0.3em] text-foreground uppercase group-hover:text-primary transition-colors">
                J-Creation
              </span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse mt-1"></div>
            </Link>
            <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] leading-relaxed max-w-xl italic">
              Redefining luxury through timeless craftsmanship and heritage. 
              Our creations are more than just garments; they are a legacy of elegance 
              passed down through generations.
            </p>
            <div className="flex gap-4 mt-2">
              {[
                { icon: <Facebook className="w-4 h-4" />, href: "#" },
                { icon: <Instagram className="w-4 h-4" />, href: "#" },
                { icon: <Twitter className="w-4 h-4" />, href: "#" }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.href} 
                  className="w-10 h-10 flex items-center justify-center border border-white/10 text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300 rounded-none bg-white/5"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 bg-white/5 p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -rotate-45 translate-x-12 -translate-y-12 transition-transform duration-700 group-hover:scale-150"></div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-primary flex items-center gap-3">
              <span className="w-4 h-[1px] bg-primary"></span> Join The Elite
            </h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest leading-loose">
              Subscribe to receive updates on new collections and exclusive invitations to private events.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input 
                placeholder="AUTHENTIC EMAIL" 
                className="bg-transparent border-white/10 rounded-none focus:border-primary transition-all text-[10px] tracking-widest h-12 uppercase"
              />
              <Button className="h-12 px-6 bg-primary text-primary-foreground rounded-none font-bold uppercase tracking-widest text-[10px] hover:brightness-110 shadow-lg">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        <Separator className="bg-white/5 mb-16" />

        {/* ── MAIN LINKS SECTION ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* THE COLLECTIONS */}
          <div className="flex flex-col gap-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">The Collections</h4>
            <ul className="flex flex-col gap-4">
              {['Sherwani', 'Panjabi', 'Suites', 'Footwear', 'Accessories'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/shop/product`} 
                    className="text-[11px] text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-[1px] bg-primary transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CLIENT SERVICES */}
          <div className="flex flex-col gap-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Client Services</h4>
            <ul className="flex flex-col gap-4">
              {['Size Guide', 'Shipping Policy', 'Returns & Exchanges', 'Care Instructions', 'FAQs'].map((item) => (
                <li key={item}>
                  <Link 
                    to="#" 
                    className="text-[11px] text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-[1px] bg-primary transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* THE HOUSE */}
          <div className="flex flex-col gap-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">The House</h4>
            <ul className="flex flex-col gap-4">
              {['Our Story', 'Craftsmanship', 'Bespoke Services', 'Store Locator', 'Careers'].map((item) => (
                <li key={item}>
                  <Link 
                    to="#" 
                    className="text-[11px] text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-[1px] bg-primary transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LIAISON */}
          <div className="flex flex-col gap-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Liaison</h4>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-start group">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest leading-loose">
                  12/A Elite Avenue, Gulshan Circle 2,<br />Dhaka 1212, Bangladesh
                </p>
              </div>
              <div className="flex gap-4 items-center group">
                <Phone className="w-4 h-4 text-primary" />
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest">+880 1700 000000</p>
              </div>
              <div className="flex gap-4 items-center group">
                <Mail className="w-4 h-4 text-primary" />
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest italic">concierge@jcreation.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── TRUST BADGES ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-white/5 mb-16">
          <div className="flex flex-col items-center text-center gap-3 group">
            <ShieldCheck className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <h5 className="text-[9px] font-bold uppercase tracking-[0.3em] text-foreground">Secure Acquisition</h5>
          </div>
          <div className="flex flex-col items-center text-center gap-3 group">
            <Truck className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <h5 className="text-[9px] font-bold uppercase tracking-[0.3em] text-foreground">Global Delivery</h5>
          </div>
          <div className="flex flex-col items-center text-center gap-3 group">
            <RotateCcw className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <h5 className="text-[9px] font-bold uppercase tracking-[0.3em] text-foreground">Elite Returns</h5>
          </div>
          <div className="flex flex-col items-center text-center gap-3 group">
            <CreditCard className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <h5 className="text-[9px] font-bold uppercase tracking-[0.3em] text-foreground">Multiple Channels</h5>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-[9px] text-muted-foreground uppercase tracking-[0.3em]">
              © {currentYear} J-Creation. All Rights Reserved.
            </p>
            <div className="flex gap-4 opacity-30">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 grayscale invert" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-3 grayscale invert" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3 grayscale invert" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-[9px] text-muted-foreground uppercase tracking-[0.3em] hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-[9px] text-muted-foreground uppercase tracking-[0.3em] hover:text-primary transition-colors">Terms of Exhibit</Link>
            <span className="text-[9px] text-primary uppercase tracking-[0.3em] font-black">Crafted For The Elite</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ShoppingFooter;
