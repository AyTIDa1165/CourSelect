import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkLoggedIn } from "@/utils/CheckLoggedIn";
import { checkTempLoggedIn } from "@/utils/CheckTempLoggedIn";

export const useAuthRedirect = ({
    redirectIfAuth = false,
    paths = {
        authenticated: "/home",
        unauthorized: "/login",
        tempRedirect: "/verify",
        allowTemp: false
    }
}) => {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const isLoggedIn = await checkLoggedIn();
            const isTempLoggedIn = await checkTempLoggedIn();
            if(redirectIfAuth){
                // Use in Guest Routes (if already logged in)
                if(isLoggedIn){
                    return navigate(paths.authenticated);
                } else if(isTempLoggedIn){
                    return navigate(paths.tempRedirect);
                } else {
                    setChecking(false);
                }
            } else {
                // Use in Protected Routes
                if (isLoggedIn){
                    setChecking(false);
                    return;
                } else if (isTempLoggedIn && paths.allowTemp) {
                    setChecking(false);
                    return;
                } else if (isTempLoggedIn && !paths.allowTemp) {
                    return navigate(paths.tempRedirect);
                } else {
                    return navigate(paths.unauthorized);
                }
            }
        };
        checkAuth();
    }, [navigate, redirectIfAuth, paths]);
    return checking;
}