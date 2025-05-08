
// import React, { useMemo } from "react";

// function Result({ userAnswers, onRestartQuiz }) {
//   const correctAnswersCount = useMemo(() => {
//     return userAnswers.filter(
//       (answer) => answer.userAnswer === answer.question.correct_answer
//     ).length;
//   }, [userAnswers]);

//   return (
//     <section className="result-screen flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-10">
//       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl text-center">
//         {correctAnswersCount === userAnswers.length ? (
//           <h1 className="text-3xl font-bold text-green-600 mb-3">🎉 Congratulations!</h1>
//         ) : (
//           <h1 className="text-3xl font-bold text-gray-800 mb-3">Quiz Results</h1>
//         )}

//         <p className="text-lg text-gray-600 mb-6">
//           You answered{" "}
//           <span className="font-semibold text-blue-600">{correctAnswersCount}</span>{" "}
//           out of{" "}
//           <span className="font-semibold text-gray-800">{userAnswers.length}</span>{" "}
//           questions correctly.
//         </p>

//         <ul className="results-list space-y-4 text-left">
//           {userAnswers.map((answer, index) => {
//             const isCorrect = answer.question.correct_answer === answer.userAnswer;

//             return (
//               <li
//                 key={index}
//                 className={`p-4 rounded-lg shadow-md ${
//                   isCorrect ? "bg-green-100 border-l-4 border-green-500" : "bg-red-100 border-l-4 border-red-500"
//                 }`}
//               >
//                 <p className="text-lg font-semibold text-gray-800">{answer.question.question}</p>
//                 <p className="text-sm text-gray-600">
//                   Your answer:{" "}
//                   <span className={isCorrect ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
//                     {answer.userAnswer}
//                   </span>
//                 </p>
//                 {!isCorrect && (
//                   <p className="text-sm text-gray-500">
//                     Correct answer:{" "}
//                     <span className="text-gray-800 font-semibold">{answer.question.correct_answer}</span>
//                   </p>
//                 )}
//               </li>
//             );
//           })}
//         </ul>

//         <button
//           onClick={onRestartQuiz}
//           className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
//         >
//           Create a New Quiz
//         </button>
//       </div>
//     </section>
//   );
// }

// export default Result;
import React, { useMemo, useEffect } from "react";

function Result({ userAnswers, onRestartQuiz }) {
  const correctAnswersCount = useMemo(() => {
    return userAnswers.filter(
      (answer) => answer.userAnswer === answer.question.correct_answer
    ).length;
  }, [userAnswers]);

  // Store score in localStorage
  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem("quizScores")) || [];
    const newScore = { date: new Date().toLocaleString(), score: correctAnswersCount };
    console.log("New score:", newScore); 
    localStorage.setItem("quizScores", JSON.stringify([...storedScores, newScore]));
  }, [correctAnswersCount]);

  return (
    <section className="result-screen flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-10">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl text-center">
        {correctAnswersCount === userAnswers.length ? (
          <h1 className="text-3xl font-bold text-green-600 mb-3">🎉 Congratulations!</h1>
        ) : (
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Quiz Results</h1>
        )}

        <p className="text-lg text-gray-600 mb-6">
          You answered{" "}
          <span className="font-semibold text-blue-600">{correctAnswersCount}</span>{" "}
          out of{" "}
          <span className="font-semibold text-gray-800">{userAnswers.length}</span>{" "}
          questions correctly.
        </p>

        <ul className="results-list space-y-4 text-left">
          {userAnswers.map((answer, index) => {
            const isCorrect = answer.question.correct_answer === answer.userAnswer;

            return (
              <li
                key={index}
                className={`p-4 rounded-lg shadow-md ${
                  isCorrect ? "bg-green-100 border-l-4 border-green-500" : "bg-red-100 border-l-4 border-red-500"
                }`}
              >
                <p className="text-lg font-semibold text-gray-800">{answer.question.question}</p>
                <p className="text-sm text-gray-600">
                  Your answer:{" "}
                  <span className={isCorrect ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {answer.userAnswer}
                  </span>
                </p>
                {!isCorrect && (
                  <p className="text-sm text-gray-500">
                    Correct answer:{" "}
                    <span className="text-gray-800 font-semibold">{answer.question.correct_answer}</span>
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        <button
          onClick={onRestartQuiz}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
        >
          Create a New Quiz
        </button>
      </div>
    </section>
  );
}

export default Result;
