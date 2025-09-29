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
        const serverIp = GENKIT_CLIENT_IP?.get();

        // Determine the most reliable IP address
        const ipToLookup = serverIp && serverIp !== '0.0.0.0' && !serverIp.startsWith('127.') && !serverIp.startsWith('::1') 
            ? serverIp 
            : clientLocation?.ip;

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

        // If we have a valid IP to look up, perform the server-side lookup
        if (ipToLookup && ipToLookup !== '0.0.0.0') {
            try {
                const response = await fetch(`https://ip-api.com/json/${ipToLookup}`);
                const data = await response.json();
                if (data.status === 'success') {
                    locationData = {
                        city: data.city || 'N/A',
                        country: data.country || 'N/A',
                        isp: data.isp || 'N/A',
                        ipType: ipToLookup.includes(':') ? 'IPv6' : 'IPv4',
                        region: data.regionName || 'NA',
                        postal: data.zip || 'N/A',
                        asn: data.as || 'N/A',
                        latitude: data.lat || null,
                        longitude: data.lon || null,
                    };
                }
            } catch (error) {
                console.error("Server-side IP lookup failed. Location data might be incomplete.", error);
            }
        }

        await recordViewer({
            visitorId: visitorId,
            ip: ipToLookup || (clientLocation?.ip || 'N/A'),
            ...locationData,
            clientDetails,
        });
    }
);

export async function runRecordViewerFlow(input: z.infer<typeof RecordViewerFlowInputSchema>) {
    return await recordViewerFlow(input);
}

    