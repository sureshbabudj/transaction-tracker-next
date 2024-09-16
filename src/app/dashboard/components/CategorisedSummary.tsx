"use client";

import { ListFilter, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { getCategorisedTransactionsSummary } from "@/lib/actions";

interface CategorisedTransactionSummary {
  category: string;
  amount: number;
}

interface SummaryFilters {
  label: string;
  value: "all" | "income" | "expense";
  icon: any;
}
const SUMMARY_FITTERS: SummaryFilters[] = [
  {
    label: "Expense",
    value: "expense",
    icon: MoreHorizontal,
  },
  {
    label: "Income",
    value: "income",
    icon: MoreHorizontal,
  },
  {
    label: "All",
    value: "all",
    icon: MoreHorizontal,
  },
];

export function CategorisedSummary({
  initialData,
}: {
  initialData: CategorisedTransactionSummary[];
}) {
  const [data, setData] = useState(initialData);
  const [filter, setFilter] = useState(SUMMARY_FITTERS[0]);

  const fetchSummary = async (filteredBy: SummaryFilters["value"]) => {
    const summary = await getCategorisedTransactionsSummary({
      filteredBy,
    });
    setData(summary);
  };

  return (
    <>
      <div className="flex my-7">
        <div className="ml-auto flex-1 md:grow-0 items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter{filter.label !== "All" ? `: ${filter.label}` : ""}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-96 overflow-y-scroll"
            >
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SUMMARY_FITTERS.map((f) => (
                <DropdownMenuCheckboxItem
                  key={f.value}
                  onCheckedChange={() => {
                    setFilter(f);
                    fetchSummary(f.value);
                  }}
                  checked={f.value === filter.value}
                >
                  {f.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">Image</span>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ category, amount }, index) => (
            <TableRow key={category}>
              <TableCell className="hidden sm:table-cell">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium">{category}</TableCell>
              <TableCell className="hidden md:table-cell text-right">
                {amount.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
