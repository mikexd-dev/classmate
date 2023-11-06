"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon, Loader2 } from "lucide-react";

export default function DialogCourse() {
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    React.useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDelete = () => {
    // Perform the delete action here
    // ...
    setShowDeleteConfirmation(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="p-6 rounded-full text-sm mr-5 bg-purple-600 drop-shadow-md cursor-pointer"
          onClick={handleDeleteClick}
        >
          <PlusIcon className="mr-2 w-4 h-4" strokeWidth={3} />
          {/* {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} */}
          New Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Subject</DialogTitle>
          <DialogDescription>
            {showDeleteConfirmation
              ? "Which subject would you like to learn now?"
              : "Make changes to your profile here. Click save when you're done."}
            <br />
            TBD - TO BE DONE
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Your existing profile fields */}
        </div>
        <DialogFooter>
          {showDeleteConfirmation ? (
            <>
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete}>Next</Button>
            </>
          ) : (
            <Button type="submit">Save changes</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
