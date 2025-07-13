import axios from 'axios';
import { toast } from 'react-toastify';
import { KeyRound, Mail } from 'lucide-react';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { PasswordInput } from '@/components/ui/password-input';
import { CONFIG } from '@/Config';
import { handleError } from '@/utils/ErrorHandler';
import { Button } from '@/components/ui/button';
import { useFetchUserData } from '@/hooks/useFetchUserData';

export const LoginPage = () => {
  
  const navigate = useNavigate();
  
  const backendUrl = CONFIG.backendUrl;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fetchUserData = useFetchUserData();

  const handleLogin = async (e) => {

    try{
      e.preventDefault();
    
      const { data } = await axios.post(`${backendUrl}/api/v1/auth/login`, {
        email,
        password,
      });
      
      if(data.success) {
        // Fetch user data from the DB
        toast.success(data.message);
        const userData = await fetchUserData();

        if (userData?.username) {
          navigate(`/user/${userData.username}`);
        } else {
          toast.error("Unable to get user info");
          navigate("/");
        }
      } else {
        toast.error(data.message);
        navigate("/login");
      }
    } catch(error){
      handleError(error, navigate);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#161616]">
      <div className="w-full max-w-lg bg-white dark:bg-[#1c1c1c] border border-gray-300 dark:border-0 rounded-lg shadow-md p-8">

        <h2 className="text-center text-3xl font-bold text-black dark:text-gray-100 mb-4">Login</h2>
        <p className="w-full text-black dark:text-gray-300 mb-6 text-center">Enter your email and password to access your account.</p>
        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black dark:text-gray-200 mb-1">
              Email
            </label>
            <div className='relative flex items-center'>
              <div className='absolute left-3 pl-2 pr-5 border-r border-gray-300'>
                <Mail className='w-5 h-5 text-gray-500'/>
              </div>
              <input
                id="email"
                type="email"
                placeholder="Enter your IIITD email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-100 dark:bg-zinc-700/60 text-black dark:text-gray-200 w-full pl-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>
            
          <div>
            <label htmlFor="password" className="text-sm font-medium text-black dark:text-gray-200">
              Password
            </label>
            <div className="relative flex items-center mt-1">
              <div className="absolute left-3 pl-2 pr-5 border-r border-gray-300 z-10">
                <KeyRound className="w-5 h-5 text-gray-500"/>
              </div>
              <PasswordInput
                id="password"
                name="password" 
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-100 dark:bg-zinc-700/60 text-black dark:text-gray-200 w-full pl-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-gray-500"                />
            </div>
          </div>

          {/* <div>
            <Link to="/login" className="text-sm text-cyan-700 dark:text-cyan-400 hover:underline underline-offset-2 hover:text-cyan-500 dark:hover:text-cyan-200">
              Forgot Password ?
            </Link>
          </div> */}

          <div className="flex justify-center w-auto">
            <Button type="submit" className="w-1/2">Log In</Button>
          </div>
        </form>

        <div className='flex justify-center mb-2 pt-6 gap-2'>
          <p className="text-black dark:text-gray-300">Want to create a new account ?</p>
          <Link to="/register" className='text-cyan-700 dark:text-cyan-400 hover:underline underline-offset-2 hover:text-cyan-500 dark:hover:text-cyan-200'>
            Register
          </Link>
        </div>

      </div>
    </div>
  )
};