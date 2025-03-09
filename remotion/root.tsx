import VideoComposition from "./composition";
import React from "react";
import { Composition, staticFile } from "remotion";
import { Video } from "@/components/video/video-player";

// Add global type declaration for Remotion's window.remotion_props
declare global {
  interface Window {
    // More specific type for Remotion props that includes the expected structure
    remotion_props: {
      video?: Video;
    } | null;
  }
}

export const RemotionRoot: React.FC = () => {
  // Sample data for development - will be replaced in production
  const sampleVideo: Video = {
    id: "147d497b-7663-4b6d-974a-9761422c9ff3",
    title: "Historical Facts",
    description:
      "The Great Pyramid of Giza, built over 4,500 years ago, took around 20 years to construct.",
    imageUrls: [
      "https://res.cloudinary.com/dfo3zdl9c/image/upload/v1741363580/flash-reels/eyxz1kdmdtneicsz59fa.png",
      "https://res.cloudinary.com/dfo3zdl9c/image/upload/v1741363597/flash-reels/pzkcqy2tprahla4sotlz.png",
      "https://res.cloudinary.com/dfo3zdl9c/image/upload/v1741363606/flash-reels/r28u2fbxk8eiqgvbhvtk.png",
      "https://res.cloudinary.com/dfo3zdl9c/image/upload/v1741363617/flash-reels/aqohtukeowutzwdh2cfn.png",
      "https://res.cloudinary.com/dfo3zdl9c/image/upload/v1741363640/flash-reels/vp9yotzunzpvqmuspwuw.png",
      "https://res.cloudinary.com/dfo3zdl9c/image/upload/v1741363654/flash-reels/myvmxbuucynazzlw8b2s.png",
      "https://res.cloudinary.com/dfo3zdl9c/image/upload/v1741363663/flash-reels/rcxyaheaypwjowigpddo.png",
    ],
    audioUrl:
      "https://res.cloudinary.com/dfo3zdl9c/video/upload/v1741363674/flash-reels/audio_1741363669194.mp3",
    captions: [
      {
        word: "the",
        start: 0,
        end: 0.32,
        confidence: 0.99782664,
        punctuated_word: "The",
      },
      {
        word: "great",
        start: 0.32,
        end: 0.56,
        confidence: 0.97539574,
        punctuated_word: "Great",
      },
      {
        word: "pyramid",
        start: 0.56,
        end: 1.04,
        confidence: 0.9994679,
        punctuated_word: "Pyramid",
      },
      {
        word: "of",
        start: 1.04,
        end: 1.12,
        confidence: 0.9996581,
        punctuated_word: "Of",
      },
      {
        word: "giza",
        start: 1.12,
        end: 1.8399999,
        confidence: 0.9970537,
        punctuated_word: "Giza,",
      },
      {
        word: "built",
        start: 1.8399999,
        end: 2.1599998,
        confidence: 0.99945337,
        punctuated_word: "built",
      },
      {
        word: "over",
        start: 2.1599998,
        end: 2.48,
        confidence: 0.99985313,
        punctuated_word: "over",
      },
      {
        word: "4,500",
        start: 2.48,
        end: 3.6799998,
        confidence: 0.99990916,
        punctuated_word: "4,500",
      },
      {
        word: "years",
        start: 3.6799998,
        end: 4,
        confidence: 0.999813,
        punctuated_word: "years",
      },
      {
        word: "ago",
        start: 4,
        end: 4.64,
        confidence: 0.99950004,
        punctuated_word: "ago,",
      },
      {
        word: "took",
        start: 4.72,
        end: 4.96,
        confidence: 0.9999167,
        punctuated_word: "took",
      },
      {
        word: "around",
        start: 4.96,
        end: 5.2799997,
        confidence: 0.9998542,
        punctuated_word: "around",
      },
      {
        word: "twenty",
        start: 5.2799997,
        end: 5.68,
        confidence: 0.99995303,
        punctuated_word: "twenty",
      },
      {
        word: "years",
        start: 5.68,
        end: 6,
        confidence: 0.9999671,
        punctuated_word: "years",
      },
      {
        word: "to",
        start: 6,
        end: 6.24,
        confidence: 0.9999701,
        punctuated_word: "to",
      },
      {
        word: "construct",
        start: 6.24,
        end: 6.96,
        confidence: 0.9982184,
        punctuated_word: "construct.",
      },
      {
        word: "the",
        start: 7.52,
        end: 7.7599998,
        confidence: 0.9990576,
        punctuated_word: "The",
      },
      {
        word: "terracotta",
        start: 7.7599998,
        end: 8.48,
        confidence: 0.9324481,
        punctuated_word: "Terracotta",
      },
      {
        word: "army",
        start: 8.48,
        end: 9.2,
        confidence: 0.97396314,
        punctuated_word: "Army,",
      },
      {
        word: "a",
        start: 9.28,
        end: 9.44,
        confidence: 0.9997309,
        punctuated_word: "a",
      },
      {
        word: "collection",
        start: 9.44,
        end: 9.84,
        confidence: 0.9996106,
        punctuated_word: "collection",
      },
      {
        word: "of",
        start: 9.84,
        end: 10.08,
        confidence: 0.9999901,
        punctuated_word: "of",
      },
      {
        word: "over",
        start: 10.08,
        end: 10.4,
        confidence: 0.999966,
        punctuated_word: "over",
      },
      {
        word: "8,000",
        start: 10.4,
        end: 10.96,
        confidence: 0.99990237,
        punctuated_word: "8,000",
      },
      {
        word: "life-sized",
        start: 10.96,
        end: 11.679999,
        confidence: 0.94063824,
        punctuated_word: "life-sized",
      },
      {
        word: "soldiers",
        start: 11.679999,
        end: 12.48,
        confidence: 0.9978105,
        punctuated_word: "soldiers,",
      },
      {
        word: "was",
        start: 12.559999,
        end: 12.799999,
        confidence: 0.9999504,
        punctuated_word: "was",
      },
      {
        word: "buried",
        start: 12.799999,
        end: 13.12,
        confidence: 0.99918276,
        punctuated_word: "buried",
      },
      {
        word: "with",
        start: 13.12,
        end: 13.36,
        confidence: 0.9999609,
        punctuated_word: "with",
      },
      {
        word: "the",
        start: 13.36,
        end: 13.5199995,
        confidence: 0.9996904,
        punctuated_word: "the",
      },
      {
        word: "first",
        start: 13.5199995,
        end: 13.759999,
        confidence: 0.6329194,
        punctuated_word: "first",
      },
      {
        word: "emperor",
        start: 13.759999,
        end: 14.16,
        confidence: 0.8446212,
        punctuated_word: "Emperor",
      },
      {
        word: "of",
        start: 14.16,
        end: 14.32,
        confidence: 0.9999378,
        punctuated_word: "of",
      },
      {
        word: "china",
        start: 14.32,
        end: 14.719999,
        confidence: 0.996428,
        punctuated_word: "China.",
      },
      {
        word: "vikings",
        start: 15.685,
        end: 16.165,
        confidence: 0.9996082,
        punctuated_word: "Vikings",
      },
      {
        word: "weren't",
        start: 16.165,
        end: 16.485,
        confidence: 0.99967474,
        punctuated_word: "weren't",
      },
      {
        word: "just",
        start: 16.485,
        end: 16.645,
        confidence: 0.99992836,
        punctuated_word: "just",
      },
      {
        word: "raiders",
        start: 16.645,
        end: 17.365,
        confidence: 0.997355,
        punctuated_word: "raiders",
      },
      {
        word: "they",
        start: 17.365,
        end: 17.765,
        confidence: 0.62557703,
        punctuated_word: "they",
      },
      {
        word: "were",
        start: 17.765,
        end: 18.005001,
        confidence: 0.99989665,
        punctuated_word: "were",
      },
      {
        word: "skilled",
        start: 18.005001,
        end: 18.325,
        confidence: 0.99986434,
        punctuated_word: "skilled",
      },
      {
        word: "shipbuilders",
        start: 18.325,
        end: 18.965,
        confidence: 0.9979971,
        punctuated_word: "shipbuilders",
      },
      {
        word: "and",
        start: 18.965,
        end: 19.125,
        confidence: 0.9999428,
        punctuated_word: "and",
      },
      {
        word: "explorers",
        start: 19.125,
        end: 19.765,
        confidence: 0.9993756,
        punctuated_word: "explorers",
      },
      {
        word: "who",
        start: 19.765,
        end: 20.005001,
        confidence: 0.99917895,
        punctuated_word: "who",
      },
      {
        word: "reached",
        start: 20.005001,
        end: 20.325,
        confidence: 0.99962914,
        punctuated_word: "reached",
      },
      {
        word: "north",
        start: 20.325,
        end: 20.645,
        confidence: 0.9995401,
        punctuated_word: "North",
      },
      {
        word: "america",
        start: 20.645,
        end: 21.045,
        confidence: 0.9998975,
        punctuated_word: "America",
      },
      {
        word: "centuries",
        start: 21.045,
        end: 21.605,
        confidence: 0.99981207,
        punctuated_word: "centuries",
      },
      {
        word: "before",
        start: 21.605,
        end: 21.925,
        confidence: 0.9992982,
        punctuated_word: "before",
      },
      {
        word: "columbus",
        start: 21.925,
        end: 22.724998,
        confidence: 0.9996598,
        punctuated_word: "Columbus.",
      },
      {
        word: "gladiatorial",
        start: 23.445,
        end: 24.325,
        confidence: 0.9493896,
        punctuated_word: "Gladiatorial",
      },
      {
        word: "contests",
        start: 24.325,
        end: 24.885,
        confidence: 0.99946654,
        punctuated_word: "contests",
      },
      {
        word: "in",
        start: 24.885,
        end: 25.045,
        confidence: 0.999954,
        punctuated_word: "in",
      },
      {
        word: "the",
        start: 25.045,
        end: 25.205,
        confidence: 0.9997526,
        punctuated_word: "the",
      },
      {
        word: "roman",
        start: 25.205,
        end: 25.525,
        confidence: 0.99948263,
        punctuated_word: "Roman",
      },
      {
        word: "colosseum",
        start: 25.525,
        end: 26.165,
        confidence: 0.9538357,
        punctuated_word: "Colosseum",
      },
      {
        word: "weren't",
        start: 26.165,
        end: 26.645,
        confidence: 0.99980736,
        punctuated_word: "weren't",
      },
      {
        word: "just",
        start: 26.645,
        end: 26.885,
        confidence: 0.99994874,
        punctuated_word: "just",
      },
      {
        word: "entertainment",
        start: 26.885,
        end: 27.525,
        confidence: 0.9998036,
        punctuated_word: "entertainment",
      },
      {
        word: "they",
        start: 27.89,
        end: 28.21,
        confidence: 0.9990133,
        punctuated_word: "they",
      },
      {
        word: "were",
        start: 28.21,
        end: 28.369999,
        confidence: 0.999977,
        punctuated_word: "were",
      },
      {
        word: "often",
        start: 28.369999,
        end: 28.689999,
        confidence: 0.9999472,
        punctuated_word: "often",
      },
      {
        word: "political",
        start: 28.689999,
        end: 29.25,
        confidence: 0.99996376,
        punctuated_word: "political",
      },
      {
        word: "statements",
        start: 29.25,
        end: 29.81,
        confidence: 0.9998913,
        punctuated_word: "statements",
      },
      {
        word: "and",
        start: 29.81,
        end: 30.13,
        confidence: 0.9969119,
        punctuated_word: "and",
      },
      {
        word: "displays",
        start: 30.13,
        end: 30.609999,
        confidence: 0.9999522,
        punctuated_word: "displays",
      },
      {
        word: "of",
        start: 30.609999,
        end: 30.849998,
        confidence: 0.99998903,
        punctuated_word: "of",
      },
      {
        word: "power",
        start: 30.849998,
        end: 31.41,
        confidence: 0.9993944,
        punctuated_word: "power.",
      },
      {
        word: "johannes",
        start: 32.05,
        end: 32.53,
        confidence: 0.98037064,
        punctuated_word: "Johannes",
      },
      {
        word: "gutenberg's",
        start: 32.53,
        end: 33.41,
        confidence: 0.9987023,
        punctuated_word: "Gutenberg's",
      },
      {
        word: "printing",
        start: 33.41,
        end: 33.73,
        confidence: 0.99851197,
        punctuated_word: "printing",
      },
      {
        word: "press",
        start: 33.73,
        end: 33.97,
        confidence: 0.9998772,
        punctuated_word: "press",
      },
      {
        word: "revolutionized",
        start: 33.97,
        end: 34.85,
        confidence: 0.983824,
        punctuated_word: "revolutionized",
      },
      {
        word: "communication",
        start: 34.85,
        end: 35.809998,
        confidence: 0.9955753,
        punctuated_word: "communication,",
      },
      {
        word: "making",
        start: 35.97,
        end: 36.29,
        confidence: 0.9998411,
        punctuated_word: "making",
      },
      {
        word: "books",
        start: 36.29,
        end: 36.69,
        confidence: 0.99977714,
        punctuated_word: "books",
      },
      {
        word: "and",
        start: 36.69,
        end: 37.01,
        confidence: 0.9999411,
        punctuated_word: "and",
      },
      {
        word: "information",
        start: 37.01,
        end: 37.57,
        confidence: 0.99995196,
        punctuated_word: "information",
      },
      {
        word: "accessible",
        start: 37.57,
        end: 38.21,
        confidence: 0.9999082,
        punctuated_word: "accessible",
      },
      {
        word: "to",
        start: 38.21,
        end: 38.37,
        confidence: 0.99998426,
        punctuated_word: "to",
      },
      {
        word: "a",
        start: 38.37,
        end: 38.53,
        confidence: 0.99997795,
        punctuated_word: "a",
      },
      {
        word: "wider",
        start: 38.53,
        end: 38.93,
        confidence: 0.9999597,
        punctuated_word: "wider",
      },
      {
        word: "audience",
        start: 38.93,
        end: 39.329998,
        confidence: 0.99928,
        punctuated_word: "audience.",
      },
      {
        word: "medieval",
        start: 40.465,
        end: 40.945,
        confidence: 0.99934125,
        punctuated_word: "Medieval",
      },
      {
        word: "castles",
        start: 40.945,
        end: 41.505,
        confidence: 0.99580127,
        punctuated_word: "castles",
      },
      {
        word: "were",
        start: 41.505,
        end: 41.745,
        confidence: 0.9999213,
        punctuated_word: "were",
      },
      {
        word: "not",
        start: 41.745,
        end: 41.985,
        confidence: 0.9999862,
        punctuated_word: "not",
      },
      {
        word: "only",
        start: 41.985,
        end: 42.225002,
        confidence: 0.9999807,
        punctuated_word: "only",
      },
      {
        word: "residences",
        start: 42.225002,
        end: 43.185,
        confidence: 0.9988078,
        punctuated_word: "residences",
      },
      {
        word: "but",
        start: 43.345,
        end: 43.745,
        confidence: 0.7908027,
        punctuated_word: "but",
      },
      {
        word: "also",
        start: 43.745,
        end: 44.065002,
        confidence: 0.9999676,
        punctuated_word: "also",
      },
      {
        word: "strategic",
        start: 44.065002,
        end: 44.705,
        confidence: 0.9998858,
        punctuated_word: "strategic",
      },
      {
        word: "military",
        start: 44.705,
        end: 45.185,
        confidence: 0.9999559,
        punctuated_word: "military",
      },
      {
        word: "strongholds",
        start: 45.185,
        end: 46.225,
        confidence: 0.9997596,
        punctuated_word: "strongholds",
      },
      {
        word: "capable",
        start: 46.225,
        end: 46.705,
        confidence: 0.55456895,
        punctuated_word: "capable",
      },
      {
        word: "of",
        start: 46.705,
        end: 46.945,
        confidence: 0.9999769,
        punctuated_word: "of",
      },
      {
        word: "withstanding",
        start: 46.945,
        end: 47.505,
        confidence: 0.9922347,
        punctuated_word: "withstanding",
      },
      {
        word: "long",
        start: 47.505,
        end: 47.905,
        confidence: 0.99989736,
        punctuated_word: "long",
      },
      {
        word: "sieges",
        start: 47.905,
        end: 48.385002,
        confidence: 0.9917266,
        punctuated_word: "sieges.",
      },
      {
        word: "the",
        start: 49.25094,
        end: 49.49094,
        confidence: 0.99954504,
        punctuated_word: "The",
      },
      {
        word: "wright",
        start: 49.49094,
        end: 49.81094,
        confidence: 0.9998419,
        punctuated_word: "Wright",
      },
      {
        word: "brothers'",
        start: 49.81094,
        end: 50.370937,
        confidence: 0.8320848,
        punctuated_word: "brothers'",
      },
      {
        word: "first",
        start: 50.370937,
        end: 50.530937,
        confidence: 0.9992974,
        punctuated_word: "first",
      },
      {
        word: "successful",
        start: 50.530937,
        end: 51.09094,
        confidence: 0.9999002,
        punctuated_word: "successful",
      },
      {
        word: "flight",
        start: 51.09094,
        end: 51.57094,
        confidence: 0.99947244,
        punctuated_word: "flight",
      },
      {
        word: "at",
        start: 51.57094,
        end: 51.890938,
        confidence: 0.998701,
        punctuated_word: "at",
      },
      {
        word: "kitty",
        start: 51.890938,
        end: 52.29094,
        confidence: 0.9971883,
        punctuated_word: "Kitty",
      },
      {
        word: "hawk",
        start: 52.29094,
        end: 52.61094,
        confidence: 0.99364436,
        punctuated_word: "Hawk",
      },
      {
        word: "in",
        start: 52.61094,
        end: 52.850937,
        confidence: 0.9997341,
        punctuated_word: "in",
      },
      {
        word: "1903",
        start: 52.850937,
        end: 53.81094,
        confidence: 0.9979796,
        punctuated_word: "1903",
      },
      {
        word: "marked",
        start: 53.81094,
        end: 54.13094,
        confidence: 0.9993851,
        punctuated_word: "marked",
      },
      {
        word: "the",
        start: 54.13094,
        end: 54.370937,
        confidence: 0.99983,
        punctuated_word: "the",
      },
      {
        word: "beginning",
        start: 54.370937,
        end: 54.69094,
        confidence: 0.99962485,
        punctuated_word: "beginning",
      },
      {
        word: "of",
        start: 54.69094,
        end: 54.850937,
        confidence: 0.9999722,
        punctuated_word: "of",
      },
      {
        word: "the",
        start: 54.850937,
        end: 55.01094,
        confidence: 0.99977857,
        punctuated_word: "the",
      },
      {
        word: "age",
        start: 55.01094,
        end: 55.25094,
        confidence: 0.99215186,
        punctuated_word: "age",
      },
      {
        word: "of",
        start: 55.25094,
        end: 55.41094,
        confidence: 0.9999577,
        punctuated_word: "of",
      },
      {
        word: "aviation",
        start: 55.41094,
        end: 55.97094,
        confidence: 0.9975617,
        punctuated_word: "aviation.",
      },
    ],
    script: "",
    voice: "onyx",
    captionStyle: "classic",
    createdAt: new Date().toISOString(),
    status: "completed",
    createdBy: "sample-user-id"
  };

  // Get props using the method described in Remotion docs for SSR
  // https://www.remotion.dev/docs/ssr#render-using-github-actions
  // https://www.remotion.dev/docs/passing-props#passing-input-props-in-github-actions
  const propsFromWindow = typeof window !== 'undefined' && window.remotion_props ? window.remotion_props : null;
  
  // Use either window props or sample data for development
  const videoProps = propsFromWindow || { video: sampleVideo };
  
  // Extract video data, ensuring correct structure regardless of source
  const videoData = videoProps.video || sampleVideo;
  
  // Get captions with safety check
  const captions = videoData.captions || [];
  
  // Use the exact same duration calculation as the player component
  const lastCaptionEnd = captions.length > 0 ? captions[captions.length - 1].end : 10;
  const durationInFrames = Number((lastCaptionEnd * 30).toFixed(0)) + 10;
  
  console.log("RemotionRoot rendering with:", {
    propsSource: propsFromWindow ? "SSR" : "Development",
    videoId: videoData.id,
    duration: `${durationInFrames} frames (${durationInFrames/30}s)`,
    captionsCount: captions.length
  });

  return (
    <>
      {/* Add font styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @font-face {
            font-family: 'Geist';
            src: url(${staticFile('/fonts/Geist-Regular.woff2')}) format('woff2');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'Geist';
            src: url(${staticFile('/fonts/Geist-Bold.woff2')}) format('woff2');
            font-weight: bold;
            font-style: normal;
          }
          @font-face {
            font-family: 'Geist';
            src: url(${staticFile('/fonts/Geist-Light.woff2')}) format('woff2');
            font-weight: 300;
            font-style: normal;
          }
        `
      }} />
      <Composition
        id="FlashReelRenderedVideo"
        component={VideoComposition}
        durationInFrames={durationInFrames}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{ 
          video: videoData
        }}
      />
    </>
  );
};