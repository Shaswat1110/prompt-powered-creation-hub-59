
import React from "react";
import { Category } from "@/types";
import { categoryDetails } from "@/services/mockData";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface CategoryBadgeProps {
  category: Category;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = "md",
  showLabel = true,
}) => {
  const categoryDetail = categoryDetails[category];
  // @ts-ignore - Dynamic icon import
  const IconComponent = LucideIcons[categoryDetail.icon];

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full text-white",
        categoryDetail.color,
        sizeClasses[size]
      )}
    >
      {IconComponent && (
        <IconComponent size={iconSizes[size]} className="mr-1.5" />
      )}
      {showLabel && (
        <span className="font-medium">{categoryDetail.displayName}</span>
      )}
    </div>
  );
};

export default CategoryBadge;
