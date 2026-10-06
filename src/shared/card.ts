import { z } from 'zod';

export const CARD_LIMITS = {
  firstNameMax: 60,
  lastNameMax: 60,
  jobTitleMax: 80,
  companyMax: 80,
  emailMax: 254,
  locationMax: 100,
  qrCapBytes: 700,
  qrGreenBytes: 250,
  qrAmberBytes: 450,
} as const;

export const QRIncludeSchema = z.object({
  name: z.boolean().default(true),
  jobTitle: z.boolean().default(true),
  company: z.boolean().default(true),
  phone: z.boolean().default(true),
  email: z.boolean().default(true),
  website: z.boolean().default(true),
  location: z.boolean().default(false),
  linkedin: z.boolean().default(false),
  instagram: z.boolean().default(false),
  xHandle: z.boolean().default(false),
  whatsapp: z.boolean().default(false),
});

export type QRInclude = z.infer<typeof QRIncludeSchema>;

export const CardSchema = z.object({
  id: z.string().uuid(),
  schemaVersion: z.number().int().default(1),
  firstName: z.string().min(1, 'First name is required').max(CARD_LIMITS.firstNameMax),
  lastName: z.string().max(CARD_LIMITS.lastNameMax).nullable().default(null),
  jobTitle: z.string().max(CARD_LIMITS.jobTitleMax).nullable().default(null),
  company: z.string().max(CARD_LIMITS.companyMax).nullable().default(null),
  phone: z.string().nullable().default(null),
  email: z.string().max(CARD_LIMITS.emailMax).nullable().default(null),
  website: z.string().nullable().default(null),
  location: z.string().max(CARD_LIMITS.locationMax).nullable().default(null),
  linkedin: z.string().nullable().default(null),
  instagram: z.string().nullable().default(null),
  xHandle: z.string().nullable().default(null),
  whatsapp: z.string().nullable().default(null),
  photoPresent: z.boolean().default(false),
  qrInclude: QRIncludeSchema.default({
    name: true,
    jobTitle: true,
    company: true,
    phone: true,
    email: true,
    website: true,
    location: false,
    linkedin: false,
    instagram: false,
    xHandle: false,
    whatsapp: false,
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  qrFingerprint: z.string().default(''),
});

export type Card = z.infer<typeof CardSchema>;

export const AppSettingsSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']).default('system'),
  haptics: z.boolean().default(true),
  storagePersisted: z.boolean().default(false),
  hasSeenOnboarding: z.boolean().default(false),
});

export type AppSettings = z.infer<typeof AppSettingsSchema>;

export interface CardBackup {
  schemaVersion: number;
  exportedAt: string;
  card: Card;
  style: any; // QRStyle
  settings: AppSettings;
  photoBase64?: string | null;
}
