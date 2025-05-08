
// import React, { useState, useEffect } from 'react';
// import './CV.css';
// import { toast } from 'react-toastify';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import TaskListProgress from './TaskListProgress';
// import LoggedInNavBar from './LoggedInNavBar';
// import ScheduleTasksList from './ScheduleTaskList';
// import RelaxationCorner from './RelaxationCorner';

// const ScheduleTasks = () => {
//   const [tasks, setTasks] = useState([]);
//   const [endTimes, setEndTimes] = useState({});
//   const [date, setDate] = useState(new Date());
//   const [scheduledTasks, setScheduledTasks] = useState({});
//   const [daysBefore, setDaysBefore] = useState(2);
//   const [selectedDateTasks, setSelectedDateTasks] = useState([]);

//   useEffect(() => {
//     fetchEndTimes();
//     fetchTasks();
//   }, []);

//   const fetchEndTimes = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/end/getEndTime', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setEndTimes(data.endTimes);
//       } else {
//         toast.error('Error fetching end times. Please try again.');
//       }
//     } catch (error) {
//       toast.error('Failed to fetch end times. Server error.');
//     }
//   };

//   const fetchTasks = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/task/myTasks', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (response.ok) {
//         const tasksData = await response.json();
//         setTasks(tasksData);
//       } else {
//         toast.error('Error fetching tasks. Please try again.');
//       }
//     } catch (error) {
//       toast.error('Failed to fetch tasks. Server error.');
//     }
//   };

//   const dayMapping = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

//   const scheduleTasks = async () => {
//     if (tasks.length === 0 || Object.keys(endTimes).length === 0) {
//       toast.error('No tasks or end times available for scheduling');
//       return;
//     }

//     const scheduledTasksMap = {};

//     for (const task of tasks) {
//       const dueDate = new Date(task.dueDate);
//       // await createReminder(task._id, task.scheduledStartTime);
//       if (dueDate < new Date()) continue;

//       const dayOfWeek = dueDate.getDay();
//       const dayString = dayMapping[dayOfWeek];
//       const userEndTime = endTimes[dayString];

//       if (!userEndTime) {
//         toast.error(`No end time specified for ${dayString}`);
//         return;
//       }

//       const [hours, minutes] = userEndTime.split(':').map(Number);
//       const userEndDateTime = new Date(dueDate);
//       userEndDateTime.setHours(hours, minutes, 0, 0);

//       const scheduledDate = new Date(dueDate);
//       scheduledDate.setDate(dueDate.getDate() - daysBefore);

//       const workDuration = 1.5 * 60 * 60 * 1000; // 1.5 hours
//       const breakDuration = 25 * 60 * 1000; // 25 minutes

//       let lastEndTime = scheduledDate;

//       if (!scheduledTasksMap[scheduledDate.toISOString().split('T')[0]]) {
//         scheduledTasksMap[scheduledDate.toISOString().split('T')[0]] = [];
//       }

//       if (scheduledTasksMap[scheduledDate.toISOString().split('T')[0]].length > 0) {
//         const lastTask = scheduledTasksMap[scheduledDate.toISOString().split('T')[0]].slice(-1)[0];
//         lastEndTime = lastTask.scheduledBreakEndTime;
//       }

//       task.scheduledStartTime = new Date(lastEndTime.getTime());
//       task.scheduledEndTime = new Date(task.scheduledStartTime.getTime() + workDuration);
//       task.scheduledBreakStartTime = task.scheduledEndTime;
//       task.scheduledBreakEndTime = new Date(task.scheduledBreakStartTime.getTime() + breakDuration);

//       scheduledTasksMap[scheduledDate.toISOString().split('T')[0]].push(task);

//       // Call backend API to update task with scheduled start date and duration
//       const scheduledDurationMinutes = (task.scheduledEndTime - task.scheduledStartTime) / 1000 / 60;
//       await updateTaskScheduledDate(task._id, task.scheduledStartTime, scheduledDurationMinutes);
//     }
   
//     setScheduledTasks(scheduledTasksMap);
//     toast.success('Tasks scheduled successfully!');
//   };


//   const updateTaskScheduledDate = async (taskId, scheduledStartDate, scheduledDurationMinutes) => {
//     try {
//       const response = await fetch(`http://localhost:5000/task/updateScheduledDate/${taskId}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ scheduledStartDate, scheduledDurationMinutes }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update scheduled date');
//       }
//     } catch (error) {
//       toast.error('Error updating scheduled task date. Server error.');
//     }
//   };

//   const handleRescheduleTask = async (taskId, newDate, newStartTime) => {
//     try {
//       const task = tasks.find(t => t._id === taskId);
//       if (!task) {
//         toast.error('Task not found');
//         return;
//       }

//       const [hours, minutes] = newStartTime.split(':').map(Number);
//       const newStartDate = new Date(newDate);
//       newStartDate.setHours(hours, minutes, 0, 0);

//       const workDuration = 1.5 * 60 * 60 * 1000;
//       const breakDuration = 25 * 60 * 1000;

//       const newEndDate = new Date(newStartDate.getTime() + workDuration);
//       const newBreakStartDate = newEndDate;
//       const newBreakEndDate = new Date(newBreakStartDate.getTime() + breakDuration);

//       const updatedTask = {
//         ...task,
//         scheduledStartTime: newStartDate,
//         scheduledEndTime: newEndDate,
//         scheduledBreakStartTime: newBreakStartDate,
//         scheduledBreakEndTime: newBreakEndDate,
//       };

//       const scheduledDurationMinutes = workDuration / 1000 / 60;
//       await updateTaskScheduledDate(taskId, newStartDate, scheduledDurationMinutes);

//       // Update the scheduledTasks state
//       setScheduledTasks(prevScheduledTasks => {
//         const updatedScheduledTasks = { ...prevScheduledTasks };
//         const oldDateKey = task.scheduledStartTime.toISOString().split('T')[0];
//         const newDateKey = newStartDate.toISOString().split('T')[0];
        
//         // Remove the task from the old date
//         if (updatedScheduledTasks[oldDateKey]) {
//           updatedScheduledTasks[oldDateKey] = updatedScheduledTasks[oldDateKey].filter(t => t._id !== taskId);
//           if (updatedScheduledTasks[oldDateKey].length === 0) {
//             delete updatedScheduledTasks[oldDateKey];
//           }
//         }
        
//         // Add the task to the new date
//         if (!updatedScheduledTasks[newDateKey]) {
//           updatedScheduledTasks[newDateKey] = [];
//         }
//         updatedScheduledTasks[newDateKey].push(updatedTask);
        
//         return updatedScheduledTasks;
//       });

//       toast.success('Task rescheduled successfully');
//     } catch (error) {
//       toast.error('Error rescheduling task. Please try again.');
//     }
//   };

// const handleDateChange = (newDate) => {
//   setDate(newDate);
//   const dateString = newDate.toISOString().split('T')[0];
//   setSelectedDateTasks(scheduledTasks[dateString] || []);
// };

// const tileContent = ({ date, view }) => {
//   if (view === 'month') {
//     const dateString = date.toISOString().split('T')[0];
//     const tasksForDate = scheduledTasks[dateString] || [];
    
//     if (tasksForDate.length > 0) {
//       return (
//         <div className="task-indicator">
//           {tasksForDate.map((task, index) => (
//             <div
//               key={index}
//               className="task-dot"
//               style={{
//                 backgroundColor: getTaskColor(task),
//                 width: '6px',
//                 height: '6px',
//                 borderRadius: '50%',
//                 margin: '1px',
//                 display: 'inline-block'
//               }}
//             />
//           ))}
//         </div>
//       );
//     }
//   }
//   return null;
// };

// const getTaskColor = (task) => {
//   // You can implement your own logic to assign colors based on task properties
//   const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#33FFF1'];
//   return colors[Math.floor(Math.random() * colors.length)];
// };

// return (
//   <div>
//     <LoggedInNavBar />
//     <div className="layout-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
//       <div className="column">
//         <h4>Task Progress</h4>
//         <TaskListProgress />
//       </div>
//       <div className="column">
//         <button className="btn btn-outline" onClick={scheduleTasks}>  
//           Schedule Tasks
//         </button>
//         <ScheduleTasksList 
//           scheduledTasks={scheduledTasks} 
//           onRescheduleTask={handleRescheduleTask}
//         />
//       </div>
//       <div className="column">
//         <Calendar
//           onChange={handleDateChange}
//           value={date}
//           // tileContent={tileContent}
//           onClickDay={(value) => {
//             const dateString = value.toISOString().split('T')[0];
//             setSelectedDateTasks(scheduledTasks[dateString] || []);
//           }}
//           className="custom-calendar"
//         />
//         <div style={{ marginTop: '20px' }}>
//           <h4>Selected Date Tasks:</h4>
//           <ul style={{ listStyleType: 'none', padding: 0 }}>
//             {selectedDateTasks.map(task => (
//               <li key={task._id} style={{ 
//                 padding: '10px', 
//                 backgroundColor: 'lightyellow', 
//                 borderRadius: '5px', 
//                 marginBottom: '10px',
//                 borderLeft: `5px solid ${getTaskColor(task)}`
//               }}>
//                 <strong>{task.title}</strong>
//                 <br />
//                 Scheduled: {new Date(task.scheduledStartTime).toLocaleTimeString()} - {new Date(task.scheduledEndTime).toLocaleTimeString()}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <div className="column">
//         <RelaxationCorner />
//       </div>
//     </div>
//     <style jsx>{`
//       .custom-calendar {
//         background: #fff;
//         border: 1px solid #ccc;
//         border-radius: 5px;
//         padding: 10px;
//       }
//       .task-indicator {
//         display: flex;
//         justify-content: center;
//         flex-wrap: wrap;
//         margin-top: 2px;
//       }
//       .task-dot {
//         width: 6px;
//         height: 6px;
//         border-radius: 50%;
//         margin: 1px;
//       }
//     `}</style>
//   </div>
// );
// };

// export default ScheduleTasks;

//new
import React, { useState, useEffect } from 'react';
import './CV.css';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TaskListProgress from './TaskListProgress';
import LoggedInNavBar from './LoggedInNavBar';
import ScheduleTasksList from './ScheduleTaskList';
import RelaxationCorner from './RelaxationCorner';

const ScheduleTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [endTimes, setEndTimes] = useState({});
  const [date, setDate] = useState(new Date());
  const [scheduledTasks, setScheduledTasks] = useState({});
  const [daysBefore, setDaysBefore] = useState(2);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);

  useEffect(() => {
    fetchEndTimes();
    fetchTasks();
    // Load scheduled tasks from local storage on component mount
    const savedScheduledTasks = localStorage.getItem('scheduledTasks');
    if (savedScheduledTasks) {
      try {
        const parsedTasks = JSON.parse(savedScheduledTasks);
        // Convert string dates back to Date objects
        const reconstitutedTasks = {};
        Object.keys(parsedTasks).forEach(dateKey => {
          reconstitutedTasks[dateKey] = parsedTasks[dateKey].map(task => ({
            ...task,
            scheduledStartTime: new Date(task.scheduledStartTime),
            scheduledEndTime: new Date(task.scheduledEndTime),
            scheduledBreakStartTime: new Date(task.scheduledBreakStartTime),
            scheduledBreakEndTime: new Date(task.scheduledBreakEndTime),
            dueDate: new Date(task.dueDate)
          }));
        });
        setScheduledTasks(reconstitutedTasks);
      } catch (error) {
        console.error('Error parsing saved scheduled tasks:', error);
      }
    }
  }, []);

  // Save to local storage whenever scheduledTasks changes
  useEffect(() => {
    localStorage.setItem('scheduledTasks', JSON.stringify(scheduledTasks));
  }, [scheduledTasks]);

  const fetchEndTimes = async () => {
    try {
      const response = await fetch('http://localhost:5000/end/getEndTime', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEndTimes(data.endTimes);
      } else {
        toast.error('Error fetching end times. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to fetch end times. Server error.');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/task/myTasks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      } else {
        toast.error('Error fetching tasks. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to fetch tasks. Server error.');
    }
  };

  const dayMapping = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  // const scheduleTasks = async () => {
  //   if (tasks.length === 0 || Object.keys(endTimes).length === 0) {
  //     toast.error('No tasks or end times available for scheduling');
  //     return;
  //   }

  //   const scheduledTasksMap = {};
  //   const scheduledTimeStorage = {};

  //   for (const task of tasks) {
  //     const dueDate = new Date(task.dueDate);
  //     // await createReminder(task._id, task.scheduledStartTime);
  //     if (dueDate < new Date()) continue;

  //     const dayOfWeek = dueDate.getDay();
  //     const dayString = dayMapping[dayOfWeek];
  //     const userEndTime = endTimes[dayString];

  //     if (!userEndTime) {
  //       toast.error(`No end time specified for ${dayString}`);
  //       return;
  //     }

  //     const [hours, minutes] = userEndTime.split(':').map(Number);
  //     const userEndDateTime = new Date(dueDate);
  //     userEndDateTime.setHours(hours, minutes, 0, 0);

  //     const scheduledDate = new Date(dueDate);
  //     scheduledDate.setDate(dueDate.getDate() - daysBefore);

  //     const workDuration = 1.5 * 60 * 60 * 1000; // 1.5 hours
  //     const breakDuration = 25 * 60 * 1000; // 25 minutes

  //     let lastEndTime = scheduledDate;

  //     if (!scheduledTasksMap[scheduledDate.toISOString().split('T')[0]]) {
  //       scheduledTasksMap[scheduledDate.toISOString().split('T')[0]] = [];
  //     }

  //     if (scheduledTasksMap[scheduledDate.toISOString().split('T')[0]].length > 0) {
  //       const lastTask = scheduledTasksMap[scheduledDate.toISOString().split('T')[0]].slice(-1)[0];
  //       lastEndTime = lastTask.scheduledBreakEndTime;
  //     }

  //     task.scheduledStartTime = new Date(lastEndTime.getTime());
  //     task.scheduledEndTime = new Date(task.scheduledStartTime.getTime() + workDuration);
  //     task.scheduledBreakStartTime = task.scheduledEndTime;
  //     task.scheduledBreakEndTime = new Date(task.scheduledBreakStartTime.getTime() + breakDuration);

  //     // Store the scheduled time info in local storage object
  //     scheduledTimeStorage[task._id] = {
  //       startTime: task.scheduledStartTime.toISOString(),
  //       endTime: task.scheduledEndTime.toISOString(),
  //       breakStartTime: task.scheduledBreakStartTime.toISOString(),
  //       breakEndTime: task.scheduledBreakEndTime.toISOString()
  //     };

  //     scheduledTasksMap[scheduledDate.toISOString().split('T')[0]].push(task);

  //     // Call backend API to update task with scheduled start date and duration
  //     const scheduledDurationMinutes = (task.scheduledEndTime - task.scheduledStartTime) / 1000 / 60;
  //     await updateTaskScheduledDate(task._id, task.scheduledStartTime, scheduledDurationMinutes);
  //     console.log(scheduledDurationMinutes);
  //   }
   
  //   // Save the scheduled times to local storage
  //   localStorage.setItem('taskScheduledTimes', JSON.stringify(scheduledTimeStorage));
  //   console.log('Scheduled times saved to local storage:', scheduledTimeStorage);
  //   setScheduledTasks(scheduledTasksMap);
  //   toast.success('Tasks scheduled successfully!');
  // };
  const scheduleTasks = async () => {
    if (tasks.length === 0 || Object.keys(endTimes).length === 0) {
      toast.error('No tasks or end times available for scheduling');
      return;
    }
  
    const scheduledTasksMap = {};
    const scheduledTimeStorage = {};
    const mlScheduleData = [];
  
    for (const task of tasks) {
      const dueDate = new Date(task.dueDate);
      if (dueDate < new Date()) continue;
  
      const dayOfWeek = dueDate.getDay();
      const dayString = dayMapping[dayOfWeek];
      const userEndTime = endTimes[dayString];
  
      if (!userEndTime) {
        toast.error(`No end time specified for ${dayString}`);
        return;
      }
  
      const [hours, minutes] = userEndTime.split(':').map(Number);
      const userEndDateTime = new Date(dueDate);
      userEndDateTime.setHours(hours, minutes, 0, 0);
  
      const scheduledDate = new Date(dueDate);
      scheduledDate.setDate(dueDate.getDate() - daysBefore);
  
      const workDuration = 1.5 * 60 * 60 * 1000; // 1.5 hours
      const breakDuration = 25 * 60 * 1000; // 25 minutes
  
      let lastEndTime = scheduledDate;
  
      const dateKey = scheduledDate.toISOString().split('T')[0];
      if (!scheduledTasksMap[dateKey]) {
        scheduledTasksMap[dateKey] = [];
      }
  
      if (scheduledTasksMap[dateKey].length > 0) {
        const lastTask = scheduledTasksMap[dateKey].slice(-1)[0];
        lastEndTime = lastTask.scheduledBreakEndTime;
      }
      task.title=task.title || 'Untitled Task';
      task.scheduledStartTime = new Date(lastEndTime.getTime());
      task.scheduledEndTime = new Date(task.scheduledStartTime.getTime() + workDuration);
      task.scheduledBreakStartTime = task.scheduledEndTime;
      task.scheduledBreakEndTime = new Date(task.scheduledBreakStartTime.getTime() + breakDuration);
  
      const scheduledDurationMinutes = (task.scheduledEndTime - task.scheduledStartTime) / 1000 / 60;
      console.log(scheduledDurationMinutes);
      // Store for frontend viewing
      scheduledTimeStorage[task._id] = {
        startTime: task.scheduledStartTime.toISOString(),
        endTime: task.scheduledEndTime.toISOString(),
        breakStartTime: task.scheduledBreakStartTime.toISOString(),
        breakEndTime: task.scheduledBreakEndTime.toISOString()
      };
  
      // Store for ML model
      mlScheduleData.push({
        taskId: task._id,
        taskType: task.taskType || '',
        subject: task.subject || '',
        userId: task.userId || '',
        scheduleStartTime: task.scheduledStartTime.toISOString(),
        scheduleEndTime: task.scheduledEndTime.toISOString(),
        breakStartTime: task.scheduledBreakStartTime.toISOString(),
        breakEndTime: task.scheduledBreakEndTime.toISOString(),
        durationMinutes: scheduledDurationMinutes
      });
      
      scheduledTasksMap[dateKey].push(task);
      await updateTaskScheduledDate(task._id, task.scheduledStartTime, scheduledDurationMinutes);
    }
  
    // Save in localStorage
    localStorage.setItem('taskScheduledTimes', JSON.stringify(scheduledTimeStorage));
    localStorage.setItem('taskScheduleDataForML', JSON.stringify(mlScheduleData));
    console.log('Scheduled times saved to local storage:', scheduledTimeStorage);console.log('ML schedule data saved to local storage:', mlScheduleData);
    setScheduledTasks(scheduledTasksMap);
    toast.success('Tasks scheduled successfully!');
  };
  
  const updateTaskScheduledDate = async (taskId, scheduledStartDate, scheduledDurationMinutes) => {
    try {
      const response = await fetch(`http://localhost:5000/task/updateScheduledDate/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scheduledStartDate, scheduledDurationMinutes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update scheduled date');
      }
    } catch (error) {
      toast.error('Error updating scheduled task date. Server error.');
    }
  };

  const handleRescheduleTask = async (taskId, newDate, newStartTime) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) {
        toast.error('Task not found');
        return;
      }

      const [hours, minutes] = newStartTime.split(':').map(Number);
      const newStartDate = new Date(newDate);
      newStartDate.setHours(hours, minutes, 0, 0);

      const workDuration = 1.5 * 60 * 60 * 1000;
      const breakDuration = 25 * 60 * 1000;

      const newEndDate = new Date(newStartDate.getTime() + workDuration);
      const newBreakStartDate = newEndDate;
      const newBreakEndDate = new Date(newBreakStartDate.getTime() + breakDuration);

      const updatedTask = {
        ...task,
        scheduledStartTime: newStartDate,
        scheduledEndTime: newEndDate,
        scheduledBreakStartTime: newBreakStartDate,
        scheduledBreakEndTime: newBreakEndDate,
      };

      // Update the task scheduled times in local storage
      const existingTaskTimes = JSON.parse(localStorage.getItem('taskScheduledTimes') || '{}');
      existingTaskTimes[taskId] = {
        startTime: newStartDate.toISOString(),
        endTime: newEndDate.toISOString(),
        breakStartTime: newBreakStartDate.toISOString(),
        breakEndTime: newBreakEndDate.toISOString()
      };
      localStorage.setItem('taskScheduledTimes', JSON.stringify(existingTaskTimes));

      const scheduledDurationMinutes = workDuration / 1000 / 60;
      await updateTaskScheduledDate(taskId, newStartDate, scheduledDurationMinutes);

      // Update the scheduledTasks state
      setScheduledTasks(prevScheduledTasks => {
        const updatedScheduledTasks = { ...prevScheduledTasks };
        const oldDateKey = task.scheduledStartTime.toISOString().split('T')[0];
        const newDateKey = newStartDate.toISOString().split('T')[0];
        
        // Remove the task from the old date
        if (updatedScheduledTasks[oldDateKey]) {
          updatedScheduledTasks[oldDateKey] = updatedScheduledTasks[oldDateKey].filter(t => t._id !== taskId);
          if (updatedScheduledTasks[oldDateKey].length === 0) {
            delete updatedScheduledTasks[oldDateKey];
          }
        }
        
        // Add the task to the new date
        if (!updatedScheduledTasks[newDateKey]) {
          updatedScheduledTasks[newDateKey] = [];
        }
        updatedScheduledTasks[newDateKey].push(updatedTask);
        
        return updatedScheduledTasks;
      });

      toast.success('Task rescheduled successfully');
    } catch (error) {
      toast.error('Error rescheduling task. Please try again.');
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const dateString = newDate.toISOString().split('T')[0];
    setSelectedDateTasks(scheduledTasks[dateString] || []);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const tasksForDate = scheduledTasks[dateString] || [];
      
      if (tasksForDate.length > 0) {
        return (
          <div className="task-indicator">
            {tasksForDate.map((task, index) => (
              <div
                key={index}
                className="task-dot"
                style={{
                  backgroundColor: getTaskColor(task),
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  margin: '1px',
                  display: 'inline-block'
                }}
              />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  const getTaskColor = (task) => {
    // You can implement your own logic to assign colors based on task properties
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F1', '#33FFF1'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div>
      <LoggedInNavBar />
      <div className="layout-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="column">
          <h4>Task Progress</h4>
          <TaskListProgress />
        </div>
        <div className="column">
          <button className="btn btn-outline" onClick={scheduleTasks}>  
            Schedule Tasks
          </button>
          <ScheduleTasksList 
            scheduledTasks={scheduledTasks} 
            onRescheduleTask={handleRescheduleTask}
          />
        </div>
        <div className="column">
          <Calendar
            onChange={handleDateChange}
            value={date}
            tileContent={tileContent}
            onClickDay={(value) => {
              const dateString = value.toISOString().split('T')[0];
              setSelectedDateTasks(scheduledTasks[dateString] || []);
            }}
            className="custom-calendar"
          />
          <div style={{ marginTop: '20px' }}>
            <h4>Selected Date Tasks:</h4>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {selectedDateTasks.map(task => (
                <li key={task._id} style={{ 
                  padding: '10px', 
                  backgroundColor: 'lightyellow', 
                  borderRadius: '5px', 
                  marginBottom: '10px',
                  borderLeft: `5px solid ${getTaskColor(task)}`
                }}>
                  <strong>{task.title}</strong>
                  <br />
                  Scheduled: {new Date(task.scheduledStartTime).toLocaleTimeString()} - {new Date(task.scheduledEndTime).toLocaleTimeString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="column">
          <RelaxationCorner />
        </div>
      </div>
      <style jsx>{`
        .custom-calendar {
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 10px;
        }
        .task-indicator {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2px;
        }
        .task-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin: 1px;
        }
      `}</style>
    </div>
  );
};

export default ScheduleTasks;