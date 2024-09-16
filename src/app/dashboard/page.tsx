import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Main } from "./components/Main";
import {
  fetchInitialState,
  getCategorisedTransactionsSummary,
} from "@/lib/actions";
import { CategorisedSummary } from "./components/CategorisedSummary";

export default async function TransactionSummary() {
  const categorySummaryObj = await getCategorisedTransactionsSummary({
    filteredBy: "expense",
  });

  const state = await fetchInitialState("/dashboard");

  return (
    <Main breadcrumbs={state.breadcrumbs} links={state.activeLinks}>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Categorised Expenses</CardTitle>
          <CardDescription>
            Transactions has been categoried based on the category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategorisedSummary initialData={categorySummaryObj} />
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{categorySummaryObj.length}</strong> of{" "}
            <strong>{categorySummaryObj.length}</strong> Categories
          </div>
        </CardFooter>
      </Card>
    </Main>
  );
}
