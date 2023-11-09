"use client";
import { cn } from "@/lib";
import { Pause, Play } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const AudioPlayer = ({ src }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(src));
  //   audioRef.current.play();

  useEffect(() => {
    audioRef.current.play();
    setIsPlaying(true);
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <div
        className={cn("bg-black rounded-full ml-2 p-3 cursor-pointer", {
          "bg-green-600 text-white": isPlaying,
          "bg-black text-white": !isPlaying,
        })}
        onClick={handlePlayPause}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </div>
      {/* <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button> */}
    </div>
  );
};

export default AudioPlayer;
