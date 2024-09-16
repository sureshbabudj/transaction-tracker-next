"use client";
import {
  CircleX,
  File,
  ListFilter,
  ListTree,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";

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
import React, { useCallback, useEffect, useState } from "react";
import { cn, createTxPattern } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  createCategory,
  getTransactionCount,
  getTransactions,
  TransactionWithCategory,
  updateTransactionCategory,
} from "@/lib/actions";
import { Category, Transaction } from "@prisma/client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ComboboxWithAdd } from "./ComboboxWithAdd";
import { SimilarTransactionsTable } from "./SimilarTransactions";
import Link from "next/link";

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
  setPage: (page: number) => void;
}

export function TxPagination({
  currentPage = 1,
  shownPageCount = 8,
  totalPages = 1,
  setPage,
}: PaginationProps) {
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
  categories: initialCategories,
  page: initialPage = 1,
  pageSize: initialPageSize = 10,
}: TransactionPageProps) {
  const initialCategory = initialCategories.find((c) => c.value === category);
  const pageSizes = [5, 10, 20, 50, 100];

  const [categories, setCategories] = useState(initialCategories);
  const [editRow, setEditRow] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>(
    []
  );
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    initialCategory ?? null
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [shownPageCount, setShownPageCount] = useState(3);
  const [similarTx, setSimilarTx] = useState<Transaction[] | null>(null);
  const [categoryToBeChanged, setCategoryToBeChanged] =
    useState<Category | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const UPDATE_SIMILAR_TX = true;

  const createQueryString = useCallback(
    (query: { name: string; value: string }[]) => {
      const params = new URLSearchParams();
      query.forEach(({ name, value }) => params.set(name, value));
      return params.toString();
    },
    []
  );

  const handleQuery = ({
    currentPageSize = pageSize,
    currentCategory = selectedCategory?.value,
    currentPage = page,
  }: {
    currentPage?: number;
    currentPageSize?: number;
    currentCategory?: string;
  }) => {
    const query = [
      { name: "page", value: currentPage.toString() },
      { name: "pageSize", value: currentPageSize.toString() },
    ];
    if (currentCategory) {
      query.push({ name: "category", value: currentCategory });
    }
    const searchQuery = createQueryString(query);
    router.push(`${pathname}?${searchQuery}`);
  };

  const handleAddCategory = async (
    value: string,
    transaction: TransactionWithCategory
  ) => {
    setActionLoading(true);

    const pattern = createTxPattern(transaction.description);

    const newOption = {
      value: value.toLowerCase().trim(),
      label: value,
      patterns: pattern ?? "",
    };
    const newCategory = await createCategory(newOption);
    setCategories([...categories, newCategory]);
    changeTxCategory(value, transaction, newCategory);
  };

  const changeTxCategory = async (
    e: string,
    transaction: TransactionWithCategory,
    categoryToBeChanged?: Category
  ) => {
    setActionLoading(true);
    const category =
      categoryToBeChanged ?? categories.find((c) => c.value === e);
    if (!category) return;

    setCategoryToBeChanged(category);
    try {
      const similarTx = await updateTransactionCategory({
        id: transaction.id,
        categoryId: category.id,
        updateSimilar: UPDATE_SIMILAR_TX,
      });
      transaction.category = category;
      setSimilarTx(similarTx);
      setSheetOpen(true);
    } catch (error) {
      console.log(error);
    }
    console.log("category updated");

    setEditRow(null);
    setActionLoading(false);
  };

  const fetchTransactions = async () => {
    if (selectedCategory) {
      return await getTransactions(page, pageSize, selectedCategory.id);
    }
    return await getTransactions(page, pageSize);
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

  useEffect(() => {
    const evalShownPageCount = () => {
      let shownPageCountValue = 3;
      if (window.innerWidth < 480) {
        shownPageCountValue = 4;
      } else if (window.innerWidth < 640) {
        shownPageCountValue = 5;
      } else if (window.innerWidth < 768) {
        shownPageCountValue = 6;
      } else if (window.innerWidth < 1024) {
        shownPageCountValue = 8;
      } else {
        shownPageCountValue = 10;
      }
      setShownPageCount(shownPageCountValue);
    };

    evalShownPageCount();
  }, []);

  return (
    <>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-96 overflow-y-scroll"
            >
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                onCheckedChange={() => {
                  setSelectedCategory(null);
                  setPage(1);
                  handleQuery({ currentCategory: "" });
                }}
                checked={!selectedCategory}
              >
                All
              </DropdownMenuCheckboxItem>
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id}
                  onCheckedChange={() => {
                    setSelectedCategory(category);
                    setPage(1);
                    handleQuery({ currentCategory: category.value });
                  }}
                  checked={selectedCategory?.id === category.id}
                >
                  {category.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListTree className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Transactions : {pageSize}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-96 overflow-y-scroll"
            >
              <DropdownMenuLabel>Show</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {pageSizes.map((size) => (
                <DropdownMenuCheckboxItem
                  key={size}
                  onCheckedChange={() => {
                    setPageSize(size);
                    setPage(1);
                    handleQuery({ currentPageSize: size });
                  }}
                  checked={size === pageSize}
                >
                  {size}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1" asChild>
            <Link href="/dashboard/upload">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add New Transactions
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>
            All transactions
            {selectedCategory?.name ? ` from ${selectedCategory.name}` : ""}
          </CardTitle>
          <CardDescription>
            Transactions from all bank accounts...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Bank</TableHead>
                <TableHead className="hidden lg:table-cell">Owner</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <>
                  {Array.from({ length: pageSize }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="w-[3%] hidden lg:table-cell">
                        <Skeleton className="h-6 p-4 w-full" />
                      </TableCell>
                      <TableCell className="w-[65%]">
                        <Skeleton className="h-6 p-4  w-full" />
                      </TableCell>
                      <TableCell className="w-[8%]">
                        <Skeleton className="h-6 p-4  w-full" />
                      </TableCell>
                      <TableCell className="w-[7%] hidden lg:table-cell">
                        <Skeleton className="h-6 p-4  w-full" />
                      </TableCell>
                      <TableCell className="w-[7%] hidden lg:table-cell">
                        <Skeleton className="h-6 p-4  w-full" />
                      </TableCell>
                      <TableCell className="w-[7%]">
                        <Skeleton className="h-6 p-4 w-full" />
                      </TableCell>
                      <TableCell className="w-[3%]">
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {!loading && (
                <>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium hidden lg:table-cell">
                          {transaction.date}
                        </TableCell>
                        <TableCell className="font-medium">
                          <Tooltip>
                            <TooltipTrigger asChild className="lg:hidden">
                              <p className="cursor-pointer w-[180px] whitespace-nowrap lg:w-auto lg:whitespace-normal text-ellipsis overflow-hidden lg:overflow-auto">
                                {transaction.description}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[180px]">
                                {transaction.description}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                          <p className="hidden lg:block">
                            {transaction.description}
                          </p>
                        </TableCell>
                        <TableCell className="font-medium text-center ">
                          {editRow !== index ? (
                            <Badge variant="secondary">
                              {transaction.category?.name}
                            </Badge>
                          ) : (
                            <ComboboxWithAdd
                              options={categories.map((i) => ({
                                label: i.name,
                                value: i.value,
                              }))}
                              onAdd={(e) => handleAddCategory(e, transaction)}
                              onSelect={async (e) =>
                                await changeTxCategory(e, transaction)
                              }
                              initialValue={transaction.category?.value}
                              isLoading={actionLoading}
                            />
                          )}
                        </TableCell>
                        <TableCell className="font-medium hidden lg:table-cell">
                          {transaction.bankName}
                        </TableCell>
                        <TableCell className="font-medium hidden lg:table-cell">
                          {transaction.accountHolderName}
                        </TableCell>
                        <TableCell
                          className={cn("text-right font-bold", {
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
                                <DropdownMenuItem
                                  onClick={() => setEditRow(index)}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 gap-1"
                              onClick={() => setEditRow(null)}
                            >
                              <CircleX className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        className="font-medium hidden lg:table-cell text-center h-24"
                        colSpan={7}
                      >
                        No Transactions
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Page <strong>{page}</strong>: Showing{" "}
            <strong>{transactions.length}</strong> of <strong>{count}</strong>{" "}
            Transactions
          </div>
        </CardFooter>
      </Card>
      <TxPagination
        currentPage={page}
        totalPages={Math.ceil(count / pageSize)}
        shownPageCount={shownPageCount}
        setPage={(p) => {
          setPage(p);
          handleQuery({ currentPage: p });
        }}
      />

      {similarTx && similarTx.length > 0 && categoryToBeChanged && (
        <SimilarTransactionsTable
          similarTx={similarTx ?? []}
          isOpen={sheetOpen}
          setOpen={setSheetOpen}
          categoryToBeChanged={categoryToBeChanged}
          beforeClose={() => {
            setCategoryToBeChanged(null);
            setSimilarTx(null);
          }}
        />
      )}
    </>
  );
}
