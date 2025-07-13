import TempProtectedRoute from "@/components/TempProtectedRoute"
import { Outlet } from "react-router-dom"

export const TempLayout = () => {
    return (
        <TempProtectedRoute>
            {/* Renders the nested routes for this layout*/}
            <Outlet/>
        </TempProtectedRoute>
    )
}