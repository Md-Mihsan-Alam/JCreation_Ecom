import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange }) {
  console.log(rating, "rating");

  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      className={`p-2 rounded-full transition-all duration-300 border-none bg-transparent ${
        star <= rating
          ? "text-primary hover:scale-110"
          : "text-muted-foreground/30 hover:text-primary hover:scale-110"
      }`}
      variant="ghost"
      size="icon"
      onClick={handleRatingChange ? () => handleRatingChange(star) : null}
    >
      <StarIcon
        className={`w-5 h-5 ${
          star <= rating ? "fill-primary" : "fill-transparent"
        }`}
      />
    </Button>
  ));
}

export default StarRatingComponent;
