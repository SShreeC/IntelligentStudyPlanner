// import React, { useState, useMemo } from 'react';

// function Quiz({ questions, onStoreAnswer, onEndQuiz }) {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
  
//   const shuffledOptions = useMemo(() => {
//     if (!questions || !questions[currentQuestion]) return [];
    
//     const options = [...questions[currentQuestion].incorrect_answers];
//     const randomIndex = Math.floor(Math.random() * (options.length + 1));
//     options.splice(randomIndex, 0, questions[currentQuestion].correct_answer);
//     return options;
//   }, [questions, currentQuestion]);
  
//   const submitAnswer = () => {
//     onStoreAnswer({
//       question: questions[currentQuestion],
//       userAnswer: selectedOption
//     });
    
//     setSelectedOption(null);
    
//     if (currentQuestion === questions.length - 1) {
//       setCurrentQuestion(0);
//       onEndQuiz();
//     } else {
//       setCurrentQuestion(prev => prev + 1);
//     }
//   };
  
//   return (
//     <section className="quiz container">
//       <div className="header">
//         <h2>Quiz</h2>
//         <p>Question {currentQuestion + 1} of {questions.length}</p>
//       </div>
      
//       <div className="progress-container">
//         <progress 
//           max="100" 
//           value={(currentQuestion + 1) / questions.length * 100} 
//         />
//       </div>
      
//       <div className="question">
//         <h3>{questions[currentQuestion].question}</h3>
//       </div>
      
//       <div className="answers">
//         {shuffledOptions.map((answer, index) => (
//           <button
//             key={index}
//             className={`answer ${answer === selectedOption ? 'active' : ''}`}
//             onClick={() => setSelectedOption(answer)}
//           >
//             {answer}
//           </button>
//         ))}
//       </div>
      
//       {selectedOption && (
//         <button onClick={submitAnswer}>
//           Send
//         </button>
//       )}
//     </section>
//   );
// }

// export default Quiz;



import React, { useState, useMemo } from 'react';

function Quiz({ questions, onStoreAnswer, onEndQuiz }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const shuffledOptions = useMemo(() => {
    if (!questions || !questions[currentQuestion]) return [];
    
    const options = [...questions[currentQuestion].incorrect_answers];
    const randomIndex = Math.floor(Math.random() * (options.length + 1));
    options.splice(randomIndex, 0, questions[currentQuestion].correct_answer);
    return options;
  }, [questions, currentQuestion]);

  const submitAnswer = () => {
    onStoreAnswer({
      question: questions[currentQuestion],
      userAnswer: selectedOption
    });

    setSelectedOption(null);

    if (currentQuestion === questions.length - 1) {
      setCurrentQuestion(0);
      onEndQuiz();
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  return (
    <section className="max-w-3xl mx-auto py-8 px-5 bg-white shadow-lg rounded-2xl border border-gray-200">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quiz Time! 🎯</h2>
        <p className="text-gray-500 text-sm">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-6">
        <div 
          className="bg-blue-500 h-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{questions[currentQuestion].question}</h3>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {shuffledOptions.map((answer, index) => (
          <button
            key={index}
            className={`px-4 py-3 rounded-lg font-medium text-gray-800 border transition-all duration-200 ${
              answer === selectedOption 
                ? "bg-blue-500 text-white border-blue-500"
                : "border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedOption(answer)}
          >
            {answer}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      {selectedOption && (
        <button 
          onClick={submitAnswer}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
        >
          Submit Answer
        </button>
      )}
    </section>
  );
}

export default Quiz;
