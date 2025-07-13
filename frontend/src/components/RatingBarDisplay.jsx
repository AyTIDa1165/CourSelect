import React from "react"

const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-lime-300", "bg-green-400"]

const RatingBarDisplay = ({ rating = 0, scale = 1 }) => {
  const roundedRating = Math.round(rating * 2) / 2

  const isHalfFilled = (blockNumber) =>
    blockNumber === Math.ceil(roundedRating) && roundedRating % 1 !== 0

  const getColor = (ratingValue) => {
    const index = Math.ceil(ratingValue) - 1
    return colors[Math.max(0, Math.min(index, colors.length - 1))]
  }

  const activeColor = getColor(roundedRating)

  // Dimensions scaled based on the `scale` prop
  const blockHeight = 16 * scale
  const blockWidth = 40 * scale
  const blockGap = 8 * scale

  return (
    <div className="flex items-center">
      <div className="inline-flex">
        {[1, 2, 3, 4, 5].map((blockNumber, idx) => {
          const isActive = roundedRating >= blockNumber
          const isPartial = isHalfFilled(blockNumber)
          const isLast = idx === 4

          return (
            <div
              key={blockNumber}
              className={`relative transform skew-x-[-20deg] transition-colors duration-200 overflow-hidden ${
                isActive && !isPartial ? activeColor : "bg-gray-500/50"
              }`}
              style={{
                height: `${blockHeight}px`,
                width: `${blockWidth}px`,
                marginRight: isLast ? 0 : `${blockGap}px`,
              }}
            >
              {isPartial && (
                <div
                  className={`absolute top-0 left-0 h-full ${activeColor}`}
                  style={{ width: `${blockWidth / 2}px` }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RatingBarDisplay
