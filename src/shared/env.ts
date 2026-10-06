import { z } from 'zod';

export const EnvSchema = z.object({
  MODE: z.string().default('development'),
  BASE_URL: z.string().default('/'),
  PROD: z.boolean().default(false),
  DEV: z.boolean().default(true),
});

export type AppEnv = z.infer<typeof EnvSchema>;

export function getAppEnv(): AppEnv {
  return EnvSchema.parse({
    MODE: import.meta.env.MODE || 'development',
    BASE_URL: import.meta.env.BASE_URL || '/',
    PROD: import.meta.env.PROD || false,
    DEV: import.meta.env.DEV || true,
  });
}
