-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Records" ("amount", "category", "date", "id", "notes", "type", "userId") SELECT "amount", "category", "date", "id", "notes", "type", "userId" FROM "Records";
DROP TABLE "Records";
ALTER TABLE "new_Records" RENAME TO "Records";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
