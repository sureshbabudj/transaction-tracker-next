"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProcessedTransactions, UploadForm } from "./UploadForm";
import { useState } from "react";
import { CircleAlert, CircleCheckBig } from "lucide-react";
import { TransactionWithCategory } from "@/lib/actions";

export function UploadPageTabs() {
  const [transactions, setTransactions] = useState<
    TransactionWithCategory[] | null
  >(null);
  const handleMessage = (
    status: boolean,
    data: ProcessedTransactions | null,
    err: Error | null
  ) => {
    if (status && data) {
      setTransactions(data.transactions);
    }
    if (!status && err) {
      console.error(err);
    }
  };
  return (
    <Tabs defaultValue="Upload" className="w-full">
      <TabsList>
        <TabsTrigger value="Upload">
          Upload transactions{" "}
          {transactions !== null ? (
            <CircleCheckBig className="text-green-500 ms-2 w-4" />
          ) : (
            <CircleAlert className="text-red-500 ms-2 w-4" />
          )}
        </TabsTrigger>
        <TabsTrigger value="Categorize" disabled={transactions === null}>
          Categorize transactions
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Upload">
        <UploadForm postMessage={handleMessage} />
      </TabsContent>
      <TabsContent value="Categorize"></TabsContent>
    </Tabs>
  );
}
