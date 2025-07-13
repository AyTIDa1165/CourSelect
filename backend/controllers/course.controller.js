import prisma from "../prisma/index.js";

export const getAllCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany({});
        return res.status(200).json({
            success : true,
            message : "Courses fetched successfully.",
            courses
        });
    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Internal Server Error."
        });
    }
}

export const getCourseData = async (req, res) => {
    try {

        const { acronym } = req.params;
        const { userId } = req.body;

        if(!acronym){
            return res.status(400).json({
                success : false,
                message : "Coursename missing"
            });
        }

        const courseExists = await prisma.course.findUnique({
            where : { acronym: acronym }
        });

        if(!courseExists){
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }
        
        const courseData = await prisma.course.findUnique({
            where : { acronym: acronym },
            select : {
                id: true,
                courseName: true,
                courseCode: true,
                sem: true,
                numRatings : true,
                numReviews : true,
                reviews : {
                    orderBy : [{ upvotes: "desc"}, {downvotes: "asc" }],
                    select : {
                        id: true,
                        content : true,
                        contentWordCount : true,
                        anonymous: true,
                        sem: true,
                        timeOfCourse: true,
                        courseStatus: true,
                        teachingQuality: true,
                        courseContent: true,
                        academicWorkload: true,
                        gradingDifficulty: true,
                        managementAndTAs: true,
                        upvotes: true,
                        downvotes: true,
                        createdAt : true,
                        prof: { select : { name : true } },
                        user : { select : { username : true } },
                        course : { select : { courseName: true, acronym: true } },
                        reviewVotes: { where: { userId: userId }, select: { voteType: true } }
                    }
                }
            }
        });

        const professorReviewsMap = {};
        const distributions = {
            courseContent: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            teachingQuality: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            managementAndTAs: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            academicWorkload: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            gradingDifficulty: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };

        let topRawReviews = courseData.reviews;

        let updatedTopReviews;
        let courseDetails = {
            name : courseData.courseName,
            acronym : acronym,
            code : courseData.courseCode,
            semester : courseData.sem,
            numReviews : courseData.numReviews,
            numRatings : courseData.numRatings
        };
        
        if(topRawReviews.length !== 0){

            topRawReviews.forEach(review => {
                const profName = review.prof.name;
    
                if(!professorReviewsMap[profName]){
                    professorReviewsMap[profName] = { name: profName, reviews: 0, ratings: 0 };
                }
    
                if(review.content && review.contentWordCount > 2){
                    professorReviewsMap[profName].reviews++;
                    professorReviewsMap[profName].ratings++;
                } else {
                    professorReviewsMap[profName].ratings++;
                }
    
                distributions.teachingQuality[review.teachingQuality]++;
                distributions.courseContent[review.courseContent]++;
                distributions.academicWorkload[review.academicWorkload]++;
                distributions.gradingDifficulty[review.gradingDifficulty]++;
                distributions.managementAndTAs[review.managementAndTAs]++;
    
            });
    
            // Review processing for voting etc
            topRawReviews = topRawReviews.filter(r => r.content && r.contentWordCount > 2).slice(0, 3);
    
            updatedTopReviews = topRawReviews.map(review => {
                const { reviewVotes, ...rest } = review;
                return {
                    ...rest,
                    user: review.anonymous ? {} : review.user,
                    userVote: review.reviewVotes[0]?.voteType ?? null
                }
            });

            const professorReviews = Object.values(professorReviewsMap);
    
            return res.status(200).json({
                success: true,
                message : "Course data fetched successfully.",
                data : {
                    courseDetails,
                    reviewData: updatedTopReviews,
                    professorReviews,
                    distributions
                }
            });
        }

        return res.status(200).json({
            success : true,
            message : "Course data fetched successfully.",
            data : {
                courseDetails,
                reviewData: updatedTopReviews,
                professorReviews : Object.values(professorReviewsMap),
                distributions
            }
        });
        
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}