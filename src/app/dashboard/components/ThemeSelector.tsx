"use client";

import { useAppContext } from "@/app/App.context";
import { Switch } from "@/components/ui/switch";
import { Moon, MoonStar, Sun } from "lucide-react";

export function ThemeSelector() {
  const { theme, setTheme } = useAppContext();
  return (
    <div className="p-2 mx-2 rounded-lg border flex flex-row content-center">
      {theme === "dark" ? (
        <MoonStar className="mr-2 w-4 text-white" />
      ) : (
        <Sun className="mr-2 w-4" />
      )}
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    </div>
  );
}
