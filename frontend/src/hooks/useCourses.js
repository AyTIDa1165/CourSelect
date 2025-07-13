import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CONFIG } from "@/Config";


const backendUrl = CONFIG.backendUrl;

export const useCourses = () => {
    const [courses, setCourses] = useState([]);
  
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/v1/course/`);
                if (response.data.success) {
                    const rawCourses = response.data.courses;
                    const departmentWiseCourses = rawCourses.reduce((acc, course) => {
                        const department = course.courseCode.slice(0, 3);
                        const existingDept = acc.find((d) => d.department === department);
    
                        if (existingDept) {
                        existingDept.courses.push(course);
                        } else {
                        acc.push({ department, courses: [course] });
                        }
    
                        return acc;
                    }, []);
                    setCourses(departmentWiseCourses);
                }
            } catch (error) {
                toast.error("Failed to fetch courses.");
            }
        };
    
        fetchCourses();
    }, []);

    return courses;
  };
