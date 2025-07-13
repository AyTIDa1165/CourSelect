import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import WriteReviews from './pages/WriteReviewsPage.jsx';
import LandingPage from "./pages/LandingPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import Reviews from './pages/ReviewsPage.jsx';
import Course from './pages/CoursePage.jsx';
import Test from './pages/TestPage.jsx';
import UserPage from './pages/UserPage.jsx';
import VerifyUserPage from "./pages/VerifyUserPage.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import MaintenancePage from "./pages/MaintenancePage.jsx";
import { GuestLayout } from "./layouts/GuestLayout.jsx";
import { ProtectedLayout } from "./layouts/ProtectedLayout.jsx";
import { TempLayout } from "./layouts/TempLayout.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import GuidelinesPage from "./pages/GuidelinesPage.jsx";
import { RootLayout } from "./layouts/RootLayout.jsx";
import { useTheme } from "./context/ThemeContext.jsx";

axios.defaults.withCredentials = true;

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        // Public-Routes
        {path: "/", element :<LandingPage/>},
        {path: "/about", element: <AboutPage/>},
        {path: "/guidelines", element: <GuidelinesPage /> },
        {path: "/unauthorized", element : <UnauthorizedPage/>},
        {path: "/maintenance", element : <MaintenancePage/>},
        
        // Guest-Routes
        {
          path: "/",
          element: <GuestLayout />,
          children: [
    
            // Public-Routes
            {path: "/test", element : <Test/>},
            
            // Auth-Routes
            {path: "/register", element : < RegisterPage/>},
            {path: "/login", element : <LoginPage/>},
            
          ]
        },
        
        // Temporarily authorized user-route
        {
          path: "/",
          element: <TempLayout />,
          children: [
            
            {path: "/verify", element : <VerifyUserPage/>},
            
          ]
        },
        
        // Protected-Routes
        {
          path: "/",
          element: <ProtectedLayout />,
          children: [
            
            // Authorized User Routes
            {path: "/reviews", element: <Reviews/>},
            {path: "/writeReviews", element : <WriteReviews/>},
            {path: "/user/:username", element : <UserPage/>},
            {path: "/course/:acronym", element : <Course/>},
            
          ]
        },
        {path: "*", element: <NotFoundPage /> }
      ]
    },
  ]
);

function App() {

  const { theme } = useTheme();

  return (
    <div>
      <ToastContainer stacked theme={theme} position="top-center" autoClose={2500}/>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;