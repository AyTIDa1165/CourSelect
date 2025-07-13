"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AnonymousLogo from '@/assets/AnonymousLogo.png';
import RatingBarDisplay from "../RatingBarDisplay";
import { format } from "date-fns";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  pauseOnHover = true,
  className
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards");
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse");
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
        containerRef.current.style.setProperty("--animation-duration", "20s");
    }
  };
  return (
    (<div
      ref={containerRef}
      className={cn(
        "scroller relative z-20  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}>
      <ul
        ref={scrollerRef}
        className={cn(
          " flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}>
        {items?.map((review, idx) => (
          <li
            className="w-[350px] max-w-full relative rounded-2xl shrink-0 px-8 py-6 md:w-[450px]"
            style={{
              background:
                "linear-gradient(180deg, var(--slate-800), var(--slate-900)",
            }}
            key={idx}>
            <Card className="bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-transparent w-full shadow-sm hover:shadow-lg transition-shadow transition-transform duration-300 flex flex-col hover:scale-105 hover:bg-zinc-100 dark:hover:bg-[#222222]">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={review.anonymous ? AnonymousLogo : review.avatarUrl} alt={review.anonymous ? "Anonymous" : review.userName} />
                  <AvatarFallback className="font-bold text-gray-200" style={{ backgroundColor: review.color }}>
                    {review.anonymous ? "?" : review.userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <CardTitle className="text-lg text-black dark:text-gray-200">{review.anonymous ? "Anonymous" : review.userName}</CardTitle>
                  <p className="text-sm text-zin-800 dark:text-gray-400">{format(new Date(review.dateTime), 'MMMM do, yyyy \'at\' h:mm a')}</p>
                </div>
              </CardHeader>
              
              {/* This ensures the content takes available space */}
              <CardContent className="flex flex-col flex-grow">
                <h3 className="font-semibold mb-1 text-black dark:text-gray-200">{review.courseName}</h3>
                <p className="text-sm text-zinc-800 dark:text-gray-400 mb-2">
                  Professor: {review.professor} | Year: {review.year}, Semester: {review.semester}
                </p>
                
                <div className="flex items-center mb-4 mt-2">
                  <RatingBarDisplay rating={review.rating} scale={0.5}/>
                </div>

                {/* Force this section to fill available space while maintaining at least 2 lines */}
                <p className="text-sm text-black dark:text-gray-200 flex-grow line-clamp-2 h-[2.5rem]">
                  {review.reviewText}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>)
  );
};
