// // const express = require("express");
// // const cors = require("cors");
// // const webpush=require('web-push');

// // const bodyParser = require("body-parser");
// // const loginRoute = require("./src/routes/login");
// // const signupRoute = require("./src/routes/signup");
// // const taskRoute =require("./src/routes/taskRoute");
// //  const endTimeRoutes=require("./src/routes/endTimeRoute");
// // const profileRoute = require("./src/routes/profileRoute");
// // const app = express();
// // const publicVapidKey = 'BMr253PJCTy2VgA-j5uJEjWV69FbbB8ArIBcOzaheT53ta84T3SCtBjIk8SCmcSCJQlJtEFM_7_xTIb7_GA3Bc8';
// // const privateVapidKey = 'COfTnjTK92d9uPZeC6c203yWXXbfUCv3OGiRe7Q77GU';
// // // const PORT = process.env.PORT || 5000;
// // const PORT = process.env.PORT || 5000; // Change port number here
// // const mongoose=require('./src/configuration/dbConfig');
// // app.use(bodyParser.json());
// // app.use(cors());
// // webpush.setVapidDetails('mailto:internco1234@gmail.com', publicVapidKey, privateVapidKey);
// // app.post('/api/save-subscription', (req, res) => {
// //   const subscription = req.body;
// //   console.log('Subscription received:', subscription);
// //   res.status(201).json({});
// // });
// // app.use("/user", signupRoute);
// // app.use("/auth", loginRoute);
// // app.use('/end', endTimeRoutes); 
// // app.use('/task',taskRoute);
// // app.use('/profile', profileRoute);
// // app.listen(PORT, () => {
// //   console.log(`Server is running on http://localhost:${PORT}`);
// // });

// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// const loginRoute = require("./src/routes/login");
// const signupRoute = require("./src/routes/signup");
// const taskRoute = require('./src/routes/taskRoute'); // Import task routes
// const { verifyToken } = require('./src/utils/authMiddleware'); // Import authentication middleware
// const endTimeRoutes=require("./src/routes/endTimeRoute"); 
// dotenv.config(); // Load environment variables

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // Public Routes
// app.use("/user", signupRoute);
// app.use("/auth", loginRoute);
// // Protected Routes with Authentication
// app.use('/end',endTimeRoutes);
// app.use('/task',taskRoute); // Use token verification middleware for task routes
// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send({ error: 'Something went wrong!' });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const webpush = require("web-push");
const loginRoute = require("./src/routes/login");
const signupRoute = require("./src/routes/signup");
const taskRoute = require("./src/routes/taskRoute");
const endTimeRoutes = require("./src/routes/endTimeRoute");
const { verifyToken } = require("./src/utils/authMiddleware");
const webhook =require("./src/controllers/webhook");
dotenv.config(); // Load environment variables
const app = express();
const PORT = process.env.PORT || 5000;
const apiRoutes = require("./src/routes/quiz_api"); // Import API routes
// Middleware
app.use(bodyParser.json());
app.use(cors());

// Public Routes
app.use("/user", signupRoute);
app.use("/auth", loginRoute);
app.use('/api', apiRoutes);
// Protected Routes with Authentication
app.use("/end", endTimeRoutes);
app.use("/task", taskRoute);

app.use("/wbhk",webhook);
let subDatabase = [];  // Store subscriptions in memory
let reminders = [];    // Store reminders in memory

const apiKeys = {
  publicKey: 'BFeTpHrYh9Us0moXwbbzsSxZvVdTx1kjyyt5zgDNyemh4j5wI9BVoIwPc-mrE9dcF5Dj8FXAH1LJ4YnWkNQfXRM',
  privateKey: 'WgFaEWzjAE481lBYK9mNiNJCspkhBB5TLvxIrsOO9v4',
};

webpush.setVapidDetails(
  'mailto:internco1234@gmail.com',
  apiKeys.publicKey,
  apiKeys.privateKey
);

app.post('/save-subscribe', (req, res) => {
  const subscription = req.body;
  subDatabase.push(subscription);
  res.json({ status: 'success', message: 'Subscription saved!' });

  // Automatically schedule a reminder after 1 hour
  const delay = 1*60 * 1000; // 1 hour in milliseconds 60 * 60 * 1000;  (here for demonstration used 15seconds)
  setTimeout(() => {
    sendNotificationToAllSubscribers({
      title: 'Drink Water Reminder',
      body: 'It’s been an hour, time to drink water!',
    });
  }, delay);
});

app.post('/add-reminder', (req, res) => {
  const { title, body, time } = req.body;

  const reminderTime = new Date(time).getTime();
  const currentTime = new Date().getTime();

  if (reminderTime <= currentTime) {
    return res.status(400).json({ status: 'error', message: 'Invalid reminder time' });
  }

  reminders.push({ title, body, time: reminderTime });
  res.json({ status: 'success', message: 'Reminder added!' });

  const delay = reminderTime - currentTime;
  setTimeout(() => {
    sendNotificationToAllSubscribers({ title, body });
  }, delay);
});

const sendNotificationToAllSubscribers = (notificationPayload) => {
  subDatabase.forEach(subscription => {
    webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
      .then(() => console.log('Notification sent!'))
      .catch(err => console.error('Error sending notification:', err));
  });
};
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
