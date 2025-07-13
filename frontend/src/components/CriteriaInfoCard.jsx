import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

let criteriaInformation = {
  courseContent: {
      title: "Course Content",
      description: "How interesting, useful, and up-to-date is the course?",
      negative: ["Boring", "Outdated syllabus", "Low real-world application"],
      positive: ["Interesting", "Up to date syllabus", "Industry-relevant material"]
  },

  teachingQuality: {
      title: "Teaching Quality",
      description: "How well does the instructor teach concepts?",
      negative: ["Poor orator", "Ignores doubts", "Boring lectures", "Superficial teaching"],
      positive: ["Great orator", "Resolves doubts", "Engaging lectures", "Deep understanding"]
  },

  managementAndTAs: {
      title: "TAs & Management",
      description: "How well-organized and reliable are the tutorials, TAs, and schedules?",
      negative: ["Disorganized course", "Unhelpful TAs", "Uninformative tutorials"],
      positive: ["On-time schedules", "Knowledgeable TAs", "Valuable tutorials"]
  },

  academicWorkload: {
      title: "Academic Workload",
      description: "How light and easy to handle is the course in terms of time and workload?",
      negative: ["Heavy deadlines","Surprise quizzes", "Highly demanding", "Mandatory attendance", "Time-consuming assignments"],
      positive: ["Chill deadlines", "Announced schedule", "Easy-to-grasp concepts", "Flexible attendance", "Easily doable assignments"]
  },

  gradingDifficulty: {
      title: "Grading Difficulty",
      description: "How easy is it to get a good grade in this course?",
      negative: ["Strict grading", "Absolute grading", "Hard to score A/A-", "Unfair grading slabs"],
      positive: ["Lenient grading", "Relative grading", "Easy to score A/A-", "Fair grading slabs"]
  },
}

// RatingBar component
const RatingBar = ({ rating = 0, scale = 1 }) => {
  const roundedRating = Math.round(rating * 2) / 2

  const isHalfFilled = (blockNumber) => blockNumber === Math.ceil(roundedRating) && roundedRating % 1 !== 0

  // Define gradient colors for each block
  const gradients = [
    "bg-gradient-to-r from-red-600 to-orange-500",
    "bg-gradient-to-r from-orange-500 to-yellow-400",
    "bg-gradient-to-r from-yellow-400 to-lime-300",
    "bg-gradient-to-r from-lime-300 to-green-400",
    "bg-gradient-to-r from-green-400 to-emerald-500",
  ]

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
                isActive && !isPartial ? gradients[idx] : "bg-gray-500/50"
              }`}
              style={{
                height: `${blockHeight}px`,
                width: `${blockWidth}px`,
                marginRight: isLast ? 0 : `${blockGap}px`,
              }}
            >
              {isPartial && (
                <div
                  className={`absolute top-0 left-0 h-full ${gradients[idx]}`}
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

const CriteriaInfoCard = ( {criteria} ) => {
  return (
    <Card className="w-full max-w-xl mx-auto bg-white dark:bg-zinc-900 border-black dark:border-gray-500 text-black dark:text-white">
      <CardHeader>
        <CardTitle className="text-center text-xl">{criteriaInformation[criteria].title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center textzinc-800 dark:text-slate-300 text-xl">
          {criteriaInformation[criteria].description}
        </p>

        <div className="flex justify-center">
          <RatingBar rating={5} scale={1.2} />
        </div>

        <div className="space-y-4">
          {criteriaInformation[criteria].negative.map((neg, index) => (
            <div key={index} className="flex justify-between gap-32">
              <p className="text-md text-red-500 text-center font-bold w-1/2 -ml-2">{neg}</p>
              <p className="text-md text-emerald-500 text-center font-bold w-1/2 -mr-2">{criteriaInformation[criteria].positive[index]}</p>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  )
}

export default CriteriaInfoCard;
