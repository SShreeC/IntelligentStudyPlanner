
// import React, { useState, useEffect } from "react";
// import { predictExamReadiness } from "../services/examReadinessAPI";

// const ExamReadinessPrediction = () => {
//     const [subjects, setSubjects] = useState([]);
//     const [selectedSubject, setSelectedSubject] = useState("");

//     const [inputData, setInputData] = useState({
//         study_consistency: [8],
//         past_test_scores: [0],
//         recent_study_hours: [0]
//     });

//     const [result, setResult] = useState(null);
//     const [error, setError] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [quizHistory, setQuizHistory] = useState([]);

//     useEffect(() => {
//         loadSubjectsFromLocalStorage();
//     }, []);

//     useEffect(() => {
//         if (selectedSubject) {
//             filterQuizScores(selectedSubject);
//             loadStudyHoursForSubject(selectedSubject);
//         }
//     }, [selectedSubject]);

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
//                 console.error("Failed to parse taskScheduleDataForML", e);
//             }
//         }
//         setIsLoading(false);
//     };

//     const filterQuizScores = (subject) => {
//         try {
//             const storedScores = JSON.parse(localStorage.getItem("quizScores")) || [];

//             // Only include quizzes where metadata matches the subject
//             const filtered = storedScores.filter(
//                 (item) =>
//                     item.metadata &&
//                     item.metadata.subject &&
//                     item.metadata.subject.toLowerCase() === subject.toLowerCase()
//             );

//             const scores = filtered.map(item => item.score);
//             const avgScore = scores.length
//                 ? scores.reduce((sum, val) => sum + val, 0) / scores.length
//                 : 0;

//             setQuizHistory(filtered);
//             setInputData(prev => ({
//                 ...prev,
//                 past_test_scores: [parseFloat(avgScore.toFixed(1))]
//             }));

//             console.log(`Filtered quiz scores for ${subject}:`, scores);
//             console.log(`Average: ${avgScore.toFixed(1)}`);
//         } catch (err) {
//             console.error("Error loading quiz scores:", err);
//         }
//     };

//     const loadStudyHoursForSubject = (subject) => {
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
//                 recent_study_hours: [parseFloat(totalHours.toFixed(1))]
//             }));

//             console.log(`Loaded ${totalHours.toFixed(1)} hours of study for ${subject}`);
//         } catch (error) {
//             console.error("Error loading study hours:", error);
//         }
//     };

//     const handleChange = (e) => {
//         setInputData({
//             ...inputData,
//             [e.target.name]: [parseFloat(e.target.value)]
//         });
//     };

//     const handleSubjectChange = (e) => {
//         const subject = e.target.value;
//         setSelectedSubject(subject);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);

//         try {
//             const response = await predictExamReadiness(inputData);
//             console.log(response);

//             if (response.status === "success") {
//                 setResult(response);
//             } else {
//                 setError("Prediction failed.");
//             }
//         } catch (err) {
//             setError("Error fetching data.");
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-500 to-indigo-600 p-6">
//                 <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center">
//                     <h2 className="text-2xl font-semibold text-gray-700">Loading data...</h2>
//                     <div className="mt-4 mx-auto w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-500 to-indigo-600 p-6">
//             <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg transition-all duration-300">
//                 <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
//                     📖 Exam Readiness Prediction
//                 </h2>

//                 {/* Subject Dropdown */}
//                 <div className="mb-6">
//                     <label className="block text-gray-700 font-medium mb-2">Select Subject</label>
//                     <select
//                         value={selectedSubject}
//                         onChange={handleSubjectChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         required
//                     >
//                         <option value="" disabled>Select a subject</option>
//                         {subjects.map((subj, idx) => (
//                             <option key={idx} value={subj}>{subj}</option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Quiz History Section */}
//                 {quizHistory.length > 0 && (
//                     <div className="mb-6 bg-blue-50 p-4 rounded-lg">
//                         <h3 className="font-bold text-gray-700 mb-2">Quiz Scores for "{selectedSubject}"</h3>
//                         <div className="max-h-32 overflow-y-auto">
//                             <ul className="space-y-1">
//                                 {quizHistory.slice(-5).map((item, index) => (
//                                     <li key={index} className="text-sm flex justify-between">
//                                         <span className="text-gray-600">
//                                             {item.metadata?.topic} ({item.metadata?.difficulty})
//                                         </span>
//                                         <span className="font-medium text-blue-700">
//                                             {item.score} points
//                                         </span>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     </div>
//                 )}

//                 {/* Input Form */}
//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     {Object.keys(inputData).map((key) => (
//                         <div key={key}>
//                             <label className="block text-gray-700 capitalize font-medium mb-2">
//                                 {key.replace(/_/g, " ")}
//                                 {key === "past_test_scores" && quizHistory.length > 0 && (
//                                     <span className="text-xs ml-2 text-blue-600">(from quiz history)</span>
//                                 )}
//                                 {key === "recent_study_hours" && (
//                                     <span className="text-xs ml-2 text-blue-600">(from schedule)</span>
//                                 )}
//                             </label>
//                             <input
//                                 type="number"
//                                 name={key}
//                                 value={inputData[key][0]}
//                                 onChange={handleChange}
//                                 className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
//                                 required
//                             />
//                         </div>
//                     ))}

//                     <button
//                         type="submit"
//                         className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-bold hover:scale-105 transform transition-all duration-300 shadow-lg">
//                         Predict Readiness
//                     </button>
//                 </form>

//                 {/* Result Display */}
//                 {result !== null && (
//                     <div className="mt-6 p-5 border rounded-lg text-center shadow-md transition-all duration-300"
//                         style={{
//                             backgroundColor: result.prediction[0] === "High" ? "#D4EDDA" :
//                                 result.prediction[0] === "Medium" ? "#FFF3CD" : "#F8D7DA",
//                             borderColor: result.prediction[0] === "High" ? "#28A745" :
//                                 result.prediction[0] === "Medium" ? "#FFC107" : "#DC3545"
//                         }}>
//                         <h3 className="text-lg font-semibold text-gray-800">{result.message}</h3>
//                         <p className={`text-2xl font-bold mt-2 ${
//                             result.prediction[0] === "High" ? "text-green-700" :
//                                 result.prediction[0] === "Medium" ? "text-yellow-700" :
//                                     "text-red-700"
//                         }`}>
//                             {result.prediction[0]}
//                         </p>
//                     </div>
//                 )}

//                 {error && (
//                     <p className="mt-4 text-center text-red-500">{error}</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ExamReadinessPrediction;
// import React, { useState, useEffect } from "react";
// import { predictExamReadiness } from "../services/examReadinessAPI";

// const ExamReadinessPrediction = () => {
//     const [subjects, setSubjects] = useState([]);
//     const [selectedSubject, setSelectedSubject] = useState("");
//     const [inputData, setInputData] = useState({
//         study_consistency: [8],
//         past_test_scores: [0],
//         recent_study_hours: [0]
//     });

//     const [result, setResult] = useState(null);
//     const [error, setError] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [quizHistory, setQuizHistory] = useState([]);

//     useEffect(() => {
//         loadSubjectsFromLocalStorage();
//     }, []);

//     useEffect(() => {
//         if (selectedSubject) {
//             filterQuizScores(selectedSubject);
//             loadStudyHoursForSubject(selectedSubject);
//         }
//     }, [selectedSubject]);

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
//                 console.error("Failed to parse taskScheduleDataForML", e);
//             }
//         }
//         setIsLoading(false);
//     };

//     const filterQuizScores = (subject) => {
//         try {
//             const storedScores = JSON.parse(localStorage.getItem("quizScores")) || [];
//             const filtered = storedScores.filter(
//                 (item) =>
//                     item.metadata?.subject?.toLowerCase() === subject.toLowerCase()
//             );

//             const scores = filtered.map(item => item.score);
//             const avgScore = scores.length
//                 ? scores.reduce((sum, val) => sum + val, 0) / scores.length
//                 : 0;

//             setQuizHistory(filtered);
//             setInputData(prev => ({
//                 ...prev,
//                 past_test_scores: [parseFloat(avgScore.toFixed(1))]
//             }));
//         } catch (err) {
//             console.error("Error loading quiz scores:", err);
//         }
//     };

//     const loadStudyHoursForSubject = (subject) => {
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
//                 recent_study_hours: [parseFloat(totalHours.toFixed(1))]
//             }));
//         } catch (error) {
//             console.error("Error loading study hours:", error);
//         }
//     };

//     const handleChange = (e) => {
//         setInputData({
//             ...inputData,
//             [e.target.name]: [parseFloat(e.target.value)]
//         });
//     };

//     const handleSubjectChange = (e) => {
//         const subject = e.target.value;
//         setSelectedSubject(subject);
//     };

//     const generateTips = () => {
//         if (!result) return [];
        
//         const sc = inputData.study_consistency[0];
//         const pts = inputData.past_test_scores[0];
//         const rsh = inputData.recent_study_hours[0];
//         const level = result.prediction[0];
        
//         const tips = [];
        
//         if (level === "High") {
//             tips.push("Great consistency! Keep going 💪");
//             if (rsh >= 10) {
//                 tips.push("Your recent efforts are paying off ⏰");
//             }
//         } else if (level === "Medium") {
//             if (rsh < 6) {
//                 tips.push("Try studying 1-2 hours more daily ⌛");
//             }
//             if (sc < 6) {
//                 tips.push("Add small goals to stay consistent 🎯");
//             }
//             if (pts < 70) {
//                 tips.push("Quick review of key topics can boost confidence 📖");
//             }
//         } else { // Low
//             tips.push("Start small – even 30 mins daily helps 🧱");
//             if (pts < 60) {
//                 tips.push("Focus on weak areas with smart revision 🧠");
//             }
//             tips.push("Use a fixed routine for better focus 📅");
//         }
        
//         return tips.slice(0, 3); // Max 3 tips
//     };

//     const getReadinessIcon = (level) => {
//         const icons = {
//             'High': "📘",
//             'Medium': "📗",
//             'Low': "📕"
//         };
//         return icons[level] || "📚";
//     };

//     const getReadinessColor = (level) => {
//         const colors = {
//             'High': {
//                 bg: "bg-green-100",
//                 border: "border-green-500",
//                 text: "text-green-700",
//                 lightBg: "bg-green-50"
//             },
//             'Medium': {
//                 bg: "bg-yellow-100",
//                 border: "border-yellow-500",
//                 text: "text-yellow-700",
//                 lightBg: "bg-yellow-50"
//             },
//             'Low': {
//                 bg: "bg-red-100",
//                 border: "border-red-500",
//                 text: "text-red-700",
//                 lightBg: "bg-red-50"
//             }
//         };
//         return colors[level] || colors['Medium'];
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         try {
//             const response = await predictExamReadiness(inputData);
//             if (response.status === "success") {
//                 setResult(response);
//             } else {
//                 setError("Prediction failed.");
//             }
//         } catch (err) {
//             setError("Error fetching data.");
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-500 to-indigo-600 p-6">
//                 <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center">
//                     <h2 className="text-2xl font-semibold text-gray-700">Loading data...</h2>
//                     <div className="mt-4 mx-auto w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-500 to-indigo-600 p-6">
//             <div className="w-full max-w-6xl mb-6">
//                 <h2 className="text-3xl font-extrabold text-white text-center">
//                     📖 Exam Readiness Prediction
//                 </h2>
//                 <p className="text-blue-100 text-center mt-2">
//                     Analyze your study habits and predict how prepared you are for upcoming exams
//                 </p>
//             </div>

//             <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-6xl">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Left Side - Inputs */}
//                     <div className="bg-gray-50 p-6 rounded-xl">
//                         <h3 className="text-xl font-semibold text-gray-800 mb-4">Input Parameters</h3>
                        
//                         {/* Subject Dropdown */}
//                         <div className="mb-6">
//                             <label className="block text-gray-700 font-medium mb-2">Select Subject</label>
//                             <select
//                                 value={selectedSubject}
//                                 onChange={handleSubjectChange}
//                                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                                 required
//                             >
//                                 <option value="" disabled>Select a subject</option>
//                                 {subjects.map((subj, idx) => (
//                                     <option key={idx} value={subj}>{subj}</option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Input Form */}
//                         <form onSubmit={handleSubmit} className="space-y-5">
//                             {/* Study Consistency Input */}
//                             <div>
//     <label className="block text-gray-700 font-medium mb-2">
//         Study Consistency
//         <span className="text-xs ml-2 text-blue-600">(scale of 1-10)</span>
//     </label>
//     <div className="flex items-center">
//         <input
//             type="number"
//             name="study_consistency"
//             min="1"
//             max="10"
//             value={inputData.study_consistency}
//             onChange={handleChange}
//             className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <span className="ml-3 text-sm text-gray-500">Enter a value between 1 and 10</span>
//     </div>
// </div>


//                             {/* Past Test Scores Input */}
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Past Test Scores
//                                     {quizHistory.length > 0 && (
//                                         <span className="text-xs ml-2 text-blue-600">(from quiz history)</span>
//                                     )}
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="past_test_scores"
//                                     value={inputData.past_test_scores[0]}
//                                     onChange={handleChange}
//                                     className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
//                                     required
//                                 />
//                                 <p className="text-xs text-gray-500 mt-1">Enter average score as percentage (0-100)</p>
//                             </div>

//                             {/* Recent Study Hours Input */}
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-2">
//                                     Recent Study Hours
//                                     <span className="text-xs ml-2 text-blue-600">(from schedule)</span>
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="recent_study_hours"
//                                     value={inputData.recent_study_hours[0]}
//                                     onChange={handleChange}
//                                     className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
//                                     required
//                                 />
//                                 <p className="text-xs text-gray-500 mt-1">Total hours studied recently (past week)</p>
//                             </div>

//                             <button
//                                 type="submit"
//                                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-bold hover:scale-105 transform transition-all duration-300 shadow-lg mt-4">
//                                 Predict Readiness
//                             </button>
//                         </form>

//                         {/* Quiz History Summary */}
//                         {quizHistory.length > 0 && (
//                             <div className="mt-6 pt-6 border-t border-gray-200">
//                                 <h4 className="font-medium text-gray-700 mb-2">Recent Quiz History</h4>
//                                 <div className="max-h-36 overflow-y-auto pr-2">
//                                     <ul className="space-y-1">
//                                         {quizHistory.slice(-5).map((item, index) => (
//                                             <li key={index} className="text-sm flex justify-between">
//                                                 <span className="text-gray-600">
//                                                     {item.metadata?.topic || "Quiz"} ({item.metadata?.difficulty || "N/A"})
//                                                 </span>
//                                                 <span className="font-medium text-blue-700">
//                                                     {item.score} points
//                                                 </span>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Right Side - Outputs */}
//                     <div className="flex flex-col">
//                         {/* Enhanced Result Display */}
//                         {result ? (
//                             <div className="h-full flex flex-col">
//                                 {/* Readiness Level */}
//                                 <div className={`p-6 rounded-xl mb-4 flex flex-col items-center ${getReadinessColor(result.prediction[0]).bg} ${getReadinessColor(result.prediction[0]).border} border`}>
//                                     <div className="text-center">
//                                         <span className="text-5xl mb-2 block">{getReadinessIcon(result.prediction[0])}</span>
//                                         <h3 className="text-xl font-bold text-gray-800">Exam Readiness</h3>
                                        
//                                         <div className="flex items-center justify-center mt-2 gap-2">
//                                             <p className={`text-3xl font-bold ${getReadinessColor(result.prediction[0]).text}`}>
//                                                 {result.prediction[0]}
//                                             </p>
//                                             <p className="text-gray-600">
//                                                 ({result.confidence ? `${Math.round(result.confidence * 100)}%` : '95%'})
//                                             </p>
//                                         </div>
//                                         <p className="text-gray-600 mt-2">{result.message || "Based on your current study habits"}</p>
//                                     </div>
//                                 </div>
                                
//                                 {/* Input Summary */}
//                                 <div className="bg-gray-50 rounded-xl p-4 mb-4">
//                                     <h4 className="font-semibold text-gray-700 mb-2">Your Input Summary</h4>
//                                     <div className="space-y-1">
//                                         <div className="flex justify-between text-sm">
//                                             <span className="text-gray-600">Study Consistency:</span>
//                                             <span className="font-medium">{inputData.study_consistency[0]}/10</span>
//                                         </div>
//                                         <div className="flex justify-between text-sm">
//                                             <span className="text-gray-600">Past Test Scores:</span>
//                                             <span className="font-medium">{inputData.past_test_scores[0]}%</span>
//                                         </div>
//                                         <div className="flex justify-between text-sm">
//                                             <span className="text-gray-600">Recent Study Hours:</span>
//                                             <span className="font-medium">{inputData.recent_study_hours[0]} hours</span>
//                                         </div>
//                                     </div>
//                                 </div>
                                
//                                 {/* Tips Section */}
//                                 <div className={`rounded-xl p-4 flex-grow ${getReadinessColor(result.prediction[0]).lightBg}`}>
//                                     <h4 className="font-semibold text-gray-700 mb-3">💡 Personalized Tips:</h4>
//                                     <ul className="space-y-3">
//                                         {generateTips().map((tip, idx) => (
//                                             <li key={idx} className="text-sm flex items-start">
//                                                 <span className="mr-2 font-bold">•</span>
//                                                 <span>{tip}</span>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                     <p className="text-xs text-gray-500 mt-4 italic">
//                                         🔍 Note: For accurate results, keep updating your study habits and quiz scores.
//                                     </p>
//                                 </div>
//                             </div>
//                         ) : error ? (
//                             <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
//                                 <p className="text-red-600 font-medium">{error}</p>
//                                 <p className="text-sm text-red-500 mt-2">Please try again or check your inputs.</p>
//                             </div>
//                         ) : (
//                             <div className="h-full flex flex-col justify-center items-center text-center p-10 bg-gray-50 rounded-xl">
//                                 <img 
//                                     src="/api/placeholder/200/200" 
//                                     alt="Exam preparation" 
//                                     className="mb-6 opacity-50"
//                                 />
//                                 <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to check your exam preparedness?</h3>
//                                 <p className="text-gray-500 mb-6">Select a subject and input your study habits to get personalized predictions and tips.</p>
//                                 <div className="text-5xl">📚 ✏️ 📊</div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ExamReadinessPrediction;


import React, { useState, useEffect } from "react";
import { predictExamReadiness } from "../services/examReadinessAPI";
import { motion } from "framer-motion";
import LoggedInNavBar from "../components/LoggedInNavBar";

const ExamReadinessPrediction = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [inputData, setInputData] = useState({
        study_consistency: [8],
        past_test_scores: [0],
        recent_study_hours: [0]
    });

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quizHistory, setQuizHistory] = useState([]);

    useEffect(() => {
        loadSubjectsFromLocalStorage();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            filterQuizScores(selectedSubject);
            loadStudyHoursForSubject(selectedSubject);
        }
    }, [selectedSubject]);

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
                console.error("Failed to parse taskScheduleDataForML", e);
            }
        }
        setIsLoading(false);
    };

    const filterQuizScores = (subject) => {
        try {
            const storedScores = JSON.parse(localStorage.getItem("quizScores")) || [];
            const filtered = storedScores.filter(
                (item) =>
                    item.metadata?.subject?.toLowerCase() === subject.toLowerCase()
            );

            const scores = filtered.map(item => item.score);
            const avgScore = scores.length
                ? scores.reduce((sum, val) => sum + val, 0) / scores.length
                : 0;

            setQuizHistory(filtered);
            setInputData(prev => ({
                ...prev,
                past_test_scores: [parseFloat(avgScore.toFixed(1))]
            }));
        } catch (err) {
            console.error("Error loading quiz scores:", err);
        }
    };

    const loadStudyHoursForSubject = (subject) => {
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
                recent_study_hours: [parseFloat(totalHours.toFixed(1))]
            }));
        } catch (error) {
            console.error("Error loading study hours:", error);
        }
    };

    const handleChange = (e) => {
        setInputData({
            ...inputData,
            [e.target.name]: [parseFloat(e.target.value)]
        });
    };

    const handleSubjectChange = (e) => {
        const subject = e.target.value;
        setSelectedSubject(subject);
    };

    const generateTips = () => {
        if (!result) return [];
        
        const sc = inputData.study_consistency[0];
        const pts = inputData.past_test_scores[0];
        const rsh = inputData.recent_study_hours[0];
        const level = result.prediction[0];
        
        const tips = [];
        
        if (level === "High") {
            tips.push("Great consistency! Keep going 💪");
            if (rsh >= 10) {
                tips.push("Your recent efforts are paying off ⏰");
            }
        } else if (level === "Medium") {
            if (rsh < 6) {
                tips.push("Try studying 1-2 hours more daily ⌛");
            }
            if (sc < 6) {
                tips.push("Add small goals to stay consistent 🎯");
            }
            if (pts < 70) {
                tips.push("Quick review of key topics can boost confidence 📖");
            }
        } else { // Low
            tips.push("Start small – even 30 mins daily helps 🧱");
            if (pts < 60) {
                tips.push("Focus on weak areas with smart revision 🧠");
            }
            tips.push("Use a fixed routine for better focus 📅");
        }
        
        return tips.slice(0, 3); // Max 3 tips
    };

    const getReadinessIcon = (level) => {
        const icons = {
            'High': "📘",
            'Medium': "📗",
            'Low': "📕"
        };
        return icons[level] || "📚";
    };

    const getReadinessColor = (level) => {
        const colors = {
            'High': {
                bg: "bg-green-500",
                text: "text-green-800"
            },
            'Medium': {
                bg: "bg-yellow-500",
                text: "text-yellow-800"
            },
            'Low': {
                bg: "bg-red-500",
                text: "text-red-800"
            }
        };
        return colors[level] || colors['Medium'];
    };

    const getConsistencyLevel = (consistency) => {
        if (consistency >= 8) return "High consistency";
        if (consistency >= 5) return "Moderate consistency";
        return "Low consistency";
    };

    const getScoreLevel = (score) => {
        if (score >= 75) return "Great performance";
        if (score >= 60) return "Good performance";
        if (score >= 40) return "Average performance";
        return "Needs improvement";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await predictExamReadiness(inputData);
            if (response.status === "success") {
                setResult(response);
            } else {
                setError("Prediction failed.");
            }
        } catch (err) {
            setError("Error fetching data.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen gradient-bg flex justify-center items-center">
                <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center">
                    <h2 className="text-2xl font-semibold text-gray-700">Loading data...</h2>
                    <div className="mt-4 mx-auto w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
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
                    Exam Readiness Prediction
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Input Form */}
                    <motion.div
                        className="feature-card p-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Input Parameters</h3>
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
                            
                            
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Study Consistency
                                    <span className="text-xs ml-2 text-blue-600">(scale of 1-10, 1 being most consistent)</span>
                                </label>
                                <input
                                    type="range"
                                    name="study_consistency"
                                    min="1"
                                    max="10"
                                    value={inputData.study_consistency[0]}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Most Consistent (1)</span>
                                    <span>Least Consistent (10)</span>
                                </div>
                                {inputData.study_consistency[0] > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {getConsistencyLevel(inputData.study_consistency[0])}
                                    </p>
                                )}
                            </div>

                            {/* Past Test Scores Input */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Past Test Scores
                                    {quizHistory.length > 0 && (
                                        <span className="text-xs ml-2 text-blue-600">(from quiz history)</span>
                                    )}
                                </label>
                                <input
                                    type="number"
                                    name="past_test_scores"
                                    value={inputData.past_test_scores[0]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                                {inputData.past_test_scores[0] > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {getScoreLevel(inputData.past_test_scores[0])}
                                    </p>
                                )}
                            </div>
                            
                            {/* Recent Study Hours Input */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Recent Study Hours
                                    <span className="text-xs ml-2 text-blue-600">(from schedule)</span>
                                </label>
                                <input
                                    type="number"
                                    name="recent_study_hours"
                                    value={inputData.recent_study_hours[0]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            
                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Predict Readiness
                            </motion.button>
                        </form>
                        
                        {/* Quiz History Summary */}
                        {quizHistory.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Quiz History</h4>
                                <div className="max-h-36 overflow-y-auto">
                                    <ul className="space-y-1">
                                        {quizHistory.slice(-5).map((item, index) => (
                                            <li key={index} className="text-xs flex justify-between">
                                                <span className="text-gray-600">
                                                    {item.metadata?.topic || "Quiz"} ({item.metadata?.difficulty || "N/A"})
                                                </span>
                                                <span className="font-medium text-blue-700">
                                                    {item.score} points
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Right Column: Results */}
                    <motion.div
                        className="feature-card p-8"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Prediction Results</h3>
                        
                        {result !== null ? (
                            <div className="space-y-6">
                                {/* Prediction Summary */}
                                <div className="p-5 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                                    <h4 className="text-lg font-semibold text-blue-800 flex items-center">
                                        <span className="mr-2">{getReadinessIcon(result.prediction[0])}</span>
                                        Exam Readiness
                                    </h4>
                                    <div className="flex items-center justify-between mt-3">
                                        <p className="text-4xl font-bold text-blue-700">{result.prediction[0]}</p>
                                        <span className="text-gray-600">
                                            ({result.confidence ? `${Math.round(result.confidence * 100)}%` : '95%'})
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mt-2 text-sm">{result.message || "Based on your current study habits"}</p>
                                </div>
                                
                                
                                
                                {/* Tips Section */}
                                <div className="p-5 bg-green-50 border-l-4 border-green-500 rounded-lg">
                                    <h4 className="text-lg font-semibold text-green-800 flex items-center">
                                        <span className="mr-2">💡</span>
                                        Personalized Tips
                                    </h4>
                                    <ul className="mt-3 space-y-3">
                                        {generateTips().map((tip, index) => (
                                            <li key={index} className="flex items-start bg-white p-3 rounded shadow-sm">
                                                <span className="mr-2">{tip.substring(0, 2)}</span>
                                                <span>{tip.substring(2)}</span>
                                            </li>
                                        ))}
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
                                    Fill in the parameters on the left and click "Predict Readiness" to see recommendations
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ExamReadinessPrediction;