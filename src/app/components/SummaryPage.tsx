"use client";

import React, { useEffect, useState } from "react";
import { CommonTransaction } from "../utils/parseCSV";

function SummaryPage({
    transactions,
  }: {
    transactions: CommonTransaction[];
  }) {

  const categorySummary: { [category: string]: number } = {};
  transactions.forEach((transaction) => {
    if (categorySummary[transaction.category]) {
      categorySummary[transaction.category] += transaction.amount;
    } else {
      categorySummary[transaction.category] = transaction.amount;
    }
  });

  return (
    <div>
      <h1>Summary Page</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Category</th>
            <th className="py-2">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(categorySummary).map(([category, amount]) => (
            <tr key={category}>
              <td className="border px-4 py-2">{category}</td>
              <td className="border px-4 py-2">{amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryPage;
