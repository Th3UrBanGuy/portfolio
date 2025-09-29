import { z } from 'zod';
import { ClientDetailsSchema } from './client-details';


export const ClientLocationSchema = z.object({
    ip: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    isp: z.string().optional(),
    ipType: z.string().optional(),
    region: z.string().optional(),
    postal: z.string().optional(),
    asn: z.string().optional(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
});

export const RecordViewerInputSchema = z.object({
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
    clientDetails: ClientDetailsSchema,
});

export type RecordViewerInput = z.infer<typeof RecordViewerInputSchema>;
