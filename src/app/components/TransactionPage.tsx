"use client";

import React, { useEffect, useState } from "react";
import TransactionsList from "./TransactionsList";
import { CommonTransaction, parseCSV } from "../utils/parseCSV";
import CategorizeTransaction from "./CategorizeTransaction";
import CategoryFilter from "./CategoryFilter";


function TransactionPage({
  transactions: initialTransactions,
}: {
  transactions: CommonTransaction[];
}) {
  const [transactions, setTransactions] = useState<CommonTransaction[]>(initialTransactions);
  const [uncategorizedTransaction, setUncategorizedTransaction] = useState<CommonTransaction | null>(null);
  const [bankType, setBankType] = useState<string>("commerzbank");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredTransactions, setFilteredTransactions] = useState<CommonTransaction[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [accountHolderName, setAccountHolderName] = useState<string>("");

  function gatherCategories() {
    const categories = Array.from(new Set(transactions.map((t) => t.category)));
    setUniqueCategories(categories);
  }

  useEffect(() => {
    setUncategorizedTransaction(initialTransactions.find((t) => !t.category) || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    gatherCategories();
    if (selectedCategory) {
      setFilteredTransactions(transactions.filter((t) => t.category === selectedCategory));
    } else {
      setFilteredTransactions(transactions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, transactions]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvData = e.target?.result as string;
        const parsedTransactions = await parseCSV(csvData, bankType, accountHolderName);
        setTransactions(parsedTransactions);
      };
      reader.readAsText(file);
    }
  };

  const handleCategorize = (results: CommonTransaction[]) => {
    const updatedMap = new Map(results.map((tx) => [tx.id, tx]));
    const updatedTx = transactions.map((tx) => {
      const newTx = updatedMap.get(tx.id);
      return newTx ? { ...tx, ...newTx } : tx;
    });
    setTransactions(updatedTx);
    const nextUncategorizedTransaction = updatedTx.find((t) => !t.category);
    setUncategorizedTransaction(nextUncategorizedTransaction || null);
  };

  return (
    <div>
      <select value={bankType} onChange={(e) => setBankType(e.target.value)}>
        <option value="commerzbank">Commerzbank</option>
        <option value="revolt">Revolt</option>
        <option value="wise">Wise</option>
      </select>
      <input
        type="text"
        value={accountHolderName}
        onChange={(e) => setAccountHolderName(e.target.value)}
        placeholder="Enter account holder name"
        className="border p-2 w-full mt-2"
      />
      <input type="file" accept=".csv" onChange={handleFileUpload} className="mt-2" />
      <hr className="my-4" />

      <CategoryFilter
        categories={uniqueCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {!selectedCategory && uncategorizedTransaction && (
        <CategorizeTransaction
          categories={uniqueCategories}
          transaction={uncategorizedTransaction}
          onCategorize={handleCategorize}
        />
      )}
      <TransactionsList transactions={filteredTransactions} />
    </div>
  );
}

export default TransactionPage;
