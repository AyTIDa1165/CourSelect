import { toast } from "react-toastify";

export const handleError = (error, navigate) => {

  if (error.message === "Network Error" || error.code === "ERR_CONNECTION_REFUSED") {
    navigate("/maintenance");
  } else if (error.response?.status === 403 || error.response?.status === 401) {
    navigate("/unauthorized");
  } else {
    const errorMessage = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : "Something went wrong!";
    toast.error(errorMessage);
  }
};