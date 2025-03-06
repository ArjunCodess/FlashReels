import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const runtime = 'edge';

fal.config({
  credentials: process.env.FAL_AI_API_KEY
});

async function generateSHA1(message: string) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function uploadToCloudinary(base64Image: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const timestamp = Math.round((new Date).getTime() / 1000).toString();

  const params = {
    timestamp: timestamp,
    folder: 'flash-reels'
  };

  // Ensure the base64 string is correctly formatted
  if (!base64Image.startsWith('data:image/jpeg;base64,')) {
    base64Image = `data:image/jpeg;base64,${base64Image}`;
  }

  const paramString = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&') + apiSecret;

  const signature = await generateSHA1(paramString);

  const formData = new URLSearchParams({
    file: base64Image,
    api_key: apiKey || '',
    signature: signature,
    ...params
  });

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[CLOUDINARY_UPLOAD_ERROR]', error);
    throw new Error(`Cloudinary upload failed: ${error}`);
  }

  const data = await response.json();
  return data.secure_url;
}

async function generateImageWithFlux(prompt: string): Promise<string> {
  try {
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: prompt,
        image_size: "portrait_16_9",
        num_inference_steps: 4,
        num_images: 1,
        enable_safety_checker: true
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      }
    });

    console.log(result.data);
    
    // Ensure we are returning the correct image URL
    const imageUrl = result.data.images[0].url; // Get the image URL
    const response = await fetch(imageUrl); // Fetch the image as a response
    const arrayBuffer = await response.arrayBuffer(); // Get the response as an ArrayBuffer
    const base64Image = Buffer.from(arrayBuffer).toString('base64'); // Convert ArrayBuffer to base64 string

    return `data:image/jpeg;base64,${base64Image}`; // Return the base64 image with the correct prefix
  } catch (error) {
    console.error("[IMAGE_GENERATION_ERROR]", error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const imageBase64 = await generateImageWithFlux(prompt);

    if (!imageBase64) {
      return new NextResponse("Failed to generate image", { status: 500 });
    }

    const cloudinaryUrl = await uploadToCloudinary(imageBase64);

    if (!cloudinaryUrl) {
      return new NextResponse("Failed to upload image", { status: 500 });
    }

    return NextResponse.json({
      imageUrl: cloudinaryUrl
    });

  } catch (error) {
    console.error('[API_ERROR]', error);
    return new NextResponse(error instanceof Error ? error.message : "Internal Server Error", { 
      status: 500 
    });
  }
}