import { createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export async function POST(request: Request) {
    const body = await request.json();
    const { audioUrl } = body;

    try {
        console.log('Generating captions for audio URL:', audioUrl);
        
        const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
            { url: audioUrl },
            { model: "nova-3", smart_format: true }
        );

        if (error) {
            throw new Error(`Caption generation failed: ${error}`);
        }

        // Extract the words array which contains detailed timing information
        const transcript = result.results.channels[0].alternatives[0].words;
        console.log('Generated transcript words:', transcript);

        return NextResponse.json({ transcript });
    } catch (err: unknown) {
        console.error('Error in generate-captions:', (err as Error).message);
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
}