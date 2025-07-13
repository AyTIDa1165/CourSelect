import { useFetchUserData } from "@/hooks/useFetchUserData"
import { useEffect } from "react";

export const UserInitializer = () => {
    const fetchUserData = useFetchUserData();

    useEffect(() => {
        fetchUserData();
    }, []);
}