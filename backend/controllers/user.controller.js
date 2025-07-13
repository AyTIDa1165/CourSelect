import prisma from "../prisma/index.js";

export const getUserData = async (req, res) => {

    try {
        
        const { userId } = req.body;

        const foundUser = await prisma.user.findFirst({
            where : {
                id : userId
            },
            select : {
                email: true,
                role: true,
                branch: true,
                batch: true,
                username: true
            }
        });

        if (!foundUser) {
            return res.status(404).json({
                success : false,
                message : "User not found."
            });
        }

        return res.status(200).json({
            success : true,
            userData : {
                email : foundUser.email,
                branch : foundUser.branch,
                role : foundUser.role,
                batch : foundUser.batch,
                username : foundUser.username
            }
        });

    } catch(error) {
        res.status(500).json({
            sucess : false,
            message : "Internal server error."
        });
    }

}

export const getUserProfileData = async (req, res) => {
    
    try {
        const { userId: loggedInUserId } = req.body;
        const { username: profileUsername } = req.params;
    
        if(!profileUsername){
            return res.status(400).json({
                success : false,
                message : "Username missing."
            });
        }
        
        const profileUser = await prisma.user.findUnique({
            where : { username: profileUsername },
            select : { id: true }
        });

        if(!profileUser){
            return res.status(404).json({
                success : false,
                message : "User not found."
            });
        }

        const isOwner = loggedInUserId === profileUser.id;

        const userProfileData = await prisma.user.findUnique({
            where: { username: profileUsername },
            select: {
                id : true,
                role: true,
                username: true,
                email: true,
                about: true,
                branch: true,
                batch: true,
                totalUpvotesOnReviews: true,
                totalDownvotesOnReviews: true,
                createdAt: true,
                badges: {
                    select: {
                        badge: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                iconUrl: true
                            }
                        },
                        assignedAt: true
                    }
                },
                reviews: {
                    where : isOwner ? { contentWordCount : { gt : 2 } } : { anonymous: false, contentWordCount : { gt : 2 } },
                    orderBy: [{ netVotes: "desc" }],
                    take: 3,
                    select: {
                        id: true,
                        courseStatus: true,
                        timeOfCourse: true,
                        sem: true,
                        content: true,
                        upvotes: true,
                        downvotes: true,
                        teachingQuality: true,
                        courseContent: true,
                        academicWorkload: true,
                        gradingDifficulty: true,
                        managementAndTAs: true,
                        anonymous: true,
                        createdAt: true,
                        prof: { select: { name: true } },
                        course: { select: { courseName: true, acronym: true } },
                        user: { select: { username: true } },
                        reviewVotes: { where: { userId: loggedInUserId }, select: { voteType: true } }
                    }
                }
            }
        });

        
        const topRawReviews = userProfileData.reviews;
        
        const updateTopReviews = topRawReviews.map(review => {
            const { reviewVotes, ...rest } = review;
            return {
                ...rest,
                userVote: review.reviewVotes[0]?.voteType ?? null
            }
        });
        
        userProfileData.reviews = updateTopReviews;
        
        if(isOwner){
            userProfileData.contributions = userProfileData.totalUpvotesOnReviews - userProfileData.totalDownvotesOnReviews;
        } else {
            const upvotes = userProfileData.reviews.reduce((sum, review) => sum + review.upvotes, 0);
            const downvotes = userProfileData.reviews.reduce((sum, review) => sum + review.downvotes, 0);
            userProfileData.contributions = upvotes - downvotes;
        }

        return res.status(200).json({
            success : true,
            message : "User profile data fetched successfully.",
            userProfileData
        });


    } catch(error){
        return res.status(500).json({
            success : false,
            message : "Internal server error."
        });
    }
}

export const updateUserProfileData = async (req, res) => {
    try {
        
        const { userId, data } = req.body;

        await prisma.user.update({
            where : {
                id : userId
            },
            data
        });

        return res.status(200).json({
            success : true,
            message : "User profile data updated successfully."
        });

    } catch (error){
        return res.status(500).json({
            success : false,
            message : "Internal server error."
        });
    }
}