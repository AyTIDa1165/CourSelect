import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card";
import Header from '../assets/HeaderNew.png';
import VerifiedLogo from '../assets/VerifiedLogo.png';
import RatingsLogo from '../assets/RatingsLogo.png';
import AnalyticsLogo from '../assets/AnalyticsLogo.png';
import SearchLogo from '../assets/SearchLogo.png';
import AnonymousLogo from '../assets/AnonymousLogo.png';
import BadgesLogo from '../assets/BadgesLogo.png';
import AnimatedButton from '@/components/AnimatedButton';
import { GraduationCap, LogIn } from "lucide-react";
import starIcon from '../assets/starIcon.ico';
import professorsIcon from '../assets/professorsIcon.ico';
import coursesIcon from '../assets/coursesIcon.ico';
import reviewsIcon from '../assets/reviewsIcon.ico';
import usersIcon from '../assets/usersIcon.ico';
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import "@/styles/scrollAnimation.css";
import RatingBarDisplay from "@/components/RatingBarDisplay";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from 'react-router-dom';
import { useLandingPageData } from "@/hooks/useLandingPageData";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useRecoilValue } from "recoil";
import { userStateAtom } from "@/store/atoms/userAtom";

const MovingReviewCards = ({ reviews }) => {
  return (
    <>
      {(reviews?.length === 0) ? <div className="flex justify-center min-h-auto mt-10 text-2xl text-black dark:text-white">No reviews yet!</div>
        :
        <div className="h-[20rem] rounded-md flex flex-col antialiased bg-white dark:bg-black bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={reviews}
            direction="right"
          />
        </div>
      }
    </>
  );
}

const FeatureGrid = ( {features} ) => {
  return(
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((item, index) => (
        <Card
          key={index}
          className="bg-white dark:bg-[#1a1a1a] p-6 border-gray-200 dark:border-transparent duration-300 ease-in-out shadow-sm hover:shadow-lg transition-transform hover:scale-105 hover:bg-zinc-100 dark:hover:bg-[#222222]"
        >
          <CardContent className="flex flex-col items-center text-center">
            {/* Logo */}
            <img src={item.img} alt={item.title} className="w-16 h-16 mb-4" />

            {/* Title */}
            <h2 className="text-black dark:text-white text-xl font-semibold">{item.title}</h2>

            {/* Description */}
            <p className="text-zinc-800 dark:text-gray-300 mt-2">{item.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const CriteriaRating = ( {ratingName, ratingValue} ) => {
  return (
    <div className="mt-1 flex items-center justify-between">
      <p className="text-black dark:text-white text-sm">{ratingName}</p>
      <RatingBarDisplay scale={0.5} rating={ratingValue}/>
    </div>
  );
}


const LandingPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const navigate = useNavigate();
  
  const [counts, setCounts] = useState({
    reviews: 0,
    ratings: 0,
    users: 0,
    courses: 0,
    professors: 0,
  });

  const { landingPageData, loading, error } = useLandingPageData();

  const targetCounts = landingPageData?.targetCounts;
  const courses = landingPageData?.courses;
  const reviews = landingPageData?.reviews;
  
  const sectionRef = useRef(null);
  const animationTriggered = useRef(false);
  const userState = useRecoilValue(userStateAtom);

  useEffect(() => {
    if(error?.response?.status === 404){
      navigate("*");
    }
  },[error, navigate]);

  useEffect(() => {

    if(!targetCounts) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animationTriggered.current) {
          animationTriggered.current = true;

          const duration = 2500;
          const interval = 50;
          const steps = duration / interval;

          const timer = setInterval(() => {
            setCounts((prevCounts) => {
              const newCounts = { ...prevCounts };
              let completed = true;
              for (const key in targetCounts) {
                if (prevCounts[key] < targetCounts[key]) {
                  const increment = Math.ceil(targetCounts[key] / steps);
                  newCounts[key] = Math.min(prevCounts[key] + increment, targetCounts[key]);
                  if (newCounts[key] < targetCounts[key]) completed = false;
                }
              }

              if (completed) clearInterval(timer);
              return newCounts;
            });
          }, interval);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [targetCounts]);

  const statItems = [
    {
      title: "Reviews",
      count: counts.reviews,
      target: parseInt(targetCounts?.reviews),
      image: reviewsIcon,
      bgColor: "bg-[#3A4F6A] dark:bg-[#1E2C43]",
      textColor: "#3B82F6"
    },
    {
      title: "Ratings",
      count: counts.ratings,
      target: parseInt(targetCounts?.ratings),
      image: starIcon,
      bgColor: "bg-[#999900] dark:bg-[#4d4d00]",
      textColor: "#dbdb00"
    },
    {
      title: "Users",
      count: counts.users,
      target: 112,
      image: usersIcon,
      bgColor: "bg-[#2E6E4D] dark:bg-[#193925]",
      textColor: "#22C55E"
    },
    {
      title: "Courses",
      count: counts.courses,
      target: parseInt(targetCounts?.courses),
      image: coursesIcon,
      bgColor: "bg-[#5B3B6B] dark:bg-[#342343]",
      textColor: "#A855F7"
    },
    {
      title: "Professors",
      count: counts.professors,
      target: parseInt(targetCounts?.professors),
      image: professorsIcon,
      bgColor: "bg-[#6B2D2D] dark:bg-[#422020]",
      textColor: "#EF4444"
    },
  ];
  
  if(loading){
    return <LoadingSkeleton/>;
  }

  return (
    <div className="relative">
      <section
        className="bg-white dark:bg-black w-full md:py-24 lg:py-32 xl:py-20 relative"
        style={{
          backgroundImage: `url(${Header})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative", // Ensure child overlay is positioned correctly
        }}
      >
        {/* Blurring Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              isDarkMode
                ? "linear-gradient(90deg, rgba(0,0,0,1) 25%, rgba(0,0,0,0.9) 45%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.4) 100%)"
                : "linear-gradient(90deg, rgba(255,255,255, 1) 25%, rgba(255,255,255,0.9) 45%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.4) 100%)",
          }}
        />

        <div className="container px-4 md:px-6 mx-auto flex justify-start items-center max-w-7xl">
          <div className="relative z-10 text-black dark:text-white space-y-4 mb-5">
            <h1 className="text-7xl font-semibold tracking-tighter sm:text-4xl md:text-5xl lg:text-7xl mb-7 text-left">
              <span className="text-cyan-500 dark:text-cyan-300 font-semibold">Select</span> the Right <br />
              <span className="text-cyan-500 dark:text-cyan-300 font-semibold">Courses</span> this Semester
            </h1>
            <p className="max-w-xl text-zinc-800 dark:text-gray-300 md:text-xl text-left">
              Make informed decisions about your academic journey with real reviews from your peers and seniors. Explore and share course insights, comprehensive ratings, and authentic student experiences.
            </p>

            <div className="flex space-x-4">
              <AnimatedButton text={"Explore"} textColor={"text-black"} bgColor={"bg-cyan-400 dark:bg-cyan-300"} borderSize= {"border-0"} Icon={GraduationCap} onClick={() => {userState.isAuthenticated ? navigate('/reviews') : navigate('/about')}}/>
              <AnimatedButton text={"Get Started"} textColor={"text-cyan-600 dark:text-cyan-300"} bgColor={"bg-transparent"} borderSize= {"border-2"} Icon={LogIn} onClick={() => {userState.isAuthenticated ? navigate('/writeReviews') : navigate('/register')}}/>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-black w-full md:py-24 lg:py-32 xl:py-10">
        <div className="block container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex justify-center mb-10">
            <h1 className="text-black dark:text-white text-6xl font-semibold tracking-tighter sm:text-3xl md:text-4xl lg:text-6xl text-center">
              What Our Platform Offers
            </h1>
          </div>
          <FeatureGrid features= {features}/>
        </div>
      </section>

      <section className="bg-white dark:bg-black w-full md:py-24 lg:py-32 xl:py-20">
        <div className="block container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex justify-center mb-10">
            <h1 className="text-black dark:text-white text-6xl font-semibold tracking-tighter sm:text-3xl md:text-4xl lg:text-6xl text-center">
              Popular Courses
            </h1>
          </div>

          <div className="flex justify-center mb-12">
            <p className="text-zinc-800 dark:text-gray-400 text-center text-xl max-w-3xl">
              Most reviewed and highly rated courses at IIITD
            </p>
          </div>

          {(courses?.length !== 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses?.map((course, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm p-6 flex flex-col border border-gray-300 dark:border-transparent
                  transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105 hover:bg-zinc-100 dark:hover:bg-[#222222]"
                >
                  {/* Container for acronym and stats */}
                  <div className="flex items-center justify-between w-full">
                    {/* Course Acronym */}
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl" 
                        style={{ backgroundColor: course.color }}>
                      {course.acronym}
                    </div>

                    {/* Ratings and Reviews */}
                    <div className="text-right">
                      <p className="text-zinc-800 dark:text-gray-300">{course.ratings} ratings</p>
                      <p className="text-zinc-800 dark:text-gray-300 text-sm">{course.reviews} reviews</p>
                    </div>
                  </div>

                  {/* Course Title and Code */}
                  <div className="mt-4">
                    <h3 className="text-black dark:text-white text-xl font-semibold">{course.name}</h3>
                    <p className="text-zinc-800 dark:text-gray-400 text-sm">{course.code}</p>
                  </div>

                  {/* Course Details */}
                  <p className="text-black dark:text-white text-sm mb-5">{(course.numProfessors) > 1 ? `Taken by ${course.numProfessors} professors` : `Taken by ${course.numProfessors} professor`}</p>
                  <CriteriaRating ratingName={"Teaching Quality"} ratingValue={course.teachingQuality} />
                  <CriteriaRating ratingName={"Course Content"} ratingValue={course.courseContent} />
                  <CriteriaRating ratingName={"Academic Workload"} ratingValue={course.academicWorkload} />
                  <CriteriaRating ratingName={"Grading Difficulty"} ratingValue={course.gradingDifficulty} />
                  <CriteriaRating ratingName={"TAs & Management"} ratingValue={course.managementAndTAs} />
                </div>
              ))}
            </div>
            ) : (
              <div className="flex items-center justify-center min-h-auto w-full text-2xl text-black dark:text-white">
                No top courses yet!
              </div>
          )}
        </div>
      </section>
      <section className="bg-white dark:bg-black w-full md:py-24 lg:py-32 xl:py-20">
        <div className="block container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex justify-center mb-10">
            <h1 className="text-black dark:text-white text-6xl font-semibold tracking-tighter sm:text-3xl md:text-4xl lg:text-6xl text-center">
              Top Reviews by Students
            </h1>
          </div>
          <MovingReviewCards reviews={reviews}/>
        </div>
      </section>

      <section className="bg-white dark:bg-black w-full md:py-24 lg:py-32 xl:py-20">
        <div className="block container mx-auto px-4">
          <div className="flex justify-center mb-10">
            <h1 className="text-black dark:text-white text-6xl font-semibold tracking-tighter sm:text-3xl md:text-4xl lg:text-6xl text-center mb-10">
              How It Works
            </h1>
          </div>

          <div className="relative">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start relative z-10 gap-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center w-full md:w-1/4">
                  {/* Circle with number */}
                  <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                    <span className="text-white text-xl font-bold">{step.number}</span>
                  </div>

                  {/* Title and description */}
                  <h3 className="text-white text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-zinc-800 dark:text-gray-400 text-center max-w-[20rem]">{step.description}</p>
                </div>
              ))}
            </div>

            {/* Connecting lines - hidden on mobile */}
            <div
              className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gray-400 dark:bg-gray-700 z-0"
              style={{ width: "80%", margin: "0 auto" }}
            ></div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-black w-full md:py-24 lg:py-32 xl:py-20">
        <div className="block max-w-screen-xl mx-auto px-0">
          <div className="flex justify-center mb-8">
            <h1 className="text-black dark:text-white text-6xl font-semibold tracking-tighter sm:text-3xl md:text-4xl lg:text-6xl text-center">
              Our Impact at IIITD
            </h1>
          </div>

          <div className="flex justify-center mb-12">
            <p className="text-zinc-800 dark:text-gray-300 text-center text-xl max-w-3xl mb-5">
              Growing stronger with every review
            </p>
          </div>

          <div className="grid grid-cols-2 gap-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" ref={sectionRef}>
            {statItems.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative mb-3">
                  <div
                    className={`w-[7rem] h-[7rem] rounded-full flex flex-col items-center justify-center ${item.bgColor}`}>
                    <div className="absolute -top-2">
                      <img src={item.image} alt="Icon" className="h-7" />
                    </div>
                    <span className="text-xl font-bold" style={{ color: item.textColor }}>
                      {item.count.toLocaleString()}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg text-black dark:text-white font-medium">{item.title}</h3>
              </div> 
            ))}
          </div>
        </div>
      </section>
      <hr className="border-t border-gray-700 w-full" />
    </div>
  )
}

export default LandingPage

const features = [
  {
    title: "Verified Reviews",
    desc: "Only IIITD students can share their experiences, ensuring authentic and trustworthy course reviews.",
    img: VerifiedLogo
  },
  {
    title: "Multi-Criteria Ratings",
    desc: "Explore our comprehensive rating system for courses based on teaching quality, academic workload, and much more!",
    img: RatingsLogo
  },
  {
    title: "Course Analytics",
    desc: "Track rating trends, review distribution, and professor-based insights to make informed decisions.",
    img: AnalyticsLogo
  },
  {
    title: "Advanced Semantic Search (TBA)",
    desc: "Find answers beyond keywords! Our AI-powered search understands your intent for smarter results.",
    img: SearchLogo
  },
  {
    title: "Go Anonymous",
    desc: "Share honest experiences freely! Choose to stay anonymous for controversial or unpopular opinions.",
    img: AnonymousLogo
  },
  {
    title: "Cool Badges",
    desc: "Earn badges for contributing to the community! Share reviews, help peers, and engage with the community!",
    img: BadgesLogo
  }
]

const steps = [
  {
    number: 1,
    title: "Create Account",
    description: "Create your own account with your IIITD Email ID",
    color: "bg-blue-500",
  },
  {
    number: 2,
    title: "Verification",
    description: "Verify your account by entering the sign-in code sent to your email",
    color: "bg-green-500",
  },
  {
    number: 3,
    title: "Read & Analyze",
    description: "Read reviews written by others and view course analytics",
    color: "bg-purple-500",
  },
  {
    number: 4,
    title: "Engage",
    description: "Write your own reviews on your most loved and most hated courses",
    color: "bg-amber-500",
  },
]