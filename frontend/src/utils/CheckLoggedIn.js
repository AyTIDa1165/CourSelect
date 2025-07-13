import axios from "axios";
import { CONFIG } from "@/Config";

// This function checks the authentication status of the user.
export const checkLoggedIn = async () => {
    
    try{
        const backendUrl = CONFIG.backendUrl;
        const { data } = await axios.get(`${backendUrl}/api/v1/user/is-auth`, {
            withCredentials : true
        });
        return data.success;
    } catch(error){
        if(error.response?.status === 403 || error.response?.status === 401){
            return false;
        }
        return false;
    }
}