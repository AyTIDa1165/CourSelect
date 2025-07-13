import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import "@/styles/scrollBar.css";
import RatingBarDisplay from "./RatingBarDisplay";
import MascotThinkLight from "@/assets/mascot/MascotThinkLight.png"
import MascotThinkDark from "@/assets/mascot/MascotThinkDark.png"
import CourseStatusTag from "./CourseStatusTag";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { userStateAtom } from '@/store/atoms/userAtom';
import { format } from "date-fns";
import { CONFIG } from "@/Config";

const NoReviewComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-[75vh] w-full text-center text-black dark:text-gray-500">
      <h2 className="text-5xl text-black dark:text-gray-500 font-semibold mb-2">No reviews yet</h2>
      <img 
        src={MascotThinkLight}
        alt="Mascot Think Light"
        className="h-auto w-40 block dark:hidden"
      />
      <img 
        src={MascotThinkDark}
        alt="Mascot Think Dark"
        className="h-auto w-40 hidden dark:block"
      />
      <p className="text-lg text-gray-800 dark:text-gray-300 mb-5">Be the first to leave a review and help others!</p>
      <Button onClick={() => {navigate('/writeReviews')}} className="w-40">Write a Review</Button>
    </div>
  )
}

const ExpandableCard = ({reviewData, active, setActive, reported, setReported }) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const reportRef = useRef(null);
  const backendUrl = CONFIG.backendUrl;

  const [reviews, setReviews] = useState(reviewData || []);
  const [isVoting, setIsVoting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const userState = useRecoilValue(userStateAtom);
  
  useEffect(() => {
    setReviews(reviewData || []);
  }, [reviewData]);
  
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        if (active && typeof active === "object") setActive(null);
        if (reported) setReported(null);
      }
    }
  
    if ((active && typeof active === "object") || reported) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, reported]);
  

  useOutsideClick(ref, () => setActive(null));
  useOutsideClick(reportRef, () => {
    if (reported) setReported(null);
  });

  const handleVote = async (e, reviewId, voteType) => {
    e.stopPropagation();
    
    if (!userState || !userState.isAuthenticated) {
      toast.error("Please login to vote.");
      return;
    }
    
    if (isVoting) return; // Prevent multiple concurrent votes
    
    setIsVoting(true);
    
    try {
      const reviewToUpdate = reviews.find(review => review.id === reviewId);
      
      // Checking if the user has already voted on this review
      if (reviewToUpdate.userVote !== null) {
        toast.error("Review already voted.");
        setIsVoting(false);
        return;
      }
      
      // Proceeding with voting if userVote is null
      const response = await axios.post(`${backendUrl}/api/v1/review/addVote`, {
        reviewId,
        voteType
      });
      
      if (response.data.success) {
        // Updating local state
        let updatedReviews = reviews.map(review => {
          if (review.id === reviewId) {
            // Calculating new vote counts
            let upvotes = review.upvotes;
            let downvotes = review.downvotes;
            
            if (voteType === "UPVOTE") upvotes++;
            else if (voteType === "DOWNVOTE") downvotes++;
            
            return {
              ...review,
              upvotes,
              downvotes,
              userVote: voteType
            };
          }
          return review;
        });
        
        setReviews(updatedReviews);
        
        if (active && active.id === reviewId) {
          const updatedActive = updatedReviews.find(r => r.id === reviewId);
          setActive(updatedActive);
        }
        
        toast.success(`Review ${voteType === "UPVOTE" ? "upvoted" : "downvoted"} successfully`);
      } else {
        toast.error(response.data.message || "Failed to vote");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("You've already voted on this review.");
      } else {
        toast.error("Error adding vote: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setIsVoting(false);
    }
  };

  const handleReport = (e, id) => {
    e.stopPropagation();
    setReported(id);
  }

  const handleReportConfirmed = async (reviewId) => {
    
    if (!userState || !userState.isAuthenticated) {
      toast.error("Please login to report.");
      return;
    }
    
    if (isReporting) return; // Prevent multiple concurrent reports
    
    setIsReporting(true);

    try {
      const reviewToUpdate = reviews.find(review => review.id === reviewId);
      
      // Checking if the user has already reported this review
      if (reviewToUpdate.userReported !== false) {
        toast.error("Review already reported.");
        setIsReporting(false);
        return;
      }

      const { data } = await axios.post(`${backendUrl}/api/v1/review/report-review/${reviewId}`);
      
      if (data.success) {
        let updatedReviews = reviews.map(review => {
          if (review.id === reviewId) {
            return {
              ...review,
              userReported: true
            };
          }
          return review;
        });
        setReviews(updatedReviews);
        toast.success("Review reported successfully.");
      }

    } catch(error){
      if (error.response && error.response.status === 409) {
        toast.error("You've already reported this review.");
      } else {
        toast.error("Error reporting review: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setIsReporting(false);
    }
    setReported(null);
  };

  return (
  <>
    <AnimatePresence>
      {reported !== null && (
        <motion.div
        ref={reportRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed z-[100] top-1/3 left-1/3 -translate-x-1/3 -translate-y-1/3 grid place-items-center bg-white dark:bg-zinc-800 border-2 border-gray-300 dark:border-gray-700 rounded-2xl p-6 w-[90%] max-w-md"
      >
        <p className="text-md text-black dark:text-gray-200 mb-6 text-center">
          Are you sure you want to report this review?
        </p>
        <div className="flex gap-8">
          <Button
            variant="outline"
            onClick={() => setReported(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleReportConfirmed(reported)}
          >
            Report
          </Button>
        </div>
      </motion.div>      
      )}
    </AnimatePresence>

    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 grid place-items-center z-[100]">
          <motion.button
            key={`button-${active.id}`}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            className="absolute top-2 right-2 flex items-center justify-center bg-zinc-400 rounded-full h-6 w-6 lg:hidden"
            onClick={() => setActive(null)}
          >
          </motion.button>

          <motion.div
            layoutId={`card-${active.id}`}
            ref={ref}
            className="w-full max-w-4xl h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-zinc-800 sm:rounded-3xl overflow-hidden"
          >
            <Card className="w-full bg-white dark:bg-zinc-800 dark:border-0">
              <CardHeader className="flex flex-row items-center gap-4 -mb-6">
                <motion.div layoutId={`avatar-${active.id}`}>
                  <Avatar>
                    <AvatarImage
                      src={active.avatarUrl}
                    />
                    <AvatarFallback
                      className="font-bold text-gray-200 bg-blue-500 text-2xl"
                    >
                      {active.anonymous ? "?" : active.user?.username?.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <motion.div className="flex-grow text-black dark:text-gray-200" layoutId={`username-${active.id}`}>
                  <CardTitle className="text-lg">
                  {active.anonymous ? (
                    "Anonymous"
                  ) : (
                      <span
                        className="font-semibold cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-200 hover:underline"
                        onClick={() => navigate(`/user/${active.user?.username?.toLowerCase()}`)}
                      >
                        {active.user?.username?.charAt(0).toUpperCase() + active.user?.username?.slice(1).toLowerCase()}
                      </span>
                  )}
                  </CardTitle>
                  <motion.p className="text-sm text-gray-800 dark:text-gray-400" layoutId={`datetime-${active.id}`}>
                    Posted on { format(new Date(active.createdAt), 'MMMM do, yyyy \'at\' h:mm a') }
                  </motion.p>
                </motion.div>
              </CardHeader>

              <CardContent className="px-6 py-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent">
                <motion.div className="flex justify-between items-start gap-6" layoutId={`rating-${active.id}`}>
                  <div className="flex flex-col flex-grow gap-2">
                    <div className="flex flex-row items-center gap-4 text-black dark:text-gray-200"></div>
                    <div className="flex flex-row gap-4 items-start">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-[100px] h-[60px] bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                          {active.course?.acronym}
                        </div>
                        <CourseStatusTag courseStatus={active.courseStatus} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <motion.h3
                          className="text-black dark:text-gray-200 text-xl mb-2 -mt-1 leading-snug"
                          layoutId={`courseName-${active.id}`}
                        >
                          <span
                            className="font-semibold cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-200 hover:underline"
                            onClick={(e) => {
                              navigate(`/course/${active.course?.acronym.toLowerCase()}`);
                            }}
                          >
                            {active.course?.courseName}
                          </span>
                        </motion.h3>
                        <motion.p
                          className="text-md text-gray-800 dark:text-gray-200 font-semibold leading-snug"
                          layoutId={`description-${active.id}`}
                        >
                          Professor: {active.prof?.name}
                        </motion.p>
                        <motion.p className="text-md text-gray-800 dark:text-gray-200 font-semibold leading-snug">
                          Year: {active.timeOfCourse}
                        </motion.p>
                        <motion.p className="text-md text-gray-800 dark:text-gray-200 font-semibold leading-snug">
                          Semester: {active.sem}
                        </motion.p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    {[
                      { label: "Course Content", value: active.courseContent },
                      { label: "Teaching Quality", value: active.teachingQuality },
                      { label: "Workload Manageability", value: active.academicWorkload },
                      { label: "Grading Leniency", value: active.gradingDifficulty },
                      { label: "TAs & Management", value: active.managementAndTAs },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center gap-1">
                        <h3 className="text-[13px] text-start text-black dark:text-gray-200 font-semibold capitalize min-w-[150px]">
                          {label}
                        </h3>
                        <div className="flex items-center">
                          <RatingBarDisplay rating={value} scale={0.6} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <hr className="mt-5" />

                <motion.p className="text-sm text-black dark:text-gray-200 mt-5">{active.content}</motion.p>

                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center gap-2">
                    <motion.div layoutId={`upvote-${active.id}`}>
                      <Button
                        variant={active.userVote === "UPVOTE" ? "default" : "outline"}
                        size="sm"
                        onClick={(e) => handleVote(e, active.id, "UPVOTE")}
                        aria-label={"Upvote"}
                        aria-pressed={active.userVote === "UPVOTE"}
                        disabled={isVoting}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {active.upvotes}
                      </Button>
                    </motion.div>
                    <motion.div layoutId={`downvote-${active.id}`}>
                      <Button
                        variant={active.userVote === "DOWNVOTE" ? "default" : "outline"}
                        size="sm"
                        onClick={(e) => handleVote(e, active.id, "DOWNVOTE")}
                        aria-label={"Downvote"}
                        aria-pressed={active.userVote === "DOWNVOTE"}
                        disabled={isVoting}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        {active.downvotes}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>

            </Card>

          </motion.div>
        </div>
      )}
    </AnimatePresence>

    <ul className="w-full flex flex-col items-center gap-4">
      {(!reviews || reviews.length === 0) ? (
        <div className="items-center">
          <NoReviewComponent />
        </div>
      ) : reviews.map((card, index) => (
        <motion.div
        layoutId={`card-${card.id}`}
        key={`card-${card.id}`}
        onClick={() => setActive(card)}
        className="bg-white w-full max-w-4xl mb-5 flex flex-col items-center rounded-xl cursor-pointer"
        >
          <Card className="w-full max-w-4xl cursor-pointer bg-gray-100/30 dark:bg-zinc-800 border-gray-300 dark:border-0 hover:bg-[#A3CBD6]/10 dark:hover:bg-[#222222] hover:shadow-lg transition-shadow">
            <CardHeader className="px-6 pt-4 pb-0">
              <div className="flex flex-row items-center gap-4 text-black dark:text-gray-200">
                <motion.div layoutId={`avatar-${card.id}`}>
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={card.avatarUrl}
                      className="w-12 h-12"
                    />
                    <AvatarFallback
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-gray-200 bg-blue-500 text-2xl"
                    >
                      {card.anonymous ? "?" : card.user?.username?.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <motion.div className="flex-grow" layoutId={`username-${card.id}`}>
                  <CardTitle className="text-lg">
                    {card.anonymous ? (
                      "Anonymous"
                    ) : (
                      <span
                        className="font-semibold cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-200 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/user/${card.user?.username.toLowerCase()}`);
                        }}
                      >
                        {card.user?.username}
                      </span>
                    )}
                  </CardTitle>

                  <motion.p className="text-sm text-gray-800 dark:text-gray-400" layoutId={`datetime-${card.id}`}>
                    Posted on { format(new Date(card.createdAt), 'MMMM do, yyyy \'at\' h:mm a') }
                  </motion.p>
                </motion.div>
              </div>
            </CardHeader>

            <CardContent className="px-6 py-4">
              <motion.div className="flex justify-between items-start gap-6" layoutId={`rating-${card.id}`}>
                <div className="flex flex-col flex-grow gap-2">
                  <div className="flex flex-row items-center gap-4 text-black dark:text-gray-200"></div>
                    <div className="flex flex-row gap-4 items-start">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-[100px] h-[60px] bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                          {card.course?.acronym}
                        </div>
                        <CourseStatusTag courseStatus={card.courseStatus} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <motion.h3
                          className="text-black dark:text-gray-200 text-xl mb-2 -mt-1 leading-snug"
                          layoutId={`courseName-${card.id}`}
                        >
                          <span
                            className="font-semibold cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-200 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/course/${card.course?.acronym.toLowerCase()}`);
                            }}
                          >
                            {card.course?.courseName}
                          </span>
                        </motion.h3>

                        <motion.p
                          className="text-md text-gray-800 dark:text-gray-200 font-semibold leading-snug"
                          layoutId={`description-${card.id}`}
                        >
                          Professor : {card.prof?.name}
                        </motion.p>
                        <motion.p
                          className="text-md text-gray-800 dark:text-gray-200 font-semibold leading-snug"
                        >
                          Year : {card.timeOfCourse}
                        </motion.p>

                        <motion.p
                          className="text-md text-gray-800 dark:text-gray-200 font-semibold leading-snug"
                        >
                          Semester : {card.sem}
                        </motion.p>
                      </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  {[
                    { label: "Course Content", value: card.courseContent },
                    { label: "Teaching Quality", value: card.teachingQuality },
                    { label: "Workload Manageability", value: card.academicWorkload },
                    { label: "Grading Leniency", value: card.gradingDifficulty },
                    { label: "TAs & Management", value: card.managementAndTAs },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-1">
                      <h3 className="text-[13px] text-start text-black dark:text-gray-200 font-semibold capitalize min-w-[150px]">
                        {label}
                      </h3>
                      <div className="flex items-center">
                        <RatingBarDisplay rating={value} scale={0.6} />
                        {/* <span className="ml-3 text-sm text-black dark:text-gray-200 font-bold">{value}</span> */}
                      </div>
                    </div>
                  ))}
                </div>


              </motion.div>
              <hr className="mt-5"/>
              {/* Content and Votes */}
              <motion.p className="text-sm line-clamp-2 text-black dark:text-gray-200 mt-5">{card.content}</motion.p>

              <div className="flex items-center justify-between mt-5">
                {/* Left: Upvote / Downvote buttons */}
                <div className="flex items-center gap-2">
                  <motion.div layoutId={`upvote-${card.id}`}>
                    <Button
                      variant={card.userVote === "UPVOTE" ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => handleVote(e, card.id, "UPVOTE")}
                      disabled={isVoting}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {card.upvotes}
                    </Button>
                  </motion.div>
                  <motion.div layoutId={`downvote-${card.id}`}>
                    <Button
                      variant={card.userVote === "DOWNVOTE" ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => handleVote(e, card.id, "DOWNVOTE")}
                      disabled={isVoting}
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      {card.downvotes}
                    </Button>
                  </motion.div>
                </div>

                {/* Right: Report link */}
                <button
                  onClick={(e) => handleReport(e, card.id)}
                  className="text-[13px] mt-4 text-red-600 dark:text-red-400 hover:underline hover:text-red-500 dark:hover:text-red-300 hover:font-semibold transition-colors"
                  disabled={isReporting}
                >
                  Report
                </button>
              </div>

            </CardContent>
          </Card>

        </motion.div>
      ))}
    </ul>
  </>
  );
}

export default ExpandableCard;