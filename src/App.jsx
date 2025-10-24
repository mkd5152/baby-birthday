import React, { useState } from "react";
import HeartSoft from "./components/HeartSoft";
import IntroScene from "./components/IntroScene";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {showIntro ? (
        <IntroScene onFinish={() => setShowIntro(false)} />
      ) : (
        <HeartSoft />
      )}
    </div>
  );
}