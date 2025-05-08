import React, { useState, useEffect } from "react";
import { predictProgress } from "../services/progressAPI";
import { motion } from "framer-motion";
import LoggedInNavBar from "../components/LoggedInNavBar";

const ProgressPrediction = () => {
    const [inputData, setInputData] = useState({
        study_hours: 0,
        topics_covered: 34,
        quiz_scores: 0
    });

    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [tips, setTips] = useState([]);

    // Load subjects from localStorage (study tasks only)
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
    }, []);

    // Generate personalized tips based on user's data and progress
    const generateTips = (studyHours, topics, quizScores, progress) => {
        const tipsList = [];

        if (studyHours < 8) {
            tipsList.push("⏰ Try to increase your daily study hours.");
        } else if (studyHours >= 15) {
            tipsList.push("✅ Great study routine! Stay balanced.");
        }

        if (topics < 25) {
            tipsList.push("🧠 Cover more topics for better grip.");
        } else if (topics >= 40) {
            tipsList.push("📚 You're covering a lot, nice going!");
        }

        if (quizScores < 40) {
            tipsList.push("📝 Consider practicing quizzes more often.");
        } else if (quizScores >= 50) {
            tipsList.push("🥇 Strong quiz scores! Keep it up.");
        }

        if (progress >= 80) {
            tipsList.push("🚀 Excellent progress overall!");
        } else if (progress >= 60) {
            tipsList.push("📈 You're doing well, a bit more push!");
        } else {
            tipsList.push("🛠️ Time to restructure your study plan.");
        }

        return tipsList.slice(0, 3); // Return top 3 tips
    };

    // Handle subject change and update study hours + quiz scores
    const handleSubjectChange = (e) => {
        const subject = e.target.value;
        setSelectedSubject(subject);
        updateStudyHours(subject);
        updateQuizScores(subject);
    };

    // Calculate study hours from scheduled tasks
    const updateStudyHours = (subject) => {
        const mlDataRaw = localStorage.getItem("taskScheduleDataForML");
        if (mlDataRaw) {
            try {
                const parsed = JSON.parse(mlDataRaw);
                const subjectTasks = parsed.filter(task =>
                    task.taskType.toLowerCase() === "study" && task.subject === subject
                );
                const totalMinutes = subjectTasks.reduce((sum, task) => sum + task.durationMinutes, 0);
                const totalHours = totalMinutes / 60;

                setInputData(prev => ({ ...prev, study_hours: parseFloat(totalHours.toFixed(2)) }));
            } catch (e) {
                console.error("Error processing schedule data", e);
            }
        }
    };

    // Normalize and average quiz scores
    const updateQuizScores = (subject) => {
        try {
            const storedScores = JSON.parse(localStorage.getItem("quizScores")) || [];

            const subjectScores = storedScores.filter(
                q =>
                    q.metadata &&
                    q.metadata.subject &&
                    q.metadata.subject.toLowerCase() === subject.toLowerCase()
            );

            if (subjectScores.length === 0) {
                setInputData(prev => ({ ...prev, quiz_scores: 0 }));
                return;
            }

            const normalizedScores = subjectScores.map(s =>
                (s.score / (s.outOf || 10)) * 100
            );

            const average = normalizedScores.reduce((sum, score) => sum + score, 0) / normalizedScores.length;

            setInputData(prev => ({
                ...prev,
                quiz_scores: parseFloat(average.toFixed(1))
            }));

            console.log(`Normalized quiz scores for ${subject}:`, normalizedScores);
            console.log(`Average: ${average.toFixed(1)}%`);
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
            const response = await predictProgress(inputData);
            if (response.status === "success") {
                const progressValue = response.syllabus_completion_percentage;
                setResult(progressValue);
                
                // Generate personalized tips
                const generatedTips = generateTips(
                    inputData.study_hours,
                    inputData.topics_covered,
                    inputData.quiz_scores,
                    progressValue
                );
                setTips(generatedTips);
            } else {
                setError("Failed to predict progress.");
            }
        } catch (err) {
            setError("Error fetching data.");
        }
    };

    // Get the progress color based on percentage
    const getProgressColor = (percentage) => {
        if (percentage >= 75) return { bg: "bg-green-500", text: "text-green-800" };
        if (percentage >= 50) return { bg: "bg-blue-500", text: "text-blue-800" };
        if (percentage >= 25) return { bg: "bg-yellow-500", text: "text-yellow-800" };
        return { bg: "bg-red-500", text: "text-red-800" };
    };

    // Get effort level based on study hours
    const getEffortLevel = (hours) => {
        if (hours >= 15) return "High effort";
        if (hours >= 8) return "Moderate effort";
        return "Low effort";
    };

    // Get performance level based on quiz scores
    const getPerformanceLevel = (scores) => {
        if (scores >= 60) return "Better performance";
        if (scores >= 40) return "Moderate performance";
        return "Needs improvement";
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
                    Progress Prediction
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
        
                            {/* Study Hours (readonly) */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Study Hours 
                                    <span className="text-xs ml-2 text-blue-600">(calculated from schedule)</span>
                                </label>
                                <input
                                    type="number"
                                    name="study_hours"
                                    value={inputData.study_hours}
                                    readOnly
                                    className="w-full px-4 py-2 bg-gray-100 border rounded-lg cursor-not-allowed"
                                />
                                {inputData.study_hours > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {getEffortLevel(inputData.study_hours)}
                                    </p>
                                )}
                            </div>
        
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Topics Covered</label>
                                <input
                                    type="number"
                                    name="topics_covered"
                                    value={inputData.topics_covered}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
        
                            {/* Quiz Scores (editable but pre-filled) */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Quiz Scores 
                                    <span className="text-xs ml-2 text-blue-600">(average % for subject)</span>
                                </label>
                                <input
                                    type="number"
                                    name="quiz_scores"
                                    value={inputData.quiz_scores}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                {inputData.quiz_scores > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {getPerformanceLevel(inputData.quiz_scores)}
                                    </p>
                                )}
                            </div>
        
                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Predict Progress
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
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Prediction Results</h3>
                        
                        {result !== null ? (
                            <div className="space-y-6">
                                {/* Prediction Summary */}
                                <div className="p-5 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                                    <h4 className="text-lg font-semibold text-blue-800 flex items-center">
                                        <span className="mr-2">📚</span>
                                        Predicted Progress
                                    </h4>
                                    <div className="flex items-center justify-between mt-3">
                                        <p className="text-4xl font-bold text-blue-700">{result.toFixed(1)}%</p>
                                    </div>
                                    <div className="mt-3 w-full bg-blue-100 rounded-full h-3">
                                        <div 
                                            className="bg-blue-600 h-3 rounded-full" 
                                            style={{ width: `${Math.min(result, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-blue-700 mt-1">
                                        <span>0%</span>
                                        <span>50%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                                

                                
                                {/* Tips Section */}
                                <div className="p-5 bg-green-50 border-l-4 border-green-500 rounded-lg">
                                    <h4 className="text-lg font-semibold text-green-800 flex items-center">
                                        <span className="mr-2">💡</span>
                                        Personalized Tips
                                    </h4>
                                    <ul className="mt-3 space-y-3">
                                        {tips.map((tip, index) => (
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
                                    Fill in the parameters on the left and click "Predict Progress" to see recommendations
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProgressPrediction;