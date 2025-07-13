import { CONFIG } from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";

const backendUrl = CONFIG.backendUrl;

export const useUserProfileData = (username) => {
    
    const [userProfileData, setUserProfileData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfileData = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${backendUrl}/api/v1/user/${username}`);
                if(data.success){
                    setUserProfileData(data.userProfileData);
                }
            } catch(error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfileData();
    }, [username]);

    return { userProfileData, loading, error };
}