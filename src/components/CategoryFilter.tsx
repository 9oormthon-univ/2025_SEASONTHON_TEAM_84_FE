import { Button } from "./ui/button";
import { CATEGORIES, type Category } from "../types/store";

interface CategoryFilterProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="w-full bg-white border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <h3 className="mb-3">카테고리</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className="text-sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}