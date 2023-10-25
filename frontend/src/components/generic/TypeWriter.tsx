"use client";
import React from "react";
import Typewriter from "typewriter-effect";

type Props = {};

const TypewriterTitle = (props: Props) => {
  return (
    <Typewriter
      options={{
        loop: true,
      }}
      onInit={(typewriter) => {
        typewriter
          .typeString("Supercharged Learning.")
          .pauseFor(1000)
          .deleteAll()
          .typeString("AI-Powered Courses.")
          .pauseFor(1000)
          .deleteAll()
          .typeString("On-chain Credentials")
          .start();
      }}
    />
  );
};

export default TypewriterTitle;
