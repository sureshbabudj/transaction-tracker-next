import {
  Home,
  LineChart,
  Settings,
  ReceiptText,
  RefreshCw,
  UploadCloud,
  Calculator,
} from "lucide-react";
export interface AsideLink {
  href: string;
  icon: any;
  label: string;
  tooltip: string;
  active?: boolean;
  isBottom?: boolean;
}

export const links: AsideLink[] = [
  {
    href: "/",
    icon: Home,
    label: "Dashboard",
    tooltip: "Dashboard",
  },
  {
    href: "/dashboard",
    icon: ReceiptText,
    label: "Transactions Summary",
    tooltip: "Transactions Summary",
    active: true,
  },
  {
    href: "/dashboard/transactions",
    icon: RefreshCw,
    label: "Transactions",
    tooltip: "Transactions",
  },
  {
    href: "/dashboard/upload",
    icon: UploadCloud,
    label: "Upload Transactions",
    tooltip: "Upload Transactions",
  },
  {
    href: "/dashboard/analytics",
    icon: LineChart,
    label: "Analytics",
    tooltip: "Analytics",
  },
  {
    href: "/dashboard/calculate-tax",
    icon: Calculator,
    label: "Calculate Tax",
    tooltip: "Calculate Tax",
  },
  {
    href: "#",
    icon: Settings,
    label: "Settings",
    tooltip: "Settings",
    isBottom: true,
  },
];
