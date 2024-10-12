import { chatSession } from "@/config/model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();
        console.log(prompt);

        const result = await chatSession.sendMessage(prompt);
        console.log(result.response.text());

        return NextResponse.json({ 'result': JSON.parse(result.response.text()), })
    } catch (error: any) {
        return NextResponse.json({ 'error': error })
    }
}