"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Wallet,
  Clock,
  Award,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
}

interface DashboardContentProps {
  user: User;
}

// Typewriter Hook with delay support
function useTypewriter(text: string, speed: number = 80, delay: number = 0) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    setDisplayText(""); // Reset on text change
    let i = 0;
    let typeTimer: NodeJS.Timeout;
    
    const startTimer = setTimeout(() => {
      typeTimer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typeTimer);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (typeTimer) clearInterval(typeTimer);
    };
  }, [text, speed, delay]); // All dependencies included

  return displayText;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const cardHoverVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3 },
  },
};

// Dynamic user data - initialized to zeros for new users
// TODO: Replace with actual data fetching from Supabase
interface UserData {
  enrolledCourses: number;
  completedCourses: number;
  upcomingPayments: number;
  totalSpent: number;
}

interface EnrolledCourse {
  id: number;
  title: string;
  progress: number;
  nextLesson: string;
  mode: string;
  isInstallment: boolean;
  installmentsPaid?: number;
  totalInstallments?: number;
  amountPaid?: number;
  totalAmount?: number;
}

interface UpcomingPayment {
  course: string;
  amount: number;
  dueDate: string;
}

interface RecentActivityItem {
  action: string;
  course: string;
  time: string;
}

// Default empty data for new users
const getDefaultUserData = (): UserData => ({
  enrolledCourses: 0,
  completedCourses: 0,
  upcomingPayments: 0,
  totalSpent: 0,
});

const getDefaultEnrolledCourses = (): EnrolledCourse[] => [];
const getDefaultUpcomingPayments = (): UpcomingPayment[] => [];
const getDefaultRecentActivity = (): RecentActivityItem[] => [];

export default function DashboardContent({ user }: DashboardContentProps) {
  // State for dynamic data - initialized with empty/zero values for new users
  const [userData, setUserData] = useState<UserData>(getDefaultUserData());
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>(getDefaultEnrolledCourses());
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>(getDefaultUpcomingPayments());
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>(getDefaultRecentActivity());

  // TODO: Fetch actual user data from Supabase when enrollments/payments tables are ready
  // useEffect(() => {
  //   async function fetchUserData() {
  //     if (user.id) {
  //       // Fetch enrollments, payments, etc. from Supabase
  //     }
  //   }
  //   fetchUserData();
  // }, [user.id]);

  const welcomeText = `Welcome, ${user.name || "User"}! 👋`;
  const displayedText = useTypewriter(welcomeText, 80, 0); // 80ms speed, no delay
  const subtitleText = useTypewriter(
    "Here's what's happening with your learning journey",
    80,
    welcomeText.length * 80 + 500 // Start after welcome text finishes + 500ms pause
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 transition-colors duration-300">
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Welcome Section with Typewriter */}
          <motion.div variants={itemVariants} className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent min-h-[3rem]"
            >
              {displayedText}
              <span className="animate-pulse">|</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 dark:text-gray-300 text-base sm:text-lg min-h-[1.75rem]"
            >
              {subtitleText}
              {subtitleText && subtitleText.length > 0 && subtitleText.length < 50 && (
                <span className="animate-pulse">|</span>
              )}
            </motion.p>
          </motion.div>

          {/* Quick Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {[
              {
                title: "Enrolled Courses",
                value: userData.enrolledCourses,
                icon: BookOpen,
                gradient: "from-blue-500 to-blue-600",
                delay: 0.1,
              },
              {
                title: "Completed",
                value: userData.completedCourses,
                icon: Award,
                gradient: "from-green-500 to-green-600",
                delay: 0.2,
              },
              {
                title: "Upcoming Payments",
                value: userData.upcomingPayments,
                icon: Calendar,
                gradient: "from-orange-500 to-orange-600",
                delay: 0.3,
              },
              {
                title: "Total Spent",
                value: `₦${userData.totalSpent.toLocaleString()}`,
                icon: Wallet,
                gradient: "from-purple-500 to-purple-600",
                delay: 0.4,
              },
            ].map((stat) => (
              <motion.div
                key={stat.title}
                variants={cardHoverVariants}
                whileHover="hover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: stat.delay }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <stat.icon className="w-10 h-10 opacity-80" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Enrolled Courses Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  My Courses
                </h2>
                <Link href="/dashboard/courses">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 font-medium"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>

              {enrolledCourses.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No courses yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You haven&apos;t enrolled in any courses yet. Start your learning journey today!
                  </p>
                  <Link href="/courses">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium"
                    >
                      Browse Courses
                    </motion.button>
                  </Link>
                </motion.div>
              ) : (
                enrolledCourses.map((course: EnrolledCourse, index: number) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                              {course.title}
                            </h3>
                            <span className="inline-block px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full mt-2 font-medium">
                              {course.mode}
                            </span>
                          </div>
                        </div>
                        {/* Payment status badge */}
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {course.isInstallment 
                            ? `₦${course.amountPaid?.toLocaleString()} of ₦${course.totalAmount?.toLocaleString()} paid`
                            : "Fully Paid"
                          }
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                              Payment Progress {course.isInstallment ? `(${course.installmentsPaid}/${course.totalInstallments})` : ""}
                            </span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Upcoming Payments */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                    <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    Upcoming Payments
                  </h3>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  {upcomingPayments.length === 0 ? (
                    <div className="text-center py-4">
                      <Calendar className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No upcoming payments scheduled
                      </p>
                    </div>
                  ) : (
                    upcomingPayments.map((payment: UpcomingPayment, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl space-y-2 border border-orange-100 dark:border-orange-800"
                      >
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                          {payment.course}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                            ₦{payment.amount.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            Due {payment.dueDate}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                  <Link href="/dashboard/payments">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-700 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 font-medium text-gray-900 dark:text-white transition-colors"
                    >
                      View All Payments
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                  <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Recent Activity
                  </h3>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-4">
                      <Clock className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No recent activity
                      </p>
                    </div>
                  ) : (
                    recentActivity.map((activity: RecentActivityItem, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="flex gap-3 items-start"
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3,
                          }}
                          className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {activity.course}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}