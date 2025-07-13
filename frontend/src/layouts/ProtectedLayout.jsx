import ProtectedRoute from "@/components/ProtectedRoute"
import { Outlet } from "react-router-dom"

export const ProtectedLayout = () => {
    return (
        <ProtectedRoute>
            {/* Renders the nested routes for this layout*/}
            <Outlet/>
        </ProtectedRoute>
    )
}