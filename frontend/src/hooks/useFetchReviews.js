import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CONFIG } from "@/Config";
import { toast } from "react-toastify";

const backendUrl = CONFIG.backendUrl;

export const useFetchReviews = () => {
  const [searchParams] = useSearchParams();

  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 1, totalReviews: 0 });
  
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);

      const query = new URLSearchParams({
        page: searchParams.get("page") || 1,
        sort: searchParams.get("sort") || "latest",
        criteriaFilter: searchParams.get("criteriaFilter") || "All",
        ratingFilter: searchParams.get("ratingFilter") || "All",
        professorFilter: searchParams.get("professorFilter") || "All",
        courseFilter: searchParams.get("courseFilter") || "All",
        yearFilter: searchParams.get("yearFilter") || "All",
        semFilter: searchParams.get("semFilter") || "All"
      }).toString();

      try {
        const res = await axios.get(`${backendUrl}/api/v1/review/?${query}`);
        
        if (res.data.success) {
          setReviewData(res.data.reviews);
          setPagination({
            totalPages: res.data.totalPages,
            currentPage: res.data.currentPage,
            totalReviews: res.data.totalReviews
          });
        }
      } catch (err) {
        setLoading(false);
        toast.error(res.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [searchParams]);
  return { reviewData, loading, pagination };
};

export default useFetchReviews;