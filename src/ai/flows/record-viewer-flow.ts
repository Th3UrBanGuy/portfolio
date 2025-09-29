'use server';

import { ai } from '@/ai/genkit';
import { recordViewer } from '@/lib/services/viewers';
import { z } from 'zod';
import { ClientInfoSchema, type ClientInfo } from '@/lib/schemas/viewer';
import { GENKIT_CLIENT_IP } from 'genkit';


const recordViewerFlow = ai.defineFlow(
    {
        name: 'recordViewerFlow',
        inputSchema: ClientInfoSchema,
        outputSchema: z.void(),
    },
    async (clientInfo) => {

        const ip = GENKIT_CLIENT_IP?.get() || '0.0.0.0';

        let locationData = {
            city: 'N/A',
            country: 'N/A',
            isp: 'N/A',
            ipType: 'N/A',
            region: 'N/A',
            postal: 'N/A',
            asn: 'N/A',
            latitude: null,
            longitude: null,
        };

        if (ip && ip !== '0.0.0.0' && !ip.startsWith('127.')) {
            try {
                const response = await fetch(`http://ip-api.com/json/${ip}`);
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
                console.error("Server-side IP lookup failed:", error);
            }
        }

        await recordViewer({
            ip,
            ...locationData,
            ...clientInfo,
        });
    }
);

export async function runRecordViewerFlow(input: ClientInfo) {
    return await recordViewerFlow(input);
}
