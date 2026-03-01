import { getCategories } from "../lib/data-provider.js";
import type { Category } from "../types.js";

export async function listCategoriesHandler(): Promise<Category[]> {
  return getCategories();
}
