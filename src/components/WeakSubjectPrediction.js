// import React, { useState, useEffect } from "react";
// import { predictWeakSubject } from "../services/WeakSubjectAPI";

// const WeakSubjectPrediction = () => {
//     const [inputData, setInputData] = useState({
//         study_hours: 0,
//         topics_covered: 2,
//         quiz_scores: 0,
//         time_per_question: 1.7
//     });

//     const [subjects, setSubjects] = useState([]);
//     const [selectedSubject, setSelectedSubject] = useState('');
//     const [result, setResult] = useState(null);
//     const [error, setError] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
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
//     }, []);

//     const handleSubjectChange = (e) => {
//         const subject = e.target.value;
//         setSelectedSubject(subject);
//         calculateStudyHours(subject);
//         normalizeQuizScores(subject);
//     };

//     const calculateStudyHours = (subject) => {
//         const mlDataRaw = localStorage.getItem("taskScheduleDataForML");
//         if (mlDataRaw) {
//             try {
//                 const parsed = JSON.parse(mlDataRaw);
//                 const subjectTasks = parsed.filter(task =>
//                     task.taskType.toLowerCase() === "study" && task.subject === subject
//                 );
//                 const totalMinutes = subjectTasks.reduce((sum, task) => sum + task.durationMinutes, 0);
//                 const totalHours = totalMinutes / 60;
//                 setInputData(prev => ({
//                     ...prev,
//                     study_hours: parseFloat(totalHours.toFixed(2))
//                 }));
//             } catch (e) {
//                 console.error("Error processing schedule data", e);
//             }
//         }
//     };

//     const normalizeQuizScores = (subject) => {
//         try {
//             const rawScores = JSON.parse(localStorage.getItem("quizScores")) || [];
//             const subjectScores = rawScores.filter(
//                 q =>
//                     q.metadata &&
//                     q.metadata.subject &&
//                     q.metadata.subject.toLowerCase() === subject.toLowerCase()
//             );

//             if (subjectScores.length === 0) {
//                 setInputData(prev => ({ ...prev, quiz_scores: 0 }));
//                 return;
//             }

//             const normalized = subjectScores.map(s => (s.score / (s.outOf || 10)) * 100);
//             const average = normalized.reduce((sum, score) => sum + score, 0) / normalized.length;

//             setInputData(prev => ({
//                 ...prev,
//                 quiz_scores: parseFloat(average.toFixed(1))
//             }));
//         } catch (error) {
//             console.error("Error normalizing quiz scores:", error);
//         }
//     };

//     const handleChange = (e) => {
//         setInputData({ ...inputData, [e.target.name]: parseFloat(e.target.value) });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setIsLoading(true);

//         try {
//             const response = await predictWeakSubject(inputData);
//             if (response.status === "success") {
//                 setResult(response);
//             } else {
//                 setError("Prediction failed.");
//             }
//         } catch (err) {
//             setError("Error fetching data.");
//             console.error(err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Helper function to determine color and icons based on values
//     const getMetricStatus = (metric, value) => {
//         let color, icon;
        
//         switch(metric) {
//             case 'study_hours':
//                 if (value < 5) {
//                     color = "text-red-600";
//                     icon = "⏳";
//                 } else if (value < 10) {
//                     color = "text-yellow-600";
//                     icon = "🕒";
//                 } else {
//                     color = "text-green-600";
//                     icon = "✅";
//                 }
//                 break;
//             case 'topics_covered':
//                 if (value < 5) {
//                     color = "text-red-600";
//                     icon = "📊";
//                 } else if (value < 10) {
//                     color = "text-yellow-600";
//                     icon = "📑";
//                 } else {
//                     color = "text-green-600";
//                     icon = "✅";
//                 }
//                 break;
//             case 'quiz_scores':
//                 if (value < 60) {
//                     color = "text-red-600";
//                     icon = "📝";
//                 } else if (value < 80) {
//                     color = "text-yellow-600";
//                     icon = "📘";
//                 } else {
//                     color = "text-green-600";
//                     icon = "🏆";
//                 }
//                 break;
//             case 'time_per_question':
//                 if (value > 2) {
//                     color = "text-red-600";
//                     icon = "⏱️";
//                 } else if (value > 1.5) {
//                     color = "text-yellow-600";
//                     icon = "⌛";
//                 } else {
//                     color = "text-green-600";
//                     icon = "⚡";
//                 }
//                 break;
//             default:
//                 color = "text-gray-600";
//                 icon = "ℹ️";
//         }
        
//         return { color, icon };
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
//             <div className="max-w-7xl mx-auto">
//                 <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
//                     📖 Weak Subject Prediction
//                 </h2>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {/* Input Section */}
//                     <div className="bg-white rounded-2xl shadow-md p-6 h-full">
//                         <h3 className="text-xl font-semibold mb-4 text-gray-700">Input Parameters</h3>

//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label className="block text-gray-700 font-medium mb-1">Select Subject</label>
//                                 <select
//                                     value={selectedSubject}
//                                     onChange={handleSubjectChange}
//                                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                                     required
//                                 >
//                                     <option value="" disabled>Select a subject</option>
//                                     {subjects.map((subj, idx) => (
//                                         <option key={idx} value={subj}>{subj}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {Object.keys(inputData).map((key) => (
//                                 <div key={key}>
//                                     <label className="block text-gray-700 font-medium capitalize">
//                                         {key.replace(/_/g, " ")}:
//                                         {(key === 'study_hours' || key === 'quiz_scores') && (
//                                             <span className="text-xs text-blue-600 ml-2">(Auto-calculated, editable)</span>
//                                         )}
//                                     </label>
//                                     <input
//                                         type="number"
//                                         name={key}
//                                         value={inputData[key]}
//                                         onChange={handleChange}
//                                         className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                         required
//                                         step="0.1"
//                                     />
//                                 </div>
//                             ))}

//                             <button
//                                 type="submit"
//                                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold mt-4"
//                                 disabled={isLoading}
//                             >
//                                 {isLoading ? 'Processing...' : 'Predict Weak Subject'}
//                             </button>
//                         </form>
//                     </div>

//                     {/* Output Section - Updated to match weak_sub.py's output */}
//                     <div className="bg-white rounded-2xl shadow-md p-6 h-full">
//                         <h3 className="text-xl font-semibold mb-4 text-gray-700">Prediction Results</h3>

//                         {isLoading && (
//                             <div className="h-64 flex flex-col items-center justify-center">
//                                 <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
//                                 <p className="mt-4 text-gray-600">🔍 Analyzing your data...</p>
//                             </div>
//                         )}

//                         {!result && !error && !isLoading && (
//                             <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
//                                 <p className="text-gray-500 text-center">
//                                     Fill in the parameters on the left and click "Predict Weak Subject" to see results
//                                 </p>
//                             </div>
//                         )}

//                         {result && !isLoading && (
//                             <div className={`p-5 rounded-lg transition-all duration-300 ${
//                                 result.is_weak_subject ? "bg-red-50 border-l-4 border-red-500" : "bg-green-50 border-l-4 border-green-500"
//                             }`}>
//                                 <div className="flex items-center mb-4">
//                                     <span className="text-3xl mr-3">
//                                         {result.is_weak_subject ? "🚨" : "🌟"}
//                                     </span>
//                                     <div>
//                                         <h3 className={`text-xl font-semibold ${
//                                             result.is_weak_subject ? "text-red-700" : "text-green-700"
//                                         }`}>
//                                             {selectedSubject}: {result.is_weak_subject ? "Needs Improvement" : "Strong Performance"}
//                                         </h3>
//                                         <p className={`text-lg font-medium ${
//                                             result.is_weak_subject ? "text-red-600" : "text-green-600"
//                                         }`}>
//                                             💡 Prediction: {result.message}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {/* Metric Cards */}
//                                 <div className="grid grid-cols-2 gap-4 mb-6">
//                                     {Object.entries(inputData).map(([key, value]) => {
//                                         const { color, icon } = getMetricStatus(key, value);
//                                         let label, unit = "";
                                        
//                                         switch(key) {
//                                             case 'study_hours': 
//                                                 label = "Study Hours"; 
//                                                 unit = "hrs";
//                                                 break;
//                                             case 'topics_covered': 
//                                                 label = "Topics"; 
//                                                 unit = "";
//                                                 break;
//                                             case 'quiz_scores': 
//                                                 label = "Quiz Score"; 
//                                                 unit = "%";
//                                                 break;
//                                             case 'time_per_question': 
//                                                 label = "Time/Question"; 
//                                                 unit = "min";
//                                                 break;
//                                             default: 
//                                                 label = key;
//                                         }
                                        
//                                         return (
//                                             <div key={key} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
//                                                 <div className="flex justify-between items-center mb-1">
//                                                     <span className="text-sm text-gray-500">{label}</span>
//                                                     <span className={`font-medium ${color}`}>{icon} {value}{unit}</span>
//                                                 </div>
                                                
//                                                 {/* Custom Progress Bar based on metrics from weak_sub.py */}
//                                                 {key === 'study_hours' && (
//                                                     <div className="w-full bg-gray-200 rounded-full h-2">
//                                                         <div 
//                                                             className={`h-2 rounded-full ${value < 5 ? 'bg-red-500' : value < 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
//                                                             style={{ width: `${Math.min((value/20) * 100, 100)}%` }}
//                                                         ></div>
//                                                     </div>
//                                                 )}
                                                
//                                                 {key === 'topics_covered' && (
//                                                     <div className="w-full bg-gray-200 rounded-full h-2">
//                                                         <div 
//                                                             className={`h-2 rounded-full ${value < 5 ? 'bg-red-500' : value < 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
//                                                             style={{ width: `${Math.min((value/15) * 100, 100)}%` }}
//                                                         ></div>
//                                                     </div>
//                                                 )}
                                                
//                                                 {key === 'quiz_scores' && (
//                                                     <div className="w-full bg-gray-200 rounded-full h-2">
//                                                         <div 
//                                                             className={`h-2 rounded-full ${value < 60 ? 'bg-red-500' : value < 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
//                                                             style={{ width: `${Math.min(value, 100)}%` }}
//                                                         ></div>
//                                                     </div>
//                                                 )}
                                                
//                                                 {key === 'time_per_question' && (
//                                                     <div className="w-full bg-gray-200 rounded-full h-2">
//                                                         <div 
//                                                             className={`h-2 rounded-full ${value > 2 ? 'bg-red-500' : value > 1.5 ? 'bg-yellow-500' : 'bg-green-500'}`}
//                                                             style={{ width: `${Math.min((3 - Math.min(value, 3))/3 * 100, 100)}%` }}
//                                                         ></div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         );
//                                     })}
//                                 </div>

//                                 {/* Recommendations Section - Directly from weak_sub.py */}
//                                 <div className={`mt-5 p-4 rounded-lg ${
//                                     result.is_weak_subject ? "bg-red-100" : "bg-green-100"
//                                 }`}>
//                                     <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
//                                         <span className="mr-2">💡</span>
//                                         Personalized Tips
//                                     </h4>
//                                     <ul className="space-y-2">
//                                         {result.tips && result.tips.map((tip, idx) => (
//                                             <li key={idx} className="flex items-start bg-white p-3 rounded shadow-sm">
//                                                 {/* Extract emoji if present */}
//                                                 {tip.match(/^([🔴⏳📝⚡✅💡📚📊⏱️]*)/)[1] ? (
//                                                     <>
//                                                         <span className="mr-3 text-xl">{tip.match(/^([🔴⏳📝⚡✅💡📚📊⏱️]*)/)[1]}</span>
//                                                         <span className="text-gray-700">{tip.replace(/^([🔴⏳📝⚡✅💡📚📊⏱️]*)/, "").trim()}</span>
//                                                     </>
//                                                 ) : (
//                                                     <span className="text-gray-700">{tip}</span>
//                                                 )}
//                                             </li>
//                                         ))}
                                        
//                                         {/* Generate input-specific tips like weak_sub.py does */}
//                                         {inputData.study_hours < 5 && !result.tips?.some(tip => tip.includes("study hours")) && (
//                                             <li className="flex items-start bg-white p-3 rounded shadow-sm">
//                                                 <span className="mr-3 text-xl">⏳</span>
//                                                 <span className="text-gray-700">Increasing study hours can boost your performance.</span>
//                                             </li>
//                                         )}
//                                         {inputData.topics_covered < 5 && !result.tips?.some(tip => tip.includes("topics")) && (
//                                             <li className="flex items-start bg-white p-3 rounded shadow-sm">
//                                                 <span className="mr-3 text-xl">📊</span>
//                                                 <span className="text-gray-700">Focus on covering more topics to get a broader understanding.</span>
//                                             </li>
//                                         )}
//                                         {inputData.quiz_scores < 60 && !result.tips?.some(tip => tip.includes("quiz scores")) && (
//                                             <li className="flex items-start bg-white p-3 rounded shadow-sm">
//                                                 <span className="mr-3 text-xl">📝</span>
//                                                 <span className="text-gray-700">Aim to improve your quiz scores through practice and time management.</span>
//                                             </li>
//                                         )}
//                                         {inputData.time_per_question > 2 && !result.tips?.some(tip => tip.includes("quickly")) && (
//                                             <li className="flex items-start bg-white p-3 rounded shadow-sm">
//                                                 <span className="mr-3 text-xl">⏱️</span>
//                                                 <span className="text-gray-700">Try to solve questions more quickly to improve time efficiency.</span>
//                                             </li>
//                                         )}
//                                     </ul>
//                                 </div>

//                                 {/* Action Plan */}
//                                 <div className="mt-6 pt-4 border-t border-gray-200">
//                                     <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
//                                         <span className="mr-2">📝</span>
//                                         Recommended Action Plan
//                                     </h4>
//                                     <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
//                                         <ul className="space-y-2">
//                                             {result.is_weak_subject ? (
//                                                 <>
//                                                     <li className="flex items-center">
//                                                         <span className="mr-2 text-blue-500">→</span>
//                                                         <span>Schedule {Math.max(10 - inputData.study_hours, 2).toFixed(1)} additional study hours</span>
//                                                     </li>
//                                                     <li className="flex items-center">
//                                                         <span className="mr-2 text-blue-500">→</span>
//                                                         <span>Focus on covering at least {Math.max(10 - inputData.topics_covered, 0)} more topics</span>
//                                                     </li>
//                                                     <li className="flex items-center">
//                                                         <span className="mr-2 text-blue-500">→</span>
//                                                         <span>Practice with timed quizzes to improve speed and accuracy</span>
//                                                     </li>
//                                                     {inputData.time_per_question > 1.5 && (
//                                                         <li className="flex items-center">
//                                                             <span className="mr-2 text-blue-500">→</span>
//                                                             <span>Aim to reduce time per question to less than 1.5 minutes</span>
//                                                         </li>
//                                                     )}
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <li className="flex items-center">
//                                                         <span className="mr-2 text-blue-500">→</span>
//                                                         <span>Maintain current study routine with regular reviews</span>
//                                                     </li>
//                                                     <li className="flex items-center">
//                                                         <span className="mr-2 text-blue-500">→</span>
//                                                         <span>Consider helping peers who might be struggling with this subject</span>
//                                                     </li>
//                                                     <li className="flex items-center">
//                                                         <span className="mr-2 text-blue-500">→</span>
//                                                         <span>Explore advanced topics to further enhance your knowledge</span>
//                                                     </li>
//                                                 </>
//                                             )}
//                                         </ul>
//                                     </div>
//                                 </div>
                                
//                                 {/* Added note from weak_sub.py */}
//                                 <div className="mt-4 text-center text-xs text-gray-500">
//                                     🔍 Note: This is a simulated prediction. For accurate results, use real data.
//                                 </div>
//                             </div>
//                         )}

//                         {error && !isLoading && (
//                             <div className="p-5 bg-red-50 rounded-lg border border-red-300">
//                                 <div className="flex items-center mb-3">
//                                     <span className="text-3xl mr-3">⚠️</span>
//                                     <h3 className="text-xl font-semibold text-red-700">Error Occurred</h3>
//                                 </div>
//                                 <p className="text-red-500 font-medium">❌ {error}</p>
//                                 <p className="text-sm text-red-400 mt-2">Please try again or contact support if the issue persists.</p>
//                                 <button 
//                                     onClick={() => setError(null)}
//                                     className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
//                                 >
//                                     Dismiss
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default WeakSubjectPrediction;


import React, { useState, useEffect } from "react";
import { predictWeakSubject } from "../services/WeakSubjectAPI";
import LoggedInNavBar from "../components/LoggedInNavBar"; // Import the missing component

const WeakSubjectPrediction = () => {
    const [inputData, setInputData] = useState({
        study_hours: 0,
        topics_covered: 2,
        quiz_scores: 0,
        time_per_question: 1.7
    });

    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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
    }, []);

    const handleSubjectChange = (e) => {
        const subject = e.target.value;
        setSelectedSubject(subject);
        calculateStudyHours(subject);
        normalizeQuizScores(subject);
    };

    const calculateStudyHours = (subject) => {
        const mlDataRaw = localStorage.getItem("taskScheduleDataForML");
        if (mlDataRaw) {
            try {
                const parsed = JSON.parse(mlDataRaw);
                const subjectTasks = parsed.filter(task =>
                    task.taskType.toLowerCase() === "study" && task.subject === subject
                );
                const totalMinutes = subjectTasks.reduce((sum, task) => sum + task.durationMinutes, 0);
                const totalHours = totalMinutes / 60;
                setInputData(prev => ({
                    ...prev,
                    study_hours: parseFloat(totalHours.toFixed(2))
                }));
            } catch (e) {
                console.error("Error processing schedule data", e);
            }
        }
    };

    const normalizeQuizScores = (subject) => {
        try {
            const rawScores = JSON.parse(localStorage.getItem("quizScores")) || [];
            const subjectScores = rawScores.filter(
                q =>
                    q.metadata &&
                    q.metadata.subject &&
                    q.metadata.subject.toLowerCase() === subject.toLowerCase()
            );

            if (subjectScores.length === 0) {
                setInputData(prev => ({ ...prev, quiz_scores: 0 }));
                return;
            }

            const normalized = subjectScores.map(s => (s.score / (s.outOf || 10)) * 100);
            const average = normalized.reduce((sum, score) => sum + score, 0) / normalized.length;

            setInputData(prev => ({
                ...prev,
                quiz_scores: parseFloat(average.toFixed(1))
            }));
        } catch (error) {
            console.error("Error normalizing quiz scores:", error);
        }
    };

    const handleChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: parseFloat(e.target.value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await predictWeakSubject(inputData);
            if (response.status === "success") {
                setResult(response);
            } else {
                setError("Prediction failed.");
            }
        } catch (err) {
            setError("Error fetching data.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to determine color and icons based on values
    const getMetricStatus = (metric, value) => {
        let color, icon;
        
        switch(metric) {
            case 'study_hours':
                if (value < 5) {
                    color = "text-red-600";
                    icon = "⏳";
                } else if (value < 10) {
                    color = "text-yellow-600";
                    icon = "🕒";
                } else {
                    color = "text-green-600";
                    icon = "✅";
                }
                break;
            case 'topics_covered':
                if (value < 5) {
                    color = "text-red-600";
                    icon = "📊";
                } else if (value < 10) {
                    color = "text-yellow-600";
                    icon = "📑";
                } else {
                    color = "text-green-600";
                    icon = "✅";
                }
                break;
            case 'quiz_scores':
                if (value < 60) {
                    color = "text-red-600";
                    icon = "📝";
                } else if (value < 80) {
                    color = "text-yellow-600";
                    icon = "📘";
                } else {
                    color = "text-green-600";
                    icon = "🏆";
                }
                break;
            case 'time_per_question':
                if (value > 2) {
                    color = "text-red-600";
                    icon = "⏱️";
                } else if (value > 1.5) {
                    color = "text-yellow-600";
                    icon = "⌛";
                } else {
                    color = "text-green-600";
                    icon = "⚡";
                }
                break;
            default:
                color = "text-gray-600";
                icon = "ℹ️";
        }
        
        return { color, icon };
    };

    return (
        <div className="min-h-screen gradient-bg">
            <LoggedInNavBar />
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center mb-12">
                     Subject Performance Analysis
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="backdrop-blur-lg bg-white/80 rounded-2xl shadow-lg p-8 h-full border border-white/20 hover:shadow-xl transition-all duration-300">
                        <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                            <span className="text-blue-600">⚡</span>
                            Input Parameters
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="transition-all duration-300 hover:transform hover:translate-x-1">
                                <label className="block text-gray-700 font-medium mb-2">Select Subject</label>
                                <select
                                    value={selectedSubject}
                                    onChange={handleSubjectChange}
                                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
                                    required
                                >
                                    <option value="" disabled>Choose your subject</option>
                                    {subjects.map((subj, idx) => (
                                        <option key={idx} value={subj}>{subj}</option>
                                    ))}
                                </select>
                            </div>

                            {Object.keys(inputData).map((key) => (
                                <div key={key} className="transition-all duration-300 hover:transform hover:translate-x-1">
                                    <label className="block text-gray-700 font-medium mb-2 capitalize flex items-center justify-between">
                                        <span>{key.replace(/_/g, " ")}</span>
                                        {(key === 'study_hours' || key === 'quiz_scores') && (
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Auto-calculated</span>
                                        )}
                                    </label>
                                    <input
                                        type="number"
                                        name={key}
                                        value={inputData[key]}
                                        onChange={handleChange}
                                        className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/70 backdrop-blur-sm transition-colors duration-300"
                                        required
                                        step="0.1"
                                    />
                                </div>
                            ))}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin">⏳</span>
                                        Processing...
                                    </span>
                                ) : (
                                    'Analyze Performance'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Output Section */}
                    <div className="backdrop-blur-lg bg-white/80 rounded-2xl shadow-lg p-8 h-full border border-white/20 hover:shadow-xl transition-all duration-300">
                        <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                            <span className="text-purple-600">🎯</span>
                            Analysis Results
                        </h3>

                        {isLoading && (
                            <div className="h-64 flex flex-col items-center justify-center">
                                <div className="relative w-16 h-16">
                                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    <div className="absolute top-2 left-2 w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                                </div>
                                <p className="mt-6 text-gray-600 animate-pulse">Analyzing your performance data...</p>
                            </div>
                        )}

                        {!result && !error && !isLoading && (
                            <div className="h-64 flex items-center justify-center">
                                <div className="text-center space-y-4 bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border border-white/40 backdrop-blur-sm">
                                    <p className="text-gray-500">
                                        Enter your parameters on the left to receive personalized insights
                                    </p>
                                    <div className="text-4xl animate-bounce">📊</div>
                                </div>
                            </div>
                        )}

                        {result && !isLoading && (
                            <div className={`backdrop-blur-sm p-6 rounded-xl transition-all duration-500 transform hover:scale-[1.01] ${
                                result.is_weak_subject 
                                    ? "bg-gradient-to-br from-red-50/90 to-orange-50/90 border-l-4 border-red-500" 
                                    : "bg-gradient-to-br from-green-50/90 to-emerald-50/90 border-l-4 border-green-500"
                            }`}>
                                <div className="flex items-center mb-4">
                                    <span className="text-3xl mr-3">
                                        {result.is_weak_subject ? "🚨" : "🌟"}
                                    </span>
                                    <div>
                                        <h3 className={`text-xl font-semibold ${
                                            result.is_weak_subject ? "text-red-700" : "text-green-700"
                                        }`}>
                                            {selectedSubject}: {result.is_weak_subject ? "Needs Improvement" : "Strong Performance"}
                                        </h3>
                                        <p className={`text-lg font-medium ${
                                            result.is_weak_subject ? "text-red-600" : "text-green-600"
                                        }`}>
                                            💡 Prediction: {result.message}
                                        </p>
                                    </div>
                                </div>

                                {/* Metric Cards */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {Object.entries(inputData).map(([key, value]) => {
                                        const { color, icon } = getMetricStatus(key, value);
                                        let label, unit = "";
                                        
                                        switch(key) {
                                            case 'study_hours': 
                                                label = "Study Hours"; 
                                                unit = "hrs";
                                                break;
                                            case 'topics_covered': 
                                                label = "Topics"; 
                                                unit = "";
                                                break;
                                            case 'quiz_scores': 
                                                label = "Quiz Score"; 
                                                unit = "%";
                                                break;
                                            case 'time_per_question': 
                                                label = "Time/Question"; 
                                                unit = "min";
                                                break;
                                            default: 
                                                label = key;
                                        }
                                        
                                        return (
                                            <div key={key} className="backdrop-blur-md bg-white/60 rounded-lg p-4 shadow-sm border border-white/40 transition-all duration-300 hover:shadow-md">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium text-gray-600">{label}</span>
                                                    <span className={`font-semibold ${color} flex items-center gap-1`}>
                                                        {icon} {value}{unit}
                                                    </span>
                                                </div>
                                                
                                                {/* Custom Progress Bar based on metrics from weak_sub.py */}
                                                {key === 'study_hours' && (
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className={`h-2 rounded-full ${value < 5 ? 'bg-red-500' : value < 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                            style={{ width: `${Math.min((value/20) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                )}
                                                
                                                {key === 'topics_covered' && (
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className={`h-2 rounded-full ${value < 5 ? 'bg-red-500' : value < 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                            style={{ width: `${Math.min((value/15) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                )}
                                                
                                                {key === 'quiz_scores' && (
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className={`h-2 rounded-full ${value < 60 ? 'bg-red-500' : value < 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                            style={{ width: `${Math.min(value, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                )}
                                                
                                                {key === 'time_per_question' && (
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className={`h-2 rounded-full ${value > 2 ? 'bg-red-500' : value > 1.5 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                            style={{ width: `${Math.min((3 - Math.min(value, 3))/3 * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Recommendations Section - Directly from weak_sub.py */}
                                <div className={`mt-5 p-4 rounded-lg ${
                                    result.is_weak_subject ? "bg-red-100" : "bg-green-100"
                                }`}>
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                        <span className="mr-2">💡</span>
                                        Personalized Tips
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.tips && result.tips.map((tip, idx) => (
                                            <li key={idx} className="flex items-start bg-white p-3 rounded shadow-sm">
                                                {/* Extract emoji if present */}
                                                {tip.match(/^([🔴⏳📝⚡✅💡📚📊⏱️]*)/)[1] ? (
                                                    <>
                                                        <span className="mr-3 text-xl">{tip.match(/^([🔴⏳📝⚡✅💡📚📊⏱️]*)/)[1]}</span>
                                                        <span className="text-gray-700">{tip.replace(/^([🔴⏳📝⚡✅💡📚📊⏱️]*)/, "").trim()}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-700">{tip}</span>
                                                )}
                                            </li>
                                        ))}
                                        
                                        {/* Generate input-specific tips like weak_sub.py does */}
                                        {inputData.study_hours < 5 && !result.tips?.some(tip => tip.includes("study hours")) && (
                                            <li className="flex items-start bg-white p-3 rounded shadow-sm">
                                                <span className="mr-3 text-xl">⏳</span>
                                                <span className="text-gray-700">Increasing study hours can boost your performance.</span>
                                            </li>
                                        )}
                                        {inputData.topics_covered < 5 && !result.tips?.some(tip => tip.includes("topics")) && (
                                            <li className="flex items-start bg-white p-3 rounded shadow-sm">
                                                <span className="mr-3 text-xl">📊</span>
                                                <span className="text-gray-700">Focus on covering more topics to get a broader understanding.</span>
                                            </li>
                                        )}
                                        {inputData.quiz_scores < 60 && !result.tips?.some(tip => tip.includes("quiz scores")) && (
                                            <li className="flex items-start bg-white p-3 rounded shadow-sm">
                                                <span className="mr-3 text-xl">📝</span>
                                                <span className="text-gray-700">Aim to improve your quiz scores through practice and time management.</span>
                                            </li>
                                        )}
                                        {inputData.time_per_question > 2 && !result.tips?.some(tip => tip.includes("quickly")) && (
                                            <li className="flex items-start bg-white p-3 rounded shadow-sm">
                                                <span className="mr-3 text-xl">⏱️</span>
                                                <span className="text-gray-700">Try to solve questions more quickly to improve time efficiency.</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {/* Action Plan */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                        <span className="mr-2">📝</span>
                                        Recommended Action Plan
                                    </h4>
                                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                        <ul className="space-y-2">
                                            {result.is_weak_subject ? (
                                                <>
                                                    <li className="flex items-center">
                                                        <span className="mr-2 text-blue-500">→</span>
                                                        <span>Schedule {Math.max(10 - inputData.study_hours, 2).toFixed(1)} additional study hours</span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <span className="mr-2 text-blue-500">→</span>
                                                        <span>Focus on covering at least {Math.max(10 - inputData.topics_covered, 0)} more topics</span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <span className="mr-2 text-blue-500">→</span>
                                                        <span>Practice with timed quizzes to improve speed and accuracy</span>
                                                    </li>
                                                    {inputData.time_per_question > 1.5 && (
                                                        <li className="flex items-center">
                                                            <span className="mr-2 text-blue-500">→</span>
                                                            <span>Aim to reduce time per question to less than 1.5 minutes</span>
                                                        </li>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <li className="flex items-center">
                                                        <span className="mr-2 text-blue-500">→</span>
                                                        <span>Maintain current study routine with regular reviews</span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <span className="mr-2 text-blue-500">→</span>
                                                        <span>Consider helping peers who might be struggling with this subject</span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <span className="mr-2 text-blue-500">→</span>
                                                        <span>Explore advanced topics to further enhance your knowledge</span>
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                
                                {/* Added note from weak_sub.py */}
                                <div className="mt-4 text-center text-xs text-gray-500">
                                    🔍 Note: This is a simulated prediction. For accurate results, use real data.
                                </div>
                            </div>
                        )}

                        {error && !isLoading && (
                            <div className="p-6 backdrop-blur-sm bg-red-50/90 rounded-xl border border-red-200 shadow-lg animate-fadeIn">
                                <div className="flex items-center mb-3">
                                    <span className="text-3xl mr-3">⚠️</span>
                                    <h3 className="text-xl font-semibold text-red-700">Analysis Error</h3>
                                </div>
                                <p className="text-red-500 font-medium">❌ {error}</p>
                                <p className="text-sm text-red-400 mt-2">Please try again or contact support if the issue persists.</p>
                                <button 
                                    onClick={() => setError(null)}
                                    className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-300 transform hover:scale-105"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeakSubjectPrediction;