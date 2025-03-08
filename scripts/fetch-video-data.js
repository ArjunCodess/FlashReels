// CommonJS script for fetching video data
const fs = require('fs');
const axios = require('axios');

// Get command line arguments
const videoId = process.argv[2];
const apiUrl = process.env.API_URL || 'http://localhost:3000';

if (!videoId) {
  console.error('Video ID is required');
  process.exit(1);
}

// Use CommonJS async pattern
async function fetchVideoData() {
  console.log(`Fetching video data for ID: ${videoId} from ${apiUrl}/api/videos/${videoId}`);
  
  try {
    const response = await axios.get(`${apiUrl}/api/videos/${videoId}`);
    const videoData = response.data;
    
    // Extract only the needed properties for Remotion rendering
    const remotionProps = {
      videoId: videoData.id,
      title: videoData.title,
      description: videoData.description,
      imageUrls: videoData.imageUrls || [],
      audioUrl: videoData.audioUrl || "",
      captions: videoData.captions || [],
      script: videoData.script || "",
      voice: videoData.voice || ""
    };
    
    fs.writeFileSync('video-data.json', JSON.stringify(remotionProps, null, 2));
    console.log('Video data saved to video-data.json');
    return remotionProps;
  } catch (error) {
    console.error('Error fetching video data:', error.message);
    
    // Create a fallback object with the videoId
    const fallbackData = {
      videoId: videoId,
      title: "Video not found",
      description: null,
      imageUrls: [],
      audioUrl: "",
      captions: [],
      script: "",
      voice: ""
    };
    
    fs.writeFileSync('video-data.json', JSON.stringify(fallbackData, null, 2));
    console.error('Created fallback video data');
    return fallbackData;
  }
}

// Execute the function
fetchVideoData().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1); 
});