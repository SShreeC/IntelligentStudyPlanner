
import React, { useState } from 'react'; 
import SubjectInputCard from './SubjectInputCard';
import TaskForm from './TaskForm';
import CalendarView from './CalendarView'; 
import TaskList from './TaskList';
import LoggedInNavBar from './LoggedInNavBar';
import './CV.css'; 
import SubjectEndTimeList from './SubjectEndTimeList';

const MainComponent = () => {
  const [subjects, setSubjects] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);

  const handleAddSubject = (subject) => {
    setSubjects([...subjects, subject]);
  };

  const handleDone = () => {
    setShowTaskForm(true);
  };

  const handleTaskSubmit = (task) => {
    setTasks([...tasks, task]);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Optional Navbar */}
      <LoggedInNavBar />
      
      <div className="flex flex-col lg:flex-row flex-grow gap-6 p-6 overflow-y-auto">
        {/* Column 1: Task List */}
        <div className="card bg-base-300 rounded-box flex-grow max-w-full lg:max-w-xs">
          {/* <h2 className="text-lg font-bold mb-4">Task List</h2> */}
          <TaskList tasks={tasks} />
        </div>

        {/* Column 2: Subject Input or Task Form */}
        <div className="card bg-base-300 rounded-box flex-grow max-w-full lg:max-w-xs">
          {!showTaskForm ? (
            <SubjectInputCard onAddSubject={handleAddSubject} onDone={handleDone} />
          ) : (
            <TaskForm subjects={subjects} onSubmit={handleTaskSubmit} />
          )}
        </div>

        {/* Column 3: Calendar View */}
        {showTaskForm && (
          <div className="card bg-base-300 rounded-box flex-grow max-w-full lg:max-w-xs">
            <CalendarView tasks={tasks} />
          </div>
        )}

        {/* Column 4: Subject End Time List */}
        <div className="card bg-base-300 rounded-box flex-grow max-w-full lg:max-w-xs">
          
          <SubjectEndTimeList/>
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
