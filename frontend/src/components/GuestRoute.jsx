import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { LoadingSkeleton } from "./LoadingSkeleton";

const GuestRoute = ({ children }) => {
    const checking = useAuthRedirect({
        redirectIfAuth: true,
        paths: {
            authenticated: "/home",
            tempRedirect: "/verify"
        }
    });

    if (checking) {
        return <LoadingSkeleton />
    }

    return children;
};

export default GuestRoute;