import React from "react";
import MascotSleepLight from "@/assets/mascot/MascotSleepLight.png"
import MascotSleepDark from "@/assets/mascot/MascotSleepDark.png"

const MaintenancePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#161616]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black dark:text-gray-200 mb-4">
          We'll be back soon!
        </h1>
        <p className="text-zinc-800 dark:text-gray-300 text-2xl mb-6">
          Our site is under maintenance. We appreciate your patience.
        </p>
        <div className="flex justify-center space-x-2 mb-10 mt-20">
          <img 
            src={MascotSleepLight}
            alt="Mascot Sleep Light"
            className="h-auto w-[300px] block dark:hidden"
          />
          <img 
            src={MascotSleepDark}
            alt="Mascot Sleep Dark"
            className="h-auto w-[300px] hidden dark:block"
          />
        </div>
        <p className="mt-6 text-md text-zinc-800 dark:text-gray-300 text-2xl">
          If you have any urgent concerns, please contact us at {" "}
          <a
            href="mailto:team@courselect.org"
            className="text-cyan-700 dark:text-cyan-400 hover:underline underline-offset-2 hover:text-cyan-500 dark:hover:text-cyan-200"
          >
            team@courselect.org
          </a>.
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
