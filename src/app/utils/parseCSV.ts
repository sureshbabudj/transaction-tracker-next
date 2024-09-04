import Papa from "papaparse";
import { createTransactions, getTransactions } from "./actions";
import { txPatterns } from "./transactionPatterns";

export interface CommonTransactionPayload {
  date: string;
  description: string;
  amount: number;
  category: string;
  accountHolderName: string;
  bankName: string;
}

export interface CommonTransaction extends CommonTransactionPayload {
  id: number;
}

interface CommBankTransaction {
  "Booking date": string;
  "Value date": string;
  "Transaction type": string;
  "Booking text": string;
  Amount: string;
  Currency: string;
  "Account IBAN": string;
  Category: any;
}

interface RevoltTransaction {
  Type: string;
  Product: string;
  "Started Date": string;
  "Completed Date": string;
  Description: string;
  Amount: number;
  Fee: number;
  Currency: string;
  State: string;
  Balance: number;
  value: number;
}

interface WiseTransaction {
  ID: string;
  Status: string;
  Direction: string;
  "Created on": string;
  "Finished on": string;
  "Source fee amount": number;
  "Source fee currency": string;
  "Target fee amount": any;
  "Target fee currency": any;
  "Source name": string;
  "Source amount (after fees)": number;
  "Source currency": string;
  "Target name": string;
  "Target amount (after fees)": number;
  "Target currency": string;
  "Exchange rate": number;
  Reference: number;
  Batch: any;
}

const escapeRegex = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

function findCategory(desc: string): string {
  let category = "";
  const description = desc.toLowerCase().replace(/[^a-z0-9\s]/g, "");

  // Find the category based on the description patterns
  for (const [cat, patternsArray] of Object.entries(txPatterns)) {
    if (
      patternsArray.some((pattern) => {
        const escapedPattern = escapeRegex(pattern).replace(/%/g, "\\s*");
        const regex = new RegExp(escapedPattern, "i");
        return regex.test(description);
      })
    ) {
      category = cat;
      break;
    }
  }

  return category;
}

const normalizeCommBankTransaction = (
  transaction: CommBankTransaction,
  accountHolderName: string,
  bankName: string
): CommonTransactionPayload => {
  if (!transaction["Booking date"]) {
    transaction["Booking date"] = "No Date";
  }
  if (!transaction["Booking text"]) {
    transaction["Booking text"] = "No Description";
  }
  if (!transaction["Amount"]) {
    transaction["Amount"] = "0";
  }

  findCategory(transaction["Booking text"]);

  return {
    date: transaction["Booking date"],
    description: transaction["Booking text"],
    amount: parseFloat(transaction.Amount),
    category: findCategory(transaction["Booking text"]),
    accountHolderName,
    bankName,
  };
};

const normalizeRevoltTransaction = (
  transaction: RevoltTransaction,
  accountHolderName: string,
  bankName: string
): CommonTransactionPayload => {
  if (!transaction["Completed Date"]) {
    transaction["Completed Date"] = "No Date";
  }
  if (!transaction["Description"]) {
    transaction["Description"] = "No Description";
  }
  if (!transaction["Amount"]) {
    transaction["Amount"] = 0;
  }

  return {
    date: transaction["Completed Date"],
    description: transaction.Description,
    amount: transaction.Amount,
    category: findCategory(transaction.Description),
    accountHolderName,
    bankName,
  };
};

const normalizeWiseTransaction = (
  transaction: WiseTransaction,
  accountHolderName: string,
  bankName: string
): CommonTransactionPayload => {
  if (!transaction["Finished on"]) {
    transaction["Finished on"] = "No Date";
  }
  if (!transaction["Reference"]) {
    transaction["Reference"] = 1;
  }
  if (!transaction["Source amount (after fees)"]) {
    transaction["Source amount (after fees)"] = 0;
  }
  return {
    date: transaction["Finished on"],
    description: transaction.Reference.toString(),
    amount: transaction["Source amount (after fees)"],
    category: findCategory(transaction.Reference.toString()),
    accountHolderName,
    bankName,
  };
};

export const parseCSV = async (
  csvData: string,
  bankType: string,
  accountHolderName: string
): Promise<CommonTransaction[]> => {
  if (!accountHolderName) {
    alert("Account holder name is required");
    return [];
  }

  const parsedData = Papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
  });

  let transactions: CommonTransactionPayload[] = [];

  switch (bankType) {
    case "commerzbank":
      transactions = (parsedData.data as CommBankTransaction[]).map((i) =>
        normalizeCommBankTransaction(i, accountHolderName, bankType)
      );
      break;
    case "revolt":
      transactions = (parsedData.data as RevoltTransaction[]).map((i) =>
        normalizeRevoltTransaction(i, accountHolderName, bankType)
      );
      break;
    case "wise":
      transactions = (parsedData.data as WiseTransaction[]).map((i) =>
        normalizeWiseTransaction(i, accountHolderName, bankType)
      );
      break;
    default:
      throw new Error("Unsupported bank type");
  }

  // Store transactions in the database without categorization
  await createTransactions(transactions);

  const result = await getTransactions();

  return result;
};
