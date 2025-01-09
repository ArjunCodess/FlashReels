import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import cloudinary from '@/lib/cloudinary';

interface Scene {
  imagePrompt: string;
  contentText: string;
}

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  version: number;
  type: string;
  created_at: string;
  bytes: number;
  url: string;
}

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'VR6AewLTigWG4xSOukaG';

export async function POST(request: Request) {
  try {
    const { scenes } = await request.json() as { scenes: Scene[] };
    
    // Combine all content text with a pause between each segment
    const combinedText = scenes.map(scene => scene.contentText).join('\n\n');

    const options = {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: combinedText,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    };

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      options
    );

    if (!response.ok) {
      throw new Error('Failed to generate audio');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure audio directory exists
    const audioDir = path.join(process.cwd(), 'audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Generate a unique filename using timestamp
    const fileName = `audio_${Date.now()}.mp3`;
    const filePath = path.join(audioDir, fileName);
    fs.writeFileSync(filePath, buffer);

    try {
      // Upload to Cloudinary in the flash-reels folder
      const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload(
          filePath,
          {
            resource_type: 'auto',
            folder: 'flash-reels',
            public_id: path.parse(fileName).name, 
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );
      });

      // Delete local file after successful upload
      fs.unlinkSync(filePath);

      return NextResponse.json({ 
        success: true, 
        message: 'Audio file generated and uploaded successfully',
        audioUrl: uploadResult.secure_url
      });

    } catch (uploadError) {
      // Delete local file if upload fails
      fs.unlinkSync(filePath);
      throw uploadError;
    }

  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}