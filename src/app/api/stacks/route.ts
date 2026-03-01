import { getAllStacks } from "@/lib/stacks";
import { apiSuccess, handleCors } from "@/lib/api-utils";

export async function GET() {
  const stacks = getAllStacks();
  return apiSuccess({ stacks });
}

export async function OPTIONS() {
  return handleCors();
}
