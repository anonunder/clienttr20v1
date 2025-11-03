import { z } from 'zod';

export function safeParseAsync<T>(schema: z.ZodSchema<T>, data: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    const result = schema.safeParse(data);
    if (result.success) {
      resolve(result.data);
    } else {
      reject(new Error(`Validation failed: ${result.error.message}`));
    }
  });
}

export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown): T | undefined {
  const result = schema.safeParse(data);
  return result.success ? result.data : undefined;
}

export function formatZodError(error: z.ZodError): string {
  return error.errors
    .map(err => {
      const path = err.path.join('.');
      return `${path}: ${err.message}`;
    })
    .join(', ');
}

