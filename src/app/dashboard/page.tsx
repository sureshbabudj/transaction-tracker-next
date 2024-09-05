import {
  MoreHorizontal,
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
import { getTransactions } from "../utils/actions";

export default async function TransactionSummary() {
  const transactions = await getTransactions();
  const categorySummary: { [category: string]: number } = {};
  transactions.forEach((transaction) => {
    if (categorySummary[transaction.category]) {
      categorySummary[transaction.category] += transaction.amount;
    } else {
      categorySummary[transaction.category] = transaction.amount;
    }
  });

  const categorySummaryObj = Object.entries(categorySummary);

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Categorised Expenses</CardTitle>
        <CardDescription>
          Transactions has been categoried based on the category
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          {categorySummaryObj.map(([category, amount], index) => (
            <TableRow key={category}>
              <TableCell className="hidden sm:table-cell">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium">
              {category}
              </TableCell>
              <TableCell className="hidden md:table-cell text-right">{amount.toFixed(2)}</TableCell>
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
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{categorySummaryObj.length}</strong> of <strong>{categorySummaryObj.length}</strong> Categories
        </div>
      </CardFooter>
    </Card>
  );
}