
// import React, { useState, useEffect } from "react";
// import './CV.css'; // Make sure you have the necessary CSS file
// import { toast } from 'react-toastify';
// import { FaFilter } from 'react-icons/fa'; // Import a filter icon

// const TaskList = ({ currentUserId }) => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [filterByPriority, setFilterByPriority] = useState('all');
//   const [filterByDueDate, setFilterByDueDate] = useState(false);

//   // Function to get color based on priority
//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high':
//         return '#ff6347'; // Red for high priority
//       case 'medium':
//         return '#ffa500'; // Orange for medium priority
//       case 'low':
//         return '#90ee90'; // Light green for low priority
//       default:
//         return '#f5f5f5'; // Default background color
//     }
//   };

//   // Function to fetch tasks from the API
//   const fetchTasks = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/task/myTasks', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}` // Add JWT token here
//         }
//       });

//       if (response.ok) {
//         const tasksData = await response.json();
//         setTasks(tasksData);
//         setFilteredTasks(tasksData); // Initially, show all tasks
//       } else {
//         toast.error('Failed to fetch tasks.');
//       }
//     } catch (error) {
//       toast.error('Server error. Failed to fetch tasks.');
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [currentUserId]); // Fetch tasks when component mounts or currentUserId changes

//   // Get current date
//   const currentDate = new Date();

//   // Apply filters when priority or due date filter changes
//   useEffect(() => {
//     let filtered = tasks;

//     // Filter based on priority
//     if (filterByPriority !== 'all') {
//       filtered = filtered.filter(task => task.priority === filterByPriority);
//     }

//     // Filter based on due date
//     if (filterByDueDate) {
//       filtered = filtered.filter(task => new Date(task.dueDate) > currentDate);
//     }

//     setFilteredTasks(filtered);
//   }, [tasks, filterByPriority, filterByDueDate]); // Update whenever tasks or filter conditions change

//   // Function to format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
//   };

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: "400px",
//         padding: "20px",
//         backgroundColor: "#f5f5f5",
//         boxSizing: "border-box",
//         borderRadius: "8px",
//         boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//         margin: "0 auto"
//       }}
//     >
//       {/* Manual Refresh Button */}
//       <button onClick={fetchTasks} style={{ marginBottom: '10px' }}>
//         Refresh Tasks
//       </button>

//       {/* Filter buttons */}
//       <div className="filter-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//         <div>
//           <FaFilter style={{ marginRight: '5px' }} />
//           <span>Priority:</span>
//           <select
//             value={filterByPriority}
//             onChange={(e) => setFilterByPriority(e.target.value)}
//             style={{ marginLeft: '5px' }}
//           >
//             <option value="all">All</option>
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//         </div>
//         <div>
//           <label>
//             <input
//               type="checkbox"
//               checked={filterByDueDate}
//               onChange={() => setFilterByDueDate(!filterByDueDate)}
//               style={{ marginRight: '5px' }}
//             />
//             Due Date After Today
//           </label>
//         </div>
//       </div>

//       {/* Task List */}
//       <ul style={{ listStyleType: "none", padding: 0 }}>
//         {filteredTasks.length > 0 ? (
//           filteredTasks.map((task) => {
//             const isOverdue = new Date(task.dueDate) < currentDate;
//             return (
//               <li
//                 key={task._id}
//                 style={{
//                   backgroundColor: isOverdue ? '#d3d3d3' : getPriorityColor(task.priority),
//                   padding: "15px",
//                   marginBottom: "15px",
//                   borderRadius: "8px",
//                   boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//                   color: isOverdue ? "#777" : "#333",
//                   fontSize: "16px",
//                   textDecoration: isOverdue ? 'line-through' : 'none' // Grey out overdue tasks
//                 }}
//               >
//                 <strong>{task.subject || 'No Subject'}</strong> - {task.taskType || 'No Task Type'}, Due: {formatDate(task.dueDate)}
//               </li>
//             );
//           })
//         ) : (
//           <li style={{ textAlign: "center", padding: "15px" }}>No tasks available.</li>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default TaskList;
// import React, { useState, useEffect } from "react";
// import './CV.css'; // Make sure you have the necessary CSS file
// import { toast } from 'react-toastify';
// import { FaFilter } from 'react-icons/fa'; // Import a filter icon

// const TaskList = ({ currentUserId }) => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [filterByPriority, setFilterByPriority] = useState('all');
//   const [filterByDueDate, setFilterByDueDate] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const tasksPerPage = 8;

//   // Function to get color based on priority
//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high':
//         return '#ff6347'; // Red for high priority
//       case 'medium':
//         return '#ffa500'; // Orange for medium priority
//       case 'low':
//         return '#90ee90'; // Light green for low priority
//       default:
//         return '#f5f5f5'; // Default background color
//     }
//   };

//   // Function to fetch tasks from the API
//   const fetchTasks = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/task/myTasks', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}` // Add JWT token here
//         }
//       });

//       if (response.ok) {
//         const tasksData = await response.json();
//         setTasks(tasksData);
//         setFilteredTasks(tasksData); // Initially, show all tasks
//       } else {
//         toast.error('Failed to fetch tasks.');
//       }
//     } catch (error) {
//       toast.error('Server error. Failed to fetch tasks.');
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [currentUserId]); // Fetch tasks when component mounts or currentUserId changes

//   // Get current date
//   const currentDate = new Date();

//   // Apply filters when priority or due date filter changes
//   useEffect(() => {
//     let filtered = tasks;

//     // Filter based on priority
//     if (filterByPriority !== 'all') {
//       filtered = filtered.filter(task => task.priority === filterByPriority);
//     }

//     // Filter based on due date
//     if (filterByDueDate) {
//       filtered = filtered.filter(task => new Date(task.dueDate) > currentDate);
//     }

//     setFilteredTasks(filtered);
//     setCurrentPage(1); // Reset to first page when filters change
//   }, [tasks, filterByPriority, filterByDueDate]); // Update whenever tasks or filter conditions change

//   // Function to format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
//   };

//   // Get current tasks based on pagination
//   const indexOfLastTask = currentPage * tasksPerPage;
//   const indexOfFirstTask = indexOfLastTask - tasksPerPage;
//   const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

//   const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: "400px",
//         padding: "20px",
//         backgroundColor: "#f5f5f5",
//         boxSizing: "border-box",
//         borderRadius: "8px",
//         boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//         margin: "0 auto"
//       }}
//     >
//       {/* Manual Refresh Button */}
//       <button onClick={fetchTasks} style={{ marginBottom: '10px' }}>
//         Refresh Tasks
//       </button>

//       {/* Filter buttons */}
//       <div className="filter-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//         <div>
//           <FaFilter style={{ marginRight: '5px' }} />
//           <span>Priority:</span>
//           <select
//             value={filterByPriority}
//             onChange={(e) => setFilterByPriority(e.target.value)}
//             style={{ marginLeft: '5px' }}
//           >
//             <option value="all">All</option>
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//         </div>
//         <div>
//           <label>
//             <input
//               type="checkbox"
//               checked={filterByDueDate}
//               onChange={() => setFilterByDueDate(!filterByDueDate)}
//               style={{ marginRight: '5px' }}
//             />
//             Due Date After Today
//           </label>
//         </div>
//       </div>

//       {/* Task List */}
//       <ul style={{ listStyleType: "none", padding: 0 }}>
//         {currentTasks.length > 0 ? (
//           currentTasks.map((task) => {
//             const isOverdue = new Date(task.dueDate) < currentDate;
//             return (
//               <li
//                 key={task._id}
//                 style={{
//                   backgroundColor: isOverdue ? '#d3d3d3' : getPriorityColor(task.priority),
//                   padding: "15px",
//                   marginBottom: "15px",
//                   borderRadius: "8px",
//                   boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//                   color: isOverdue ? "#777" : "#333",
//                   fontSize: "16px",
//                   textDecoration: isOverdue ? 'line-through' : 'none' // Grey out overdue tasks
//                 }}
//               >
//                 <strong>{task.subject || 'No Subject'}</strong> - {task.taskType || 'No Task Type'}, Due: {formatDate(task.dueDate)}
//               </li>
//             );
//           })
//         ) : (
//           <li style={{ textAlign: "center", padding: "15px" }}>No tasks available.</li>
//         )}
//       </ul>

//       {/* Pagination Controls */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
//         <button 
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span>Page {currentPage} of {totalPages}</span>
//         <button 
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TaskList;

// trial2 
// import React, { useState, useEffect } from "react";
// import './CV.css'; // Make sure you have the necessary CSS file
// import { toast } from 'react-toastify';
// import { FaFilter, FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import arrow icons

// const TaskList = ({ currentUserId }) => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [filterByPriority, setFilterByPriority] = useState('all');
//   const [filterByDueDate, setFilterByDueDate] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const tasksPerPage = 8;

//   // Function to get color based on priority
//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high':
//         return '#ff6347'; // Red for high priority
//       case 'medium':
//         return '#ffa500'; // Orange for medium priority
//       case 'low':
//         return '#90ee90'; // Light green for low priority
//       default:
//         return '#f5f5f5'; // Default background color
//     }
//   };

//   // Function to fetch tasks from the API
//   const fetchTasks = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/task/myTasks', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}` // Add JWT token here
//         }
//       });

//       if (response.ok) {
//         const tasksData = await response.json();
//         setTasks(tasksData);
//         setFilteredTasks(tasksData); // Initially, show all tasks
//       } else {
//         toast.error('Failed to fetch tasks.');
//       }
//     } catch (error) {
//       toast.error('Server error. Failed to fetch tasks.');
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [currentUserId]); // Fetch tasks when component mounts or currentUserId changes

//   // Get current date
//   const currentDate = new Date();

//   // Apply filters when priority or due date filter changes
//   useEffect(() => {
//     let filtered = tasks;

//     // Filter based on priority
//     if (filterByPriority !== 'all') {
//       filtered = filtered.filter(task => task.priority === filterByPriority);
//     }

//     // Filter based on due date
//     if (filterByDueDate) {
//       filtered = filtered.filter(task => new Date(task.dueDate) > currentDate);
//     }

//     // Separate overdue and future tasks
//     const overdueTasks = filtered.filter(task => new Date(task.dueDate) < currentDate);
//     const futureTasks = filtered.filter(task => new Date(task.dueDate) >= currentDate);

//     // Sort future tasks by due date
//     futureTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

//     // Combine future and overdue tasks
//     setFilteredTasks([...futureTasks, ...overdueTasks]);
//     setCurrentPage(1); // Reset to first page when filters change
//   }, [tasks, filterByPriority, filterByDueDate]); // Update whenever tasks or filter conditions change

//   // Function to format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
//   };

//   // Get current tasks based on pagination
//   const indexOfLastTask = currentPage * tasksPerPage;
//   const indexOfFirstTask = indexOfLastTask - tasksPerPage;
//   const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

//   const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: "400px",
//         padding: "20px",
//         backgroundColor: "#f5f5f5",
//         boxSizing: "border-box",
//         borderRadius: "8px",
//         boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//         margin: "0 auto"
//       }}
//     >
//       {/* Manual Refresh Button */}
//       <button onClick={fetchTasks} style={{ marginBottom: '10px' }}>
//         Refresh Tasks
//       </button>

//       {/* Filter buttons */}
//       <div className="filter-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//         <div>
//           <FaFilter style={{ marginRight: '5px' }} />
//           <span>Priority:</span>
//           <select
//             value={filterByPriority}
//             onChange={(e) => setFilterByPriority(e.target.value)}
//             style={{ marginLeft: '5px' }}
//           >
//             <option value="all">All</option>
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//         </div>
//         <div>
//           <label>
//             <input
//               type="checkbox"
//               checked={filterByDueDate}
//               onChange={() => setFilterByDueDate(!filterByDueDate)}
//               style={{ marginRight: '5px' }}
//             />
//             Due Date After Today
//           </label>
//         </div>
//       </div>

//       {/* Task List */}
//       <ul style={{ listStyleType: "none", padding: 0 }}>
//         {currentTasks.length > 0 ? (
//           currentTasks.map((task) => {
//             const isOverdue = new Date(task.dueDate) < currentDate;
//             return (
//               <li
//                 key={task._id}
//                 style={{
//                   backgroundColor: isOverdue ? '#d3d3d3' : getPriorityColor(task.priority),
//                   padding: "15px",
//                   marginBottom: "15px",
//                   borderRadius: "8px",
//                   boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//                   color: isOverdue ? "#777" : "#333",
//                   fontSize: "16px",
//                   textDecoration: isOverdue ? 'line-through' : 'none' // Grey out overdue tasks
//                 }}
//               >
//                 <strong>{task.subject || 'No Subject'}</strong> - {task.taskType || 'No Task Type'}, Due: {formatDate(task.dueDate)}
//               </li>
//             );
//           })
//         ) : (
//           <li style={{ textAlign: "center", padding: "15px" }}>No tasks available.</li>
//         )}
//       </ul>

//       {/* Pagination Controls */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
//         <button 
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
//           disabled={currentPage === 1}
//           style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentPage === 1 ? '#ccc' : '#000' }}
//         >
//           <FaArrowLeft />
//         </button>
//         <span>Page {currentPage} of {totalPages}</span>
//         <button 
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
//           disabled={currentPage === totalPages}
//           style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentPage === totalPages ? '#ccc' : '#000' }}
//         >
//           <FaArrowRight />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TaskList;
import React, { useState, useEffect } from "react";
import './CV.css'; // Ensure you have the required CSS file
import { toast } from 'react-toastify';
import { FaFilter, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const TaskList = ({ currentUserId }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filterByPriority, setFilterByPriority] = useState('all');
  const [filterByDueDate, setFilterByDueDate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 8;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ff6347';
      case 'medium':
        return '#ffa500';
      case 'low':
        return '#90ee90';
      default:
        return '#f5f5f5';
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/task/myTasks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
        setFilteredTasks(tasksData);
      } else {
        toast.error('Failed to fetch tasks.');
      }
    } catch (error) {
      toast.error('Server error. Failed to fetch tasks.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentUserId]);

  const currentDate = new Date();

  useEffect(() => {
    let filtered = tasks;

    if (filterByPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterByPriority);
    }

    if (filterByDueDate) {
      filtered = filtered.filter(task => new Date(task.dueDate) > currentDate);
    }

    const overdueTasks = filtered.filter(task => new Date(task.dueDate) < currentDate);
    const futureTasks = filtered.filter(task => new Date(task.dueDate) >= currentDate);

    futureTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    setFilteredTasks([...futureTasks, ...overdueTasks]);
    setCurrentPage(1);
  }, [tasks, filterByPriority, filterByDueDate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        padding: "15px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        margin: "0 auto"
      }}
    >
      <button onClick={fetchTasks} style={{ marginBottom: '10px' }}>
        Refresh Tasks
      </button>

      <div className="filter-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <FaFilter style={{ marginRight: '5px' }} />
          <span>Priority:</span>
          <select
            value={filterByPriority}
            onChange={(e) => setFilterByPriority(e.target.value)}
            style={{ marginLeft: '5px', padding: '3px' }}
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={filterByDueDate}
              onChange={() => setFilterByDueDate(!filterByDueDate)}
              style={{ marginRight: '5px' }}
            />
            Due Date After Today
          </label>
        </div>
      </div>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {currentTasks.length > 0 ? (
          currentTasks.map((task) => {
            const isOverdue = new Date(task.dueDate) < currentDate;
            return (
              <li
                key={task._id}
                style={{
                  backgroundColor: isOverdue ? '#d3d3d3' : getPriorityColor(task.priority),
                  padding: "8px", 
                  marginBottom: "8px", 
                  borderRadius: "5px", 
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  color: isOverdue ? "#777" : "#333",
                  fontSize: "17px", 
                  textDecoration: isOverdue ? 'line-through' : 'none'
                }}
              >
                <strong>{task.subject || 'No Subject'}</strong> - {task.taskType || 'No Task Type'}, Due: {formatDate(task.dueDate)}
              </li>
            );
          })
        ) : (
          <li style={{ textAlign: "center", padding: "10px" }}>No tasks available.</li>
        )}
      </ul>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentPage === 1 ? '#ccc' : '#000' }}
        >
          <FaArrowLeft />
        </button>
        <span style={{ fontSize: '14px' }}>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentPage === totalPages ? '#ccc' : '#000' }}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default TaskList;
