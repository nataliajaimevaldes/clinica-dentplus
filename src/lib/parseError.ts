import { ZodError } from "zod";

export const formatZodErrors = (error: ZodError): Record<string, string> => 
    Object.fromEntries(
        error.issues.map((e) => [e.path.join("."), e.message])
    );

export function parseError(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues.map((e) => e.message).join(", ");
  }
  return "Error desconocido";
}
