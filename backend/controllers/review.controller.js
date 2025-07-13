import axios from "axios";
import prisma from "../prisma/index.js";

// Get all reviews with pagination
export const getAllReviews = async (req, res) => {
    try {
        let { 
            page = 1,
            limit = 3,
            sort,
            criteriaFilter,
            ratingFilter,
            professorFilter, 
            courseFilter, 
            yearFilter, 
            semFilter
        } = req.query;

        const { userId } = req.body;

        page = parseInt(page);
        limit = parseInt(limit);

        // Initializing filter conditions
        let where = {};

        where.contentWordCount = { gt : 2 };
        if (professorFilter && professorFilter !== "All") where.profId = parseInt(professorFilter);
        if (courseFilter && courseFilter !== "All") where.courseId = parseInt(courseFilter);
        if (yearFilter && yearFilter !== "All") where.timeOfCourse = parseInt(yearFilter);
        if (semFilter && semFilter !== "All") where.sem = semFilter; // Enum check

        // Handling criteria & rating filter logic
        if(criteriaFilter && criteriaFilter !== "All"){
            if(ratingFilter && ratingFilter !== "All"){
                if(criteriaFilter === "academicWorkload"){
                    where.academicWorkload = parseInt(ratingFilter);
                }else if (criteriaFilter === "courseContent"){
                    where.courseContent = parseInt(ratingFilter);
                }else if (criteriaFilter === "gradingDifficulty"){
                    where.gradingDifficulty = parseInt(ratingFilter);
                }else if (criteriaFilter === "managementAndTAs"){
                    where.managementAndTAs = parseInt(ratingFilter);
                } else if (criteriaFilter === "teachingQuality"){
                    where.teachingQuality = parseInt(ratingFilter);
                }
            }
        } else {
            if(ratingFilter && ratingFilter !== "All"){
                where.averageRating = parseInt(ratingFilter);
            }
        }

        // Sorting logic
        let orderBy = [];
        if (sort === "latest") orderBy.push({ createdAt: "desc" });
        else if (sort === "oldest") orderBy.push({ createdAt: "asc" });
        else if (sort === "likes") orderBy.push({ netVotes: "desc" });
        else if (sort === "shortest") orderBy.push({ contentWordCount: "asc" });
        else if (sort === "longest") orderBy.push({ contentWordCount: "desc" });
        else orderBy.push({ createdAt: "desc" }); // Default sorting (latest first)

        // Fetch reviews and total count in a single transaction
        const [rawReviews, totalReviews] = await prisma.$transaction([
            prisma.reviews.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    content: true,
                    gradingDifficulty: true,
                    academicWorkload: true,
                    teachingQuality: true,
                    courseContent: true,
                    managementAndTAs: true,
                    timeOfCourse: true,
                    courseStatus: true,
                    sem: true,
                    anonymous: true,
                    createdAt: true,
                    upvotes: true,
                    downvotes: true,
                    user: { select: { id: true, username: true, email: true } },
                    course: { select: { id: true, courseName: true, courseCode: true, acronym: true } },
                    prof: { select: { department: true, name: true } },
                    reviewVotes: { where: { userId: userId }, select: { voteType: true } },
                    reports: { where: { userId: userId } }
                }
            }),
            prisma.reviews.count({ where })
        ]);

        const reviews = rawReviews.map(review => {
            const { reviewVotes, ...rest } = review;
            return {
                ...rest,
                user: review.anonymous ? {} : review.user,
                userVote: review.reviewVotes[0]?.voteType ?? null,
                userReported: review.reports[0] ?? false
            }
        });

        return res.status(200).json({
            success: true,
            message: "Fetched reviews successfully.",
            reviews,
            totalReviews,
            totalPages: totalReviews ? Math.ceil(totalReviews / limit) : 1,
            currentPage: page,
            limit
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

// Add a new review
export const addReview = async (req, res) => {
    try {

        const { userId, courseId, profId, gradingDifficulty, academicWorkload, teachingQuality, courseContent, managementAndTAs, anonymous, timeOfCourse, sem, content, courseStatus } = req.body;

        if (!userId || !courseId || !profId || !gradingDifficulty || !academicWorkload || !teachingQuality || !courseContent || !managementAndTAs || !sem || !timeOfCourse || !courseStatus) {
            return res.status(400).json({
                success : false,
                message : "Missing required fields."
            });
        }

        const parsedUserId = parseInt(userId, 10);
        const parsedCourseId = parseInt(courseId, 10);
        const parsedProfId = parseInt(profId, 10);
        
        const parsedGradingDifficulty = parseInt(gradingDifficulty, 10);
        const parsedAcademicWorkload = parseInt(academicWorkload, 10);
        const parsedTeachingQuality = parseInt(teachingQuality, 10);
        const parsedCourseContent = parseInt(courseContent, 10);
        const parsedManagementAndTAs = parseInt(managementAndTAs, 10);

        const parsedTimeOfCourse = parseInt(timeOfCourse, 10);

        const averageRating = Math.round((parsedGradingDifficulty + parsedAcademicWorkload + parsedTeachingQuality + parsedCourseContent + parsedManagementAndTAs) / 5);
        const contentWordCount = content?.trim().split(" ").length || 0;

        let vectorEmbedding;

        if(content){
            try {
                // Getting vector embeddings from Python service
                const pythonResponse = await axios.post("http://python-service:5001/embed", { review: content });
                if (pythonResponse.data && pythonResponse.data.vectors) {
                    vectorEmbedding = Array.isArray(pythonResponse.data.vectors) &&
                        Array.isArray(pythonResponse.data.vectors[0])
                        ? pythonResponse.data.vectors[0] // Extract the inner array
                        : [];
                } else {
                    return res.status(500).json({
                        success : false,
                        message : "Failed to receive vector embeddings."
                    });
                }
            } catch (err) {
                return res.status(500).json({
                    success : false,
                    message : "Error calling python service"
                });
            }
        }
        
        await prisma.$transaction([
            prisma.reviews.create({
                data: {
                    userId: parsedUserId,
                    courseId: parsedCourseId,
                    profId: parsedProfId,
                    gradingDifficulty: parsedGradingDifficulty,
                    academicWorkload: parsedAcademicWorkload,
                    teachingQuality: parsedTeachingQuality,
                    courseContent: parsedCourseContent,
                    managementAndTAs: parsedManagementAndTAs,
                    anonymous,
                    timeOfCourse: parsedTimeOfCourse,
                    sem,
                    content,
                    vectors: (vectorEmbedding) ? { set : vectorEmbedding} : [],
                    courseStatus,
                    averageRating,
                    contentWordCount
                }
            }),
            prisma.course.update({
                where : { id : parsedCourseId },
                data : {
                    numRatings : { increment : 1 },
                    numReviews : { increment : (contentWordCount > 2) ? 1 : 0 },
                    profs : { connect : { id : parsedProfId } } // Ensures that the professor is linked to the course
                }
            }),
            prisma.user.update({
                where : { id: userId },
                data : {
                    totalReviews : { increment : 1 }
                }
            })
        ]);

        return res.status(201).json({
            success : true,
            message: "Review added successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success : false,
            message: "Internal server error."
        });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
      const userId = req.cookies?.id;
      const userRole = req.cookies?.role;
  
      if (!userId || !userRole) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }
  
      const { id } = req.params;
      const reviewId = parseInt(id);
  
      const existingReview = await prisma.reviews.findUnique({
        where: { id: reviewId },
        include: {
          reviewVotes: true
        }
      });
  
      if (!existingReview) {
        return res.status(404).json({
          success: false,
          message: "Review not found"
        });
      }
  
      if (userRole !== "ADMIN" && existingReview.userId !== parseInt(userId)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: You can only delete your own review."
        });
      }
  
      // Calculating vote impact
      const totalUpvotes = existingReview.upvotes;
      const totalDownvotes = existingReview.downvotes;
  
      const isReviewContent = existingReview.contentWordCount > 2;
  
      await prisma.$transaction([
        prisma.reviews.delete({
          where: { id: reviewId }
        }),
  
        // Updating related course counters
        prisma.course.update({
          where: { id: existingReview.courseId },
          data: {
            numRatings: { decrement: 1 },
            numReviews: { decrement: isReviewContent ? 1 : 0 }
          }
        }),
  
        // Updating user statistics
        prisma.user.update({
          where: { id: existingReview.userId },
          data: {
            totalReviews: { decrement: 1 },
            totalUpvotesOnReviews: { decrement: totalUpvotes },
            totalDownvotesOnReviews: { decrement: totalDownvotes }
          }
        })
      ]);
  
      return res.status(200).json({
        success: true,
        message: "Review deleted successfully."
      });
  
    } catch (error) {
      console.error("Delete review error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
};
  

// Semantic search of reviews
export const searchReview = async (req, res) => {
    try {

        const { query } = req.body;

        if(!query){
            return res.status(400).json({
                success : "false",
                message : "Query missing"
            });
        }

        // Calling Python microservice to get ranked review IDs
        const response = await axios.post("http://localhost:5001/similarity", { query });

        if (!response.data || !response.data.review_ids) {
            return res.status(404).json({
                success : false,
                message : "Failed to fetch similar reviews"
            });
        }

        const reviewIds = response.data.review_ids; // List of ranked review IDs

        if (reviewIds.length === 0) {
            return []; // No similar reviews found
        }

        // Fetch full reviews from DB using the ranked IDs
        const similarReviews = await prisma.reviews.findMany({
            where: {
                id: { in: reviewIds }
            },
            orderBy: [
                {
                    id: {
                        sort: "asc", // Maintain the same order as returned by Python
                        nulls: "last"
                    }
                }
            ]
        });

        return res.status(200).json({
            success : true,
            reviews : similarReviews
        });

    } catch(error){
        return res.status(500).json({
            success : false,
            message : "Internal server error."
        });
    }
}

// Upvotes / Downvotes on reviews
export const addVote = async (req, res) => {
    
    const { userId, reviewId, voteType } = req.body;

    try {

        const review = await prisma.reviews.findUnique({
            where : { id : reviewId },
            select : { userId : true }
        })
    
        if(!review){
            return res.status(404).json({
                success: false,
                message: "Review not found."
            });
        }

        const reviewOwnerId = review.userId;

        await prisma.$transaction([
            prisma.reviewVotes.create({
                data: {
                    userId,
                    reviewId,
                    voteType
                }
            }),
            prisma.reviews.update({
                where : { id : reviewId },
                data : {
                    upvotes : { increment: voteType === "UPVOTE" ? 1 : 0 },
                    downvotes : { increment: voteType === "DOWNVOTE" ? 1 : 0 },
                    netVotes : { increment: voteType === "UPVOTE" ? 1 : -1 }
                }
            }),
            prisma.user.update({
                where : { id : reviewOwnerId },
                data : {
                    totalUpvotesOnReviews: { increment : voteType === "UPVOTE" ? 1 : 0 },
                    totalDownvotesOnReviews: { increment : voteType === "DOWNVOTE" ? 1 : 0 }
                }
            })
        ]);

        return res.status(200).json({
            success : true,
            message : "Vote added successfully."
        });
        
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(409).json({
            success : false,
            message : "Already voted for this review."
        });
      }
      else {
        return res.status(500).json({
            success : false,
            message : "Internal server error."
        });
      }
    }
}

// Reporting a review
export const reportReview = async (req, res) => {
    const { userId } = req.body;
    const { reviewId } = req.params;

    try{
        const review = await prisma.reviews.findUnique({
            where : { id : parseInt(reviewId) },
            select : { userId : true }
        })
    
        if(!review){
            return res.status(404).json({
                success: false,
                message: "Review not found."
            });
        }

        await prisma.report.create({
            data : {
                userId,
                reviewId: parseInt(reviewId),
                status: "PENDING"
            }
        });

        return res.status(200).json({
            success : true,
            message : "Report submitted successfully."
        });

    } catch(error){
        if (error.code === "P2002") {
            return res.status(409).json({
                success : false,
                message : "You have already reported this review."
            });
        }else {
            return res.status(500).json({
                success : false,
                message : "Internal server error."
            });
        }
    }
}