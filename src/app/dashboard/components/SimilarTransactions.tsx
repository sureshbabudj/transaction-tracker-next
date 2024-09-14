"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Category, Transaction } from "@prisma/client";
import { cn } from "@/lib/utils";
import { updateAllTransactionCategoryById } from "@/lib/actions";

interface SimilarTransactionsTableProps {
  similarTx: Transaction[];
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  categoryToBeChanged: Category;
  beforeClose: () => void;
}

const FormSchema = z.object({
  selectedTransactions: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one transaction.",
    }),
});

export function SimilarTransactionsTable({
  similarTx,
  categoryToBeChanged,
  isOpen,
  setOpen,
  beforeClose,
}: SimilarTransactionsTableProps) {
  const [loading, setLoading] = useState(false);
  const [allChecked, setAllChecked] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selectedTransactions: [],
    },
  });

  const { watch, setValue } = form;
  const selectedTransactions = watch("selectedTransactions");

  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      setValue(
        "selectedTransactions",
        similarTx.map((tx) => tx.id.toString())
      );
    } else {
      setValue("selectedTransactions", []);
    }
  };

  useEffect(() => {
    setAllChecked(selectedTransactions.length === similarTx.length);
  }, [selectedTransactions, similarTx]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);

    const identifiers = data.selectedTransactions
      .map((i) => Number(i))
      .filter((i) => !isNaN(i));

    await updateAllTransactionCategoryById({
      categoryId: categoryToBeChanged.id,
      identifiers,
    });

    toast({
      title: "You submitted the following transactions:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    beforeClose();
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="max-w-full sm:max-w-full">
        <SheetHeader>
          <SheetTitle>Similar Transactions</SheetTitle>
          <SheetDescription>
            These transactions have been identified as similar. You can update
            their categories here.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 max-h-[80vh] overflow-auto w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="selectedTransactions"
                render={() => (
                  <FormItem>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">
                            <Checkbox
                              checked={allChecked}
                              onCheckedChange={handleCheckAll}
                              aria-label="Select all transactions"
                            />
                          </TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {similarTx.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <FormField
                                key={transaction.id}
                                control={form.control}
                                name="selectedTransactions"
                                render={({ field }) => {
                                  return (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(
                                            transaction.id.toString()
                                          )}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  transaction.id.toString(),
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) =>
                                                      value !==
                                                      transaction.id.toString()
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(transaction.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell
                              className={cn("text-right font-bold", {
                                "text-red-500": transaction.amount < 0,
                                "text-green-500": transaction.amount > 0,
                              })}
                            >
                              {transaction.amount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Selected Transactions"}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
