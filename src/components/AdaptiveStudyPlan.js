
// import React, { useState, useEffect } from "react";
// import { predictStudyPlan } from "../services/api";

// const AdaptiveStudyPlan = () => {
//     const [examDate, setExamDate] = useState("");
//     const [subjectData, setSubjectData] = useState([]);
//     const [result, setResult] = useState(null);
//     const [error, setError] = useState(null);
//     const [timeLeft, setTimeLeft] = useState(null);

//     // Load subjects and study data from localStorage on component mount
//     useEffect(() => {
//         loadStudyData();
//     }, []);

//     // Function to load study data from localStorage
//     const loadStudyData = () => {
//         try {
//             // Method 1: Try to get from taskScheduleDataForML like ProgressPrediction component
//             const mlDataRaw = localStorage.getItem("taskScheduleDataForML");
//             if (mlDataRaw) {
//                 const parsed = JSON.parse(mlDataRaw);
//                 const studyTasks = parsed.filter(task => 
//                     task.taskType && task.taskType.toLowerCase() === "study"
//                 );
                
//                 // Group by subject
//                 const subjectMap = {};
//                 studyTasks.forEach(task => {
//                     const subject = task.subject || "Unnamed Subject";
//                     if (!subjectMap[subject]) {
//                         subjectMap[subject] = {
//                             name: subject,
//                             totalHours: 0,
//                             difficulty: 3 // Default difficulty
//                         };
//                     }
//                     subjectMap[subject].totalHours += (task.durationMinutes || 0) / 60;
//                 });
                
//                 const studyData = Object.values(subjectMap).map(subject => ({
//                     ...subject,
//                     totalHours: parseFloat(subject.totalHours.toFixed(2))
//                 }));
                
//                 setSubjectData(studyData);
//                 return;
//             }
            
//             // Method 2: Fallback to tasks in localStorage
//             const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//             const studyTasks = tasks.filter(task => task.taskType === "study");
            
//             // Group by subject
//             const subjectMap = {};
//             studyTasks.forEach(task => {
//                 const subject = task.subject || "Unnamed Subject";
//                 if (!subjectMap[subject]) {
//                     subjectMap[subject] = {
//                         name: subject,
//                         totalHours: 0,
//                         difficulty: 3 // Default difficulty
//                     };
//                 }
//                 subjectMap[subject].totalHours += Number(task.timeSpent || 0);
//             });
            
//             const studyData = Object.values(subjectMap);
//             setSubjectData(studyData);
//         } catch (err) {
//             console.error("Error loading study data from localStorage:", err);
//             setError("Failed to load your study history.");
//         }
//     };

//     // Calculate days between today and exam date
//     const calculateDaysLeft = (examDateStr) => {
//         const today = new Date();
//         const examDay = new Date(examDateStr);
        
//         // Reset time portion for accurate day calculation
//         today.setHours(0, 0, 0, 0);
//         examDay.setHours(0, 0, 0, 0);
        
//         const diffTime = examDay - today;
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
//         return diffDays > 0 ? diffDays : 0; // Ensure non-negative
//     };

//     // Handle exam date change
//     const handleExamDateChange = (e) => {
//         const newDate = e.target.value;
//         setExamDate(newDate);
//         const days = calculateDaysLeft(newDate);
//         setTimeLeft(days);
//     };

//     // Handle difficulty change for a subject
//     const handleDifficultyChange = (index, value) => {
//         const updatedSubjects = [...subjectData];
//         updatedSubjects[index].difficulty = parseInt(value);
//         setSubjectData(updatedSubjects);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setResult(null);

//         try {
//             if (timeLeft <= 0) {
//                 setError("Please select a future date for your exam.");
//                 return;
//             }

//             if (subjectData.length === 0) {
//                 setError("No study data found. Please log some study sessions first.");
//                 return;
//             }

//             // Format data for API
//             const formattedInput = {
//                 study_logs: subjectData.map(subject => subject.totalHours),
//                 subject_difficulty: subjectData.map(subject => subject.difficulty),
//                 time_left: timeLeft
//             };

//             const response = await predictStudyPlan(formattedInput);
            
//             if (response.status === "success" && response.prediction) {
//                 // Combine subject names with predicted hours
//                 const namedResults = response.prediction.map((hours, index) => ({
//                     name: subjectData[index].name,
//                     hours: hours
//                 }));
//                 setResult(namedResults);
//             } else {
//                 setError("Failed to generate study plan.");
//             }
//         } catch (err) {
//             console.error("Error generating study plan:", err);
//             setError("Error fetching data.");
//         }
//     };

//     return (
//         <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
//             <h2 className="text-2xl font-semibold text-center mb-4">📖 Adaptive Study Plan</h2>
//             <p className="text-gray-500 text-center mb-6">
//                 Get a personalized study schedule based on your study history and exam timeline.
//             </p>

//             {subjectData.length > 0 ? (
//                 <div className="mb-6 bg-gray-50 p-4 rounded-lg">
//                     <h3 className="font-medium mb-3">📚 Your Study History</h3>
//                     <ul className="space-y-3">
//                         {subjectData.map((subject, index) => (
//                             <li key={index} className="flex items-center justify-between">
//                                 <span className="text-gray-700">{subject.name}: {subject.totalHours.toFixed(1)} hours</span>
//                                 <div className="ml-4">
//                                     <select 
//                                         value={subject.difficulty}
//                                         onChange={(e) => handleDifficultyChange(index, e.target.value)}
//                                         className="border rounded p-1 text-sm"
//                                     >
//                                         <option value="1">Easy</option>
//                                         <option value="2">Somewhat Easy</option>
//                                         <option value="3">Medium</option>
//                                         <option value="4">Difficult</option>
//                                         <option value="5">Very Difficult</option>
//                                     </select>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             ) : (
//                 <div className="mb-6 bg-yellow-50 p-4 rounded-lg text-yellow-700 border border-yellow-200">
//                     No study data found. Please log some study sessions first.
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg shadow-sm">
//                 {/* Exam Date */}
//                 <label className="block text-gray-700 font-medium mb-2">📅 Exam Date:</label>
//                 <input 
//                     type="date" 
//                     value={examDate} 
//                     onChange={handleExamDateChange} 
//                     className="w-full p-2 border rounded-md mb-4"
//                     required 
//                 />

//                 {timeLeft !== null && (
//                     <div className="text-gray-700 mb-4">
//                         <p>⏳ Days until exam: <strong>{timeLeft}</strong></p>
//                     </div>
//                 )}

//                 <button 
//                     type="submit"
//                     className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition duration-200"
//                     disabled={subjectData.length === 0}
//                 >
//                     Generate Study Plan
//                 </button>
//             </form>

//             {/* Display Results */}
//             {result && (
//                 <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg shadow-sm">
//                     <h3 className="text-lg font-semibold text-green-700">✅ Recommended Study Hours</h3>
//                     <ul className="mt-3 text-gray-800">
//                         {result.map((item, index) => (
//                             <li key={index} className="py-2 text-md">
//                                 <strong>{item.name}:</strong> {item.hours.toFixed(2)} hours
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             {/* Display Errors */}
//             {error && (
//                 <p className="text-red-600 text-center mt-4 p-2 bg-red-50 border border-red-300 rounded-lg">
//                     {error}
//                 </p>
//             )}
//         </div>
//     );
// };

// export default AdaptiveStudyPlan;



import React, { useState, useEffect } from "react";
import { predictStudyPlan } from "../services/api";
import { motion } from "framer-motion";
import LoggedInNavBar from "../components/LoggedInNavBar";

const AdaptiveStudyPlan = () => {
    const [examDate, setExamDate] = useState("");
    const [subjectData, setSubjectData] = useState([]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

    // Load subjects and study data from localStorage on component mount
    useEffect(() => {
        loadStudyData();
    }, []);

    // Function to load study data from localStorage
    const loadStudyData = () => {
        try {
            // Method 1: Try to get from taskScheduleDataForML like ProgressPrediction component
            const mlDataRaw = localStorage.getItem("taskScheduleDataForML");
            if (mlDataRaw) {
                const parsed = JSON.parse(mlDataRaw);
                const studyTasks = parsed.filter(task => 
                    task.taskType && task.taskType.toLowerCase() === "study"
                );
                
                // Group by subject
                const subjectMap = {};
                studyTasks.forEach(task => {
                    const subject = task.subject || "Unnamed Subject";
                    if (!subjectMap[subject]) {
                        subjectMap[subject] = {
                            name: subject,
                            totalHours: 0,
                            difficulty: 3 // Default difficulty
                        };
                    }
                    subjectMap[subject].totalHours += (task.durationMinutes || 0) / 60;
                });
                
                const studyData = Object.values(subjectMap).map(subject => ({
                    ...subject,
                    totalHours: parseFloat(subject.totalHours.toFixed(2))
                }));
                
                setSubjectData(studyData);
                return;
            }
            
            // Method 2: Fallback to tasks in localStorage
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const studyTasks = tasks.filter(task => task.taskType === "study");
            
            // Group by subject
            const subjectMap = {};
            studyTasks.forEach(task => {
                const subject = task.subject || "Unnamed Subject";
                if (!subjectMap[subject]) {
                    subjectMap[subject] = {
                        name: subject,
                        totalHours: 0,
                        difficulty: 3 // Default difficulty
                    };
                }
                subjectMap[subject].totalHours += Number(task.timeSpent || 0);
            });
            
            const studyData = Object.values(subjectMap);
            setSubjectData(studyData);
        } catch (err) {
            console.error("Error loading study data from localStorage:", err);
            setError("Failed to load your study history.");
        }
    };

    // Calculate days between today and exam date
    const calculateDaysLeft = (examDateStr) => {
        const today = new Date();
        const examDay = new Date(examDateStr);
        
        // Reset time portion for accurate day calculation
        today.setHours(0, 0, 0, 0);
        examDay.setHours(0, 0, 0, 0);
        
        const diffTime = examDay - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays > 0 ? diffDays : 0; // Ensure non-negative
    };

    // Handle exam date change
    const handleExamDateChange = (e) => {
        const newDate = e.target.value;
        setExamDate(newDate);
        const days = calculateDaysLeft(newDate);
        setTimeLeft(days);
    };

    // Handle difficulty change for a subject
    const handleDifficultyChange = (index, value) => {
        const updatedSubjects = [...subjectData];
        updatedSubjects[index].difficulty = parseInt(value);
        setSubjectData(updatedSubjects);
    };

    // Get personalized tip based on difficulty and allocated hours
    const getPersonalizedTip = (difficulty, hours) => {
        if (difficulty >= 4) {
            return "👉 Focus more on this subject. It's challenging.";
        } else if (hours < 3) {
            return "✅ You're doing well. Just keep reviewing regularly.";
        } else {
            return "📝 Keep up consistent practice.";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        try {
            if (timeLeft <= 0) {
                setError("Please select a future date for your exam.");
                return;
            }

            if (subjectData.length === 0) {
                setError("No study data found. Please log some study sessions first.");
                return;
            }

            // Format data for API
            const formattedInput = {
                study_logs: subjectData.map(subject => subject.totalHours),
                subject_difficulty: subjectData.map(subject => subject.difficulty),
                time_left: timeLeft
            };

            const response = await predictStudyPlan(formattedInput);
            
            if (response.status === "success" && response.prediction) {
                // Combine subject names with predicted hours
                const namedResults = response.prediction.map((hours, index) => ({
                    name: subjectData[index].name,
                    hours: hours,
                    difficulty: subjectData[index].difficulty,
                    tip: getPersonalizedTip(subjectData[index].difficulty, hours)
                }));
                setResult(namedResults);
            } else {
                setError("Failed to generate study plan.");
            }
        } catch (err) {
            console.error("Error generating study plan:", err);
            setError("Error fetching data.");
        }
    };

    return (
        <div className="min-h-screen gradient-bg">
            <LoggedInNavBar />
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <motion.h2 
                    className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Adaptive Study Plan
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Input Form */}
                    <motion.div
                        className="feature-card p-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Your Study Parameters</h3>
                        
                        {subjectData.length > 0 ? (
                            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h4 className="font-medium mb-3 text-blue-800 flex items-center">
                                    <span className="mr-2">📚</span>
                                    Your Study History
                                </h4>
                                <div className="space-y-4">
                                    {subjectData.map((subject, index) => (
                                        <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-gray-700">{subject.name}</span>
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                    {subject.totalHours.toFixed(1)} hours
                                                </span>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">
                                                    Difficulty (1-5)
                                                </label>
                                                <div className="flex items-center">
                                                    <input 
                                                        type="range" 
                                                        min="1" 
                                                        max="5" 
                                                        value={subject.difficulty}
                                                        onChange={(e) => handleDifficultyChange(index, e.target.value)}
                                                        className="w-full mr-3"
                                                    />
                                                    <span className="font-semibold w-8 text-center">
                                                        {subject.difficulty}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                    <span>Easy</span>
                                                    <span>Hard</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-6 bg-yellow-50 p-4 rounded-lg text-yellow-700 border border-yellow-200">
                                <div className="flex items-center">
                                    <span className="text-xl mr-2">⚠️</span>
                                    <span>No study data found. Please log some study sessions first.</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Exam Date */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    <span className="mr-2">📅</span>
                                    Exam Date
                                </label>
                                <input 
                                    type="date" 
                                    value={examDate} 
                                    onChange={handleExamDateChange} 
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required 
                                />
                            </div>

                            {timeLeft !== null && (
                                <div className="p-3 bg-purple-50 rounded-lg flex items-center">
                                    <span className="text-xl mr-2">⏳</span>
                                    <span className="text-purple-800">
                                        Days until exam: <strong>{timeLeft}</strong>
                                    </span>
                                </div>
                            )}

                            <motion.button 
                                type="submit"
                                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={subjectData.length === 0}
                            >
                                Generate Study Plan
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Right Column: Results */}
                    <motion.div
                        className="feature-card p-8"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Study Plan Results</h3>
                        
                        {result ? (
                            <div className="space-y-6">
                                {/* Results Header */}
                                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                                    <h4 className="font-semibold text-green-800 flex items-center">
                                        <span className="mr-2">📊</span>
                                        Recommended Study Hours Allocation
                                    </h4>
                                    <p className="text-sm text-green-700 mt-1">
                                        Based on your study history and exam timeline
                                    </p>
                                </div>
                                
                                {/* Results List */}
                                <div className="space-y-3">
                                    {result.map((item, index) => (
                                        <div 
                                            key={index}
                                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <h5 className="font-semibold text-gray-800">
                                                    🔹 {item.name}
                                                </h5>
                                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                    {item.hours.toFixed(1)} hours
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center text-sm text-gray-600 mb-3">
                                                <span className="mr-2">Difficulty:</span>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span 
                                                            key={i} 
                                                            className={`w-4 h-4 rounded-full mx-0.5 ${
                                                                i < item.difficulty 
                                                                    ? 'bg-yellow-500' 
                                                                    : 'bg-gray-200'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <p className="text-gray-700 bg-gray-50 p-2 rounded">
                                                {item.tip}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Motivational Note */}
                                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <h4 className="font-semibold text-purple-800 flex items-center mb-2">
                                        <span className="mr-2">✨</span>
                                        Tips for Success
                                    </h4>
                                    <ul className="space-y-2 text-purple-700">
                                        <li className="flex items-start">
                                            <span className="mr-2">🎯</span>
                                            <span>Break long sessions into short ones. Stay consistent.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">🧠</span>
                                            <span>Use active recall techniques for better retention.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">🚀</span>
                                            <span>You've got this! All the best for your exams!</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="p-5 bg-red-50 border border-red-300 rounded-lg text-center">
                                <div className="text-3xl mb-2">⚠️</div>
                                <p className="text-red-600 font-medium">{error}</p>
                                <button 
                                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                                    onClick={() => setError(null)}
                                >
                                    Dismiss
                                </button>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                                <p className="text-gray-500 text-center">
                                    Fill in the parameters on the left and click "Generate Study Plan" to see your personalized recommendations
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdaptiveStudyPlan;