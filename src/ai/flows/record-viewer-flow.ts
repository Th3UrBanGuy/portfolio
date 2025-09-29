'use server';

import { ai } from '@/ai/genkit';
import { recordViewer } from '@/lib/services/viewers';
import { z } from 'zod';
import { RecordViewerInputSchema, type RecordViewerInput } from '@/lib/schemas/viewer';


const recordViewerFlow = ai.defineFlow(
    {
        name: 'recordViewerFlow',
        inputSchema: RecordViewerInputSchema,
        outputSchema: z.void(),
    },
    async (viewerData) => {
        await recordViewer(viewerData);
    }
);

export async function runRecordViewerFlow(input: RecordViewerInput) {
    return await recordViewerFlow(input);
}
