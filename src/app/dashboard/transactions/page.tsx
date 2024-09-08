import { fetchInitialState, getTransactions } from "@/app/utils/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TransactionPage from "../components/TransactionPage";
import { Main } from "../components/Main";

export default async function Page() {
  const transactions = await getTransactions();
  const categories = Array.from(new Set(transactions.map((t) => t.category)));
  const state = await fetchInitialState("/dashboard/transactions");
  return (
    <Main breadcrumbs={state.breadcrumbs} links={state.activeLinks}>
      <Tabs defaultValue="all">
        <div className="overflow-x-hidden">
          <ScrollArea className="max-w-96 sm:max-w-screen-xs lg:max-w-screen-sm xl:max-w-screen-lg 2xl:max-w-screen-xl">
            <TabsList defaultValue="all">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category || "Uncategorized"}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="all">
          <TransactionPage transactions={transactions} />
        </TabsContent>
        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <TransactionPage
              transactions={transactions.filter((t) => t.category === category)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </Main>
  );
}
