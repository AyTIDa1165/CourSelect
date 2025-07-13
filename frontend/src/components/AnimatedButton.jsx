"use client";
import React from "react";
import {
  Modal,
  ModalTrigger,
} from "@/components/ui/animated-modal";

const AnimatedButton = ({ text, textColor, bgColor, borderSize, Icon, onClick }) => {
  return (
    <div className="flex items-center justify-center" onClick={onClick}>
      <Modal>
        <ModalTrigger
          className={`group flex justify-center items-center w-[175px] h-[45px] py-2 px-10 ${borderSize} border-cyan-600 dark:border-cyan-300 rounded-md shadow-sm text-md font-semibold ${bgColor} ${textColor} transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:bg-cyan-400 dark:hover:bg-cyan-300 dark:hover:text-black hover:border-transparent group/modal-btn`}
        >
          {/* Bold text with transition */}
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500 font-bold">
            {text}
          </span>

          {/* SVG icon appears on hover */}
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 z-20">
            <Icon className="w-8 h-8" />
          </div>
        </ModalTrigger>
      </Modal>
    </div>
  );
};

export default AnimatedButton;