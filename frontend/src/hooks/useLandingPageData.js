import { CONFIG } from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";

const backendUrl = CONFIG.backendUrl;

export const useLandingPageData = () => {
    const [loading, setLoading] = useState(false);
    const [landingPageData, setLandingPageData] = useState();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLandingPageData = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${backendUrl}/api/v1/misc/landing`);
                if(data.success){
                    setLandingPageData(data.data);
                } 
            } catch(error){
                setError(error);
            } finally{
                setLoading(false);
            }
        }
        fetchLandingPageData();
    },[]);

    return { landingPageData, loading, error };
}