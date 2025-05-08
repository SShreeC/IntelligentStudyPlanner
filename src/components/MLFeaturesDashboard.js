
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import LoggedInNavBar from "./LoggedInNavBar";
// import { motion } from "framer-motion";
// import { Book, BarChart3, Clock, BrainCircuit, ClipboardList, AlertTriangle } from "lucide-react";
// import UserPreferencesForm from "./userInputs";
// const features = [
//     {
//         title: "Adaptive Study Plan",
//         description: "Get a personalized study schedule based on your past study patterns, subject difficulty, and available time.",
//         icon: <Book size={40} className="text-blue-600" />,
//         route: "/adaptive-study-plan",
//         gradient: "from-blue-500/20 to-purple-500/20"
//     },
//     {
//         title: "Study Time Prediction",
//         description: "Predict how much study time you need based on past hours, test scores, deadlines, and focus levels.",
//         icon: <Clock size={40} className="text-purple-600" />,
//         route: "/studyTime",
//         gradient: "from-purple-500/20 to-pink-500/20"
//     },
//     {
//         title: "Quiz Generator",
//         description: "Generate quizzes automatically for any topic with mixed difficulty levels and question types.",
//         icon: <ClipboardList size={40} className="text-indigo-600" />,
//         route: "/quiz",
//         gradient: "from-indigo-500/20 to-blue-500/20"
//     },
//     {
//         title: "Progress Prediction",
//         description: "Predict syllabus completion percentage based on study hours, topics covered, and quiz scores.",
//         icon: <BarChart3 size={40} className="text-blue-600" />,
//         route: "/progress_predict",
//         gradient: "from-blue-500/20 to-cyan-500/20"
//     },
//     {
//         title: "Exam Readiness Analysis",
//         description: "Analyze your preparedness for exams based on study patterns, test scores, and performance trends.",
//         icon: <BrainCircuit size={40} className="text-cyan-600" />,
//         route: "/exam_ready",
//         gradient: "from-cyan-500/20 to-teal-500/20"
//     },
//     {
//         title: "Weakness Prediction",
//         description: "Identify subjects or topics where you need improvement based on your performance trends.",
//         icon: <AlertTriangle size={40} className="text-teal-600" />,
//         route: "/weak_sub",
//         gradient: "from-teal-500/20 to-emerald-500/20"
//     }
// ];


// const MLFeaturesDashboard = () => {
//     const navigate = useNavigate();

//     return (
//         <div className="min-h-screen gradient-bg">
//             <LoggedInNavBar />
//             <div className="flex justify-end p-4">

// </div>

//             <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
//                 <div className="text-center mb-12">
//                     <motion.h1 
//                         className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         AI-Powered Study Tools
//                     </motion.h1>
//                     <motion.p 
//                         className="text-gray-600 text-lg max-w-2xl mx-auto"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.2 }}
//                     >
//                         Enhance your learning journey with our intelligent study tools
//                     </motion.p>
//                 </div>
                
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {features.map((feature, index) => (
//                         <motion.div
//                             key={index}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.1 }}
//                         >
//                             <div className="feature-card rounded-xl p-6 h-full">
//                                 <div className={`bg-gradient-to-br ${feature.gradient} rounded-lg p-8 mb-6`}>
//                                     <div className="icon-wrapper inline-block">
//                                         {feature.icon}
//                                     </div>
//                                 </div>
//                                 <h2 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h2>
//                                 <p className="text-gray-600 mb-6 text-sm leading-relaxed">{feature.description}</p>
//                                 <button 
//                                     onClick={() => navigate(feature.route)}
//                                     className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
//                                 >
//                                     Explore
//                                 </button>
//                             </div>
//                         </motion.div>
//                     ))}
//                 </div>
                
//             </div>
//         </div>
//     );
// };

// export default MLFeaturesDashboard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoggedInNavBar from "./LoggedInNavBar";
import { motion } from "framer-motion";
import {
    Book,
    BarChart3,
    Clock,
    BrainCircuit,
    ClipboardList,
    AlertTriangle,
    X,
    MessageCircle
} from "lucide-react";
import UserPreferencesForm from "./userInputs";
import PomodoroFocusTracker from "./focusTracker";
import FeedbackBox from "./feedbackInput";
const features = [
    {
        title: "Adaptive Study Plan",
        description: "Get a personalized study schedule based on your past study patterns, subject difficulty, and available time.",
        icon: <Book size={40} className="text-blue-600" />,
        route: "/adaptive-study-plan",
        gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
        title: "Study Time Prediction",
        description: "Predict how much study time you need based on past hours, test scores, deadlines, and focus levels.",
        icon: <Clock size={40} className="text-purple-600" />,
        route: "/studyTime",
        gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
        title: "Quiz Generator",
        description: "Generate quizzes automatically for any topic with mixed difficulty levels and question types.",
        icon: <ClipboardList size={40} className="text-indigo-600" />,
        route: "/quiz",
        gradient: "from-indigo-500/20 to-blue-500/20"
    },
    {
        title: "Progress Prediction",
        description: "Predict syllabus completion percentage based on study hours, topics covered, and quiz scores.",
        icon: <BarChart3 size={40} className="text-blue-600" />,
        route: "/progress_predict",
        gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        title: "Exam Readiness Analysis",
        description: "Analyze your preparedness for exams based on study patterns, test scores, and performance trends.",
        icon: <BrainCircuit size={40} className="text-cyan-600" />,
        route: "/exam_ready",
        gradient: "from-cyan-500/20 to-teal-500/20"
    },
    {
        title: "Weakness Prediction",
        description: "Identify subjects or topics where you need improvement based on your performance trends.",
        icon: <AlertTriangle size={40} className="text-teal-600" />,
        route: "/weak_sub",
        gradient: "from-teal-500/20 to-emerald-500/20"
    }
];

const MLFeaturesDashboard = () => {
    const navigate = useNavigate();
    const [showTracker, setShowTracker] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState(false);

    return (
        <div className="min-h-screen relative">
            <LoggedInNavBar />

            {/* Floating Action Buttons - Top Right */}
            <div className="bg-white fixed top-24 right-6 z-50 flex flex-col items-end space-y-4">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTracker(true)}
                className="bg-white text-blue p-4 rounded-full shadow-xl hover:shadow-2xl transition duration-300"
                title="Start Focus Session"
            >
                <Clock size={24} className="text-blue" />
            </motion.button>
            {showTracker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Focus Tracker</h2>
                            <button
                                onClick={() => setShowTracker(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <PomodoroFocusTracker />
                    </div>
                </div>
            )}
            {showPreferences && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">User Preferences</h2>
                            <button
                                onClick={() => setShowPreferences(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <UserPreferencesForm />
                    </div>
                </div>
            )}
            
             <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPreferences(true)}
                className="bg-white text-blue-600 px-5 py-2 rounded-xl shadow-md font-medium transition-all border border-blue-200"
            >
                Preferences
            </motion.button>
            </div>

            {/* Feedback Modal */}
            {feedbackModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Feedback</h2>
                    <button
                    onClick={() => setFeedbackModal(false)}
                    className="text-white-500 hover:text-gray-700"
                    >
                    <X size={20} />
                    </button>
                </div>
                <FeedbackBox />
                </div>
            </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <motion.h1
                className="text-4xl md:text-5xl font-bold text-blue-600 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                >
                AI-Powered Study Tools
                </motion.h1>
                <motion.p
                className="text-gray-600 text-lg max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                >
                Enhance your learning journey with our intelligent study tools
                </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                >
                    <div className="h-full bg-white rounded-2xl p-8 border shadow-lg hover:shadow-xl transition-all duration-300 relative">
                    <div className={`bg-gradient-to-br rounded-xl p-8 mb-6 ${feature.gradient}`}>
                        <div className="icon-wrapper inline-block">{feature.icon}</div>
                    </div>
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">{feature.title}</h2>
                    <p className="text-gray-600 mb-6 text-sm leading-relaxed">{feature.description}</p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(feature.route)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        Explore
                    </motion.button>
                    <button
                        onClick={() => setFeedbackModal(true)}
                        className="absolute bottom-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-full shadow-md transition-all"
                        title="Give Feedback"
                    >
                        <MessageCircle size={20} />
                    </button>
                    </div>
                </motion.div>
                ))}
            </div>
            </div>
        </div>
        );
};

export default MLFeaturesDashboard;
