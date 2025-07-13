/*
  Warnings:

  - You are about to drop the `Asset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FixedIncome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `assetId` on the `Investment` table. All the data in the column will be lost.
  - Added the required column `maturity` to the `FixedIncomeInvestment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `FixedIncomeInvestment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `FixedIncomeInvestment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rateType` to the `FixedIncomeInvestment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `FixedIncomeInvestment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sector` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Asset_symbol_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Asset";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FixedIncome";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FixedIncomeInvestment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fixedIncomeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rate" REAL NOT NULL,
    "rateType" TEXT NOT NULL,
    "maturity" DATETIME NOT NULL,
    "investedAmount" REAL NOT NULL,
    "investedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FixedIncomeInvestment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FixedIncomeInvestment" ("fixedIncomeId", "id", "investedAmount", "investedAt", "userId") SELECT "fixedIncomeId", "id", "investedAmount", "investedAt", "userId" FROM "FixedIncomeInvestment";
DROP TABLE "FixedIncomeInvestment";
ALTER TABLE "new_FixedIncomeInvestment" RENAME TO "FixedIncomeInvestment";
CREATE TABLE "new_Investment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "averagePrice" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Investment" ("averagePrice", "id", "quantity", "userId") SELECT "averagePrice", "id", "quantity", "userId" FROM "Investment";
DROP TABLE "Investment";
ALTER TABLE "new_Investment" RENAME TO "Investment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
