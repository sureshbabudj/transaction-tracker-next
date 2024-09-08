"use server";

import { txPatterns } from "@/app/utils/transactionPatterns";
import { PrismaClient } from "@prisma/client";
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
