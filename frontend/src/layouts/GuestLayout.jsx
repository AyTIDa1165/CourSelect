import GuestRoute from "@/components/GuestRoute";
import { Outlet } from "react-router-dom";

export const GuestLayout = () => {
    return (
        <GuestRoute>
            {/* Renders the nested routes for this layout*/}
            <Outlet/>
        </GuestRoute>
    )
}