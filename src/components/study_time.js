
// import React, { useState, useEffect } from "react";
// import { predictStudyTime } from "../services/study_timeAPI";
// import { motion } from "framer-motion";

// const StudyTimePrediction = () => {
//     const [subjects, setSubjects] = useState([]);
//     const [selectedSubject, setSelectedSubject] = useState("");

//     const [inputData, setInputData] = useState({
//         past_study_hours: 0.0,
//         test_scores: 75,
//         subject_difficulty: 2,
//         upcoming_deadlines: 10,
//         focus_level: 4
//     });

//     const [result, setResult] = useState(null);
//     const [error, setError] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         loadSubjectsFromLocalStorage();
//     }, []);

//     const loadSubjectsFromLocalStorage = () => {
//         const mlDataRaw = localStorage.getItem("taskScheduleDataForML");
//         if (mlDataRaw) {
//             try {
//                 const parsed = JSON.parse(mlDataRaw);
//                 const studySubjects = [...new Set(parsed
//                     .filter(task => task.taskType.toLowerCase() === "study")
//                     .map(task => task.subject)
//                 )];
//                 setSubjects(studySubjects);
//             } catch (e) {
//                 console.error("Failed to parse study subjects", e);
//             }
//         }
//         setIsLoading(false);
//     };

//     const handleSubjectChange = (e) => {
//         const subject = e.target.value;
//         setSelectedSubject(subject);
//         calculatePastStudyHours(subject);
//         normalizeQuizScores(subject);
//     };

//     const calculatePastStudyHours = (subject) => {
//         try {
//             const mlDataRaw = localStorage.getItem("taskScheduleDataForML");
//             if (!mlDataRaw) return;

//             const parsed = JSON.parse(mlDataRaw);
//             const subjectTasks = parsed.filter(
//                 task => task.taskType.toLowerCase() === "study" && task.subject === subject
//             );

//             const totalMinutes = subjectTasks.reduce((sum, task) => sum + task.durationMinutes, 0);
//             const totalHours = totalMinutes / 60;

//             setInputData(prev => ({
//                 ...prev,
//                 past_study_hours: parseFloat(totalHours.toFixed(2))
//             }));

//             console.log(`Study hours for subject "${subject}": ${totalHours.toFixed(2)}`);
//         } catch (e) {
//             console.error("Error calculating past study hours", e);
//         }
//     };

//     const normalizeQuizScores = (subject) => {
//         try {
//             const rawScores = JSON.parse(localStorage.getItem("quizScores")) || [];

//             const subjectScores = rawScores.filter(
//                 q => q.metadata?.subject?.toLowerCase() === subject.toLowerCase()
//             );

//             if (subjectScores.length === 0) {
//                 setInputData(prev => ({
//                     ...prev,
//                     test_scores: 0
//                 }));
//                 return;
//             }

//             const normalized = subjectScores.map(q =>
//                 (q.score / (q.outOf || 10)) * 100
//             );

//             const avg = normalized.reduce((sum, score) => sum + score, 0) / normalized.length;

//             setInputData(prev => ({
//                 ...prev,
//                 test_scores: parseFloat(avg.toFixed(1))
//             }));

//             console.log(`Normalized scores for "${subject}":`, normalized);
//             console.log(`Average: ${avg.toFixed(1)}%`);
//         } catch (e) {
//             console.error("Error normalizing quiz scores:", e);
//         }
//     };

//     const handleChange = (e) => {
//         setInputData({ ...inputData, [e.target.name]: parseFloat(e.target.value) });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);

//         try {
//             const response = await predictStudyTime(inputData);
//             if (response.status === "success" && response.recommended_study_hours !== undefined) {
//                 setResult(response.recommended_study_hours);
//             } else {
//                 setError("Failed to predict study time.");
//             }
//         } catch (err) {
//             setError("Error fetching data.");
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
//                 <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
//                     <h2 className="text-2xl font-semibold text-gray-700">Loading study data...</h2>
//                     <div className="mt-4 mx-auto w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
//             <motion.div
//                 className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.3 }}
//             >
//                 <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📚 Study Time Prediction</h2>

//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     {/* Subject Dropdown */}
//                     <div>
//                         <label className="block text-gray-700 font-medium mb-1">Select Subject</label>
//                         <select
//                             value={selectedSubject}
//                             onChange={handleSubjectChange}
//                             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                             required
//                         >
//                             <option value="" disabled>Select a subject</option>
//                             {subjects.map((subj, idx) => (
//                                 <option key={idx} value={subj}>{subj}</option>
//                             ))}
//                         </select>
//                     </div>

                    
//                                         {Object.keys(inputData).map((key) => (
//                                             <div key={key}>
//                                                 <label className="block text-gray-700 font-medium capitalize">
//                                                     {key.replace(/_/g, " ")}:
//                                                     {(key === 'past_study_hours' || key === 'test_scores') && (
//                                                         <span className="text-xs text-blue-600 ml-2">(Auto-calculated)</span>
//                                                     )}
//                                                 </label>
//                                                 <input
//                                                     type="number"
//                                                     name={key}
//                                                     value={inputData[key]}
//                                                     onChange={handleChange}
//                                                     className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//                                                     required
//                                                     disabled={key === 'past_study_hours'}
//                                                     title={
//                                                         key === 'past_study_hours'
//                                                             ? 'Auto-calculated from selected subject schedule'
//                                                             : ''
//                                                     }
//                                                 />
//                                             </div>
//                                         ))}

//                                         <motion.button
//                                             type="submit"
//                                             className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
//                                             whileHover={{ scale: 1.05 }}
//                                         >
//                                             Predict Study Time
//                                         </motion.button>
//                                     </form>

//                                     {/* Display Results */}
//                 {result !== null && (
//                     <motion.div
//                         className="mt-6 p-5 bg-green-50 border border-green-400 rounded-xl shadow-lg text-center"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3 }}
//                     >
//                         <h3 className="text-xl font-semibold text-green-700">✅ Recommended Study Time</h3>
//                         <p className="text-3xl font-bold text-green-800 mt-2">{result.toFixed(2)} hours</p>
//                     </motion.div>
//                 )}

//                 {/* Display Errors */}
//                 {error && (
//                     <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
//                 )}
//             </motion.div>
//         </div>
//     );
// };

// export default StudyTimePrediction;
import React, { useState, useEffect } from "react";
import { predictStudyTime } from "../services/study_timeAPI";
import { motion } from "framer-motion";
import LoggedInNavBar from "../components/LoggedInNavBar";

const StudyTimePrediction = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");

    const [inputData, setInputData] = useState({
        past_study_hours: 0.0,
        test_scores: 75,
        subject_difficulty: 2,
        upcoming_deadlines: 10,
        focus_level: 4
    });

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSubjectsFromLocalStorage();
    }, []);

    const loadSubjectsFromLocalStorage = () => {
        const mlDataRaw = localStorage.getItem("taskScheduleDataForML");
        if (mlDataRaw) {
            try {
                const parsed = JSON.parse(mlDataRaw);
                const studySubjects = [...new Set(parsed
                    .filter(task => task.taskType.toLowerCase() === "study")
                    .map(task => task.subject)
                )];
                setSubjects(studySubjects);
            } catch (e) {
                console.error("Failed to parse study subjects", e);
            }
        }
        setIsLoading(false);
    };

    const handleSubjectChange = (e) => {
        const subject = e.target.value;
        setSelectedSubject(subject);
        calculatePastStudyHours(subject);
        normalizeQuizScores(subject);
    };

    const calculatePastStudyHours = (subject) => {
        try {
            const mlDataRaw = localStorage.getItem("taskScheduleDataForML");
            if (!mlDataRaw) return;

            const parsed = JSON.parse(mlDataRaw);
            const subjectTasks = parsed.filter(
                task => task.taskType.toLowerCase() === "study" && task.subject === subject
            );

            const totalMinutes = subjectTasks.reduce((sum, task) => sum + task.durationMinutes, 0);
            const totalHours = totalMinutes / 60;

            setInputData(prev => ({
                ...prev,
                past_study_hours: parseFloat(totalHours.toFixed(2))
            }));

            console.log(`Study hours for subject "${subject}": ${totalHours.toFixed(2)}`);
        } catch (e) {
            console.error("Error calculating past study hours", e);
        }
    };

    const normalizeQuizScores = (subject) => {
        try {
            const rawScores = JSON.parse(localStorage.getItem("quizScores")) || [];

            const subjectScores = rawScores.filter(
                q => q.metadata?.subject?.toLowerCase() === subject.toLowerCase()
            );

            if (subjectScores.length === 0) {
                setInputData(prev => ({
                    ...prev,
                    test_scores: 0
                }));
                return;
            }

            const normalized = subjectScores.map(q =>
                (q.score / (q.outOf || 10)) * 100
            );

            const avg = normalized.reduce((sum, score) => sum + score, 0) / normalized.length;

            setInputData(prev => ({
                ...prev,
                test_scores: parseFloat(avg.toFixed(1))
            }));

            console.log(`Normalized scores for "${subject}":`, normalized);
            console.log(`Average: ${avg.toFixed(1)}%`);
        } catch (e) {
            console.error("Error normalizing quiz scores:", e);
        }
    };

    const handleChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: parseFloat(e.target.value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await predictStudyTime(inputData);
            if (response.status === "success" && response.recommended_study_hours !== undefined) {
                setResult(response.recommended_study_hours);
            } else {
                setError("Failed to predict study time.");
            }
        } catch (err) {
            setError("Error fetching data.");
            console.error(err);
        }
    };

    // Generate personalized tips based on prediction
    const generateTips = (hours) => {
        const tips = [];
        
        // Primary recommendation based on study hours
        if (hours < 2) {
            tips.push("✅ You're doing well! Just keep revising consistently to stay on track.");
        } else if (hours < 4) {
            tips.push("📈 Boost your focus during study sessions and revise smart with summaries.");
        } else if (hours < 6) {
            tips.push("📌 Consider breaking study time into smaller blocks and avoid distractions.");
        } else {
            tips.push("🚨 Time to prioritize! You may need to reduce distractions and set strict routines.");
        }
        
        // Additional tips based on other factors
        if (inputData.focus_level < 3) {
            tips.push("🧘 Try Pomodoro technique or short meditation before studying to improve focus.");
        }
        
        if (inputData.subject_difficulty >= 4) {
            tips.push("📝 Break down difficult topics into smaller chunks and practice with mock tests.");
        }
        
        if (inputData.upcoming_deadlines <= 5) {
            tips.push("⏰ Exam is close! Focus on revision and time management. Avoid starting new topics.");
        }
        
        // Always include this generic tip
        tips.push("✨ Tip: Progress > Perfection. Study smart, not just hard!");
        
        return tips;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen gradient-bg">
                <LoggedInNavBar />
                <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                    <div className="feature-card p-8 w-full max-w-md text-center">
                        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Loading study data...
                        </h2>
                        <div className="mt-4 mx-auto w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

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
                Study Time Prediction
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Section */}
                <motion.div
                className="feature-card p-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                >
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Study Parameters</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Subject Dropdown */}
                    <div>
                    <label className="block text-gray-700 font-medium mb-1">Select Subject</label>
                    <select
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    >
                        <option value="" disabled>Select a subject</option>
                        {subjects.map((subj, idx) => (
                        <option key={idx} value={subj}>{subj}</option>
                        ))}
                    </select>
                    </div>

                    
                                        {Object.keys(inputData).map((key) => (
                                        <div key={key}>
                                            <label className="block text-gray-700 font-medium capitalize">
                                            {key.replace(/_/g, " ")}:
                                            {(key === 'past_study_hours' || key === 'test_scores') && (
                                                <span className="text-xs text-blue-600 ml-2">(Auto-calculated)</span>
                                            )}
                                            </label>
                                            {key === 'subject_difficulty' ? (
                                            <div className="mt-2">
                                                <input
                                                type="range"
                                                name={key}
                                                value={inputData[key]}
                                                onChange={handleChange}
                                                className="w-full"
                                                min="1"
                                                max="5"
                                                step="1"
                                                />
                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>Easy (1)</span>
                                                <span>Hard (5)</span>
                                                </div>
                                            </div>
                                            ) : (
                                            <input
                                                type="number"
                                                name={key}
                                                value={inputData[key]}
                                                onChange={handleChange}
                                                className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                                required
                                                step={key === 'focus_level' ? "1" : "0.1"}
                                                min={key === 'focus_level' ? "1" : "0"}
                                                max={key === 'focus_level' ? "5" : undefined}
                                                disabled={key === 'past_study_hours'}
                                                title={
                                                key === 'past_study_hours'
                                                    ? 'Auto-calculated from selected subject schedule'
                                                    : key === 'focus_level'
                                                    ? 'Rate from 1 (lowest) to 5 (highest)'
                                                    : ''
                                                }
                                            />
                                            )}
                                            {key === 'focus_level' && (
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>Low (1)</span>
                                                <span>High (5)</span>
                                            </div>
                                            )}
                                        </div>
                                        ))}

                                        <motion.button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        >
                                        Predict Study Time
                                        </motion.button>
                                    </form>
                                    </motion.div>

                                    {/* Results Section */}
                <motion.div
                className="feature-card p-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                >
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Recommendations</h3>

                {!result && !error && (
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 text-center">
                        Fill in the parameters on the left and click "Predict Study Time" to see recommendations
                    </p>
                    </div>
                )}

                {/* Display Results */}
                {result !== null && (
                    <div className="space-y-6">
                    {/* Hours Recommendation */}
                    <div className="p-5 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                        <h4 className="text-lg font-semibold text-blue-800 flex items-center">
                        <span className="mr-2">📚</span>
                        Recommended Study Time
                        </h4>
                        <div className="flex items-center justify-between mt-3">
                        <p className="text-4xl font-bold text-blue-700">{result.toFixed(2)}</p>
                        <p className="text-2xl font-medium text-blue-600">hours/day</p>
                        </div>
                        <div className="mt-3 w-full bg-blue-100 rounded-full h-3">
                        <div 
                            className="bg-blue-600 h-3 rounded-full" 
                            style={{ width: `${Math.min(result * 10, 100)}%` }}
                        ></div>
                        </div>
                        <div className="flex justify-between text-xs text-blue-700 mt-1">
                        <span>0 hrs</span>
                        <span>5 hrs</span>
                        <span>10 hrs</span>
                        </div>
                    </div>

                    {/* Study Tips */}
                    <div className="p-5 bg-green-50 border-l-4 border-green-500 rounded-lg">
                        <h4 className="text-lg font-semibold text-green-800 flex items-center">
                        <span className="mr-2">💡</span>
                        Personalized Tips
                        </h4>
                        <ul className="mt-3 space-y-3">
                        {generateTips(result).map((tip, index) => (
                            <li key={index} className="flex items-start bg-white p-3 rounded shadow-sm">
                            <span className="mr-2">{tip.substring(0, 2)}</span>
                            <span>{tip.substring(2)}</span>
                            </li>
                        ))}
                        </ul>
                    </div>

                    {/* Time Allocation Chart */}
                    <div className="p-5 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
                        <h4 className="text-lg font-semibold text-purple-800 flex items-center">
                        <span className="mr-2">⏰</span>
                        Suggested Daily Schedule
                        </h4>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded shadow-sm">
                            <p className="text-purple-700 font-medium">Active Study</p>
                            <p className="text-2xl font-bold">{(result * 0.7).toFixed(1)} hrs</p>
                            <p className="text-xs text-gray-500">70% - Problem solving, practice questions</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm">
                            <p className="text-purple-700 font-medium">Revision</p>
                            <p className="text-2xl font-bold">{(result * 0.3).toFixed(1)} hrs</p>
                            <p className="text-xs text-gray-500">30% - Review, note-taking</p>
                        </div>
                        </div>
                    </div>

                    
                    </div>
                )}

                {/* Display Errors */}
                {error && (
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
                )}
                </motion.div>
            </div>
            </div>
        </div>
        );
};

export default StudyTimePrediction;
