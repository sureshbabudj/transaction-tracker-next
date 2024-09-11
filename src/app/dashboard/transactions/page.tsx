import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TransactionPage from "../components/TransactionPage";
import { Main } from "../components/Main";
import {
  fetchInitialState,
  getCategories,
  getTransactions,
} from "@/lib/actions";

export default async function Page() {
  const transactions = await getTransactions();
  const categories = await getCategories();
  const state = await fetchInitialState("/dashboard/transactions");
  return (
    <Main breadcrumbs={state.breadcrumbs} links={state.activeLinks}>
      <Tabs defaultValue="all">
        <div className="overflow-x-hidden">
          <ScrollArea className="max-w-96 sm:max-w-screen-xs lg:max-w-screen-sm xl:max-w-screen-lg 2xl:max-w-screen-xl">
            <TabsList defaultValue="all">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.value}>
                  {category.name || "Uncategorized"}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="all">
          <TransactionPage
            transactions={transactions}
            categories={categories}
          />
        </TabsContent>
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.value}>
            <TransactionPage
              categories={categories}
              transactions={transactions.filter(
                (t) => t.categoryId && t.categoryId === category.id
              )}
            />
          </TabsContent>
        ))}
      </Tabs>
    </Main>
  );
}
