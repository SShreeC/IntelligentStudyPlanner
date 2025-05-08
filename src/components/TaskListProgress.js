
// import React, { useState, useEffect } from "react";
// import './CV.css'; // Ensure you have the required CSS file
// import { toast } from 'react-toastify';
// import { FaFilter, FaArrowLeft, FaArrowRight, FaEllipsisV, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// const TaskListProgress = ({ currentUserId }) => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [filterByPriority, setFilterByPriority] = useState('all');
//   const [filterByDueDate, setFilterByDueDate] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const tasksPerPage = 8;
//   const [selectedTask, setSelectedTask] = useState(null); // Track the task for which the menu is open

//   const fetchTasks = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/task/myTasks', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (response.ok) {
//         const tasksData = await response.json();
//         setTasks(tasksData);
//         setFilteredTasks(tasksData);
//       } else {
//         toast.error('Failed to fetch tasks.');
//       }
//     } catch (error) {
//       toast.error('Server error. Failed to fetch tasks.');
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [currentUserId]);

//   const currentDate = new Date();

//   useEffect(() => {
//     let filtered = tasks;

//     if (filterByPriority !== 'all') {
//       filtered = filtered.filter(task => task.priority === filterByPriority);
//     }

//     if (filterByDueDate) {
//       filtered = filtered.filter(task => new Date(task.dueDate) > currentDate);
//     }

//     const overdueTasks = filtered.filter(task => new Date(task.dueDate) < currentDate);
//     const futureTasks = filtered.filter(task => new Date(task.dueDate) >= currentDate);

//     futureTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

//     setFilteredTasks([...futureTasks, ...overdueTasks]);
//     setCurrentPage(1);
//   }, [tasks, filterByPriority, filterByDueDate]);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
//   };

//   const getStarIcons = (progress) => {
//     const fullStars = Math.floor(progress / 25); // 4 stars for full
//     const halfStar = (progress % 25) >= 12.5 ? 1 : 0; // Half star if progress >= 12.5%
//     const emptyStars = 4 - fullStars - halfStar; // Total of 4 stars

//     return (
//       <>
//         {Array(fullStars).fill(<FaStar color="#33ff36" />)} {/* Change color for full stars */}
//         {halfStar ? <FaStarHalfAlt color="#33ff36" /> : null} {/* Half star color */}
//         {Array(emptyStars).fill(<FaRegStar color="#ff3633" />)} {/* Empty star color */}
//       </>
//     );
//   };

//   const updateTaskProgress = (taskId, newProgress) => {
//     const updatedTasks = tasks.map(task => {
//       if (task._id === taskId) {
//         return { ...task, progress: newProgress };
//       }
//       return task;
//     });
//     setTasks(updatedTasks);
//     setFilteredTasks(updatedTasks);
//   };

//   const handleMenuClick = (task) => {
//     setSelectedTask(task._id === selectedTask ? null : task._id);
//   };

//   const handleProgressChange = (taskId, progress) => {
//     updateTaskProgress(taskId, progress);
//     setSelectedTask(null); // Close the menu after selecting an option
//   };

//   const indexOfLastTask = currentPage * tasksPerPage;
//   const indexOfFirstTask = indexOfLastTask - tasksPerPage;
//   const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

//   const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: "700px",
//         padding: "15px",
//         backgroundColor: "#f5f5f5",
//         borderRadius: "8px",
//         boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//         margin: "0 auto"
//       }}
//     >
//       <button onClick={fetchTasks} style={{ marginBottom: '10px' }}>
//         Refresh Tasks
//       </button>

//       <div className="filter-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//         <div>
//           <FaFilter style={{ marginRight: '5px' }} />
//           <span>Priority:</span>
//           <select
//             value={filterByPriority}
//             onChange={(e) => setFilterByPriority(e.target.value)}
//             style={{ marginLeft: '5px', padding: '3px' }}
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

//       <ul style={{ listStyleType: "none", padding: 0 }}>
//         {currentTasks.length > 0 ? (
//           currentTasks.map((task) => {
//             const isOverdue = new Date(task.dueDate) < currentDate;
//             const progress = task.progress || 0;

//             return (
//               <li
//                 key={task._id}
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   backgroundColor: isOverdue ? '#d3d3d3' : '#f5f5f5',
//                   padding: "8px",
//                   marginBottom: "8px",
//                   borderRadius: "5px",
//                   boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
//                   color: isOverdue ? "#777" : "#333",
//                   fontSize: "16px",
//                   textDecoration: isOverdue ? 'line-through' : 'none'
//                 }}
//               >
//                 <div>
//                   <strong>{task.subject || 'No Subject'}</strong> - {task.taskType || 'No Task Type'}, Due: {formatDate(task.dueDate)}
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                   <div style={{ display: 'flex' }}>
//                     {getStarIcons(progress)}
//                   </div>
//                   <div style={{ position: 'relative' }}>
//                     <FaEllipsisV
//                       style={{ cursor: 'pointer', marginLeft: '8px' }}
//                       onClick={() => handleMenuClick(task)}
//                     />
//                     {selectedTask === task._id && (
//                       <div style={{
//                         position: 'absolute',
//                         right: '0',
//                         backgroundColor: '#fff',
//                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
//                         borderRadius: '4px',
//                         zIndex: 1,
//                       }}>
//                         <ul style={{ listStyle: 'none', padding: '5px', margin: 0 }}>
//                           <li onClick={() => handleProgressChange(task._id, 100)} style={{ padding: '5px', cursor: 'pointer' }}>Completed</li>
//                           <li onClick={() => handleProgressChange(task._id, 75)} style={{ padding: '5px', cursor: 'pointer' }}>Almost Done</li>
//                           <li onClick={() => handleProgressChange(task._id, 50)} style={{ padding: '5px', cursor: 'pointer' }}>Half Done</li>
//                           <li onClick={() => handleProgressChange(task._id, 25)} style={{ padding: '5px', cursor: 'pointer' }}>Started</li>
//                           <li onClick={() => handleProgressChange(task._id, 0)} style={{ padding: '5px', cursor: 'pointer' }}>Not Started</li>
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </li>
//             );
//           })
//         ) : (
//           <li style={{ textAlign: "center", color: "#777" }}>No tasks found.</li>
//         )}
//       </ul>

//       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
//         <button
//           onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//           style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
//         >
//           <FaArrowLeft /> Previous
//         </button>
//         <span>Page {currentPage} of {totalPages}</span>
//         <button
//           onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//           style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
//         >
//           Next <FaArrowRight />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TaskListProgress;
// import React, { useState, useEffect } from "react";
// import './CV.css'; // Ensure you have the required CSS file
// import { toast } from 'react-toastify';
// import { FaFilter, FaArrowLeft, FaArrowRight, FaEllipsisV } from 'react-icons/fa';

// const TaskListProgress = ({ currentUserId }) => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [filterByPriority, setFilterByPriority] = useState('all');
//   const [filterByDueDate, setFilterByDueDate] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const tasksPerPage = 8;
//   const [selectedTask, setSelectedTask] = useState(null); // Track the task for which the menu is open

//   const fetchTasks = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/task/myTasks', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (response.ok) {
//         const tasksData = await response.json();
//         setTasks(tasksData);
//         setFilteredTasks(tasksData);
//       } else {
//         toast.error('Failed to fetch tasks.');
//       }
//     } catch (error) {
//       toast.error('Server error. Failed to fetch tasks.');
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [currentUserId]);

//   const currentDate = new Date();

//   useEffect(() => {
//     let filtered = tasks;

//     if (filterByPriority !== 'all') {
//       filtered = filtered.filter(task => task.priority === filterByPriority);
//     }

//     if (filterByDueDate) {
//       filtered = filtered.filter(task => new Date(task.dueDate) > currentDate);
//     }

//     const overdueTasks = filtered.filter(task => new Date(task.dueDate) < currentDate);
//     const futureTasks = filtered.filter(task => new Date(task.dueDate) >= currentDate);

//     futureTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

//     setFilteredTasks([...futureTasks, ...overdueTasks]);
//     setCurrentPage(1);
//   }, [tasks, filterByPriority, filterByDueDate]);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
//   };

//   const getStarIcons = (progress) => {
//     const fullStars = Math.floor(progress / 25); // 4 stars for full
//     const halfStar = (progress % 25) >= 12.5 ? 1 : 0; // Half star if progress >= 12.5%
//     const emptyStars = 4 - fullStars - halfStar; // Total of 4 stars

//     return (
//       <>
//         {Array(fullStars).fill(<span style={{ color: "#33ff36" }}>★</span>)} {/* Complete - Green */}
//         {halfStar ? <span style={{ color: "#ffa500" }}>★</span> : null} {/* Half Done - Orange */}
//         {Array(emptyStars).fill(<span style={{ color: "#ff3633" }}>★</span>)} {/* Empty - Red */}
//       </>
//     );
//   };

//   const updateTaskProgress = (taskId, newProgress) => {
//     const updatedTasks = tasks.map(task => {
//       if (task._id === taskId) {
//         return { ...task, progress: newProgress };
//       }
//       return task;
//     });
//     setTasks(updatedTasks);
//     setFilteredTasks(updatedTasks);
//   };

//   const handleMenuClick = (task) => {
//     setSelectedTask(task._id === selectedTask ? null : task._id);
//   };

//   const handleProgressChange = (taskId, progress) => {
//     updateTaskProgress(taskId, progress);
//     setSelectedTask(null); // Close the menu after selecting an option
//   };

//   const indexOfLastTask = currentPage * tasksPerPage;
//   const indexOfFirstTask = indexOfLastTask - tasksPerPage;
//   const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

//   const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: "700px",
//         padding: "15px",
//         backgroundColor: "#f5f5f5",
//         borderRadius: "8px",
//         boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//         margin: "0 auto"
//       }}
//     >
//       <button onClick={fetchTasks} style={{ marginBottom: '10px' }}>
//         Refresh Tasks
//       </button>

//       <div className="filter-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//         <div>
//           <FaFilter style={{ marginRight: '5px' }} />
//           <span>Priority:</span>
//           <select
//             value={filterByPriority}
//             onChange={(e) => setFilterByPriority(e.target.value)}
//             style={{ marginLeft: '5px', padding: '3px' }}
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

//       <ul style={{ listStyleType: "none", padding: 0 }}>
//         {currentTasks.length > 0 ? (
//           currentTasks.map((task) => {
//             const isOverdue = new Date(task.dueDate) < currentDate;
//             const progress = task.progress || 0;

//             return (
//               <li
//                 key={task._id}
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   backgroundColor: isOverdue ? '#d3d3d3' : '#f5f5f5',
//                   padding: "8px",
//                   marginBottom: "8px",
//                   borderRadius: "5px",
//                   boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
//                   color: isOverdue ? "#777" : "#333",
//                   fontSize: "16px",
//                   textDecoration: isOverdue ? 'line-through' : 'none'
//                 }}
//               >
//                 <div>
//                   <strong>{task.subject || 'No Subject'}</strong> - {task.taskType || 'No Task Type'}, Due: {formatDate(task.dueDate)}
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                   {!isOverdue && (
//                     <div style={{ display: 'flex' }}>
//                       {getStarIcons(progress)}
//                     </div>
//                   )}
//                   <div style={{ position: 'relative' }}>
//                     <FaEllipsisV
//                       style={{ cursor: 'pointer', marginLeft: '8px' }}
//                       onClick={() => handleMenuClick(task)}
//                     />
//                     {selectedTask === task._id && (
//                       <div style={{
//                         position: 'absolute',
//                         right: '0',
//                         backgroundColor: '#fff',
//                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
//                         borderRadius: '4px',
//                         zIndex: 1,
//                       }}>
//                         <ul style={{ listStyle: 'none', padding: '5px', margin: 0 }}>
//                           <li onClick={() => handleProgressChange(task._id, 100)} style={{ padding: '5px', cursor: 'pointer' }}>Completed</li>
//                           <li onClick={() => handleProgressChange(task._id, 75)} style={{ padding: '5px', cursor: 'pointer' }}>Almost Done</li>
//                           <li onClick={() => handleProgressChange(task._id, 50)} style={{ padding: '5px', cursor: 'pointer' }}>Half Done</li>
//                           <li onClick={() => handleProgressChange(task._id, 25)} style={{ padding: '5px', cursor: 'pointer' }}>Started</li>
//                           <li onClick={() => handleProgressChange(task._id, 0)} style={{ padding: '5px', cursor: 'pointer' }}>Not Started</li>
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </li>
//             );
//           })
//         ) : (
//           <li style={{ textAlign: "center", color: "#777" }}>No tasks found.</li>
//         )}
//       </ul>

//       <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
//         <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
//           <FaArrowLeft /> Previous
//         </button>
//         <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
//           Next <FaArrowRight />
//         </button>
//       </div>

//       <div style={{ marginTop: "10px", textAlign: "center", color: "#777" }}>
//         Page {currentPage} of {totalPages}
//       </div>
//     </div>
//   );
// };

// export default TaskListProgress;
// import React, { useState, useEffect } from "react";
// import './CV.css'; // Ensure you have the required CSS file
// import { toast } from 'react-toastify';
// import { FaFilter, FaArrowLeft, FaArrowRight, FaEllipsisV } from 'react-icons/fa';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const TaskListProgress = ({ currentUserId }) => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [filterByPriority, setFilterByPriority] = useState('all');
//   const [filterByDueDate, setFilterByDueDate] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const tasksPerPage = 8;
//   const [selectedTask, setSelectedTask] = useState(null); // Track the task for which the menu is open

//   const fetchTasks = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/task/myTasks', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (response.ok) {
//         const tasksData = await response.json();
//         setTasks(tasksData);
//         setFilteredTasks(tasksData);
//       } else {
//         toast.error('Failed to fetch tasks.');
//       }
//     } catch (error) {
//       toast.error('Server error. Failed to fetch tasks.');
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [currentUserId]);

//   const currentDate = new Date();

//   useEffect(() => {
//     let filtered = tasks;

//     if (filterByPriority !== 'all') {
//       filtered = filtered.filter(task => task.priority === filterByPriority);
//     }

//     if (filterByDueDate) {
//       filtered = filtered.filter(task => new Date(task.dueDate) > currentDate);
//     }

//     const overdueTasks = filtered.filter(task => new Date(task.dueDate) < currentDate);
//     const futureTasks = filtered.filter(task => new Date(task.dueDate) >= currentDate);

//     futureTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

//     setFilteredTasks([...futureTasks, ...overdueTasks]);
//     setCurrentPage(1);
//   }, [tasks, filterByPriority, filterByDueDate]);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
//   };

//   const getPieChartData = (progress) => {
//     const data = [progress, 100 - progress]; // Progress vs Remaining
//     return {
//       labels: ['Completed', 'Remaining'],
//       datasets: [{
//         data: data,
//         backgroundColor: ['#33ff36', '#ff3633'], // Green for completed, red for remaining
//         borderWidth: 0,
//       }],
//     };
//   };

//   const updateTaskProgress = (taskId, newProgress) => {
//     const updatedTasks = tasks.map(task => {
//       if (task._id === taskId) {
//         return { ...task, progress: newProgress };
//       }
//       return task;
//     });
//     setTasks(updatedTasks);
//     setFilteredTasks(updatedTasks);
//   };

//   const handleMenuClick = (task) => {
//     setSelectedTask(task._id === selectedTask ? null : task._id);
//   };

//   const handleProgressChange = (taskId, progress) => {
//     updateTaskProgress(taskId, progress);
//     setSelectedTask(null); // Close the menu after selecting an option
//   };

//   const indexOfLastTask = currentPage * tasksPerPage;
//   const indexOfFirstTask = indexOfLastTask - tasksPerPage;
//   const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

//   const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: "700px",
//         padding: "15px",
//         backgroundColor: "#f5f5f5",
//         borderRadius: "8px",
//         boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//         margin: "0 auto"
//       }}
//     >
//       <button onClick={fetchTasks} style={{ marginBottom: '10px' }}>
//         Refresh Tasks
//       </button>

//       <div className="filter-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//         <div>
//           <FaFilter style={{ marginRight: '5px' }} />
//           <span>Priority:</span>
//           <select
//             value={filterByPriority}
//             onChange={(e) => setFilterByPriority(e.target.value)}
//             style={{ marginLeft: '5px', padding: '3px' }}
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

//       <ul style={{ listStyleType: "none", padding: 0 }}>
//         {currentTasks.length > 0 ? (
//           currentTasks.map((task) => {
//             const isOverdue = new Date(task.dueDate) < currentDate;
//             const progress = task.progress || 0;

//             return (
//               <li
//                 key={task._id}
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   backgroundColor: isOverdue ? '#d3d3d3' : '#f5f5f5',
//                   padding: "8px",
//                   marginBottom: "8px",
//                   borderRadius: "5px",
//                   boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
//                   color: isOverdue ? "#777" : "#333",
//                   fontSize: "16px",
//                   textDecoration: isOverdue ? 'line-through' : 'none'
//                 }}
//               >
//                 <div>
//                   <strong>{task.subject || 'No Subject'}</strong> - {task.taskType || 'No Task Type'}, Due: {formatDate(task.dueDate)}
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                   {!isOverdue && (
//                     <div style={{ width: '30px', height: '30px', marginRight: '8px' }}>
//                       <Pie data={getPieChartData(progress)} options={{ maintainAspectRatio: false }} />
//                     </div>
//                   )}
//                   <div style={{ position: 'relative' }}>
//                     <FaEllipsisV
//                       style={{ cursor: 'pointer', marginLeft: '8px' }}
//                       onClick={() => handleMenuClick(task)}
//                     />
//                     {selectedTask === task._id && (
//                       <div style={{
//                         position: 'absolute',
//                         right: '0',
//                         backgroundColor: '#fff',
//                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
//                         borderRadius: '4px',
//                         zIndex: 1,
//                       }}>
//                         <ul style={{ listStyle: 'none', padding: '5px', margin: 0 }}>
//                           <li onClick={() => handleProgressChange(task._id, 100)} style={{ padding: '5px', cursor: 'pointer' }}>Completed</li>
//                           <li onClick={() => handleProgressChange(task._id, 75)} style={{ padding: '5px', cursor: 'pointer' }}>Almost Done</li>
//                           <li onClick={() => handleProgressChange(task._id, 50)} style={{ padding: '5px', cursor: 'pointer' }}>Half Done</li>
//                           <li onClick={() => handleProgressChange(task._id, 25)} style={{ padding: '5px', cursor: 'pointer' }}>Started</li>
//                           <li onClick={() => handleProgressChange(task._id, 0)} style={{ padding: '5px', cursor: 'pointer' }}>Not Started</li>
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </li>
//             );
//           })
//         ) : (
//           <li style={{ textAlign: "center", color: "#777" }}>No tasks available.</li>
//         )}
//       </ul>

//       <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
//         <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
//           <FaArrowLeft /> Previous
//         </button>
//         <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
//           Next <FaArrowRight />
//         </button>
//       </div>

//       <div style={{ marginTop: "10px", textAlign: "center", color: "#777" }}>
//         Page {currentPage} of {totalPages}
//       </div>
//     </div>
//   );
// };

// export default TaskListProgress;
// import React, { useState, useEffect } from "react";
// import './CV.css'; // Ensure you have the required CSS file
// import { toast } from 'react-toastify';
// import { FaFilter, FaArrowLeft, FaArrowRight, FaEllipsisV } from 'react-icons/fa';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const TaskListProgress = ({ currentUserId }) => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [filterByPriority, setFilterByPriority] = useState('all');
//   const [filterByDueDate, setFilterByDueDate] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const tasksPerPage = 8;
//   const [selectedTask, setSelectedTask] = useState(null); // Track the task for which the menu is open

//   const fetchTasks = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/task/myTasks', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (response.ok) {
//         const tasksData = await response.json();
//         setTasks(tasksData);
//         setFilteredTasks(tasksData);
//       } else {
//         toast.error('Failed to fetch tasks.');
//       }
//     } catch (error) {
//       toast.error('Server error. Failed to fetch tasks.');
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [currentUserId]);

//   const currentDate = new Date();

//   useEffect(() => {
//     let filtered = tasks;

//     if (filterByPriority !== 'all') {
//       filtered = filtered.filter(task => task.priority === filterByPriority);
//     }

//     if (filterByDueDate) {
//       filtered = filtered.filter(task => new Date(task.dueDate) > currentDate);
//     }

//     const overdueTasks = filtered.filter(task => new Date(task.dueDate) < currentDate);
//     const futureTasks = filtered.filter(task => new Date(task.dueDate) >= currentDate);

//     futureTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

//     setFilteredTasks([...futureTasks, ...overdueTasks]);
//     setCurrentPage(1);
//   }, [tasks, filterByPriority, filterByDueDate]);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
//   };

//   const getPieChartData = (progress) => {
//     const data = [progress, 100 - progress]; // Progress vs Remaining
//     return {
//       labels: [], // Remove labels to not display them on the chart
//       datasets: [{
//         data: data,
//         backgroundColor: ['#33ff36', '#ff3633'], // Green for completed, red for remaining
//         borderWidth: 0,
//       }],
//     };
//   };

//   const updateTaskProgress = (taskId, newProgress) => {
//     const updatedTasks = tasks.map(task => {
//       if (task._id === taskId) {
//         return { ...task, progress: newProgress };
//       }
//       return task;
//     });
//     setTasks(updatedTasks);
//     setFilteredTasks(updatedTasks);
//   };

//   const handleMenuClick = (task) => {
//     setSelectedTask(task._id === selectedTask ? null : task._id);
//   };

//   const handleProgressChange = (taskId, progress) => {
//     updateTaskProgress(taskId, progress);
//     setSelectedTask(null); // Close the menu after selecting an option
//   };

//   const indexOfLastTask = currentPage * tasksPerPage;
//   const indexOfFirstTask = indexOfLastTask - tasksPerPage;
//   const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

//   const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

//   return (
//     <div
//       style={{
//         width: "100%",
//         maxWidth: "700px",
//         padding: "15px",
//         backgroundColor: "#f5f5f5",
//         borderRadius: "8px",
//         boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//         margin: "0 auto"
//       }}
//     >
//       <button onClick={fetchTasks} style={{ marginBottom: '10px' }}>
//         Refresh Tasks
//       </button>

//       <div className="filter-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//         <div>
//           <FaFilter style={{ marginRight: '5px' }} />
//           <span>Priority:</span>
//           <select
//             value={filterByPriority}
//             onChange={(e) => setFilterByPriority(e.target.value)}
//             style={{ marginLeft: '5px', padding: '3px' }}
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

//       <ul style={{ listStyleType: "none", padding: 0 }}>
//         {currentTasks.length > 0 ? (
//           currentTasks.map((task) => {
//             const isOverdue = new Date(task.dueDate) < currentDate;
//             const progress = task.progress || 0;

//             return (
//               <li
//                 key={task._id}
//                 style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   backgroundColor: isOverdue ? '#d3d3d3' : '#f5f5f5',
//                   padding: "8px",
//                   marginBottom: "8px",
//                   borderRadius: "5px",
//                   boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
//                   color: isOverdue ? "#777" : "#333",
//                   fontSize: "16px",
//                   textDecoration: isOverdue ? 'line-through' : 'none'
//                 }}
//               >
//                 <div>
//                   <strong>{task.subject || 'No Subject'}</strong> - {task.taskType || 'No Task Type'}, Due: {formatDate(task.dueDate)}
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                   {!isOverdue && (
//                     <div style={{ width: '30px', height: '30px', marginRight: '8px' }}>
//                       <Pie 
//                         data={getPieChartData(progress)} 
//                         options={{ 
//                           maintainAspectRatio: false,
//                           plugins: {
//                             legend: { display: false }, // Hide legend
//                             tooltip: { enabled: false } // Disable tooltips
//                           }
//                         }} 
//                       />
//                     </div>
//                   )}
//                   <div style={{ position: 'relative' }}>
//                     <FaEllipsisV
//                       style={{ cursor: 'pointer', marginLeft: '8px' }}
//                       onClick={() => handleMenuClick(task)}
//                     />
//                     {selectedTask === task._id && (
//                       <div style={{
//                         position: 'absolute',
//                         right: '0',
//                         backgroundColor: '#fff',
//                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
//                         borderRadius: '4px',
//                         zIndex: 1,
//                       }}>
//                         <ul style={{ listStyle: 'none', padding: '5px', margin: 0 }}>
//                           <li onClick={() => handleProgressChange(task._id, 100)} style={{ padding: '5px', cursor: 'pointer' }}>Completed</li>
//                           <li onClick={() => handleProgressChange(task._id, 75)} style={{ padding: '5px', cursor: 'pointer' }}>Almost Done</li>
//                           <li onClick={() => handleProgressChange(task._id, 50)} style={{ padding: '5px', cursor: 'pointer' }}>Half Done</li>
//                           <li onClick={() => handleProgressChange(task._id, 25)} style={{ padding: '5px', cursor: 'pointer' }}>Started</li>
//                           <li onClick={() => handleProgressChange(task._id, 0)} style={{ padding: '5px', cursor: 'pointer' }}>Not Started</li>
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </li>
//             );
//           })
//         ) : (
//           <li style={{ textAlign: "center", color: "#777" }}>No tasks available.</li>
//         )}
//       </ul>

//       <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
//         <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
//           <FaArrowLeft /> Previous
//         </button>
//         <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
//           Next <FaArrowRight />
//         </button>
//       </div>

//       <div style={{ marginTop: "10px", textAlign: "center", color: "#777" }}>
//         Page {currentPage} of {totalPages}
//       </div>
//     </div>
//   );
// };

// export default TaskListProgress;





import React, { useState, useEffect } from "react";
import './CV.css'; // Ensure you have the required CSS file
import { toast } from 'react-toastify';
import { FaFilter, FaArrowLeft, FaArrowRight, FaEllipsisV } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskListProgress = ({ currentUserId }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filterByPriority, setFilterByPriority] = useState('all');
  const [filterByDueDate, setFilterByDueDate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 8;
  const [selectedTask, setSelectedTask] = useState(null); // Track the task for which the menu is open

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

  const getPieChartData = (progress) => {
    const data = [progress, 100 - progress]; // Progress vs Remaining
    return {
      labels: [], // Remove labels to not display them on the chart
      datasets: [{
        data: data,
        backgroundColor: ['#33ff36', '#ff3633'], // Green for completed, red for remaining
        borderWidth: 0,
      }],
    };
  };

  // Function to update the task on the server
  const updateTaskOnServer = async (taskId, updatedTask) => {
    try {
      const response = await fetch(`http://localhost:5000/task/updateProgress/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask), // Send updated task details
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedData = await response.json();
      return updatedData; // Return the updated task data
    } catch (error) {
      toast.error('Failed to update task.');
      console.error(error);
    }
  };

  const updateTaskProgress = async (taskId, newProgress) => {
    const updatedTask = { progress: newProgress }; // Create the updated task object
    const updatedData = await updateTaskOnServer(taskId, updatedTask);

    if (updatedData) {
      const updatedTasks = tasks.map(task => {
        if (task._id === taskId) {
          return { ...task, progress: updatedData.progress }; // Update the task with new progress
        }
        return task;
      });
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
    }
  };

  const handleMenuClick = (task) => {
    setSelectedTask(task._id === selectedTask ? null : task._id);
  };

  const handleProgressChange = (taskId, progress) => {
    updateTaskProgress(taskId, progress);
    setSelectedTask(null); // Close the menu after selecting an option
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
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
            const progress = task.progress || 0;

            return (
              <li
                key={task._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: isOverdue ? '#d3d3d3' : '#f5f5f5',
                  padding: "8px",
                  marginBottom: "8px",
                  borderRadius: "5px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  color: isOverdue ? "#777" : "#333",
                  fontSize: "16px",
                  textDecoration: isOverdue ? 'line-through' : 'none'
                }}
              >
                <div>
                  <strong>{task.subject || 'No Subject'}</strong> - {task.taskType || 'No Task Type'}, Due: {formatDate(task.dueDate)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {!isOverdue && (
                    <div style={{ width: '30px', height: '30px', marginRight: '8px' }}>
                      <Pie 
                        data={getPieChartData(progress)} 
                        options={{ 
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false }, // Hide legend
                            tooltip: { enabled: false } // Disable tooltips
                          }
                        }} 
                      />
                    </div>
                  )}
                  <div style={{ position: 'relative' }}>
                    <FaEllipsisV
                      style={{ cursor: 'pointer', marginLeft: '8px' }}
                      onClick={() => handleMenuClick(task)}
                    />
                    {selectedTask === task._id && (
                      <div style={{
                        position: 'absolute',
                        right: '0',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        borderRadius: '5px',
                        zIndex: 1000
                      }}>
                        <div style={{ padding: '10px' }}>
                          <h5>Update Progress</h5>
                          {[0,25,50,75,100].map(progress => (
                            <button
                              key={progress}
                              onClick={() => handleProgressChange(task._id, progress)}
                              style={{
                                display: 'block',
                                margin: '5px 0',
                                padding: '5px',
                                border: 'none',
                                borderRadius: '5px',
                                backgroundColor: 'white',
                                color: 'black',
                                cursor: 'pointer'
                              }}
                            >
                              {progress}%
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <li>No tasks available.</li>
        )}
      </ul>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <FaArrowLeft /> Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default TaskListProgress;
