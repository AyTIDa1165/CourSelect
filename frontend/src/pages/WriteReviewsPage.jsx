import axios from 'axios';
import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AnonymousCheckBox } from '@/components/AnonymousCheckBox'
import { CONFIG } from '@/Config';
import { toast } from 'react-toastify';
import { criteriaMapping, years, semesters, CourseStatus, criteriaInstructions } from '@/utils/constants';
import { useProfessors } from '@/hooks/useProfessors.js';
import { useCourses } from '@/hooks/useCourses.js';
import RatingBarSelector from '@/components/RatingBarSelector';
import CriteriaInfoCard from '@/components/CriteriaInfoCard';

const InfoIcon = ({ criteria }) => {
  return (
    <div className="relative group cursor-pointer flex items-center">
      <div className="relative">
        <div className="group relative inline-block">
          <Info className="h-4 w-4 ml-2 text-black dark:text-gray-400 relative" />
          
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 w-[600px]">
            <CriteriaInfoCard criteria={criteria} />
          </div>
          
        </div>

        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
      </div>
    </div>
  );
};

export default function Component() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    profId: '',
    courseId: '',
    courseStatus: '',
    timeOfCourse: '',
    semester: '',
    content: '',
    gradingDifficulty: '',
    academicWorkload: '',
    teachingQuality: '',
    courseContent: '',
    managementAndTAs: '',
    anonymous: false,
  });

  const backendUrl = CONFIG.backendUrl;
  const courses = useCourses();
  const professors = useProfessors();
  

  const handleChange = (value, fieldName) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    const {
      profId, courseId, timeOfCourse, semester, content, 
      gradingDifficulty, academicWorkload, teachingQuality, 
      courseContent, managementAndTAs, anonymous, courseStatus
    } = formData;

    if (!profId || !courseId || !timeOfCourse || !semester || !gradingDifficulty || !academicWorkload || !teachingQuality || !courseContent || !managementAndTAs || !courseStatus) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/v1/review/add`, {
        courseId,
        profId,
        gradingDifficulty,
        academicWorkload,
        teachingQuality,
        courseContent,
        managementAndTAs,
        anonymous,
        timeOfCourse,
        sem: semester,
        content,
        courseStatus
      });
  
      if(response.data.success) {
        toast.success("Review submitted successfully!");
        navigate("/reviews"); // Redirect to reviews page
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if(error.data?.message){
        toast.error(error.data?.message);
      } else {
        toast.error("Failed to submit the review. Please try again.");
      }
    }
  }

  const RatingDiv = ({criteria}) =>{

    return(
      <div className="flex items-start gap-8">
        {/* Left side */}
        <div className="flex flex-col w-48 mt-6">
          <Label htmlFor={criteria} className="text-black dark:text-gray-300 flex items-center gap-1">
            {criteriaMapping[criteria]}
            <InfoIcon criteria={criteria}/>
          </Label>
        </div>

        {/* Right side */}
        <div className="flex flex-col flex-1 mt-6">
          <RatingBarSelector 
            criteria={criteria} 
            rating={formData[criteria]} 
            handleChange={handleChange} 
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white dark:bg-[#161616] py-8 px-4 sm:px-6 lg:px-8">
      <Card className="bg-white dark:bg-[#1c1c1c] border dark:border-2 border-gray-300 dark:border-zinc-800 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-black dark:text-gray-100 font-bold text-center">Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="professor" className="text-black dark:text-gray-200">Professor</Label>
              <Select onValueChange={(value) => {handleChange(value, 'profId')}}>
                <SelectTrigger id="professor">
                  <SelectValue placeholder="Select a professor"/>
                </SelectTrigger>
                <SelectContent>
                  {professors.map((professor) => (
                    <SelectItem key={professor.id} value={professor.id.toString()}>
                      {professor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="course" className="text-black dark:text-gray-200">Course</Label>
              <Select onValueChange={(value) => handleChange(value, 'courseId')}>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="courseStatus" className="text-black dark:text-gray-200">Course Status</Label>
              <Select onValueChange={(value) => {handleChange(value, 'courseStatus')}}>
                <SelectTrigger id="courseStatus">
                  <SelectValue placeholder="Select course status" />
                </SelectTrigger>
                <SelectContent>
                  {CourseStatus.map((status) => (
                    <SelectItem key={status} value={status.toString()}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year" className="text-black dark:text-gray-200">Year</Label>
                <Select onValueChange={(value) => {handleChange(value, 'timeOfCourse')}}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="semester" className="text-black dark:text-gray-200">Semester</Label>
                <Select onValueChange={(value) => {handleChange(value, 'semester')}}>
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester.toString()}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <RatingDiv criteria={'courseContent'}/>
            <RatingDiv criteria={'teachingQuality'}/>
            <RatingDiv criteria={'managementAndTAs'}/>
            <RatingDiv criteria={'academicWorkload'}/>
            <RatingDiv criteria={'gradingDifficulty'}/>
            
            <AnonymousCheckBox formData={formData} handleChange={handleChange} />

            <div>
              <Label htmlFor="content" className='text-black dark:text-gray-200'>Review</Label>
              <Textarea
                id="content"
                placeholder="Write your review here..."
                className="mt-1"
                rows={5}
                onChange={(e) => handleChange(e.target.value, 'content')}
              />
            </div>
          <Button type="submit" className="w-full">Submit Review</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}