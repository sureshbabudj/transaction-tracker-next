"use client";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import {
  getCategories,
  getTransactionCount,
  getTransactions,
  getTransactionsByCategory,
  TransactionWithCategory,
  updateTransaction,
} from "@/lib/actions";
import { Category } from "@prisma/client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface TransactionPageProps {
  categories: Category[];
  category?: string | null;
  page?: number;
  pageSize?: number;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  shownPageCount?: number;
}

export function TxPagination({
  currentPage = 1,
  shownPageCount = 8,
  totalPages = 1,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const setPage = (page: number) => {
    router.push(pathname + "?" + createQueryString("page", String(page)));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - Math.floor(shownPageCount / 2));
    const endPage = Math.min(totalPages, startPage + shownPageCount - 1);

    if (startPage > 1) {
      pageNumbers.push(
        <PaginationItem key="prev-ellipsis">
          <PaginationLink href="#" onClick={() => setPage(startPage - 1)}>
            <PaginationEllipsis />
          </PaginationLink>
        </PaginationItem>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={() => setPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <PaginationItem key="next-ellipsis">
          <PaginationLink href="#" onClick={() => setPage(endPage)}>
            <PaginationEllipsis />
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageNumbers;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => currentPage > 1 && setPage(currentPage - 1)}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function Transactions({
  category = null,
  categories,
  page = 1,
  pageSize: initialPageSize = 10,
}: TransactionPageProps) {
  const initialCategory = categories.find((c) => c.value === category);

  const [editRow, setEditRow] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>(
    []
  );
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    initialCategory ?? null
  );

  const handleCategoryChange = async (
    e: string,
    transaction: TransactionWithCategory
  ) => {
    const category = categories.find((c) => c.value === e);
    if (!category) return;
    try {
      await updateTransaction({
        id: transaction.id,
        categoryId: category.id,
      });
      transaction.category = category;
    } catch (error) {
      console.log(error);
    }
    console.log("category updated");
    setEditRow(null);
  };

  const fetchTransactions = async () => {
    if (selectedCategory) {
      return await getTransactionsByCategory(
        selectedCategory.id,
        page,
        pageSize
      );
    }
    return await getTransactions(1, 10);
  };

  const fetchCount = async () =>
    await getTransactionCount({
      categoryId: selectedCategory?.id,
    });

  useEffect(() => {
    setLoading(true);
    fetchTransactions().then((tx) => {
      setTransactions(tx);
      setLoading(false);
      fetchCount().then((c) => setCount(c));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, selectedCategory]);

  return (
    <>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>All transactions</CardTitle>
          <CardDescription>
            Transactions from all bank accounts...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Number</span>
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={transaction.id}>
                  <TableCell className="hidden sm:table-cell">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.date}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {editRow !== index ? (
                      <Badge variant="secondary">
                        {transaction.category?.name}
                      </Badge>
                    ) : (
                      <Select
                        onValueChange={async (e) =>
                          await handleCategoryChange(e, transaction)
                        }
                      >
                        <SelectTrigger
                          key={transaction.id}
                          id={`category-${transaction.id}`}
                          className="items-start [&_[data-description]]:hidden"
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {categories.map((category) => (
                            <SelectItem
                              value={category.value}
                              key={category.value}
                            >
                              <div className="py-2">{category.name}</div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.bankName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.accountHolderName}
                  </TableCell>
                  <TableCell
                    className={cn("hidden md:table-cell text-right font-bold", {
                      "text-red-500": transaction.amount < 0,
                      "text-green-500": transaction.amount > 0,
                    })}
                  >
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {editRow !== index ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setEditRow(index)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button
                        variant="outline"
                        className="text-xs"
                        onClick={() => setEditRow(null)}
                      >
                        cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-xs text-muted-foreground">
              Page <strong>{page}</strong>: Showing{" "}
              <strong>{transactions.length}</strong> of <strong>{count}</strong>{" "}
              Categories
            </div>
            <TxPagination
              currentPage={page}
              totalPages={Math.ceil(count / pageSize)}
            />
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
