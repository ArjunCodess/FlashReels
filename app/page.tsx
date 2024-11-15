'use client'
import React from "react";
import { sendAnalyticsEvent } from "@/utils/analytics";

export default function Home() {
  const handleAnalyticsTest = () => sendAnalyticsEvent({
    name: 'Performance Alert',
    description: 'High latency detected in API endpoints',
    emoji: '⚠️',
    fields: [
      {
        name: "Average Response Time",
        value: "2.5s",
        inline: true
      },
      {
        name: "Affected Region", 
        value: "EU-WEST",
        inline: true
      },
      {
        name: "Impact Level",
        value: "Medium",
        inline: true
      },
      {
        name: "Recommended Action",
        value: "Scale up server instances and investigate potential bottlenecks",
        inline: false
      }
    ]
  });

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