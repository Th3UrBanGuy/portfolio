import { z } from 'zod';

export const ClientInfoSchema = z.object({
    browser: z.string(),
    os: z.string(),
    resolution: z.string(),
    deviceMemory: z.union([z.string(), z.literal('N/A')]),
    cpuCores: z.union([z.number(), z.literal('N/A')]),
    userAgent: z.string(),
});

export type ClientInfo = z.infer<typeof ClientInfoSchema>;


export const RecordViewerInputSchema = ClientInfoSchema.extend({
    ip: z.string(),
    city: z.string(),
    country: z.string(),
    isp: z.string(),
    ipType: z.string(),
    region: z.string(),
    postal: z.string(),
    asn: z.string(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
});

export type RecordViewerInput = z.infer<typeof RecordViewerInputSchema>;