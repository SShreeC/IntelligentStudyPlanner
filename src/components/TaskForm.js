
import React, { useState, useEffect } from 'react';
import './CV.css';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';

const TaskForm = ({ onSubmit }) => {
  const [subject, setSubject] = useState('');
  const [taskType, setTaskType] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [summary, setSummary] = useState('');
  const [subjects, setSubjects] = useState([]); // State for subjects
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/task/getSub', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add JWT token here
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSubjects(data); // Set the fetched subjects
        } else {
          toast.error('Error fetching subjects. Please try again.');
        }
      } catch (error) {
        toast.error('Failed to fetch subjects. Server error.');
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    if (subject && taskType && priority && dueDate) {
      setSummary(`${subject} - ${taskType}, Priority: ${priority}, Due Date: ${dueDate}`);
    } else {
      setSummary('');
    }
  }, [subject, taskType, priority, dueDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (subject && taskType && priority && dueDate) {
      try {
        const response = await fetch('http://localhost:5000/task/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add JWT token here
          },
          body: JSON.stringify({ subject, taskType, priority, dueDate }),
        });

        if (response.ok) {
          const newTask = await response.json();
          setMessage('Task added successfully!');
          toast.success('Task added successfully');

          // Reset the form fields
          setSubject('');
          setTaskType('');
          setPriority('');
          setDueDate('');
          setSummary('');

          if (onSubmit) {
            onSubmit(newTask); // Pass the new task to parent for calendar/task list
          }
        } else {
          toast.error('Error adding task. Please try again.');
        }
      } catch (error) {
        toast.error('Failed to add task. Server error.');
      }
    } else {
      toast.error('Please fill out all fields.');
    }
  };

  const handleSchedule = () => {
    navigate('/schedule'); 
  };

  return (
    <div className="card bg-base-100 shadow-lg opacity-90 mx-auto p-2 max-w-xs" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-1 gap-2 mb-2">
          <div>
            <label className="label" htmlFor="subject">Subject</label>
            <select
              id="subject"
              className='select select-bordered w-full h-8 text-sm'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              aria-label="Select Subject"
            >
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub.subject}>{sub.subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="taskType">Task Type</label>
            <select
              id="taskType"
              className='select select-bordered w-full h-8 text-sm'
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              aria-label="Select Task Type"
            >
              <option value="">Select Type</option>
              <option value="Assignment">Assignment</option>
              <option value="Study">Study</option>
              <option value="Practical">Practical</option> <option value="Others">Others</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="priority">Priority</label>
            <select
              id="priority"
              className='select select-bordered w-full h-8 text-sm'
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              aria-label="Select Priority"
            >
              <option value="">Select Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              className='input input-bordered w-full h-8 text-sm'
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Select Due Date"
            />
          </div>
        </div>
        <div className="mb-2">
          <label className="label" htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            className='input input-bordered w-full h-8 text-sm'
            type="text"
            value={summary}
            readOnly
            aria-label="Task Summary"
          />
        </div>
        <button className='btn btn-outline btn-info w-full h-8 text-sm' type="submit">Add Task</button>
      </form>

      {/* Schedule Button */}
      <div className="mt-2">
        <button className='btn btn-outline btn-info w-full h-8 text-sm' onClick={handleSchedule}>Schedule Task</button>
      </div>

      {/* Display success/error message */}
      {message && <div className="mt-2 text-xs text-red-500">{message}</div>}
    </div>
  );
};

export default TaskForm;
