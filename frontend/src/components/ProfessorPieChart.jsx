import { useState } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector  } from "recharts"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "../context/ThemeContext";

const ToggleSwitch = ({ isRatings, setIsRatings }) => {
  return (
    <div
      onClick={() => setIsRatings(!isRatings)}
      className="flex items-center w-60 h-12 bg-gray-200 dark:bg-zinc-900 rounded-full p-4 cursor-pointer relative transition-colors duration-300"
    >
      <div
        className={`absolute top-1 bottom-1 left-1 w-1/2 rounded-full transition-all duration-300 ${
          isRatings ? "translate-x-full bg-[#A8A29E]" : "bg-[#94A3B8]"
        }`}
        style={{ width: "calc(50% - 0.25rem)" }}
      />
      <div className="flex justify-between w-full text-black dark:text-white font-semibold z-10 px-4 text-md">
        <div className={`transition-colors duration-300 ${!isRatings ? "text-black font-semibold" : "text-gray-700 dark:text-gray-500"}`}>
          Reviews
        </div>
        <div className={`transition-colors duration-300 ${isRatings ? "text-black font-semibold" : "text-gray-700 dark:text-gray-500"}`}>
          Ratings
        </div>
      </div>
    </div>
  );
}

const COLORS_rating = [
  "#A69F7A", // Soft Olive
  "#A79C60", // Golden Olive
  "#8A7F53", // Muted Mustard
  "#6F6534", // Dark Olive Brown
  "#BFAF81", // Dusty Gold
];

const COLORS_reviews = [
  "#64748B", // Slate Gray
  "#94A3B8", // Cool Gray
  "#71717A", // Zinc Gray
  "#9CA3AF", // Grayish Blue
  "#475569", // Blue Gray
];

export default function ProfessorPieChart({ professorReviews, activeProfessor, setActiveProfessor }) {
    const { theme } = useTheme();
    const strokeColor = theme === "dark" ? "#27272a" : "#ffffff";
    const disabledColor = theme === "dark" ? "#1f1f22" : "#D4D4D8";

    const handlePieClick = (data, index) => {
        setActiveProfessor(activeProfessor === index ? null : index)
    }
    
    const handleSelectChange = (value) => {
        if (value === "all") {
            setActiveProfessor(null)
        } else {
            const index = professorReviews.findIndex(prof => prof.name === value)
            setActiveProfessor(index)
        }
    }
  
  const [isRatings, setIsRatings] = useState(false);
  const totalReviews = Array.isArray(professorReviews) ?  
  professorReviews.reduce((sum, prof) => sum + prof.reviews, 0)
  : 0;
  const totalRatings = Array.isArray(professorReviews) ? professorReviews.reduce((sum, prof) => sum + prof.ratings, 0)
  : 0;

  const COLORS_rating = [
    "#A69F7A", "#A79C60", "#8A7F53", "#6F6534", "#BFAF81"
  ];
  const COLORS_reviews = [
    "#64748B", "#94A3B8", "#71717A", "#9CA3AF", "#475569"
  ];

  const currentColors = isRatings ? COLORS_rating : COLORS_reviews;
  const currentDataKey = isRatings ? "ratings" : "reviews";

  // (CustomTooltip remains same)
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const hoveredName = payload[0].name; // Get the name of the hovered slice
      // Disable tooltip if the hovered slice is not the active professor's slice
      if (activeProfessor !== null && professorReviews[activeProfessor].name !== hoveredName) {
        return null; // Don't show tooltip if not the active professor
      }
  
      return (
        <div className="bg-white dark:bg-zinc-900 p-2 rounded border border-gray-700 text-black dark:text-white text-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p>Reviews: {payload[0].payload.reviews}</p>
          <p>Ratings: {payload[0].payload.ratings}</p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <Card className="bg-white border border-gray-300 dark:bg-zinc-800 dark:border-2 dark:border-gray-700 w-full">
      <CardHeader>
        <CardTitle className="text-black dark:text-gray-200 text-center text-3xl">Professors</CardTitle>
      </CardHeader>

      <div className="flex flex-col md:flex-row gap-6 mr-20">

        {/* Left side: Pie Chart + Toggle */}
        <div className="w-full md:w-2/3 flex flex-col items-center">
          
          {/* Pie Chart */}
          <div className="w-full h-[250px] flex justify-center">
            <ResponsiveContainer width="80%" height="100%">
              <PieChart>
                <Pie
                  data={professorReviews}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  activeIndex={activeProfessor}
                  activeShape={(props) => (
                    <Sector {...props} outerRadius={120} />
                  )}
                  stroke={strokeColor}
                  fill="#8884d8"
                  dataKey={currentDataKey}
                  nameKey="name"
                  onClick={handlePieClick}
                  cursor="pointer"
                  style={{ outline: "none" }}
                >
                  {professorReviews?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={activeProfessor === null || activeProfessor === index
                        ? currentColors[index % currentColors.length]
                        : disabledColor}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Toggle Switch */}
          <div className="mb-10">
            <ToggleSwitch isRatings={isRatings} setIsRatings={setIsRatings} />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col mt-8">
          <h2 className="text-xl font-bold text-black dark:text-white mb-2 text-center md:text-left">
            {activeProfessor !== null ? professorReviews[activeProfessor].name : "All Professors"}
          </h2>
          <p className="text-lg text-black dark:text-gray-300 mb-3 text-center md:text-left">
            {activeProfessor !== null ? professorReviews[activeProfessor].reviews : totalReviews} Reviews
          </p>
          <p className="text-lg text-black dark:text-gray-300 mb-6 text-center md:text-left">
            {activeProfessor !== null ? professorReviews[activeProfessor].ratings : totalRatings} Ratings
          </p>

          <div className="w-full max-w-xs mx-auto md:mx-0">
            <Select 
              defaultValue="all"
              onValueChange={handleSelectChange}
              value={activeProfessor !== null ? professorReviews[activeProfessor].name : "all"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a professor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Professors</SelectItem>
                { Array.isArray(professorReviews) && 
                  professorReviews.map((prof, index) => (
                  <SelectItem key={index} value={prof.name}>
                    {prof.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
