 const express = require('express');
 const router = express.Router();
 const { GoogleGenerativeAI } = require('@google/generative-ai');
router.post('/generate-quiz', async (req, res) => {
   try {
     const { subject, topic, difficulty } = req.body;
    
     if (!topic) {
       return res.status(400).json({ error: 'Topic is required' });
     }

     const genAI = new GoogleGenerativeAI("AIzaAIzaSyDw7du0n26wcrNSpVXS8L6ePlI0zqS1f2o");
  
     // Define schema to match expected quiz format
    const schema = {
       type: "object",
       properties: {
         response_code: { type: "number" },
         results: {
           type: "array",
           items: {
             type: "object",
             properties: {
               type: { type: "string" },
               difficulty: { type: "string" },
               category: { type: "string" },
               question: { type: "string" },
               correct_answer: { type: "string" },
               incorrect_answers: {
                 type: "array",
                 items: { type: "string" }
               }
             },
             required: ["type", "difficulty", "category", "question", "correct_answer", "incorrect_answers"]
           }
         }
      },
       required: ["response_code", "results"]
     };

     const model = genAI.getGenerativeModel({
       model: "gemini-1.5-pro",
       generationConfig: {
         responseMimeType: "application/json",
         responseSchema: schema,
       }
     });

     const result = await model.generateContent(
       `
        Generate a quiz based on the subject "${subject}" and the topic "${topic}".
      Include 10 questions of mixed types (e.g., Multiple Choice, True/False, Fill in the blanks).
      Questions should be at "${difficulty}" difficulty level.
      Assign varying marks (e.g., 1 to 5) for each question based on its complexity.  
       `
     );

     const quizData = JSON.parse(result.response.text());
    
     res.json(quizData);
   } catch (error) {
     console.error('Error generating quiz:', error);
     res.status(500).json({ error: 'Failed to generate quiz. Please try again later.' });
   }
 });

 module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// // POST: /generate-quiz
// router.post('/generate-quiz', async (req, res) => {
//   try {
//     const { subject, topic, difficulty } = req.body;

//     if (!subject || !topic || !difficulty) {
//       return res.status(400).json({ error: 'Subject, topic, and difficulty are required' });
//     }

//     const genAI = new GoogleGenerativeAI("AIzaSyB9ndFV8z-TVUvaQr14tE-ieb3sKlkIPo8");

//     // Schema to validate Gemini response
//     const schema = {
//       type: "object",
//       properties: {
//         response_code: { type: "number" },
//         results: {
//           type: "array",
//           items: {
//             type: "object",
//             properties: {
//               type: { type: "string" },
//               difficulty: { type: "string" },
//               category: { type: "string" },
//               question: { type: "string" },
//               correct_answer: { type: "string" },
//               incorrect_answers: {
//                 type: "array",
//                 items: { type: "string" }
//               },
//               marks: { type: "number" }
//             },
//             required: ["type", "difficulty", "category", "question", "correct_answer", "incorrect_answers", "marks"]
//           }
//         }
//       },
//       required: ["response_code", "results"]
//     };

//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-pro",
//       generationConfig: {
//         responseMimeType: "application/json",
//         responseSchema: schema,
//       }
//     });

//     const prompt = `
//       Generate a quiz based on the subject "${subject}" and the topic "${topic}".
//       Include 10 questions of mixed types (e.g., Multiple Choice, True/False, Fill in the blanks).
//       Questions should be at "${difficulty}" difficulty level.
//       Assign varying marks (e.g., 1 to 5) for each question based on its complexity.   `;

//     const result = await model.generateContent(prompt);

//     const quizData = JSON.parse(result.response.text());

//     res.json(quizData);
//   } catch (error) {
//     console.error('Error generating quiz:', error);
//     res.status(500).json({ error: 'Failed to generate quiz. Please try again later.' });
//   }
// });

// module.exports = router;
