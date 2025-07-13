import React, { useState } from "react"

const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-lime-300", "bg-green-400"]

const RatingBarSelector = ({ criteria, rating, handleChange }) => {
  const [hoveredRating, setHoveredRating] = useState(0)

  const displayRating = hoveredRating || rating
  const activeColor = colors[displayRating - 1] || "bg-gray-400"

  const handleMouseEnter = (blockNumber) => setHoveredRating(blockNumber)
  const handleMouseLeave = () => setHoveredRating(0)

  const handleClick = (blockNumber) => {
    handleChange(blockNumber, criteria)
  }

  return (
    <div className="flex items-center">
      <div className="inline-flex">
        {[1, 2, 3, 4, 5].map((blockNumber, idx) => {
          const isActive = displayRating >= blockNumber
          const isLast = idx === 4
          const isHovered = hoveredRating >= blockNumber
  
          return (
            <div
              key={blockNumber}
              className="h-[16px] w-[40px] mr-[8px] relative"
              style={{ marginRight: isLast ? 0 : "8px" }}
              onMouseEnter={() => handleMouseEnter(blockNumber)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(blockNumber)}
            >
              <div
                className={`h-full w-full transform skew-x-[-20deg] cursor-pointer 
                  transition-transform transition-colors duration-200 origin-bottom 
                  ${isActive ? activeColor : "bg-gray-400"} 
                  ${isHovered ? "scale-110" : "scale-100"}`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
   
}

export default RatingBarSelector
