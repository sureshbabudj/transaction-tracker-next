import Papa from "papaparse";
import {
  createTransactions,
  getCategories as getDataBaseCategories,
  getTransactions,
  TransactionWithCategory,
} from "./actions";
import { Category } from "@prisma/client";

export interface TransactionMapping {
  date: string;
  description: string;
  amount: string;
  transactionType: string;
  bankName: string;
}

export interface CommonTransactionPayload {
  date: string;
  description: string;
  amount: number;
  categoryId?: number;
  accountHolderName: string;
  bankName: string;
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

const getCategories: {
  default: () => Promise<Category[]>;
  data?: Category[] | null;
} = {
  default: async (): Promise<Category[]> => {
    if (Array.isArray(getCategories.data) && getCategories.data) {
      return getCategories.data;
    }
    const categories = await getDataBaseCategories();
    getCategories.data = categories;
    return categories;
  },
  data: null,
};

export const escapeRegex = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

async function findCategory(desc: string): Promise<number | null> {
  let category: number | null = null;
  const description = desc.toLowerCase().replace(/[^a-z0-9\s]/g, "");

  const categories = await getCategories.default();

  // Find the category based on the description patterns
  for (const cat of categories) {
    if (
      cat.patterns.split("|").some((pattern) => {
        const escapedPattern = escapeRegex(pattern).replace(/%/g, "\\s*");
        const regex = new RegExp(escapedPattern, "i");
        return regex.test(description);
      })
    ) {
      category = cat.id;
      break;
    }
  }

  return category;
}

const normalizeCommBankTransaction = async (
  transaction: CommBankTransaction,
  accountHolderName: string,
  bankName: string
): Promise<CommonTransactionPayload> => {
  if (!transaction["Booking date"]) {
    transaction["Booking date"] = "No Date";
  }
  if (!transaction["Booking text"]) {
    transaction["Booking text"] = "No Description";
  }
  if (!transaction["Amount"]) {
    transaction["Amount"] = "0";
  }

  const payload: CommonTransactionPayload = {
    date: transaction["Booking date"],
    description: transaction["Booking text"],
    amount: parseFloat(transaction.Amount),
    accountHolderName,
    bankName,
  };

  const categoryId = await findCategory(transaction["Booking text"]);
  if (categoryId) payload.categoryId = categoryId;

  return payload;
};

const normalizeRevoltTransaction = async (
  transaction: RevoltTransaction,
  accountHolderName: string,
  bankName: string
): Promise<CommonTransactionPayload> => {
  if (!transaction["Completed Date"]) {
    transaction["Completed Date"] = "No Date";
  }
  if (!transaction["Description"]) {
    transaction["Description"] = "No Description";
  }
  if (!transaction["Amount"]) {
    transaction["Amount"] = 0;
  }

  const payload: CommonTransactionPayload = {
    date: transaction["Completed Date"],
    description: transaction.Description,
    amount: transaction.Amount,
    accountHolderName,
    bankName,
  };

  const categoryId = await findCategory(transaction.Description);
  if (categoryId) payload.categoryId = categoryId;

  return payload;
};

const normalizeWiseTransaction = async (
  transaction: WiseTransaction,
  accountHolderName: string,
  bankName: string
): Promise<CommonTransactionPayload> => {
  if (!transaction["Finished on"]) {
    transaction["Finished on"] = "No Date";
  }
  if (!transaction["Source amount (after fees)"]) {
    transaction["Source amount (after fees)"] = 0;
  }
  const description =
    transaction["Target name"] || String(transaction["Reference"] ?? "");
  const payload: CommonTransactionPayload = {
    date: transaction["Finished on"],
    description,
    amount: transaction["Source amount (after fees)"],
    accountHolderName,
    bankName,
  };

  const categoryId = await findCategory(description);
  if (categoryId) payload.categoryId = categoryId;

  return payload;
};

const normalizeAnyTransaction = async (
  transaction: any,
  accountHolderName: string,
  _bankName: string,
  mappings: TransactionMapping
): Promise<CommonTransactionPayload> => {
  try {
    const date = transaction[mappings.date] || "No Date";
    let amount = 0;
    if (transaction[mappings.amount]) {
      if (typeof transaction[mappings.amount] === "string") {
        amount = parseFloat(transaction[mappings.amount].replaceAll(",", ""));
      } else {
        amount = transaction[mappings.amount];
      }
      if (mappings.transactionType) {
        amount =
          transaction[mappings.transactionType] === "DR" ? amount * -1 : amount;
      }
    }
    const description = transaction[mappings.description] ?? "";
    const payload: CommonTransactionPayload = {
      date,
      description,
      amount,
      accountHolderName,
      bankName: mappings.bankName,
    };

    const categoryId = await findCategory(description);
    if (categoryId) payload.categoryId = categoryId;

    return payload;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const parseCSV = async (
  parsedData: Papa.ParseResult<any>,
  bankType: string,
  accountHolderName: string,
  mappings?: TransactionMapping
): Promise<TransactionWithCategory[]> => {
  try {
    if (!accountHolderName) {
      alert("Account holder name is required");
      return [];
    }

    let transactions: CommonTransactionPayload[] = [];

    switch (bankType) {
      case "commerzbank":
        transactions = await Promise.all(
          (parsedData.data as CommBankTransaction[]).map((i) =>
            normalizeCommBankTransaction(i, accountHolderName, bankType)
          )
        );
        break;
      case "revolt":
        transactions = await Promise.all(
          (parsedData.data as RevoltTransaction[]).map((i) =>
            normalizeRevoltTransaction(i, accountHolderName, bankType)
          )
        );
        break;
      case "wise":
        transactions = await Promise.all(
          (parsedData.data as WiseTransaction[]).map((i) =>
            normalizeWiseTransaction(i, accountHolderName, bankType)
          )
        );
        break;
      case "others":
        if (!mappings) {
          throw new Error("Mappings are required for other bank types");
        }
        transactions = await Promise.all(
          (parsedData.data as any[]).map((i) =>
            normalizeAnyTransaction(i, accountHolderName, bankType, mappings)
          )
        );
        break;
      default:
        throw new Error("Unsupported bank type");
    }

    // Store transactions in the database without categorization
    await createTransactions(transactions);

    const result = await getTransactions();

    return result;
  } catch (error) {
    throw error;
  }
};
