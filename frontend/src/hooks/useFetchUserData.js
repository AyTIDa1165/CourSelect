import { CONFIG } from "@/Config"
import { userStateAtom } from "@/store/atoms/userAtom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSetRecoilState, useRecoilValue } from "recoil";

export const useFetchUserData = () => {
    const setUserData = useSetRecoilState(userStateAtom);
    const userData = useRecoilValue(userStateAtom);
    
    const fetchUserData = async () => {
        try {
            const { data } = await axios.get(`${CONFIG.backendUrl}/api/v1/user/data`);

            const userData = data.userData;

            setUserData({
                email : userData.email,
                username : userData.username,
                role : userData.role,
                batch : userData.batch,
                isAuthenticated : true
            });
            return userData;
        } catch(error) {
            if (userData.isAuthenticated) {
                toast.error("Error fetching user data.");
            }
            return null;
        }
    };

    return fetchUserData;
};