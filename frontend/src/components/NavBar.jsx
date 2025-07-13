import { motion } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CourselectLogo from "@/assets/courselectLogo.ico";
import { Link,useLocation,useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userStateAtom } from "@/store/atoms/userAtom";
import { CONFIG } from "@/Config";
import axios from "axios";
import { toast } from "react-toastify";


export default function NavBar({ isLoggedIn }) {
  
  const userData = useRecoilValue(userStateAtom);
  const backendUrl = CONFIG.backendUrl;
  
  const items = useMemo(() => {
    const baseItems = [
      { id: 1, title: "Home", path: "/" },
      { id: 2, title: "Reviews", path: "/reviews" },
      { id: 3, title: "Write a Review", path: "/writereviews" },
      { id: 4, title: "About", path: "/about" },
    ];
    
    const authItems = isLoggedIn
    ? [{ id: 7, title: "Profile", path: `/user/${userData.username}` }]
    : [
      { id: 5, title: "Login", path: "/login" },
      { id: 6, title: "Sign Up", path: "/register" },
    ];

    return [...baseItems, ...authItems];
  }, [isLoggedIn]);

  const location = useLocation();
  useEffect(() => {
    const currentPath = location.pathname;

    // Match the current path to one of the items
    const matchedItem = items.find(item =>
      currentPath === item.path ||
      (item.path !== "/" && currentPath.startsWith(item.path))
    );
    if (matchedItem) {
      setActive(matchedItem);
    } else {
      setActive(null);
    }
  }, [window.location.pathname, items]);

  const [active, setActive] = useState();
  const [isHover, setIsHover] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const setUserData = useSetRecoilState(userStateAtom);
  
  const handleLogout = async () => {
    
    const { data } = await axios.post(`${backendUrl}/api/v1/auth/logout`);

    if(data.success){
      toast.info(data.message);
      setUserData({
        isAuthenticated : false,
        batch : null,
        email : null,
        role : null
      });
      navigate("/login");
    } else {
      toast.error(data.message);
    }
    setActive(items[0]);
    setIsHover(null);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 left-0 w-full bg-black z-50 h-16 flex items-center shadow-sm">
      <main className="bg-black relative w-full max-h-screen flex items-start md:items-center justify-center">
        <div className="w-full relative flex items-end justify-between px-6 mt-2 border-b border-b-white/20">
            <Link to={"/"}>
              <div className="flex items-end space-x-3 mb-2">
                <img src={CourselectLogo} alt="Logo" className="h-[40px] w-[40px] mb-2" />
                <span className="text-white text-4xl font-bold mb-2">
                  Cour
                  <span className="bg-gradient-to-r font-bold from-white to-cyan-300 bg-clip-text text-transparent">
                    Se
                  </span>
                  <span className="text-cyan-300 font-bold">lect</span>
                </span>
              </div>
            </Link>
          <ul className="flex items-end justify-end">
            {items.map((item) => {
              const isProfile = item.title === "Profile";
              const isActive = active?.id === item.id;
              const isHovering = isHover?.id === item.id;

              const wrapperProps = {
                onMouseEnter: () => setIsHover(item),
                onMouseLeave: () => setIsHover(null),
                className: cn(
                  "py-2 relative duration-300 transition-colors hover:text-white",
                  isActive ? "text-cyan-200" : "text-gray-300",
                  "mb-0"
                ),
              };

              const innerContent = (
                <>
                  <div
                    className={cn(
                      "relative flex items-center justify-center",
                      isProfile ? "px-3 py-3" : "px-5 py-4"
                    )}
                  >
                    {isProfile ? (
                      <div className="relative" ref={dropdownRef}>
                        <Avatar className="h-8 w-8 cursor-pointer">
                          <AvatarFallback className="rounded-full flex items-center justify-center font-bold text-white bg-cyan-500">
                            {userData.username?.slice(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        {showDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute -right-[110%] mt-5 w-40 bg-zinc-800 rounded-md border border-gray-500 shadow-lg z-50 overflow-visible"
                            >
                            <ul className="text-sm py-2">
                              <li
                                className="px-4 py-2 hover:bg-zinc-700 cursor-pointer text-gray-200 hover:text-white"
                                onClick={() => {
                                  setShowDropdown(false);
                                  setActive(items[4])
                                  navigate(`/user/${userData.username}`);
                                }}
                              >
                                @{userData.username}
                              </li>
                              <li
                                className="hover:bg-zinc-700 cursor-pointer text-gray-200"
                                onClick={() => {
                                  setShowDropdown(false);
                                }}
                              >
                                <ThemeToggle />
                              </li>
                              <li
                                className="px-4 py-2 hover:bg-zinc-700 cursor-pointer text-red-500 hover:text-red-400"
                                onClick={handleLogout}
                              >
                                Log Out
                              </li>
                            </ul>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      item.title
                    )}

                    {isHovering && (
                      <motion.div
                        layoutId="hover-bg"
                        className="absolute bottom-0 left-0 right-0 w-full h-full bg-white/20"
                        style={{ borderRadius: 6 }}
                      />
                    )}
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="active"
                      className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-cyan-200"
                    />
                  )}
                </>
              );

              return isProfile ? (
                <div
                  key={item.id}
                  {...wrapperProps}
                  onClick={() => {
                    setShowDropdown((prev) => !prev);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {innerContent}
                </div>
              ) : (
                <Link
                  key={item.id}
                  {...wrapperProps}
                  to={item.path}
                  onClick={() => setActive(item)}
                >
                  {innerContent}
                </Link>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );
}
