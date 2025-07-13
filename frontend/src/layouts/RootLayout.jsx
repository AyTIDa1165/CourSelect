import Footer from "@/components/Footer";
import { NavbarWrapper } from "@/components/NavbarWrapper";
import { UserInitializer } from "@/components/UserInitializer";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
    return (
        <>
            <NavbarWrapper />
            <UserInitializer />
            <main style={{ minHeight: "80vh" }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}