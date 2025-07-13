import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <Toggle
      variant="outline"
      className="px-1 flex items-center gap-2 text-white group data-[state=on]:bg-transparent"
      pressed={isDark}
      onPressedChange={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Icons */}
      <Moon
        size={16}
        strokeWidth={2}
        className="ml-2 shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
        aria-hidden="true"
      />
      <Sun
        size={16}
        strokeWidth={2}
        className="ml-2 absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
        aria-hidden="true"
      />

      {/* Text */}
      <span className="text-white">{isDark ? "Dark" : "Light"}</span>
    </Toggle>
  );
}

