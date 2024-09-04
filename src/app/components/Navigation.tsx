"use client";
import React from "react";
import Tabs from "./Tabs";
import { usePathname } from "next/navigation";

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;
  return (
    <Tabs
      tabs={[
        {
          label: "Summary",
          href: "/",
          active: isActive('/'),
        },
        {
          label: "Upload Transactions",
          href: "/upload-transactions",
          active: isActive('/upload-transactions'),
        },
      ]}
    />
  );
};

export default Navigation;
