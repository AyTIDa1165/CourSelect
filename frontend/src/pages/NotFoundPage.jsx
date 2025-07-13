import React from 'react'
import { Link } from 'react-router-dom'
import MascotLostLight from '@/assets/mascot/MascotLostLight.png'
import MascotLostDark from '@/assets/mascot/MascotLostDark.png'

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#161616]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black dark:text-gray-200 mb-4">
          Page Not Found!
        </h1>
        <p className="text-zinc-800 dark:text-gray-300 text-2xl mb-6">
          It looks like you’ve lost your way...
        </p>
        <div className="flex justify-center space-x-2">
          <img
            src={MascotLostLight}
            alt="Mascot Lost Light"
            className="h-auto w-80 block dark:hidden"
          />
          <img
            src={MascotLostDark}
            alt="Mascot Lost Dark"
            className="h-auto w-80 hidden dark:block"
          />
        </div>
        <div className="flex items-center justify-center mt-10 space-x-4 text-2xl">
          <Link to="/" className="text-cyan-700 dark:text-cyan-400 hover:underline underline-offset-2 hover:text-cyan-500 dark:hover:text-cyan-200">Go To Home Page</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage