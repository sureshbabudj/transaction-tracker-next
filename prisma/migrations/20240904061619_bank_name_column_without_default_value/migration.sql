-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL DEFAULT 'Suresh Babu Dhanaraj',
    "bankName" TEXT NOT NULL
);
INSERT INTO "new_Transaction" ("accountHolderName", "amount", "bankName", "category", "date", "description", "id") SELECT "accountHolderName", "amount", "bankName", "category", "date", "description", "id" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
