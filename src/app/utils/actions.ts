"use server";
import prisma from "../lib/prisma";
import { links } from "./data";
import { CommonTransaction, CommonTransactionPayload } from "./parseCSV";

export async function createTransactions(
  transactions: CommonTransactionPayload[]
): Promise<void> {
  await prisma.transaction.createMany({
    data: transactions,
  });
}

export async function getTransactions(): Promise<CommonTransaction[]> {
  return await prisma.transaction.findMany({});
}

export async function updateTransactions(
  transaction: CommonTransaction,
  category: string,
  keyword: string
) {
  const descriptionPattern =
    transaction.description.split(" ").slice(0, 5).join("%") + "%";
  const isOutgoing = transaction.amount <= 0;

  const predicate: Array<{
    description: { startsWith?: string; contains?: string };
  }> = [
    {
      description: {
        startsWith: descriptionPattern,
      },
    },
  ];

  if (keyword) {
    predicate.push({ description: { contains: keyword } });
  }

  const where: { [key: string]: any } = {
    category: { equals: "" },
  };

  if (transaction.amount !== 0) {
    where.amount = isOutgoing ? { lt: 0 } : { gt: 0 };
  }

  if (predicate.length > 1) {
    where["OR"] = predicate;
  } else {
    where["description"] = predicate[0].description;
  }

  await prisma.transaction.updateMany({
    where,
    data: { category },
  });

  return await prisma.transaction.findMany({
    where: { category },
  });
}

// dev only method
export async function correctTransactions() {
  await prisma.transaction.updateMany({
    where: {
      category: "misc",
    },
    data: {
      category: "",
    },
  });
}

// dev only method
export async function getTransactionPatterns() {
  const transactions = await prisma.transaction.findMany();

  const result: { [key: string]: string[] } = {};

  transactions.forEach((transaction) => {
    const descriptionPattern =
      transaction.description.split(" ").slice(0, 5).join("%") + "%";
    if (!result[transaction.category]) {
      result[transaction.category] = [descriptionPattern];
    } else if (!result[transaction.category].includes(descriptionPattern)) {
      result[transaction.category].push(descriptionPattern);
    }
  });

  return result;
}

export const fetchInitialState = async (
  path: string
): Promise<Record<string, any>> => {
  const breadcrumbs = [{ label: "Home", path: "/" }];
  if (path === "/dashboard") {
    breadcrumbs.push({ label: "Dashboard", path: "/dashboard" });
  } else if (path === "/dashboard/transactions") {
    breadcrumbs.push({ label: "Dashboard", path: "/dashboard" });
    breadcrumbs.push({
      label: "Transactions",
      path: "/dashboard/transactions",
    });
  } else if (path === "/dashboard/upload") {
    breadcrumbs.push({ label: "Dashboard", path: "/dashboard" });
    breadcrumbs.push({
      label: "Upload Transactions",
      path: "/dashboard/upload",
    });
  } else if (path === "/dashboard/analytics") {
    breadcrumbs.push({ label: "Dashboard", path: "/dashboard" });
    breadcrumbs.push({
      label: "Analytics",
      path: "/dashboard/analytics",
    });
  }
  // Fetch or compute your initial state here
  return {
    header: {},
    footer: {},
    account: {},
    activeLinks: links.map((link) => ({ ...link, active: link.href === path })),
    breadcrumbs,
    helpLinks: [],
  };
};
