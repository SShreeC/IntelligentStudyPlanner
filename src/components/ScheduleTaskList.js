
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ScheduleTasksList = ({ scheduledTasks, onRescheduleTask }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [reschedulingTask, setReschedulingTask] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [newTime, setNewTime] = useState('');
  const tasksPerPage = 2;

  const flattenedTasks = Object.keys(scheduledTasks).flatMap((date) =>
    scheduledTasks[date].map((task) => ({
      date,
      ...task,
    }))
  );

  const totalTasks = flattenedTasks.length;
  const totalPages = Math.ceil(totalTasks / tasksPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const currentTasks = flattenedTasks.slice(
    currentPage * tasksPerPage,
    (currentPage + 1) * tasksPerPage
  );

  const handleRescheduleClick = (task) => {
    setReschedulingTask(task);
    setNewDate(new Date(task.scheduledStartTime));
    setNewTime(new Date(task.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  };

  const handleConfirmReschedule = () => {
    if (newDate && newTime) {
      onRescheduleTask(reschedulingTask._id, newDate, newTime);
      setReschedulingTask(null);
      setNewDate(null);
      setNewTime('');
    } else {
      toast.error('Please select both date and time for rescheduling.');
    }
  };

  return (
    <div>
      {currentTasks.length === 0 ? (
        <p>No tasks scheduled yet.</p>
      ) : (
        currentTasks.map((task, index) => (
          <div key={index} style={{ margin: '20px 0' }}>
            <h4>Date: {new Date(task.date).toLocaleDateString()}</h4>
            <div
              className="task-card"
              style={{
                backgroundColor: 'lightyellow',
                margin: '10px',
                padding: '10px',
                borderRadius: '5px',
              }}
            >
              <h4>{task.subject}</h4>
              <p>Scheduled Start: {new Date(task.scheduledStartTime).toLocaleTimeString()}</p>
              <p>Scheduled End: {new Date(task.scheduledEndTime).toLocaleTimeString()}</p>
              <button className="btn btn-outline btn-info" onClick={() => handleRescheduleClick(task)}>Reschedule</button>
            </div>
            <div
              className="task-card"
              style={{
                backgroundColor: '#CBC3E3',
                margin: '10px',
                padding: '10px',
                borderRadius: '5px',
              }}
            >
              <h4>Relax Break</h4>
              <p>Break Start: {new Date(task.scheduledBreakStartTime).toLocaleTimeString()}</p>
              <p>Break End: {new Date(task.scheduledBreakEndTime).toLocaleTimeString()}</p>
            </div>
          </div>
        ))
      )}
      {reschedulingTask && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <h4>Reschedule: {reschedulingTask.subject}</h4>
          <div style={{ marginBottom: '10px' }}>
            <label>New Date: </label>
            <DatePicker
              selected={newDate}
              onChange={date => setNewDate(date)}
              dateFormat="MMMM d, yyyy"
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>New Time: </label>
            <input
              type="time"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
            />
          </div>
          <button class="btn btn-outline btn-info" onClick={handleConfirmReschedule}>Confirm Reschedule</button>
          <button  class="btn btn-outline btn-info"onClick={() => setReschedulingTask(null)}>Cancel</button>
        </div>
      )}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          &#8592; {/* Left Arrow */}
        </button>
        <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
          &#8594; {/* Right Arrow */}
        </button>
      </div>
    </div>
  );
};

export default ScheduleTasksList;



// import React, { useState } from 'react';
// import { toast } from 'react-toastify';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const ScheduleTasksList = ({ scheduledTasks, onRescheduleTask }) => {
//   const [currentPage, setCurrentPage] = useState(0);
//   const [reschedulingTask, setReschedulingTask] = useState(null);
//   const [newDate, setNewDate] = useState(null);
//   const [newTime, setNewTime] = useState('');
//   const tasksPerPage = 2;

//   const flattenedTasks = Object.keys(scheduledTasks).flatMap((date) =>
//     scheduledTasks[date].map((task) => ({
//       date,
//       ...task,
//     }))
//   );

//   const totalTasks = flattenedTasks.length;
//   const totalPages = Math.ceil(totalTasks / tasksPerPage);

//   const handleNextPage = () => {
//     if (currentPage < totalPages - 1) {
//       setCurrentPage((prevPage) => prevPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 0) {
//       setCurrentPage((prevPage) => prevPage - 1);
//     }
//   };

//   const currentTasks = flattenedTasks.slice(
//     currentPage * tasksPerPage,
//     (currentPage + 1) * tasksPerPage
//   );

//   const handleRescheduleClick = (task) => {
//     setReschedulingTask(task);
//     setNewDate(new Date(task.scheduledStartTime));
//     setNewTime(new Date(task.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
//   };

//   const handleConfirmReschedule = () => {
//     if (newDate && newTime) {
//       // Pass taskId, instanceId, and new timing information
//       onRescheduleTask(reschedulingTask._id, reschedulingTask.instanceId, newDate, newTime);
//       setReschedulingTask(null);
//       setNewDate(null);
//       setNewTime('');
//     } else {
//       toast.error('Please select both date and time for rescheduling.');
//     }
//   };

//   return (
//     <div>
//       {currentTasks.length === 0 ? (
//         <p>No tasks scheduled yet.</p>
//       ) : (
//         currentTasks.map((task, index) => (
//           <div key={`${task._id}-${task.instanceId}-${index}`} style={{ margin: '20px 0' }}>
//             <h4>Date: {new Date(task.date).toLocaleDateString()}</h4>
//             <div
//               className="task-card"
//               style={{
//                 backgroundColor: task.isCompleted ? '#d4edda' : 'lightyellow',
//                 margin: '10px',
//                 padding: '10px',
//                 borderRadius: '5px',
//               }}
//             >
//               <h4>{task.subject}</h4>
//               <p>Scheduled Start: {new Date(task.scheduledStartTime).toLocaleTimeString()}</p>
//               <p>Scheduled End: {new Date(task.scheduledEndTime).toLocaleTimeString()}</p>
//               <button className="btn btn-outline btn-info" onClick={() => handleRescheduleClick(task)}>Reschedule</button>
//             </div>
//             <div
//               className="task-card"
//               style={{
//                 backgroundColor: '#CBC3E3',
//                 margin: '10px',
//                 padding: '10px',
//                 borderRadius: '5px',
//               }}
//             >
//               <h4>Relax Break</h4>
//               <p>Break Start: {new Date(task.scheduledBreakStartTime).toLocaleTimeString()}</p>
//               <p>Break End: {new Date(task.scheduledBreakEndTime).toLocaleTimeString()}</p>
//             </div>
//           </div>
//         ))
//       )}
//       {reschedulingTask && (
//         <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
//           <h4>Reschedule: {reschedulingTask.subject}</h4>
//           <div style={{ marginBottom: '10px' }}>
//             <label>New Date: </label>
//             <DatePicker
//               selected={newDate}
//               onChange={date => setNewDate(date)}
//               dateFormat="MMMM d, yyyy"
//             />
//           </div>
//           <div style={{ marginBottom: '10px' }}>
//             <label>New Time: </label>
//             <input
//               type="time"
//               value={newTime}
//               onChange={e => setNewTime(e.target.value)}
//             />
//           </div>
//           <button className="btn btn-outline btn-info" onClick={handleConfirmReschedule}>Confirm Reschedule</button>
//           <button className="btn btn-outline btn-info" onClick={() => setReschedulingTask(null)}>Cancel</button>
//         </div>
//       )}
//       <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
//         <button onClick={handlePreviousPage} disabled={currentPage === 0}>
//           &#8592; {/* Left Arrow */}
//         </button>
//         <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
//           &#8594; {/* Right Arrow */}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ScheduleTasksList;