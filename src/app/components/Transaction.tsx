import React from "react";
import { CommonTransaction } from "../utils/parseCSV";

interface TransactionProps extends CommonTransaction {}

const Transaction: React.FC<TransactionProps> = ({
  date,
  description,
  amount,
  category,
  bankName,
  accountHolderName,
}) => {
  return (
    <div className="flex justify-between p-4 border-b">
      <div>
        <p>
          {date}{" "}
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {category}
          </span>
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {bankName}
          </span>
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {accountHolderName}
          </span>
        </p>
        <p className="text-sm max-w-[70%]">{description}</p>
      </div>
      <div>
        <p> <span className={`font-bold ${amount > 0 ? "text-green-500" : "text-red-500"}`}>{amount}</span></p>
      </div>
    </div>
  );
};

export default Transaction;
