import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { LoadingSkeleton } from "./LoadingSkeleton";

const TempProtectedRoute = ({ children }) => {

    const checking = useAuthRedirect({
        redirectIfAuth : false,
        paths : {
            authenticated: "/home",
            unauthorized: "/login",
            allowTemp : true
        }
    });

    if(checking) {
        return <LoadingSkeleton />;
    }

    return children;
}

export default TempProtectedRoute;