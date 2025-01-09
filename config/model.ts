/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  // safetySettings: Adjust safety settings
  // See https://ai.google.dev/gemini-api/docs/safety-settings
  history: [
    {
      role: "user",
      parts: [
        {
          text: `Generate a 30-second video script on the topic: "Interesting Historical Story". For each scene, provide an AI-generated image prompt in a "Realistic" format. Return the result in JSON format with "imagePrompt" and "contentText" as fields. No plain text output.`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  {\n    "imagePrompt": "A bustling marketplace in ancient Rome, with people haggling over goods, merchants selling their wares, and soldiers patrolling the streets.",\n    "contentText": "In the heart of ancient Rome, a bustling marketplace teemed with life. Merchants hawked their wares, their voices weaving a tapestry of sounds over the din of the crowd. Soldiers, clad in shining armor, patrolled the streets, ensuring order and security."\n  },\n  {\n    "imagePrompt": "A portrait of a young woman with a determined expression, holding a scroll in her hand.",\n    "contentText": "Among the throng, a young woman named Livia stood out. Her eyes, sharp and intelligent, scanned the crowds as she held a scroll in her hand, its contents a secret she held close."\n  },\n  {\n    "imagePrompt": "A dramatic scene of a Roman senator addressing a crowd in the Senate, with other senators listening intently.",\n    "contentText": "Livia was no ordinary citizen. She was a skilled scribe, entrusted with a vital message for the Roman Senate. The scroll she carried held the key to a conspiracy that threatened to unravel the very fabric of the Roman Republic."\n  },\n  {\n    "imagePrompt": "A close-up shot of Livia\'s hand carefully delivering the scroll to a senator.",\n    "contentText": "With a heart pounding with both fear and determination, Livia navigated the labyrinthine corridors of the Roman Senate. She found the Senator she sought and, with a trembling hand, delivered the scroll."\n  },\n  {\n    "imagePrompt": "A wide shot of the Roman Senate in chaos, with senators arguing and shouting.",\n    "contentText": "The news sent shockwaves through the Senate. The senators erupted in heated debate, their voices echoing through the chamber as they grappled with the gravity of the threat."\n  },\n  {\n    "imagePrompt": "A dramatic scene of Roman soldiers apprehending a group of conspirators.",\n    "contentText": "Livia\'s courage and determination saved Rome. Her timely warning led to the swift apprehension of the conspirators and prevented a catastrophe that could have plunged the empire into chaos."\n  },\n  {\n    "imagePrompt": "A final shot of Livia, now an honored citizen, being praised by the Roman populace.",\n    "contentText": "Livia, once an unassuming scribe, became a symbol of bravery and loyalty, her name forever etched in the annals of Roman history."\n  }\n]\n```\n\n**Notes:**\n\n- This script uses seven scenes, which can be edited to fit the desired length (30 seconds).\n- Each scene has a corresponding AI image prompt, which can be used to generate images using tools like Midjourney or Dall-E.\n- The content text provides narration for each scene, which can be voiced over or used as subtitles.\n- The story is a fictionalized account, but it draws inspiration from real historical events and themes.\n- Adjust the image prompts and content text to create a story that aligns with your specific vision.\n\nThis is just a starting point. You can adapt and expand this script to create a more detailed and engaging historical video. \n',
        },
      ],
    },
  ],
});