import z from "zod";

export const httpMethodSchema = z.enum([
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "HEAD",
]);
