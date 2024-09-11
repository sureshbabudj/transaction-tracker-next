"use client";
import { Button } from "@/components/ui/button";
import {
  CategorizeTransaction,
  migrateCategories,
} from "@/lib/migration-utils";

export function DatabaseActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" onClick={() => migrateCategories()}>
        Migrate Categories
      </Button>
      <Button variant="outline" onClick={() => CategorizeTransaction()}>
        Categorize Transaction
      </Button>
    </div>
  );
}
