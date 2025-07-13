import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
// import SearchBar from '@/components/SearchBar'
import ExpandableCard from '@/components/ExpandableCard'
import { useSearchParams } from "react-router-dom";

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { semesters, years } from '@/utils/constants';
import { useProfessors } from '@/hooks/useProfessors';
import { useCourses } from '@/hooks/useCourses';
import { useFetchReviews } from '@/hooks/useFetchReviews';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

export default function ReviewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const [criteriaFilter, setCriteriaFilter] = useState(searchParams.get('criteriaFilter') || 'All');
  const [ratingFilter, setRatingFilter] = useState(searchParams.get('ratingFilter') || 'All');
  const [professorFilter, setProfessorFilter] = useState(searchParams.get('professorFilter') || 'All');
  const [courseFilter, setCourseFilter] = useState(searchParams.get('courseFilter') || 'All');
  const [semFilter, setSemFilter] = useState(searchParams.get('semFilter') || 'All');
  const [yearFilter, setYearFilter] = useState(searchParams.get('semFilter') || 'All');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort') || 'latest');
  const [active, setActive] = useState(null);
  const [reported, setReported] = useState(null);
  
  const professors = useProfessors();
  const courses = useCourses();
  let { reviewData, loading, pagination } = useFetchReviews();

  const syncSearchParams = (params, setSearchParams) => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== "All" && value !== "-" && value !== "latest"
      )
    );
    setSearchParams(filteredParams);
  };

  useEffect(() => {
    syncSearchParams({
      sort : sortOrder
    }, setSearchParams);
  }, [sortOrder])

  const applyFilter = () => {
    syncSearchParams({
      page: 1,
      sort: sortOrder,
      criteriaFilter,
      ratingFilter,
      professorFilter,
      courseFilter,
      yearFilter,
      semFilter
    }, setSearchParams);
  };

  const clearFilters = () => {
    setSortOrder("latest");
    setCriteriaFilter("All");
    setRatingFilter("All");
    setProfessorFilter("All");
    setCourseFilter("All");
    setYearFilter("All");
    setSemFilter("All");
  
    syncSearchParams({ page: 1 }, setSearchParams);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const handleFilterChange = (filterSetter, value) => {
    filterSetter(value);
  };

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-[#161616] py-12 px-4 sm:px-6 lg:px-8"> 

      {/* Page Div */}
        <AnimatePresence>
          {(active && typeof active === "object") || reported !== null ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 backdrop-blur-xl bg-black/30 h-full w-full z-[100]"
            />
          ) : null}
        </AnimatePresence>

        <div className="flex justify-center">
        {/* Heading Div */}

        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        {/* Grid Div */}

          {/* Left Side Div */}
          <div className="col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-lg shadow border dark:border-2 border-gray-300 dark:border-zinc-800">
            {/* Filter Div */}

              <h2 className="text-xl text-black dark:text-gray-200 font-bold mb-4 flex justify-center">FILTER</h2>
              <div className="space-y-6">

              <div>
                  <Label htmlFor="course" className="text-black dark:text-gray-200">Course</Label>
                  <Select onValueChange={(value) => handleFilterChange(setCourseFilter, value)} value={courseFilter}>
                    <SelectTrigger className="w-full ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" id="course">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {courses.map((dept) => (
                        <SelectGroup key={dept.department}>
                          <SelectLabel>{dept.department}</SelectLabel>
                          {dept.courses.map((course) => (
                            <SelectItem key={course.id} value={course.id.toString()}>
                              {course.courseName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="professor" className="text-black dark:text-gray-200">Professor</Label>
                  <Select className="bg-zinc-700" onValueChange={(value) => handleFilterChange(setProfessorFilter, value)} value={professorFilter}>
                    <SelectTrigger className="w-full ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" id="professor">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {professors.map((professor) => (
                        <SelectItem key={professor.id} value={professor.id.toString()}>
                          {professor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
    
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <Label htmlFor="ratingCriteria" className="text-black dark:text-gray-200">Parameter</Label>
                    <Select onValueChange={(value) => handleFilterChange(setCriteriaFilter, value)} value={criteriaFilter}>
                      <SelectTrigger className="w-full ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" id="criteria">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="courseContent">Course Content</SelectItem>
                        <SelectItem value="teachingQuality">Teaching Quality</SelectItem>
                        <SelectItem value="managementAndTAs">TAs & Management</SelectItem>
                        <SelectItem value="academicWorkload">Workload Manageability</SelectItem>
                        <SelectItem value="gradingDifficulty">Grading Leniency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-1/2">
                    <Label htmlFor="rating" className="text-black dark:text-gray-200">Rating</Label>
                    <Select onValueChange={(value) => handleFilterChange(setRatingFilter, value)} value={ratingFilter}>
                      <SelectTrigger className="w-full ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" id="rating">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
      
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <Label htmlFor="year" className="text-black dark:text-gray-200">Year</Label>
                    <Select onValueChange={(value) => handleFilterChange(setYearFilter, value)} value={yearFilter}>
                      <SelectTrigger className="w-full ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" id="year">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-1/2">
                    <Label htmlFor="semester" className="text-black dark:text-gray-200">Semester</Label>
                    <Select onValueChange={(value) => handleFilterChange(setSemFilter, value)} defaultValue="All">
                      <SelectTrigger className="w-full ring-0 focus-visible:ring-offset-0 focus-visible:ring-0" id="semester">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {semesters.map((semester) => (
                          <SelectItem key={semester} value={semester}>
                            Semester {semester}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-center gap-8">
                  <Button onClick={() => applyFilter()} className="w-32 mt-2">Apply</Button>
                  <Button onClick={() => clearFilters()} className="w-32 mt-2">Clear</Button>
                </div>
              </div>
            </div>

            {/* Sorting Div */}
            <div className="bg-white dark:bg-[#1C1C1C] p-6 rounded-lg shadow border border-gray-300 dark:border-2 dark:border-zinc-800">

              <h2 className="text-xl font-bold text-black dark:text-gray-200 mb-6 flex justify-center">SORT</h2>
              <div className="flex gap-4 mb-4 justify-center">
                <Button 
                  variant={sortOrder === 'latest' ? 'default' : 'outline'}
                  onClick={() => handleSortChange('latest')}
                >
                  Latest
                </Button>
                <Button 
                  variant={sortOrder === 'oldest' ? 'default' : 'outline'}
                  onClick={() => handleSortChange('oldest')}
                >
                  Oldest
                </Button>
                <Button 
                  variant={sortOrder === 'likes' ? 'default' : 'outline'}
                  onClick={() => handleSortChange('likes')}
                >
                  Most Liked
                </Button>
              </div>

              <div className="flex gap-2 justify-center">
                <Button 
                  variant={sortOrder === 'shortest' ? 'default' : 'outline'}
                  onClick={() => handleSortChange('shortest')}
                >
                  Shortest Reviews
                </Button>
                <Button 
                  variant={sortOrder === 'longest' ? 'default' : 'outline'}
                  onClick={() => handleSortChange('longest')}
                >
                  Longest Reviews
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side Div */}
          <div className="col-span-8 space-y-6">  
            {/* <div className={`flex items-center justify-start transition-all duration-500 ${active ? "backdrop-blur-lg" : "backdrop-blur-none"}`}>
              <SearchBar
                    placeholders={searchPlaceHolders}
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
              />
            </div> */}
            {loading ?
            <div><LoadingSkeleton/></div> : <ExpandableCard reviewData={reviewData} active={active} setActive={setActive} reported={reported} setReported={setReported}/>
            }
            <div className="flex justify-center">
              {reviewData.length === 0 ? null
              : <Stack spacing={2}>
                <Pagination 
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  shape="rounded"
                  color='primary'
                  size='large'
                  onChange ={(e, value) => {
                    const currentParams = Object.fromEntries([...searchParams.entries()]);
                    syncSearchParams({ ...currentParams, page: value }, setSearchParams);
                  }}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'white',
                      '&.Mui-selected': {
                        backgroundColor: 'white',
                        color: 'black',
                        '&:hover': {
                          backgroundColor: 'white',
                          color: 'black',
                        },
                      },
                      '&:not(.Mui-selected):hover': {
                        backgroundColor: '#222222',
                      },
                    },
                  }}       
                />
              </Stack>}
            </div>
          </div>
        </div>
      </div>
    </>
  ); 
}
