
// import React, { useEffect, useState } from 'react';
// import LoggedInNavBar from './LoggedInNavBar';
// import { CheckSquare, Droplet, PieChart, Calendar, Bell, StickyNote } from 'lucide-react';
// import { toast } from 'react-toastify';
// import waterImage from '../media/water.png';
// import { Calendar as ReactCalendar } from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import NotesComponent from './notesComponent';  
// import Reminder from './reminder';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const Dashboard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [taskProgress, setTaskProgress] = useState({ completed: 0, remaining: 100 });
//   const [loadingTasks, setLoadingTasks] = useState(false);
//   const [waterIntakeCups, setWaterIntakeCups] = useState(8);
//   const [cardOrder, setCardOrder] = useState([0, 1, 2, 3, 4, 5]);

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     setLoadingTasks(true);
//     try {
//       const response = await fetch('http://localhost:5000/task/myTasks', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const today = new Date();
//         const upcomingTasks = data.filter(task => new Date(task.dueDate) > today);
//         setTasks(upcomingTasks);
//       } else {
//         toast.error('Error fetching tasks. Please try again.');
//       }
//     } catch (error) {
//       toast.error('Failed to fetch tasks. Server error.');
//     } finally {
//       setLoadingTasks(false);
//     }
//   };

//   const fetchTaskProgress = async (taskId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/task/progress/${taskId}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (response.ok) {
//         const progress = await response.json();
//         setTaskProgress(progress);
//       } else {
//         toast.error('Error fetching task progress. Please try again.');
//       }
//     } catch (error) {
//       toast.error('Failed to fetch task progress. Server error.');
//     }
//   };

//   const handleTaskSelect = (event) => {
//     const taskId = event.target.value;
//     setSelectedTask(taskId);
//     if (taskId) {
//       fetchTaskProgress(taskId);
//     }
//   };

//   const handleCupClick = () => {
//     if (waterIntakeCups > 0) {
//       setWaterIntakeCups(prevCups => prevCups - 1);
//     } else {
//       toast.info('You have reached your daily water intake goal!');
//     }
//   };

//   const onDragEnd = (result) => {
//     if (!result.destination) return;

//     const updatedCardOrder = Array.from(cardOrder);
//     const [removed] = updatedCardOrder.splice(result.source.index, 1);
//     updatedCardOrder.splice(result.destination.index, 0, removed);

//     setCardOrder(updatedCardOrder);
//   };

//   const cards = [
//     {
//       title: `Scheduled Tasks (${tasks.length})`,
//       content: (
//         <ul className="list-disc pl-5 max-h-48 overflow-y-auto">
//           {loadingTasks ? (
//             <li className="text-gray-600">Loading tasks...</li>
//           ) : tasks.length === 0 ? (
//             <li className="text-gray-600">No upcoming tasks.</li>
//           ) : (
//             tasks.map(task => (
//               <li key={task._id} className="text-gray-700 mb-2">
//                 <span className="font-semibold">{task.subject}</span> - {task.taskType}
//                 <br />
//                 <span className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
//               </li>
//             ))
//           )}
//         </ul>
//       ),
//       icon: <CheckSquare size={24} />,
//       link: '/tasks',
//       color: 'bg-blue-100',
//     },
//     {
//       title: 'Water Intake',
//       content: (
//         <div>
//           <h3 className="text-lg font-semibold mb-2">Daily Goal: {waterIntakeCups} Cups</h3>
//           <div className="cup-icons grid grid-cols-4 gap-2">
//             {[...Array(8)].map((_, index) => (
//               <img
//                 key={index}
//                 src={waterImage}
//                 alt="Water Cup"
//                 className={`cup-icon w-8 h-8 cursor-pointer transition-opacity duration-300 ${index < waterIntakeCups ? 'opacity-100' : 'opacity-30'}`}
//                 onClick={handleCupClick}
//               />
//             ))}
//           </div>
//         </div>
//       ),
//       icon: <Droplet size={24} />,
//       link: '/water-intake',
//       color: 'bg-green-100',
//     },
//     {
//       title: 'Task Progress',
//       content: (
//         <div className="w-full">
//           <div className="mb-4">
//             <label htmlFor="taskSelect" className="block mb-2 text-gray-700 font-semibold">Select Task:</label>
//             <select
//               id="taskSelect"
//               onChange={handleTaskSelect}
//               className="border rounded p-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">-- Select a task --</option>
//               {tasks.map(task => (
//                 <option key={task._id} value={task._id}>{task.subject} - {task.taskType}</option>
//               ))}
//             </select>
//           </div>
//           {selectedTask && (
//             <div className="mt-4">
//               <h3 className="text-lg font-semibold mb-2">Task Progress</h3>
//               <div className="relative pt-1">
//                 <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
//                   <div style={{ width: `${taskProgress.completed}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
//                 </div>
//               </div>
//               <div className="flex justify-between mt-2 text-sm">
//                 <span>Completed: {taskProgress.completed}%</span>
//                 <span>Remaining: {taskProgress.remaining}%</span>
//               </div>
//             </div>
//           )}
//         </div>
//       ),
//       icon: <PieChart size={24} />,
//       link: '/task-progress',
//       color: 'bg-yellow-100',
//     },
//     {
//       title: 'Reminders',
//       content: <Reminder />,
//       icon: <Bell size={24} />,
//       link: '/reminders',
//       color: 'bg-red-100',
//     },
//     {
//       title: 'Notes',
//       content: <NotesComponent />,
//       icon: <StickyNote size={24} />,
//       link: '/notes',
//       color: 'bg-purple-100',
//     },
//     {
//       title: 'Calendar View',
//       content: <ReactCalendar />,
//       icon: <Calendar size={24} />,
//       link: '/calendar',
//       color: 'bg-blue-100',
//     },
//   ];

//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col">
//       <LoggedInNavBar />
//       <div className="flex-grow container mx-auto px-4 py-8">
//         <DragDropContext onDragEnd={onDragEnd}>
//           <Droppable droppableId="dashboard-cards" direction="horizontal">
//             {(provided) => (
//               <div
//                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//                 style={{ minHeight: 'calc(100vh - 200px)' }}
//                 {...provided.droppableProps}
//                 ref={provided.innerRef}
//               >
//                 {cardOrder.map((cardIndex, index) => (
//                   <Draggable key={cardIndex} draggableId={`card-${cardIndex}`} index={index}>
//                     {(provided, snapshot) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         className={`bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition duration-300 ${snapshot.isDragging ? 'opacity-70' : ''}`}
//                         style={{
//                           ...provided.draggableProps.style,
//                           height: '100%',
//                         }}
//                       >
//                         <div className={`${cards[cardIndex].color} p-4 rounded-full self-start cursor-move`}>
//                           {cards[cardIndex].icon}
//                         </div>
//                         <h2 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
//                           {cards[cardIndex].title}
//                         </h2>
//                         <div className="flex-grow overflow-y-auto">
//                           {cards[cardIndex].content}
//                         </div>
//                         {/* <a href={cards[cardIndex].link} className="text-blue-500 hover:underline mt-4 block">
//                           View More
//                         </a> */}
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </DragDropContext>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;





import React, { useEffect, useState } from 'react';
import LoggedInNavBar from './LoggedInNavBar';
import { CheckSquare, Droplet, PieChart, Calendar, Bell, StickyNote } from 'lucide-react';
import { toast } from 'react-toastify';
import waterImage from '../media/water.png';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import NotesComponent from './notesComponent';  
import Reminder from './reminder';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskProgress, setTaskProgress] = useState({ completed: 0, remaining: 100 });
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [waterIntakeCups, setWaterIntakeCups] = useState(8);
  const [cardOrder, setCardOrder] = useState([0, 1, 2, 3, 4, 5]);
  const [maxCardHeight, setMaxCardHeight] = useState(0);
  const [clickedCup, setClickedCup] = useState(null); // Track the clicked cup

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const response = await fetch('http://localhost:5000/task/myTasks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const today = new Date();
        const upcomingTasks = data.filter(task => new Date(task.dueDate) > today);
        setTasks(upcomingTasks);
      } else {
        toast.error('Error fetching tasks. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to fetch tasks. Server error.');
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchTaskProgress = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/task/progress/${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const progress = await response.json();
        setTaskProgress(progress);
      } else {
        toast.error('Error fetching task progress. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to fetch task progress. Server error.');
    }
  };

  const handleTaskSelect = (event) => {
    const taskId = event.target.value;
    setSelectedTask(taskId);
    if (taskId) {
      fetchTaskProgress(taskId);
    }
  };

  const handleCupClick = (index) => {
    if (clickedCup !== null) {
      toast.info('You can only click one cup at a time!');
      return; // Prevent multiple clicks
    }

    if (waterIntakeCups > 0) {
      setWaterIntakeCups(prevCups => prevCups - 1);
      setClickedCup(index); // Track the clicked cup
    } else {
      toast.info('You have reached your daily water intake goal!');
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedCardOrder = Array.from(cardOrder);
    const [removed] = updatedCardOrder.splice(result.source.index, 1);
    updatedCardOrder.splice(result.destination.index, 0, removed);

    setCardOrder(updatedCardOrder);
  };

  const cards = [
    {
      title: `Scheduled Tasks (${tasks.length})`,
      content: (
        <ul className="list-disc pl-5 max-h-48 overflow-y-auto">
          {loadingTasks ? (
            <li className="text-gray-600">Loading tasks...</li>
          ) : tasks.length === 0 ? (
            <li className="text-gray-600">No upcoming tasks.</li>
          ) : (
            tasks.map(task => (
              <li key={task._id} className="text-gray-700 mb-2">
                <span className="font-semibold">{task.subject}</span> - {task.taskType}
                <br />
                <span className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </li>
            ))
          )}
        </ul>
      ),
      icon: <CheckSquare size={24} />,
      link: '/tasks',
    },
    {
      title: 'Water Intake',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Daily Goal: {waterIntakeCups} Cups</h3>
          <div className="cup-icons grid grid-cols-4 gap-2">
            {[...Array(8)].map((_, index) => (
              <img
                key={index}
                src={waterImage}
                alt="Water Cup"
                className={`cup-icon w-8 h-8 cursor-pointer transition-opacity duration-300 ${index < waterIntakeCups ? 'opacity-100' : 'opacity-30'}`}
                onClick={() => handleCupClick(index)}
              />
            ))}
          </div>
        </div>
      ),
      icon: <Droplet size={24} />,
      link: '/water-intake',
    },
    {
      title: 'Task Progress',
      content: (
        <div className="w-full">
          <div className="mb-4">
            <label htmlFor="taskSelect" className="block mb-2 text-gray-700 font-semibold">Select Task:</label>
            <select
              id="taskSelect"
              onChange={handleTaskSelect}
              className="border rounded p-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a task --</option>
              {tasks.map(task => (
                <option key={task._id} value={task._id}>{task.subject} - {task.taskType}</option>
              ))}
            </select>
          </div>
          {selectedTask && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Task Progress</h3>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div style={{ width: `${taskProgress.completed}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>Completed: {taskProgress.completed}%</span>
                <span>Remaining: {taskProgress.remaining}%</span>
              </div>
            </div>
          )}
        </div>
      ),
      icon: <PieChart size={24} />,
      link: '/task-progress',
    },
    {
      title: 'Reminders',
      content: <Reminder />,
      icon: <Bell size={24} />,
      link: '/reminders',
    },
    {
      title: 'Notes',
      content: <NotesComponent />,
      icon: <StickyNote size={24} />,
      link: '/notes',
    },
    {
      title: 'Calendar View',
      content: <ReactCalendar />,
      icon: <Calendar size={24} />,
      link: '/calendar',
    },
  ];

  useEffect(() => {
    // Calculate maximum card height
    const cardElements = document.querySelectorAll('.dashboard-card');
    let maxHeight = 0;

    cardElements.forEach(card => {
      const cardHeight = card.offsetHeight;
      if (cardHeight > maxHeight) {
        maxHeight = cardHeight;
      }
    });

    setMaxCardHeight(maxHeight);
  }, [cards]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <LoggedInNavBar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="dashboard-cards" direction="horizontal">
            {(provided) => (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                style={{ minHeight: 'calc(100vh - 200px)' }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {cardOrder.map((cardIndex, index) => {
                  const card = cards[cardIndex];
                  return (
                    <Draggable key={index} draggableId={`card-${index}`} index={index}>
                      {(provided) => (
                        <div
                          className="dashboard-card border border-gray-300 p-4 rounded-lg shadow-md transition-all duration-300"
                          style={{ minHeight: `${maxCardHeight}px`, backgroundColor: 'white' }} // Set min height and white background
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="flex items-center mb-2">
                            {card.icon}
                            <h2 className="ml-2 font-bold">{card.title}</h2>
                          </div>
                          {card.content}
                          <div className="mt-4">
                            {/* <a href={card.link} className="text-blue-600 hover:underline">View more</a> */}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Dashboard;
