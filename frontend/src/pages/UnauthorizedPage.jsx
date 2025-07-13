import React from 'react'
import { Link } from 'react-router-dom'
import MascotStopLight from '@/assets/mascot/MascotStopLight.png'
import MascotStopDark from '@/assets/mascot/MascotStopDark.png'

const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#161616]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black dark:text-gray-200 mb-4">
          Access denied!
        </h1>
        <p className="text-zinc-800 dark:text-gray-300 text-2xl mb-6">
        It looks like you don't have permission to access this page.
        </p>
        <div className="flex justify-center space-x-2 mb-10 mt-20">
          <img 
            src={MascotStopLight}
            alt="Mascot Stop Light"
            className="h-auto w-[300px] block dark:hidden"
          />
          <img 
            src={MascotStopDark}
            alt="Mascot Stop Dark"
            className="h-auto w-[300px] hidden dark:block"
          />
        </div>
        <div className="flex items-center justify-center mt-10 space-x-4 text-2xl">
          <Link to="/" className="text-cyan-700 dark:text-cyan-400 hover:underline underline-offset-2 hover:text-cyan-500 dark:hover:text-cyan-200">Go To Home Page</Link>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage