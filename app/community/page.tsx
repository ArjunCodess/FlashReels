"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import VideoGrid from "@/components/video/video-grid";
import { VideoData } from "@/components/video/video-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Interface for raw video data from API
interface RawVideoData {
  id: string;
  title?: string;
  description?: string | null;
  imageUrls?: string[] | string | null;
  createdAt?: string;
  status?: string;
  isFavourite?: boolean;
  [key: string]: unknown; // Allow for other properties with unknown type
}

export default function CommunityPage() {
  const router = useRouter();
  const [videoList, setVideoList] = useState<VideoData[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);
  const [displayedVideos, setDisplayedVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 8;

  // Process video data to ensure it has all required fields
  const processVideoData = useCallback((video: RawVideoData): VideoData => {
    return {
      id: video.id,
      imageUrls: Array.isArray(video.imageUrls) ? video.imageUrls : [],
      title: video.title || 'Untitled Video',
      description: video.description || null,
      status: video.status || 'completed',
      createdAt: video.createdAt || new Date().toISOString(),
      isFavourite: video.isFavourite || false
    };
  }, []);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all videos from the API
      const response = await axios.get('/api/videos', {
        params: {
          _t: new Date().getTime() // Add timestamp to prevent caching
        },
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      // Process the videos to ensure they have all required fields
      const processedVideos = response.data.map(processVideoData);
      
      // Sort videos by createdAt in descending order (newest first)
      const sortedVideos = [...processedVideos].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setVideoList(sortedVideos);
      setFilteredVideos(sortedVideos);
      setCurrentPage(1); // Reset to first page when new data is loaded
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [processVideoData]);

  // Filter videos based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVideos(videoList);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = videoList.filter(video => 
        video.title.toLowerCase().includes(query) || 
        (video.description && video.description.toLowerCase().includes(query))
      );
      setFilteredVideos(filtered);
    }
    setCurrentPage(1); // Reset to first page when search query changes
  }, [searchQuery, videoList]);

  // Update total pages whenever filtered videos change
  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil(filteredVideos.length / PAGE_SIZE));
    setTotalPages(newTotalPages);
    console.log(`Debug: Videos: ${filteredVideos.length}, Page size: ${PAGE_SIZE}, Total pages: ${newTotalPages}`);
  }, [filteredVideos]);

  // Update displayed videos based on current page and filtered videos
  useEffect(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    setDisplayedVideos(filteredVideos.slice(startIndex, endIndex));
  }, [filteredVideos, currentPage]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleBack = () => {
    router.back();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at bounds
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis before range if needed
      if (startPage > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add range
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis after range if needed
      if (endPage < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }
      
      // Always include last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="container mx-auto min-h-[calc(100vh-120px)] p-6 border rounded-md my-4 flex flex-col">
      <Button
        variant="outline"
        onClick={handleBack}
        className="mb-4 flex items-center gap-2 w-fit"
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Community Videos</h1>
          <p className="text-gray-500 mt-2">
            Explore the latest videos created by the community
          </p>
        </div>
        
        <div className="relative md:min-w-[300px] lg:min-w-[500px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 w-full"
          />
          {searchQuery && (
            <p className="absolute text-xs text-gray-500 mt-1">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>
      </div>

      <VideoGrid
        videos={displayedVideos}
        loading={loading}
        error={error}
        onRetry={fetchVideos}
      />

      {/* Spacer to push pagination to bottom */}
      <div className="flex-grow" />
      
      {/* Pagination */}
      {!loading && filteredVideos.length > 0 && totalPages > 1 && (
        <Pagination className="pt-6">
          <PaginationContent>
            {/* Previous Page Button */}
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                />
              </PaginationItem>
            )}

            {/* Page Numbers */}
            {getPageNumbers().map((pageNum, index) => (
              <PaginationItem key={`page-${pageNum}-${index}`}>
                {pageNum === -1 || pageNum === -2 ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={pageNum === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNum);
                    }}
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {/* Next Page Button */}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
