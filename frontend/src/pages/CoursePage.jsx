import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import RatingBarDisplay from '@/components/RatingBarDisplay'
import { criteriaMapping, criteriaDescriptions } from '@/utils/constants';
import ExpandableCard from '@/components/ExpandableCard'
import ProfessorPieChart from '@/components/ProfessorPieChart';
import { AnimatePresence, motion } from "framer-motion";
import { useCoursePageData } from '@/hooks/useCoursePageData';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { useRecoilValue } from 'recoil';
import { userStateAtom } from '@/store/atoms/userAtom';

const totalRatings = (distribution) =>{
    return Object.values(distribution).reduce((sum, count) => sum + count, 0)
}

const averageRating = (distribution) =>{
    const totalScore = Object.entries(distribution).reduce(
        (sum, [rating, count]) => sum + Number(rating) * count, 0
    )
    const total = totalRatings(distribution);
    const average = total > 0 ? totalScore / total : 0;
    return average;
}

const getRatingColor = ({average, reviewData}) => {
  if (!reviewData || reviewData.length === 0 || average == null) {
    return "text-zinc-500";
  }

  const rating = Math.round(average * 2) / 2;
  const textColors = [
    "text-red-500",
    "text-orange-500",
    "text-yellow-400",
    "text-lime-300",
    "text-green-400",
  ];
  const index = Math.ceil(rating.toFixed(1)) - 1;
  return textColors[Math.max(0, Math.min(index, textColors.length - 1))];
};

const RatingDistributionCard = ({ selectedCriteria, setSelectedCriteria, courseData }) => {

  const selectedDistribution = courseData?.distributions?.[selectedCriteria] || {};
  const total = totalRatings(selectedDistribution);
  const average = averageRating(selectedDistribution);

  if(!courseData?.reviewData){
    return (
      <Card className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-2 dark:border-gray-700 max-w-4xl w-full">
        <CardTitle className="text-black dark:text-gray-200 text-center text-3xl mb-10 pt-10">
          Ratings
        </CardTitle>
        <div className="flex flex-col justify-center">
          <div className="flex justify-center">
            No data to show
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-2 dark:border-gray-700 max-w-4xl w-full">
      <CardHeader className="pb-4 h-32 overflow-hidden">
        <div className="flex items-baseline justify-between">
            <div>
              <CardTitle className="text-2xl text-black dark:text-gray-200 font-bold">
                {criteriaMapping[selectedCriteria]}
              </CardTitle>
              <p className="text-md max-w-4xl text-black dark:text-gray-300 mt-2 leading-relaxed">
                {criteriaDescriptions[selectedCriteria]}
              </p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center justify-center md:space-x-8 mt-2">
          {/* Criteria Selection */}
          <div className="flex-shrink-0 w-full md:w-48 space-y-4 mb-6 md:mb-0">
            {Object.keys(courseData?.distributions).map((parameter) => (
              <motion.button
                key={parameter}
                onClick={() => setSelectedCriteria(parameter)}
                className={`w-full text-center px-4 py-2.5 rounded-lg transition-colors ${
                  parameter === selectedCriteria
                    ? "bg-[#A3CBD6] text-black font-medium"
                    : "bg-gray-200 dark:bg-zinc-700 text-black dark:text-gray-300 hover:bg-[#B8DBD9] hover:text-black"
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-sm">{criteriaMapping[parameter]}</div>
              </motion.button>
            ))}
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          {/* Distribution Bars */}
          <div className="w-[600px] space-y-4 flex flex-col justify-center min-h-[250px]">
            <div className="space-y-6">
              {Object.entries(selectedDistribution)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([rating, count]) => (
                  <div key={rating} className=" flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-right text-black dark:text-[#A3CBD6]">
                      {rating}
                    </div>
                    <div className="flex-1 max-w-[500px]">
                      <motion.div
                        className="h-5 rounded-full bg-zinc-300 dark:bg-[#424548] overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5 }}
                      >
                      <motion.div
                        className="h-full bg-cyan-600 dark:bg-[#A3CBD6]"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${total > 0 ? (count / total) * 100 : 0}%`,
                        }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                      </motion.div>
                    </div>
                    <div className="w-12 text-sm text-black dark:text-gray-300">
                      {total > 0 ? Math.round((count / total) * 100) : 0}%
                    </div>
                  </div>
                ))}

              </div>
            </div>
  
  
            {/* Average Score */}
            <div className="text-center flex flex-col justify-center min-h-[250px]">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={selectedCriteria}
                  >
                  <div className={`text-center text-7xl font-bold mb-2 ${getRatingColor(average, courseData?.reviewData)}`}>
                    {average.toFixed(1)}
                  </div>
                    {/* <StarRating rating={average} /> */}
                    <RatingBarDisplay rating={average} scale={0.8}/>
                    <p className="text-md text-black dark:text-gray-300 mt-2">
                      Average rating
                    </p>
                  </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
}

const RatingCard = ({courseData}) => {
    return(
        <Card className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-2 dark:border-gray-700 w-1/2">
            <CardHeader>
            <CardTitle className="text-black dark:text-gray-200 text-center text-3xl mb-10">Course Ratings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4"> {/* Adds vertical spacing between each row */}
                {courseData?.distributions ? 
                Object.entries(courseData.distributions).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-10">
                        <h3 className="text-lg text-start text-black dark:text-gray-300 font-semibold capitalize min-w-[200px]">
                            {criteriaMapping[key]}
                        </h3>
                        <div className="flex items-center">
                          <RatingBarDisplay rating={averageRating(value)} scale={1} />
                          <span className="ml-3 text-lg text-gray-500 dark:text-gray-300 font-bold">{averageRating(value).toFixed(1)}</span>
                        </div>
                    </div>
                )) : <div className="flex justify-center">No data to show</div>}
            </CardContent>
        </Card>
    )
}

const InfoCard = ({courseData}) => {
    return (
        <Card className="bg-white border border-gray-300 dark:bg-zinc-800 dark:border-2 dark:border-gray-700 p-4 rounded-2xl w-full">
        <CardContent className="flex flex-col items-center gap-4">
          {/* DSA box */}
          <div className="bg-cyan-700 dark:bg-zinc-700 text-white border-2 border-gray-200 dark:border-4 dark:border-zinc-600 text-6xl font-bold h-40 w-60 rounded-lg flex items-center justify-center mb-10">
            {courseData.courseDetails?.acronym}
          </div>
      
          {/* Course Details */}
          <div className="text-black dark:text-white text-2xl font-bold flex flex-col gap-2 w-full">
            {/* Each row is a flex */}
            <div className="flex">
              <p className="w-40 font-semibold">Course Code:</p>
              <p className="font-semibold text-cyan-700 dark:text-[#B8DBD9]">{courseData.courseDetails?.code}</p>
            </div>
            <div className="flex">
              <p className="w-40 font-semibold">Semester:</p>
              <p className="font-semibold text-cyan-700 dark:text-[#B8DBD9]">{courseData.courseDetails?.semester}</p>
            </div>
            <div className="flex">
              <p className="w-40 font-semibold">Reviews:</p>
              <p className="font-semibold text-cyan-700 dark:text-[#B8DBD9]">{courseData.courseDetails?.numReviews}</p>
            </div>
            <div className="flex">
              <p className="w-40 font-semibold">Ratings:</p>
              <p className="font-semibold text-cyan-700 dark:text-[#B8DBD9]">{courseData.courseDetails?.numRatings}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
    );
}

export default function CoursePage() {
  const [activeCard, setActiveCard] = useState(null)
  const [reported, setReported] = useState(null)
  const [activeProfessor, setActiveProfessor] = useState(null);
  const navigate = useNavigate();
  const userData = useRecoilValue(userStateAtom);

  const { acronym } = useParams();
  
  const { coursePageData, loading, error } = useCoursePageData(acronym);
  const [selectedCriteria, setSelectedCriteria] = useState([]);

  useEffect(() => {
    if (coursePageData?.distributions) {
      setSelectedCriteria(Object.keys(coursePageData.distributions)?.[0]);
    }
  }, [coursePageData]);

  useEffect(() => {
    if(error?.response?.status === 404){
      navigate("*");
    }
  },[error, navigate]);
  
  if(loading && !coursePageData && !userData){
    return <LoadingSkeleton />;
  }

  return (
    <div className='bg-white dark:bg-[#161616]'>

      <AnimatePresence>
        {(activeCard && typeof activeCard === "object") || reported !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-xl bg-black/30 h-full w-full z-[100]"
          />
        ) : null}
      </AnimatePresence>

      <div className="min-h-screen mx-auto p-4 space-y-8 bg-white dark:bg-[#161616] max-w-7xl">
        <h1 className='text-black dark:text-white text-5xl text-center font-bold mt-10 mb-10'>
          {coursePageData.courseDetails?.name}
        </h1>

        <div className="flex gap-4">
            <InfoCard courseData={coursePageData}/>
            {coursePageData.distributions?.length !== 0 ? <RatingDistributionCard selectedCriteria={selectedCriteria} setSelectedCriteria={setSelectedCriteria} courseData={coursePageData}/> 
            : 
            <Card className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-2 dark:border-gray-700 max-w-4xl w-full">
              <CardTitle className="text-black dark:text-gray-200 text-center text-3xl mb-10 pt-10">
                Ratings
              </CardTitle>
              <div className="flex flex-col justify-center">
                <div className="flex justify-center">
                  No data to show
                </div>
              </div>
            </Card>}
        </div>

        <div className="flex gap-4">
            <RatingCard courseData={coursePageData}/>
            {(coursePageData.professorReviews?.length !== 0) ?
            <ProfessorPieChart professorReviews={coursePageData.professorReviews} activeProfessor={activeProfessor} setActiveProfessor={setActiveProfessor}/>
            : 
            <Card className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-2 dark:border-gray-700 max-w-4xl w-full">
              <CardTitle className="text-black dark:text-gray-200 text-center text-3xl mb-10 pt-10">
                Professors
              </CardTitle>
              <div className="flex flex-col justify-center">
                <div className="flex justify-center">
                  No data to show
                </div>
              </div>
            </Card>
            }
        </div>

      <div className="border-t border-white my-12"></div> {/* White horizontal line */}
        <h2 className="text-black dark:text-white text-4xl font-semibold text-center mb-8">Top Reviews by Students</h2>

          <ExpandableCard reviewData={coursePageData.reviewData} active={activeCard} setActive={setActiveCard} reported={reported} setReported={setReported}/>

        {coursePageData.reviewData?.length > 0 && (
          <div className="flex space-x-4 justify-center mt-8">
            <Button onClick={() => { navigate('/writeReviews') }} className="w-40">
              Write a Review
            </Button>
            <Button onClick={() => { navigate('/reviews') }} className="w-40">
              Read all Reviews
            </Button>
          </div>
        )}

    </div>
    </div>
  )
}