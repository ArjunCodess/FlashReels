"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Dashboard() {
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    setVideoList([]);
  }, []);

  return (
    <div className="pt-4 pb-6 px-4 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button>
          <Link href="create-new">Create New</Link>
        </Button>
      </div>
      {videoList.length == 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
            <p className="text-lg text-neutral-500 mb-4">
              You don&apos;t have any short video created
            </p>
            <Button>
              <Link href="create-new">Create New</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card></Card>
      )}
    </div>
  );
}
