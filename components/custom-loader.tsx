import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CustomLoader({ loading }: { loading: boolean }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className="flex flex-row items-center justify-between">
        <div className="flex-1">
          <AlertDialogHeader>
            <AlertDialogTitle>Processing Your Request</AlertDialogTitle>
            <AlertDialogDescription>
              Please wait while we generate your video...
              <br />
              DO NOT REFRESH.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <div className="ml-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}