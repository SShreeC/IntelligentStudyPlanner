// import React, { useState } from "react";

// const QuizStartScreen = ({ errorMessage, onStartQuiz }) => {
//   const [topic, setTopic] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (topic.trim()) {
//       onStartQuiz(topic);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">
//           Choose a topic to test your knowledge
//         </h2>
//         <form onSubmit={handleSubmit} className="w-full">
//           <input
//             type="text"
//             placeholder="Enter your topic..."
//             value={topic}
//             onChange={(e) => setTopic(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           />
//           <button
//             type="submit"
//             disabled={!topic.trim()}
//             className={`mt-4 w-full p-3 text-white font-semibold rounded-lg transition 
//                         ${
//                           topic.trim()
//                             ? "bg-blue-500 hover:bg-blue-600"
//                             : "bg-gray-300 cursor-not-allowed"
//                         }`}
//           >
//             Start Quiz
//           </button>
//         </form>
//         {errorMessage && (
//           <p className="mt-3 text-red-500 text-sm">
//             ❌ There was an error, please try again later.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default QuizStartScreen;
import React, { useState } from "react";

const QuizStartScreen = ({ errorMessage, onStartQuiz }) => {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (subject.trim() && topic.trim() && difficulty) {
      // Store quiz metadata in localStorage
      const quizMetadata = {
        subject: subject.trim(),
        topic: topic.trim(),
        difficulty
      };

      localStorage.setItem("quizMetadata", JSON.stringify(quizMetadata));

      // Start the quiz
      onStartQuiz(subject, topic, difficulty);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🧠 Generate a Quiz
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Subject</label>
            <input
              type="text"
              placeholder="Enter subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Topic</label>
            <input
              type="text"
              placeholder="Enter topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!subject.trim() || !topic.trim() || !difficulty}
            className={`w-full p-3 font-semibold rounded-lg transition 
              ${subject.trim() && topic.trim() && difficulty
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
          >
            Start Quiz
          </button>
        </form>

        {errorMessage && (
          <p className="mt-3 text-red-500 text-sm text-center">
            ❌ There was an error. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
};

export default QuizStartScreen;
