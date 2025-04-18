
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

interface ThemeToggleProps {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = "outline", 
  size = "icon" 
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={toggleTheme} 
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
    </Button>
  );
};

export default ThemeToggle;
