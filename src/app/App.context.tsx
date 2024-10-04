"use client";

import { cn } from "@/lib/utils";
import React, { createContext, useState, useContext } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface AppContextType {
  theme: string;
  setTheme: (theme: string) => void;
  auth: any;
  setAuth: (auth: any) => void;
  preferences: any;
  setPreferences: (preferences: any) => void;
  settings: any;
  setSettings: (settings: any) => void;
}

// Create the context
export const AppContext = createContext<AppContextType>({} as AppContextType);

// Create a provider component
export const AppProvider = ({ children }: React.PropsWithChildren) => {
  const [theme, setTheme] = useState("dark");
  const [auth, setAuth] = useState(null);
  const [preferences, setPreferences] = useState({});
  const [settings, setSettings] = useState({});

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        auth,
        setAuth,
        preferences,
        setPreferences,
        settings,
        setSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppWrapper = ({ children }: React.PropsWithChildren) => {
  const { theme } = useAppContext();
  return <body className={cn(inter.className, theme)}>{children}</body>;
};
