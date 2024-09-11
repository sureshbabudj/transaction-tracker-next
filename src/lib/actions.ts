"use server";

import { Category, Transaction } from "@prisma/client";
import { CommonTransactionPayload } from "./parseCSV";
import prisma from "./prisma";
import { links } from "@/data/data";

export async function createTransactions(
  transactions: CommonTransactionPayload[]
): Promise<void> {
  await prisma.transaction.createMany({
    data: transactions,
  });
}

export interface TransactionWithCategory extends Transaction {
  category: Category | null;
}

export async function getTransactions(): Promise<TransactionWithCategory[]> {
  return await prisma.transaction.findMany({
    include: {
      category: true,
    },
  });
}

export async function updateTransaction({
  id,
  categoryId,
}: {
  id: number;
  categoryId: number;
}) {
  await prisma.transaction.update({
    where: {
      id,
    },
    data: {
      categoryId,
    },
  });
}

export async function getCategories(): Promise<Category[]> {
  return await prisma.category.findMany();
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
