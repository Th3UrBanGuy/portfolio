'use server';

import { ai } from '@/ai/genkit';
import { recordViewer } from '@/lib/services/viewers';
import { z } from 'zod';
import { ClientLocationSchema } from '@/lib/schemas/viewer';
import { GENKIT_CLIENT_IP } from 'genkit';
import { ClientDetailsSchema } from '@/lib/schemas/client-details';


const RecordViewerFlowInputSchema = ClientDetailsSchema.extend({
    visitorId: z.string(),
    clientLocation: ClientLocationSchema.optional(),
});


const recordViewerFlow = ai.defineFlow(
    {
        name: 'recordViewerFlow',
        inputSchema: RecordViewerFlowInputSchema,
        outputSchema: z.void(),
    },
    async (input) => {
        const { clientLocation, visitorId, ...clientDetails } = input;
        const ip = GENKIT_CLIENT_IP?.get() || '0.0.0.0';

        let locationData = {
            city: clientLocation?.city || 'N/A',
            country: clientLocation?.country || 'N/A',
            isp: clientLocation?.isp || 'N/A',
            ipType: clientLocation?.ipType || 'N/A',
            region: clientLocation?.region || 'NA',
            postal: clientLocation?.postal || 'N/A',
            asn: clientLocation?.asn || 'N/A',
            latitude: clientLocation?.latitude || null,
            longitude: clientLocation?.longitude || null,
        };

        const isServerIpValid = ip && ip !== '0.0.0.0' && !ip.startsWith('127.') && !ip.startsWith('::1');

        if (isServerIpValid) {
            try {
                const response = await fetch(`https://ip-api.com/json/${ip}`);
                const data = await response.json();
                if (data.status === 'success') {
                    locationData = {
                        city: data.city || 'N/A',
                        country: data.country || 'N/A',
                        isp: data.isp || 'N/A',
                        ipType: ip.includes(':') ? 'IPv6' : 'IPv4',
                        region: data.regionName || 'NA',
                        postal: data.zip || 'N/A',
                        asn: data.as || 'N/A',
                        latitude: data.lat || null,
                        longitude: data.lon || null,
                    };
                }
            } catch (error) {
                console.error("Server-side IP lookup failed, using client-side data as fallback:", error);
            }
        }

        await recordViewer({
            visitorId: visitorId,
            ip: isServerIpValid ? ip : (clientLocation?.ip || 'N/A'),
            ...locationData,
            clientDetails,
        });
    }
);

export async function runRecordViewerFlow(input: z.infer<typeof RecordViewerFlowInputSchema>) {
    return await recordViewerFlow(input);
}
