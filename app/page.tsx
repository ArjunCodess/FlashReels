'use client'
import React from "react";
import { sendAnalyticsEvent } from "@/utils/analytics";

export default function Home() {
  const handleAnalyticsTest = () => sendAnalyticsEvent('test_analytics', 'Testing analytics integration');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl mb-4">Home</h1>
      <button 
        onClick={handleAnalyticsTest}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Test Analytics Event
      </button>
    </div>
  );
}