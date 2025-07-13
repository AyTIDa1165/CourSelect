import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { LoadingSkeleton } from "./LoadingSkeleton";

const ProtectedRoute = ({ children }) => {

    const checking = useAuthRedirect({
        redirectIfAuth : false,
        paths : {
            authenticated: "/home",
            unauthorized: "/login",
            tempRedirect: "/verify",
            allowTemp : false
        }
    });

    if(checking) {
        return <LoadingSkeleton />
    }

    return children;
}

export default ProtectedRoute;