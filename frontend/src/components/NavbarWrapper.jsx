import { userStateAtom } from "@/store/atoms/userAtom"
import { useRecoilValue } from "recoil"
import NavBar from "./NavBar";

export const NavbarWrapper = () => {
    const userData = useRecoilValue(userStateAtom);
    return <NavBar isLoggedIn={userData.isAuthenticated} />;
}