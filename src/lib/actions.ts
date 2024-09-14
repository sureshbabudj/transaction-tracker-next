"use server";

import { Category, Transaction } from "@prisma/client";
import { CommonTransactionPayload } from "./parseCSV";
import prisma from "./prisma";
import { links } from "@/data/data";
import { Option } from "@/app/dashboard/components/ComboboxWithAdd";

export async function createTransactions(
  transactions: CommonTransactionPayload[]
): Promise<void> {
  await prisma.transaction.createMany({
    data: transactions,
  });
}

export async function createCategory({
  value,
  label,
  patterns,
}: Option & { patterns: string }): Promise<Category> {
  const result = await prisma.category.create({
    data: {
      name: label,
      value,
      patterns,
    },
  });
  return result;
}

export interface TransactionWithCategory extends Transaction {
  category: Category | null;
}

export async function getTransactionCount(
  params: {
    categoryId?: number;
  } = {}
): Promise<number> {
  if (params.categoryId) {
    return await prisma.transaction.count({
      where: {
        categoryId: params.categoryId,
      },
    });
  } else {
    return await prisma.transaction.count();
  }
}

export async function getTransactions(
  page = 1,
  pageSize = 10,
  categoryId?: number
): Promise<TransactionWithCategory[]> {
  const query: {
    where?: any;
    skip?: number;
    take?: number;
    include: { category: true };
  } = {
    include: {
      category: true,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
  if (categoryId) {
    query.where = {
      categoryId: {
        equals: categoryId,
      },
    };
  }
  return await prisma.transaction.findMany(query);
}

export async function updateTransactionCategory({
  id,
  categoryId,
  updateSimilar = false,
}: {
  id: number;
  categoryId: number;
  updateSimilar?: boolean;
}) {
  const similarTx = [];
  if (updateSimilar) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    const patterns = category?.patterns.split("|") ?? [];
    if (patterns.length > 0) {
      for (const pattern of patterns) {
        const similar = await prisma.transaction.findMany({
          where: {
            description: {
              contains: pattern,
            },
          },
        });
        similarTx.push(...similar);
      }
    }
  }
  await prisma.transaction.update({
    where: {
      id,
    },
    data: {
      categoryId,
    },
  });
  return similarTx;
}

export async function updateAllTransactionCategoryById({
  identifiers,
  categoryId,
}: {
  identifiers: number[];
  categoryId: number;
}) {
  await prisma.transaction.updateMany({
    where: {
      id: {
        in: identifiers,
      },
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
