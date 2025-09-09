"use client";

import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "./card";
import { GlowingEffect } from "./glowing-effect";

const AnimatedCard = ({ title, description, features }) => {
  const topRef = useRef(null);
  const rightRef = useRef(null);
  const bottomRef = useRef(null);
  const leftRef = useRef(null);
  const animationFrameRef = useRef(0);

  useEffect(() => {
    const animateBorder = () => {
      const now = Date.now() / 1000;
      const speed = 0.5; // Animation speed

      // Calculate positions based on time
      const topX = Math.sin(now * speed) * 100;
      const rightY = Math.cos(now * speed) * 100;
      const bottomX = Math.sin(now * speed + Math.PI) * 100;
      const leftY = Math.cos(now * speed + Math.PI) * 100;

      // Apply positions to elements
      if (topRef.current)
        topRef.current.style.transform = `translateX(${topX}%)`;
      if (rightRef.current)
        rightRef.current.style.transform = `translateY(${rightY}%)`;
      if (bottomRef.current)
        bottomRef.current.style.transform = `translateX(${bottomX}%)`;
      if (leftRef.current)
        leftRef.current.style.transform = `translateY(${leftY}%)`;

      animationFrameRef.current = requestAnimationFrame(animateBorder);
    };

    animationFrameRef.current = requestAnimationFrame(animateBorder);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  return (
    <div className="relative w-full max-w-6xl bg-gray-900 border border-gray-800 rounded-2xl p-8 md:p-12 overflow-hidden shadow-2xl mx-auto">
      {/* Animated border elements */}
      <div className="absolute top-0 left-0 w-full h-0.5 overflow-hidden">
        <div
          ref={topRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"
        ></div>
      </div>

      <div className="absolute top-0 right-0 w-0.5 h-full overflow-hidden">
        <div
          ref={rightRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"
        ></div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-0.5 overflow-hidden">
        <div
          ref={bottomRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"
        ></div>
      </div>

      <div className="absolute top-0 left-0 w-0.5 h-full overflow-hidden">
        <div
          ref={leftRef}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>

        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
          {description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="relative">
              <div className="relative h-full rounded-xl border border-gray-700 p-1">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={80}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <Card className="relative h-full bg-gray-800 border-0 hover:bg-gray-750 transition-colors duration-300">
                  <CardContent className="p-6">
                    <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-orange-500/10 blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-purple-500/10 blur-xl"></div>
    </div>
  );
};

export default AnimatedCard;
