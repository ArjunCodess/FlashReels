import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

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

export async function POST(request: Request) {
  try {
    const { scenes, voice } = await request.json() as { scenes: Scene[], voice: string };
    
    // Combine all content text with a pause between each segment
    const combinedText = scenes.map(scene => scene.contentText).join('\n\n');

    // Initialize Microsoft Edge TTS
    const tts = new MsEdgeTTS();
    // Use the provided voice
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    // Generate audio using Edge TTS
    const { audioStream } = await tts.toStream(combinedText);
    const chunks: Buffer[] = [];
    
    await new Promise((resolve, reject) => {
      audioStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      
      audioStream.on('end', () => {
        resolve(null);
      });
      
      audioStream.on('error', (error) => {
        reject(error);
      });
    });
    
    const audioBuffer = Buffer.concat(chunks);

    // Generate a unique filename using timestamp
    const fileName = `audio_${Date.now()}.mp3`;

    try {
      // Upload to Cloudinary directly from buffer (without saving to filesystem)
      const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'flash-reels',
            public_id: fileName.replace('.mp3', ''),
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        ).end(audioBuffer);
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Audio file generated and uploaded successfully',
        audioUrl: uploadResult.secure_url
      });

    } catch (uploadError) {
      console.error('Error uploading to Cloudinary:', uploadError);
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