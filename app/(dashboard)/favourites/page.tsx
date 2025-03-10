"use client";

import React, { useEffect, useState } from "react";
import { VideoData } from "@/components/video/video-card";
import VideoCard from "@/components/video/video-card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await fetch(`/api/favourites?_t=${new Date().getTime()}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (res.ok) {
          const data = await res.json();
          setFavourites(data);
        } else {
          console.error("Failed to fetch favourites:", res.statusText);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching favourites:", error);
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  return (
    <div className="pt-4 pb-8 px-8 mx-auto">
      <h1 className="text-2xl font-bold mt-2 mb-4">Favourites</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : favourites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favourites.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-medium mb-2">No favourites yet</h2>
          <p className="text-gray-500 mb-6">
            Videos you mark as favourite will appear here
          </p>
          <Button>
            <Link href="/dashboard">Browse videos</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
