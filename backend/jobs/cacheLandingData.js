import prisma from "../prisma/index.js";
import { redis } from "../config/redis.js";

const CACHE_KEY = "landingPageData";

const randomColor = () => {
  const colors = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#3B82F6"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const cacheLandingData = async () => {
  try {
    const courses = await prisma.course.findMany({
      take: 3,
      where : { numRatings : { gt : 0 } },
      orderBy: [{ numRatings: "desc" }],
      include: {
        reviews: {
          select: {
            gradingDifficulty: true,
            academicWorkload: true,
            teachingQuality: true,
            courseContent: true,
            managementAndTAs: true,
          },
        },
        profs : true,
      },
    });

    const formattedCourses = courses.map((course) => {
      const total = course.reviews.length || 1;
      const avg = (key) =>
        course.reviews.reduce((sum, r) => sum + (r[key] || 0), 0) / total;

      return {
        name: course.courseName,
        code: course.courseCode,
        acronym: course.acronym,
        color: randomColor(),
        numProfessors: course.profs.length,
        ratings: course.numRatings,
        reviews: course.numReviews,
        teachingQuality: parseFloat(avg("teachingQuality").toFixed(1)),
        courseContent: parseFloat(avg("courseContent").toFixed(1)),
        academicWorkload: parseFloat(avg("academicWorkload").toFixed(1)),
        gradingDifficulty: parseFloat(avg("gradingDifficulty").toFixed(1)),
        managementAndTAs: parseFloat(avg("managementAndTAs").toFixed(1)),
      };
    });

    const topReviews = await prisma.reviews.findMany({
      take: 3,
      where : { contentWordCount : { gt : 2 } },
      orderBy: { netVotes: "desc" },
      include: { user: true, course: true, prof: true },
    });

    const formattedReviews = topReviews.map((r) => ({
      id: r.id,
      userName: r.anonymous ? "Anonymous" : r.user.username,
      avatarUrl: "/placeholder.svg?height=40&width=40",
      dateTime: r.createdAt,
      courseName: r.course.courseName,
      professor: r.prof.name,
      year: r.timeOfCourse,
      semester: r.sem,
      rating: r.averageRating,
      reviewText: r.content,
      upvotes: r.upvotes,
      downvotes: r.downvotes,
      userVote: null,
      anonymous: r.anonymous,
      color: randomColor(),
    }));

    const [ratingsCount, reviewsCount, usersCount, coursesCount, professorsCount] =
      await Promise.all([
        prisma.reviews.count(),
        prisma.reviews.count({
            where : { contentWordCount : { gt : 2 } }
        }),
        prisma.user.count(),
        prisma.course.count(),
        prisma.professor.count(),
      ]);

    const payload = {
      courses: formattedCourses,
      reviews: formattedReviews,
      targetCounts: {
        reviews: reviewsCount,
        ratings: ratingsCount,
        users: usersCount,
        courses: coursesCount,
        professors: professorsCount,
      },
    };

    await redis.set(CACHE_KEY, JSON.stringify(payload));
    console.log("Landing page data cached");
  } catch (err) {
    console.error("Error caching landing data:", err);
  }
};
