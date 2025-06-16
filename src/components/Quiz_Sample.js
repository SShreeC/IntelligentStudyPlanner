

import React, { useState } from "react";
import StartScreen from "./quizStartScreen";
import Quiz from "./Quiz_UI";
import Result from "./Result";
import Loader from "./Loader";
import { motion } from "framer-motion";

const Quiz_Sample = () => {
  const [questions, setQuestions] = useState(null);
  const [status, setStatus] = useState("start");
  const [userAnswers, setUserAnswers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const restartQuiz = () => {
    setQuestions(null);
    setStatus("start");
    setUserAnswers([]);
    setErrorMessage("");
  };

  const storeAnswer = (answer) => {
    setUserAnswers((prev) => [...prev, answer]);
  };

  const startQuiz = async ( subject, topic, difficulty) => {
    setStatus("loading");

    try {
      const response = await fetch("http://localhost:5000/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  subject, topic, difficulty }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quiz. Please try again.");
      }

      const data = await response.json();
      setQuestions(data);
      setStatus("ready");
    } catch (error) {
      console.error("Error starting quiz:", error);
      setErrorMessage(error.message);
      setStatus("start");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Header */}
      <motion.header 
        className="bg-white shadow-md w-full py-4 px-6 flex justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="App Logo" className="h-10 w-10" />
          <h1 className="text-2xl font-bold text-gray-800">Quiz Generator</h1>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.div 
        className="w-full max-w-3xl mt-6 bg-white shadow-lg rounded-lg p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {status === "start" && (
          <StartScreen errorMessage={errorMessage} onStartQuiz={startQuiz} />
        )}
        {status === "loading" && <Loader />}
        {status === "ready" && (
          <Quiz 
            questions={questions.results} 
            onEndQuiz={() => setStatus("finished")} 
            onStoreAnswer={storeAnswer} 
          />
        )}
        {status === "finished" && <Result userAnswers={userAnswers} onRestartQuiz={restartQuiz} />}
      </motion.div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div 
          className="mt-4 text-red-600 bg-red-100 px-4 py-2 rounded-md shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {errorMessage}
        </motion.div>
      )}
    </div>
  );
};

export default Quiz_Sample;
