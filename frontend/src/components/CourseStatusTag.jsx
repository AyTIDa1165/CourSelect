import React from 'react'

const CourseStatusTag = ({ courseStatus = "Completed" }) => {
    const statusStyles = {
      Completed: "bg-green-200 text-green-700",
      Repeated: "bg-blue-200 text-blue-700",
      Dropped: "bg-red-200 text-red-700",
    };
  
    const styles = statusStyles[courseStatus] || "bg-gray-200 text-gray-700";
  
    return (
      <div className={`px-4 py-1 rounded-full font-medium text-sm inline-block ${styles}`}>
        {courseStatus}
      </div>
    );
  };  

export default CourseStatusTag