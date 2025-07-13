import { CONFIG } from '@/Config';
import axios from 'axios';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { handleError } from '@/utils/ErrorHandler.js';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useFetchUserData } from '@/hooks/useFetchUserData';

const VerifyUserPage = () => {
  
  axios.defaults.withCredentials = true;

  const backendUrl = CONFIG.backendUrl;
  
  const navigate = useNavigate();
  const fetchUserData = useFetchUserData();
  
  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index+1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if(e.key === "Backspace" && index >= 0){
      if(e.target.value !== ""){
        e.target.value = "";
      } else {
        inputRefs.current[index-1].focus();
      }
    }
    if(e.key === "ArrowRight" && index < inputRefs.current.length - 1){
      inputRefs.current[index+1].focus();
    }
    if(e.key === "ArrowLeft" && index > 0){
      inputRefs.current[index-1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    });
    inputRefs.current[pasteArray.length - 1].focus();
  }

  const onSubmitHandler = async (e) => {
    try{
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(`${backendUrl}/api/v1/auth/verify-account`, {
        otp
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
      }

    } catch(error){
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        handleError(error, navigate);
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#161616]">
        <form onSubmit={onSubmitHandler} className="w-full max-w-md bg-[#1c1c1c] rounded-lg shadow-lg p-8">
          <h1 className="text-center text-3xl font-bold text-gray-100 mb-4">Account Verification OTP</h1>
          <p className="text-center mb-6 text-gray-300">Enter the 6-digit code sent to your email id.</p>
          <div className="flex justify-center gap-3 mb-8">
            {Array(6).fill(0).map((_, index) => (
              <input 
                type="text" 
                maxLength="1" 
                key={index} 
                required 
                className="w-12 h-12 border-2 bg-zinc-700/60 text-gray-200 text-center text-xl border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                ref={(e) => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={(e) => handlePaste(e)}
              />
            ))}
          </div>
          <div className='flex justify-center'>
              <div className='flex justify-center'>
                <Button type="submit">
                  Verify Email
                </Button>
              </div>
            </div>
        </form>
    </div>
  )
}

export default VerifyUserPage;