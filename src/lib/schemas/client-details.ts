import { z } from 'zod';

export const NavigatorConnectionSchema = z.object({
    downlink: z.number().optional(),
    rtt: z.number().optional(),
    effectiveType: z.string().optional(),
    saveData: z.boolean().optional(),
    type: z.string().optional(),
});

export const NavigatorDetailsSchema = z.object({
    hardwareConcurrency: z.union([z.number(), z.string(), z.literal('N/A')]),
    deviceMemory: z.union([z.string(), z.literal('N/A')]),
    platform: z.string(),
    userAgent: z.string(),
    appVersion: z.string(),
    vendor: z.string(),
    connection: NavigatorConnectionSchema,
});

export const WindowDetailsSchema = z.object({
    indexedDB: z.string(),
    crypto: z.string(),
    devicePixelRatio: z.number(),
    localStorage: z.string(),
    sessionStorage: z.string(),
});

export const ScreenDetailsSchema = z.object({
    availHeight: z.number(),
    availWidth: z.number(),
    height: z.number(),
    width: z.number(),
    pixelDepth: z.number(),
    colorDepth: z.number(),
    resolution: z.string(),
});


export const ClientDetailsSchema = z.object({
    collectedAt: z.string(),
    collectedVia: z.string(),
    navigator: NavigatorDetailsSchema,
    window: WindowDetailsSchema,
    screen: ScreenDetailsSchema,
    browser: z.string(),
    os: z.string(),
});

export type ClientDetails = z.infer<typeof ClientDetailsSchema>;