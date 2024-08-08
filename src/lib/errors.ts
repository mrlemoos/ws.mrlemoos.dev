import { ZodError } from "zod";

function extractMessageFromZodError(error: ZodError): string {
  if (error.errors.length === 1) {
    return error.errors[0].message;
  }
  return error.errors
    .filter(Boolean)
    .map((e) => e.message)
    .join(", ");
}

export function transformErrorToRequestBody<T extends Error | string | object>(
  error: T
): {
  error: string;
} {
  if (error instanceof ZodError) {
    return {
      error: extractMessageFromZodError(error),
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
    };
  }

  return {
    error: typeof error === "string" ? error : "Unknown error",
  };
}
