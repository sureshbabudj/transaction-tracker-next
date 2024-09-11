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
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { banks } from "@/data/data";
import {
  getCategories,
  TransactionWithCategory,
  updateTransaction,
} from "@/lib/actions";
import { Category } from "@prisma/client";

interface TransactionPageProps {
  transactions: TransactionWithCategory[];
  categories: Category[];
}

function TransactionPage({ transactions, categories }: TransactionPageProps) {
  const [editRow, setEditRow] = useState<number | null>(null);
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
          <div className="text-xs text-muted-foreground">
            Showing <strong>{transactions.length}</strong> of
            <strong>{transactions.length}</strong> Categories
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

export default TransactionPage;
