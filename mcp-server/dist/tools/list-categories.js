import { getCategories } from "../lib/data-provider.js";
export async function listCategoriesHandler() {
    return getCategories();
}
