import { CONFIG } from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";

const backendUrl = CONFIG.backendUrl;

export const useCoursePageData = (acronym) => {
    acronym = acronym.toUpperCase();
    const [coursePageData, setCoursePageData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCoursePageData = async () => {
            try{
                setLoading(true);
                const { data } = await axios.get(`${backendUrl}/api/v1/course/${acronym}`);
                if(data.success){
                    setCoursePageData(data.data);
                }
            } catch(error){
                setError(error);
            } finally{
                setLoading(false);
            }
        }
        fetchCoursePageData();
    }, [acronym]);

    return { coursePageData, loading , error};
}