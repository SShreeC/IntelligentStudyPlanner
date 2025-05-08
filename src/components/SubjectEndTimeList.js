import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

const SubjectEndTimeList = () => {
  const [subjects, setSubjects] = useState([]);
  const [endTimes, setEndTimes] = useState({});
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingEndTime, setEditingEndTime] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState('subjects');
  const [subjectsPerPage] = useState(9);

  useEffect(() => {
    fetchSubjects();
    fetchEndTimes();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/task/getSub', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      } else {
        toast.error('Error fetching subjects. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to fetch subjects. Server error.');
    }
  };

  const fetchEndTimes = async () => {
    try {
      const response = await fetch('http://localhost:5000/end/getEndTime', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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

  const handleEditSubject = (subject) => {
    setEditingSubject({ ...subject });
  };

  const handleEditEndTime = (day) => {
    setEditingEndTime({ day, time: endTimes[day] });
  };

  const handleUpdateSubject = async () => {
    try {
      const response = await fetch(`http://localhost:5000/task/updateSub/${editingSubject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ subject: editingSubject.subject }),
      });

      if (response.ok) {
        toast.success('Subject updated successfully.');
        setEditingSubject(null);
        fetchSubjects();
      } else {
        toast.error('Error updating subject. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to update subject. Server error.');
    }
  };

  const handleUpdateEndTime = async () => {
    try {
      const response = await fetch(`http://localhost:5000/end/updateEndTime/${editingEndTime.day}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ endTime: editingEndTime.time }),
      });

      if (response.ok) {
        toast.success('End time updated successfully.');
        setEditingEndTime(null);
        fetchEndTimes();
      } else {
        toast.error('Error updating end time. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to update end time. Server error.');
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        const response = await fetch(`http://localhost:5000/task/deleteSub/${subjectId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          toast.success('Subject deleted successfully.');
          fetchSubjects();
        } else {
          toast.error('Error deleting subject. Please try again.');
        }
      } catch (error) {
        toast.error('Failed to delete subject. Server error.');
      }
    }
  };

  // Pagination for subjects
  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = subjects.slice(indexOfFirstSubject, indexOfLastSubject);
  const totalPages = Math.ceil(subjects.length / subjectsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Subjects and End Times</h2>

      {/* Toggle buttons for subjects and end times */}
      <div className="flex justify-center mb-4">
        <button
          className={`px-3 py-1 rounded-l-lg ${view === 'subjects' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setView('subjects')}
        >
          Subjects
        </button>
        <button
          className={`px-3 py-1 rounded-r-lg ${view === 'endTimes' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => setView('endTimes')}
        >
          End Times
        </button>
      </div>

      {/* Conditional rendering based on selected view */}
      {view === 'subjects' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSubjects.map((sub) => (
              <div key={sub._id} className="bg-gray-100 rounded-lg p-3 flex flex-col justify-between">
                {editingSubject && editingSubject._id === sub._id ? (
                  <div>
                    <input
                      type="text"
                      value={editingSubject.subject}
                      onChange={(e) => setEditingSubject({ ...editingSubject, subject: e.target.value })}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <div className="flex justify-end">
                      <button onClick={handleUpdateSubject} className="mr-1 p-1 bg-green-500 text-white rounded">
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button onClick={() => setEditingSubject(null)} className="p-1 bg-red-500 text-white rounded">
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-800">{sub.subject}</span>
                      <div className="flex space-x-1">
                        <button onClick={() => handleEditSubject(sub)} className="p-1 text-blue-500 rounded">
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button onClick={() => handleDeleteSubject(sub._id)} className="p-1 text-red-500 rounded">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {sub.days && Object.keys(sub.days).map((day) => (
                        <div key={day}>
                          <strong>{day}: </strong> {sub.days[day] || 'No time set'}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Pagination for subjects */}
          <div className="mt-4 flex justify-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {view === 'endTimes' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(endTimes).map((day) => (
              <div key={day} className="bg-gray-100 rounded-lg p-3 flex flex-col justify-between">
                {editingEndTime && editingEndTime.day === day ? (
                  <div>
                    <input
                      type="time"
                      value={editingEndTime.time}
                      onChange={(e) => setEditingEndTime({ ...editingEndTime, time: e.target.value })}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <div className="flex justify-end">
                      <button onClick={handleUpdateEndTime} className="mr-1 p-1 bg-green-500 text-white rounded">
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button onClick={() => setEditingEndTime(null)} className="p-1 bg-red-500 text-white rounded">
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-800">{day}: {endTimes[day] || 'No time set'}</span>
                    <button onClick={() => handleEditEndTime(day)} className="p-1 text-blue-500 rounded">
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectEndTimeList;





// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPen, faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

// const SubjectEndTimeList = () => {
//   const [subjects, setSubjects] = useState([]);
//   const [endTimes, setEndTimes] = useState({});
//   const [editingSubject, setEditingSubject] = useState(null);
//   const [editingEndTime, setEditingEndTime] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [subjectsPerPage] = useState(9);

//   useEffect(() => {
//     fetchSubjects();
//     fetchEndTimes();
//   }, []);

//   const fetchSubjects = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/task/getSub', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setSubjects(data);
//       } else {
//         toast.error('Error fetching subjects. Please try again.');
//       }
//     } catch (error) {
//       toast.error('Failed to fetch subjects. Server error.');
//     }
//   };

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

//   const handleEditSubject = (subject) => {
//     setEditingSubject({ ...subject });
//   };

//   const handleEditEndTime = (day) => {
//     setEditingEndTime({ day, time: endTimes[day] });
//   };

//   const handleUpdateSubject = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/task/updateSub/${editingSubject._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({ subject: editingSubject.subject }),
//       });

//       if (response.ok) {
//         toast.success('Subject updated successfully.');
//         setEditingSubject(null);
//         fetchSubjects();
//       } else {
//         toast.error('Error updating subject. Please try again.');
//       }
//     } catch (error) {
//       toast.error('Failed to update subject. Server error.');
//     }
//   };

//   const handleUpdateEndTime = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/end/updateEndTime/${editingEndTime.day}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({ endTime: editingEndTime.time }),
//       });

//       if (response.ok) {
//         toast.success('End time updated successfully.');
//         setEditingEndTime(null);
//         fetchEndTimes();
//       } else {
//         toast.error('Error updating end time. Please try again.');
//       }
//     } catch (error) {
//       toast.error('Failed to update end time. Server error.');
//     }
//   };

//   const handleDeleteSubject = async (subjectId) => {
//     if (window.confirm('Are you sure you want to delete this subject?')) {
//       try {
//         const response = await fetch(`http://localhost:5000/task/deleteSub/${subjectId}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           },
//         });

//         if (response.ok) {
//           toast.success('Subject deleted successfully.');
//           fetchSubjects();
//         } else {
//           toast.error('Error deleting subject. Please try again.');
//         }
//       } catch (error) {
//         toast.error('Failed to delete subject. Server error.');
//       }
//     }
//   };

//   // Pagination
//   const indexOfLastSubject = currentPage * subjectsPerPage;
//   const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
//   const currentSubjects = subjects.slice(indexOfFirstSubject, indexOfLastSubject);
//   const totalPages = Math.ceil(subjects.length / subjectsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6">Subjects and End Times</h2>
      
//       <div className="mb-8">
//         <h3 className="text-xl font-semibold mb-4">Subjects</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {currentSubjects.map((sub) => (
//             <div key={sub._id} className="bg-gray-100 rounded-lg p-4 flex flex-col justify-between">
//               {editingSubject && editingSubject._id === sub._id ? (
//                 <div>
//                   <input
//                     type="text"
//                     value={editingSubject.subject}
//                     onChange={(e) => setEditingSubject({ ...editingSubject, subject: e.target.value })}
//                     className="w-full p-2 mb-2 border rounded"
//                   />
//                   <div className="flex justify-end">
//                     <button onClick={handleUpdateSubject} className="mr-2 p-1 bg-green-500 text-white rounded">
//                       <FontAwesomeIcon icon={faCheck} />
//                     </button>
//                     <button onClick={() => setEditingSubject(null)} className="p-1 bg-red-500 text-white rounded">
//                       <FontAwesomeIcon icon={faTimes} />
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <span className="text-lg font-medium text-gray-800 mb-2">{sub.subject}</span>
//                   <div className="text-sm text-gray-600">
//                     {sub.days && Object.keys(sub.days).map(day => (
//                       <div key={day}>
//                         <strong>{day}: </strong> {sub.days[day] || 'No time set'}
//                       </div>
//                     ))}
//                   </div>
//                   <div className="mt-2 flex justify-end">
//                     <button onClick={() => handleEditSubject(sub)} className="mr-2 p-1 bg-blue-500 text-white rounded">
//                       <FontAwesomeIcon icon={faPen} />
//                     </button>
//                     <button onClick={() => handleDeleteSubject(sub._id)} className="p-1 bg-red-500 text-white rounded">
//                       <FontAwesomeIcon icon={faTrash} />
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Pagination */}
//         <div className="mt-4 flex justify-center">
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i}
//               onClick={() => paginate(i + 1)}
//               className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div>
//         <h3 className="text-xl font-semibold mb-4">End Times</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {Object.keys(endTimes).map(day => (
//             <div key={day} className="bg-gray-100 rounded-lg p-4 flex flex-col justify-between">
//               {editingEndTime && editingEndTime.day === day ? (
//                 <div>
//                   <input
//                     type="text"
//                     value={editingEndTime.time}
//                     onChange={(e) => setEditingEndTime({ ...editingEndTime, time: e.target.value })}
//                     className="w-full p-2 mb-2 border rounded"
//                   />
//                   <div className="flex justify-end">
//                     <button onClick={handleUpdateEndTime} className="mr-2 p-1 bg-green-500 text-white rounded">
//                       <FontAwesomeIcon icon={faCheck} />
//                     </button>
//                     <button onClick={() => setEditingEndTime(null)} className="p-1 bg-red-500 text-white rounded">
//                       <FontAwesomeIcon icon={faTimes} />
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <span className="text-lg font-medium text-gray-800 mb-2">{day}</span>
//                   <div className="text-sm text-gray-600">
//                     {endTimes[day] || 'No end time set'}
//                   </div>
//                   <div className="mt-2 flex justify-end">
//                     <button onClick={() => handleEditEndTime(day)} className="p-1 bg-blue-500 text-white rounded">
//                       <FontAwesomeIcon icon={faPen} />
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubjectEndTimeList;