import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import banner from "../../assets/j_banner.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col">
      <div className="relative h-[200px] sm:h-[240px] w-full overflow-hidden border-b border-white/5">
        <img
          src={banner}
          className="h-full w-full object-cover object-center brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] text-primary font-bold mb-2">Member Portal</p>
          <h1 className="text-2xl sm:text-4xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-foreground">Your Account</h1>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-6 sm:py-8 px-4 sm:px-0">
        <div className="bg-card border border-white/5 p-4 sm:p-8 shadow-2xl rounded-none">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="bg-white/5 p-1 rounded-none mb-6 sm:mb-8 w-full sm:w-fit grid grid-cols-2 sm:flex">
              <TabsTrigger 
                value="orders"
                className="rounded-none px-4 sm:px-8 py-2 text-[10px] sm:text-[11px] uppercase tracking-widest font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="address"
                className="rounded-none px-4 sm:px-8 py-2 text-[10px] sm:text-[11px] uppercase tracking-widest font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                Addresses
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-0 focus-visible:ring-0">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address" className="mt-0 focus-visible:ring-0">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
