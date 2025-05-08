
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import LandingPage from './components/LandingPage';
// import AuthForm from './auth/authForm';
// import MainComponent from './components/MainComponent';
// import { ToastContainer } from 'react-toastify';
// import LoggedInNavBar from './components/LoggedInNavBar';
// const App = () => {
//   return (
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/auth" element={<AuthForm />} /> 
//         <Route path='/tasks' element={ <MainComponent />}/>
//         <Route path="/dashboard" element={<LoggedInNavBar/>}/>
//       </Routes>
   
//   );
// };

// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthForm from './auth/authForm';
import MainComponent from './components/MainComponent';
import { ToastContainer } from 'react-toastify';
import ScheduleTask from './components/scheduleTask';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import Dashboard from './components/dashboard';
import ReminderForm from './components/reminder';
import RelaxationCorner from './components/RelaxationCorner';
import ComingSoonPage from './components/comingSoon';
import AdaptiveStudyPlan from './components/AdaptiveStudyPlan';
import StudyTimePrediction from './components/study_time';
import WeakSubjectPrediction from './components/WeakSubjectPrediction';
import ExamReadinessPrediction from './components/ExamReadinessPrediction';
import ProgressPrediction from './components/ProgressPrediction';
import Quiz_Sample from './components/Quiz_Sample';
import MLFeaturesDashboard from './components/MLFeaturesDashboard';
import { useState,useEffect } from 'react';
const App = () => {
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    } 
  }, []);
  
  return (
    
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path='/tasks' element={<MainComponent />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schedule" element={<ScheduleTask />} />
          <Route path="/remainder" element={<ReminderForm />} />
          <Route path="/relaxation" element={<RelaxationCorner/>} />
          <Route path="/coming-soon" element={<ComingSoonPage/>} />
          <Route path="/adaptive-study-plan" element={<AdaptiveStudyPlan />} />
          <Route path="/studyTime" element={<StudyTimePrediction />} />
          <Route path="/weak_sub" element={<WeakSubjectPrediction />} />
          <Route path="/exam_ready" element={<ExamReadinessPrediction />} />
          <Route path="/progress_predict" element={<ProgressPrediction />} />
          <Route path="/quiz" element={<Quiz_Sample/>}/>
          <Route path="/ml_features" element={<MLFeaturesDashboard />} />
        </Routes>
        <ToastContainer /> {/* Include ToastContainer */}
      </div>
   
  );
};

export default App;
