"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProcessedTransactions, UploadForm } from "./UploadForm";
import TransactionPage from "../components/TransactionPage";
import { CommonTransaction } from "@/app/utils/parseCSV";
import { useState } from "react";
import { CircleAlert, CircleCheckBig } from "lucide-react";

export function UploadPageTabs() {
  const [transactions, setTransactions] = useState<CommonTransaction[] | null>(
    null
  );
  const handleMessage = (
    status: boolean,
    data: ProcessedTransactions | null
  ) => {
    if (status && data) {
      setTransactions(data.transactions);
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
      <TabsContent value="Categorize">
        {transactions && <TransactionPage transactions={transactions} />}
      </TabsContent>
    </Tabs>
  );
}
