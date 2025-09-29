import { z } from 'zod';

export const RecordViewerInputSchema = z.object({
    ip: z.string(),
    city: z.string(),
    country: z.string(),
    isp: z.string(),
    browser: z.string(),
    os: z.string(),
    resolution: z.string(),
    deviceMemory: z.union([z.string(), z.literal('N/A')]),
    cpuCores: z.union([z.number(), z.literal('N/A')]),
});

export type RecordViewerInput = z.infer<typeof RecordViewerInputSchema>;
