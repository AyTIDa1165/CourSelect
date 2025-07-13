import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CONFIG } from "@/Config";


const backendUrl = CONFIG.backendUrl;

export const useProfessors = () => {

    const [professors, setProfessors] = useState([]);

    useEffect(() => {
        const fetchProfessors = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/v1/prof/`);
                if (response.data.success) {
                    setProfessors(response.data.profs);
                }
            } catch (error) {
                toast.error("Failed to fetch professors.");
            }
        };
        fetchProfessors();
    }, []);

    return professors;
};
