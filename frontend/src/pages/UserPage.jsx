import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import "@/styles/scrollAnimation.css";
import ExpandableCard from "@/components/ExpandableCard";
import { branches, years } from "@/utils/constants";
import { useUserProfileData } from "@/hooks/useUserProfileData";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { CONFIG } from "@/Config";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { userStateAtom } from "@/store/atoms/userAtom";
import { format } from "date-fns";

export default function UserPage() {
  const backendUrl = CONFIG.backendUrl;
  const [active, setActive] = useState(null);
  const [reported, setReported] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { username } = useParams();
  const { userProfileData, loading, error } = useUserProfileData(username);

  const userData = useRecoilValue(userStateAtom);

  const [studentInfo, setStudentInfo] = useState({});
  const [formValues, setFormValues] = useState({});

  const userProfileReviews = userProfileData.reviews;
  const userBadges = userProfileData.badges;

  const handleOpenModal = () => {
    setFormValues({ ...studentInfo });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    setStudentInfo({ ...formValues });
    setIsModalOpen(false);
    const { data } = await axios.put(`${backendUrl}/api/v1/user/`, {
      data: {
        branch: formValues.branch,
        batch: formValues.batch,
        about: formValues.about,
      },
    });

    if (data.success) {
      toast.success("User data updated successfully.");
    } else {
      toast.error("Error updating user data.");
    }
  };

  const handleAboutChange = (e) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setFormValues({ ...formValues, about: value });
    }
  };

  useEffect(() => {
    if (userProfileData) {
      setStudentInfo(userProfileData);
      setFormValues({ ...studentInfo });
    }
  }, [userProfileData]);

  useEffect(() => {
    if (error?.response?.status === 404) {
      navigate("*");
    }
  }, [error, navigate]);

  if (loading && !formValues && !userProfileData && !userData) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <AnimatePresence>
        {(active && typeof active === "object") || reported !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-xl bg-black/30 h-full w-full z-[100]"
          />
        ) : null}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#161616] min-h-screen py-6 px-4">
        <div className="max-w-screen-xl mx-auto flex gap-6 items-center">
          {/* Left Column */}
          <div className="w-1/3 h-fit flex flex-col space-y-4">
            <Card className="bg-zinc-100 dark:bg-[#1C1C1C] border-gray-300 dark:border-zinc-700 text-black dark:text-gray-200 shadow-lg p-6 space-y-6">
              <CardHeader className="flex flex-row items-center p-0 space-x-4">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="w-32 h-32">
                    {/* <AvatarImage src={studentInfo.avatarUrl} /> */}
                    <AvatarFallback className="rounded-full flex items-center justify-center font-bold text-white bg-blue-500 text-7xl">
                      {studentInfo.username?.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`inline-flex items-center rounded-full px-4 py-1.5 font-semibold transition-colors justify-center text-sm w-max ${
                      userProfileData.role === "ADMIN"
                        ? "bg-red-600 text-white"
                        : "bg-[#22C55E] text-[#193925]"
                    }`}
                  >
                    {userProfileData.role === "ADMIN" ? "Admin" : "Student"}
                  </div>
                </div>

                <div className="flex flex-col items-start space-y-2">
                  <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
                      {studentInfo.username}
                    </h1>
                    {username === userData.username ? (
                      <div className="relative group cursor-pointer">
                        <PencilSquareIcon
                          className="h-6 w-6 text-gray-800 dark:text-gray-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"
                          onClick={handleOpenModal}
                        />
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black dark:bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                          Edit
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <a
                    href={`mailto:${studentInfo ? studentInfo.email : "email"}`}
                    className="flex items-center gap-2 text-gray-800 dark:text-gray-400 text-md hover:text-cyan-300 transition-colors font-medium"
                  >
                    <Mail className="h-5 w-5" />
                    <span>{studentInfo.email}</span>
                  </a>

                  <div className="text-black dark:text-gray-300 text-md">
                    {studentInfo.branch &&
                      studentInfo.batch &&
                      `${
                        studentInfo.branch
                      } | B.Tech ${studentInfo.batch.toString()}`}
                    {studentInfo.branch &&
                      !studentInfo.batch &&
                      `${studentInfo.branch} | B.Tech`}
                    {!studentInfo.branch &&
                      studentInfo.batch &&
                      `B.Tech ${studentInfo.batch.toString()}`}
                    {!studentInfo.branch && !studentInfo.batch && `B.Tech`}
                  </div>

                  <div className="font-medium text-black dark:text-gray-300">
                    Contribution :{" "}
                    <span
                      className={`font-bold ${
                        studentInfo.contributions > 0
                          ? "text-green-600 dark:text-green-400"
                          : studentInfo.contributions === 0
                          ? "text-zinc-800 dark:text-zinc-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {studentInfo.contributions}
                    </span>
                  </div>

                  <div className="text-black dark:text-gray-300">
                    <span className="text-black dark:text-gray-300 font-medium">
                      Member Since :
                    </span>
                    {studentInfo.createdAt &&
                      " " +
                        format(
                          new Date(studentInfo.createdAt),
                          "MMMM do, yyyy"
                        )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <p className="ml-4 mr-4 mb-4">{studentInfo.about}</p>
                <div className="flex flex-col items-center space-y-4">
                  <hr className="w-full border-t border-zinc-700" />
                  <h1 className="text-2xl font-bold tracking-tight">
                    Achievements
                  </h1>
                  {userBadges?.length === 0 ? (
                    <div className="text-gray-400">No Badges Earned Yet.</div>
                  ) : (
                    "Yaha badges aaenge"
                  )}
                  <div className="grid grid-cols-4 gap-6 w-fit"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="w-2/3 flex flex-col space-y-4">
            <ExpandableCard
              reviewData={userProfileReviews}
              active={active}
              setActive={setActive}
              reported={reported}
              setReported={setReported}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" />

          {/* Modal Card */}
          <Card className="relative z-10 w-full max-w-md mx-auto bg-white dark:bg-[#1C1C1C] border-2 border-zinc-300 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-black dark:text-white text-center">
                Edit Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="branches"
                  className="text-sm font-medium text-black dark:text-gray-200"
                >
                  Branch
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormValues((prevState) => ({
                      ...prevState,
                      ["branch"]: value,
                    }))
                  }
                >
                  <SelectTrigger
                    id="branch"
                    className="py-2 border-gray-300 focus:outline-none font-medium text-black dark:text-gray-200"
                  >
                    <SelectValue
                      placeholder={formValues.branch || "Select your branch"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.name} value={branch.code}>
                        {`${branch.name} (${branch.code})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="batch"
                  className="text-sm font-medium text-black dark:text-gray-200"
                >
                  Batch Year
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormValues((prevState) => ({
                      ...prevState,
                      ["batch"]: value,
                    }))
                  }
                >
                  <SelectTrigger
                    id="batch"
                    className="py-2 border-gray-300 focus:outline-none font-medium text-black dark:text-gray-200"
                  >
                    <SelectValue
                      placeholder={formValues.batch || "Select your batch"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((batch) => (
                      <SelectItem key={batch} value={batch}>
                        {batch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="about"
                  className="text-black dark:text-gray-200"
                >
                  About
                </Label>
                <div>
                  <Textarea
                    id="about"
                    value={formValues.about}
                    onChange={handleAboutChange}
                    className="h-32 resize-none rounded-md border-2 border-gray-300 dark:border-gray-600 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-200 ring-offset-background focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  <p className="text-sm text-gray-800 dark:text-gray-400 mt-1">
                    {formValues.about?.length}/200 characters
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="danger" onClick={handleCloseModal}>
                Discard
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
