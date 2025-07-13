-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('CB', 'ECE', 'CSE', 'HCD', 'MTH', 'SSH');

-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII');

-- CreateEnum
CREATE TYPE "CourseSemester" AS ENUM ('WINTER', 'MONSOON', 'SUMMER', 'MONSOONWINTER');

-- CreateEnum
CREATE TYPE "Branch" AS ENUM ('CSAI', 'CSE', 'CSAM', 'CSD', 'CSB', 'CSSS', 'ECE', 'EVE');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('Completed', 'Repeated', 'Dropped');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REJECTED', 'APPROVED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "batch" INTEGER NOT NULL,
    "branch" "Branch" NOT NULL,
    "about" TEXT,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalUpvotesOnReviews" INTEGER NOT NULL DEFAULT 0,
    "totalDownvotesOnReviews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "department" "Department",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "courseName" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "acronym" TEXT NOT NULL,
    "sem" "CourseSemester" NOT NULL,
    "numRatings" INTEGER NOT NULL DEFAULT 0,
    "numReviews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "vectors" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "profId" INTEGER NOT NULL,
    "gradingDifficulty" INTEGER NOT NULL,
    "academicWorkload" INTEGER NOT NULL,
    "teachingQuality" INTEGER NOT NULL,
    "courseContent" INTEGER NOT NULL,
    "managementAndTAs" INTEGER NOT NULL,
    "averageRating" INTEGER NOT NULL,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "timeOfCourse" INTEGER NOT NULL,
    "sem" "Semester" NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "courseStatus" "CourseStatus" NOT NULL DEFAULT 'Completed',
    "contentWordCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewVotes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "voteType" "VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewVotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "userId" INTEGER NOT NULL,
    "badgeId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("userId","badgeId")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseToProfessor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CourseToProfessor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Course_courseCode_key" ON "Course"("courseCode");

-- CreateIndex
CREATE UNIQUE INDEX "Course_acronym_key" ON "Course"("acronym");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_userId_courseId_timeOfCourse_courseStatus_key" ON "Reviews"("userId", "courseId", "timeOfCourse", "courseStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_name_key" ON "Badge"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewVotes_userId_reviewId_key" ON "ReviewVotes"("userId", "reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_userId_reviewId_key" ON "Report"("userId", "reviewId");

-- CreateIndex
CREATE INDEX "_CourseToProfessor_B_index" ON "_CourseToProfessor"("B");

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_profId_fkey" FOREIGN KEY ("profId") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewVotes" ADD CONSTRAINT "ReviewVotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewVotes" ADD CONSTRAINT "ReviewVotes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToProfessor" ADD CONSTRAINT "_CourseToProfessor_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToProfessor" ADD CONSTRAINT "_CourseToProfessor_B_fkey" FOREIGN KEY ("B") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
