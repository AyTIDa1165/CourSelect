import prisma from "../prisma/index.js";

export const getAllProfs = async(req, res) => {
    try {

        const profs = await prisma.professor.findMany({
            select : {
                id : true,
                name: true
            }
        });

        return res.status(200).json({
            profs,
            success : true,
            message : "Professors fetched successfully."
        });

    } catch(error){
        return res.status(500).json({
            success : false,
            message : "Internal server error."
        });
    }
}