"use client";
import { Button } from "@/components/ui/button";
import {
  migrateCategories,
  populateCategoryValues,
  updateCategoryIds,
} from "../../../../prisma/migration-utils";

export function DatabaseActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" onClick={() => migrateCategories()}>
        Migrate Categories
      </Button>
      <Button variant="outline" onClick={() => updateCategoryIds()}>
        update Category Ids
      </Button>
      <Button variant="outline" onClick={() => populateCategoryValues()}>
        populateCategoryValues
      </Button>
    </div>
  );
}
