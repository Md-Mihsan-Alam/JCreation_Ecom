import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-card border border-white/5 rounded-none shadow-xl">
      <div className="p-5 border-b border-white/5">
        <h2 className="text-[14px] font-bold uppercase tracking-[0.2em] text-foreground">Refine By</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment>
            <div className="py-2">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center justify-between">
                {keyItem === "brand" ? "Collection" : keyItem}
                <div className="h-[1px] flex-1 ml-4 bg-primary/10" />
              </h3>
              <div className="grid gap-3 mt-2">
                {filterOptions[keyItem].map((option) => (
                  <Label className="flex font-medium items-center gap-3 text-[13px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors group">
                    <Checkbox
                      className="rounded-none border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator className="bg-white/5" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
