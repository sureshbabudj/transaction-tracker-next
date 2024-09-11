"use server";

import { txPatterns } from "@/data/transactionPatterns";
import { PrismaClient } from "@prisma/client";
import { getCategories } from "./actions";
import { escapeRegex } from "./parseCSV";
const prisma = new PrismaClient();

export async function migrateCategories() {
  const categories = Object.keys(txPatterns);

  for (const category of categories) {
    if (!category) {
      continue;
    }
    await prisma.category.create({
      data: {
        name: category,
        value: category,
        patterns: txPatterns[category].join("|"),
      },
    });
  }
}

export async function CategorizeTransaction() {
  const categories = await getCategories();

  const transactions = await prisma.transaction.findMany({
    where: { categoryId: null },
  });

  for (const tx of transactions) {
    let categoryId = null;
    console.log(tx.description);
    for (const cat of categories) {
      if (
        cat.patterns.split("|").some((pattern) => {
          const escapedPattern = escapeRegex(pattern).replace(/%/g, "\\s*");
          const regex = new RegExp(escapedPattern, "i");
          return regex.test(tx.description);
        })
      ) {
        categoryId = cat.id;
        console.log(`Found category for ${tx.description}: ${cat.name}`);
        break;
      }
    }
    if (categoryId !== null) {
      await prisma.transaction.update({
        where: { id: tx.id },
        data: { categoryId },
      });
    }
  }
}
