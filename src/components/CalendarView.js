// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import './CV.css';

// const CalendarView = ({ tasks }) => {
//   const [date, setDate] = useState(new Date());
//   const [selectedTasks, setSelectedTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);

//   // Filter tasks to include only those with a dueDate beyond today
//   useEffect(() => {
//     const currentDate = new Date();
//     const tasksAfterToday = tasks.filter(
//       (task) => new Date(task.dueDate).setHours(0, 0, 0, 0) > currentDate.setHours(0, 0, 0, 0)
//     );
//     setFilteredTasks(tasksAfterToday);
//   }, [tasks]);

//   // Handle changing the selected date
//   const handleDateChange = (newDate) => {
//     setDate(newDate);
//     // Display tasks for the selected date
//     const tasksForDay = filteredTasks.filter(
//       (task) => new Date(task.dueDate).toDateString() === newDate.toDateString()
//     );
//     setSelectedTasks(tasksForDay);
//   };

//   // Function to get color based on priority
//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high':
//         return 'red';
//       case 'medium':
//         return 'orange';
//       case 'low':
//         return 'green';
//       default:
//         return 'gray';
//     }
//   };

//   const currentDate = new Date();

//   return (
//     <div className="calendar-view" style={{ padding: '20px', overflowY: 'auto' }}>
//       <Calendar
//         onChange={handleDateChange}
//         value={date}
//         minDate={currentDate}
//         tileContent={({ date }) => {
//           const dateStr = date.toDateString();
//           const tasksForDate = filteredTasks.filter(
//             (task) => new Date(task.dueDate).toDateString() === dateStr
//           );

//           return tasksForDate.length > 0 ? (
//             <div className="task-dots">
//               {tasksForDate.map((task, index) => (
//                 <div
//                   key={index}
//                   className="task-dot"
//                   style={{
//                     backgroundColor: getPriorityColor(task.priority),
//                     width: '8px',
//                     height: '8px',
//                     borderRadius: '50%',
//                     margin: '1px',
//                   }}
//                 ></div>
//               ))}
//             </div>
//           ) : null;
//         }}
//         onClickDay={handleDateChange}
//         tileClassName={({ date }) => {
//           return date < currentDate ? 'disabled-tile' : null;
//         }}
//       />
//       <div className="tasks-list mt-4">
//         <h3>Tasks for {date.toDateString()}</h3>
//         {selectedTasks.length > 0 ? (
//           selectedTasks.map((task, index) => (
//             <div key={index} className="task-item" style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
//               <h4 style={{ marginBottom: '5px', color: getPriorityColor(task.priority) }}>
//                 {task.subject} - {task.taskType}
//               </h4>
//               <p style={{ margin: 0 }}>Priority: {task.priority}</p>
//               <p style={{ margin: 0 }}>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
//             </div>
//           ))
//         ) : (
//           <p>No tasks for this date</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CalendarView;
// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import './CV.css';
// import { toast } from 'react-toastify';

// const CalendarView = () => {
//   const [date, setDate] = useState(new Date());
//   const [tasks, setTasks] = useState([]);
//   const [selectedTasks, setSelectedTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);

//   // Function to fetch tasks from the API
//   const fetchTasks = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/task/myTasks', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add JWT token here
//         },
//       });

//       if (response.ok) {
//         const tasksData = await response.json();
//         setTasks(tasksData);
//       } else {
//         toast.error('Failed to fetch tasks.');
//       }
//     } catch (error) {
//       toast.error('Server error. Failed to fetch tasks.');
//     }
//   };

//   // Filter tasks to include only those with a dueDate beyond today
//   useEffect(() => {
//     const currentDate = new Date();
//     const tasksAfterToday = tasks.filter(
//       (task) => new Date(task.dueDate).setHours(0, 0, 0, 0) > currentDate.setHours(0, 0, 0, 0)
//     );
//     setFilteredTasks(tasksAfterToday);
//   }, [tasks]);

//   // Fetch tasks on component mount
//   useEffect(() => {
//     fetchTasks();
//   }, []); // Empty dependency array to fetch tasks only once

//   // Handle changing the selected date
//   const handleDateChange = (newDate) => {
//     setDate(newDate);
//     // Display tasks for the selected date
//     const tasksForDay = filteredTasks.filter(
//       (task) => new Date(task.dueDate).toDateString() === newDate.toDateString()
//     );
//     setSelectedTasks(tasksForDay);
//   };

//   // Function to get color based on priority
//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high':
//         return 'red';
//       case 'medium':
//         return 'orange';
//       case 'low':
//         return 'green';
//       default:
//         return 'gray';
//     }
//   };

//   const currentDate = new Date();

//   return (
//     <div className="calendar-view" style={{ padding: '20px', overflowY: 'auto' }}>
//       <Calendar
//         onChange={handleDateChange}
//         value={date}
//         minDate={currentDate}
//         tileContent={({ date }) => {
//           const dateStr = date.toDateString();
//           const tasksForDate = filteredTasks.filter(
//             (task) => new Date(task.dueDate).toDateString() === dateStr
//           );

//           return tasksForDate.length > 0 ? (
//             <div className="task-dots">
//               {tasksForDate.map((task, index) => (
//                 <div
//                   key={index}
//                   className="task-dot"
//                   style={{
//                     backgroundColor: getPriorityColor(task.priority),
//                     width: '8px',
//                     height: '8px',
//                     borderRadius: '50%',
//                     margin: '1px',
//                   }}
//                 ></div>
//               ))}
//             </div>
//           ) : null;
//         }}
//         onClickDay={handleDateChange}
//         tileClassName={({ date }) => {
//           return date < currentDate ? 'disabled-tile' : null;
//         }}
//       />
//       <div className="tasks-list mt-4">
//         <h3>Tasks for {date.toDateString()}</h3>
//         {selectedTasks.length > 0 ? (
//           selectedTasks.map((task, index) => (
//             <div key={index} className="task-item" style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
//               <h4 style={{ marginBottom: '5px', color: getPriorityColor(task.priority) }}>
//                 {task.subject} - {task.taskType}
//               </h4>
//               <p style={{ margin: 0 }}>Priority: {task.priority}</p>
//               <p style={{ margin: 0 }}>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
//             </div>
//           ))
//         ) : (
//           <p>No tasks for this date</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CalendarView;
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CV.css';
import { toast } from 'react-toastify';

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Function to fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/task/myTasks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add JWT token here
        },
      });

      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      } else {
        toast.error('Failed to fetch tasks.');
      }
    } catch (error) {
      toast.error('Server error. Failed to fetch tasks.');
    }
  };

  // Filter tasks to include only those with a dueDate beyond today
  useEffect(() => {
    const currentDate = new Date();
    const tasksAfterToday = tasks.filter(
      (task) => new Date(task.dueDate).setHours(0, 0, 0, 0) > currentDate.setHours(0, 0, 0, 0)
    );
    setFilteredTasks(tasksAfterToday);
  }, [tasks]);

  // Fetch tasks on component mount and set an interval for automatic refresh
  useEffect(() => {
    fetchTasks(); // Initial fetch

    // Set an interval to fetch tasks every 60 seconds (60000 milliseconds)
    const intervalId = setInterval(() => {
      fetchTasks();
    },2000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to fetch tasks only once on mount

  // Handle changing the selected date
  const handleDateChange = (newDate) => {
    setDate(newDate);
    // Display tasks for the selected date
    const tasksForDay = filteredTasks.filter(
      (task) => new Date(task.dueDate).toDateString() === newDate.toDateString()
    );
    setSelectedTasks(tasksForDay);
  };

  // Function to get color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const currentDate = new Date();

  return (
    <div className="calendar-view" style={{ padding: '20px', overflowY: 'auto' }}>
      <Calendar
        onChange={handleDateChange}
        value={date}
        minDate={currentDate}
        tileContent={({ date }) => {
          const dateStr = date.toDateString();
          const tasksForDate = filteredTasks.filter(
            (task) => new Date(task.dueDate).toDateString() === dateStr
          );

          return tasksForDate.length > 0 ? (
            <div className="task-dots">
              {tasksForDate.map((task, index) => (
                <div
                  key={index}
                  className="task-dot"
                  style={{
                    backgroundColor: getPriorityColor(task.priority),
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    margin: '1px',
                  }}
                ></div>
              ))}
            </div>
          ) : null;
        }}
        onClickDay={handleDateChange}
        tileClassName={({ date }) => {
          return date < currentDate ? 'disabled-tile' : null;
        }}
      />
      <div className="tasks-list mt-4">
        <h3>Tasks for {date.toDateString()}</h3>
        {selectedTasks.length > 0 ? (
          selectedTasks.map((task, index) => (
            <div key={index} className="task-item" style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
              <h4 style={{ marginBottom: '5px', color: getPriorityColor(task.priority) }}>
                {task.subject} - {task.taskType}
              </h4>
              <p style={{ margin: 0 }}>Priority: {task.priority}</p>
              <p style={{ margin: 0 }}>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No tasks for this date</p>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
