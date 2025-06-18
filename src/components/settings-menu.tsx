import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoonIcon, RotateCcwIcon, SettingsIcon, SunIcon } from "lucide-react";
import { useTheme } from "./theme-provider";

const SettingsMenu = ({ resetToDefault }: { resetToDefault: () => void }) => {
  const { setTheme, theme } = useTheme()

  const handleSetTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <DropdownMenu dir="ltr">
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSetTheme}>
          <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          Change theme
        </DropdownMenuItem>
        <DropdownMenuItem onClick={resetToDefault}>
          <RotateCcwIcon /> Reset Default Values
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsMenu;