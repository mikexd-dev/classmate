"use client";

import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@/lib/useWindowSize";
type Props = {};

const ConfettiComponent = (props: Props) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  return (
    <div className="z-50">
      <Confetti width={windowWidth} height={windowHeight} gravity={0.02} />
    </div>
  );
};

export default ConfettiComponent;
