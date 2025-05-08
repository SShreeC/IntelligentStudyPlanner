// import React, { useState } from 'react';

// const NotesComponent = () => {
//   const [notes, setNotes] = useState([]);
//   const [noteText, setNoteText] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [expandedNoteIndex, setExpandedNoteIndex] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   const notesPerPage = 4; // Limit notes per page

//   // Save the new note
//   const handleSaveNote = () => {
//     if (noteText.trim()) {
//       setNotes([...notes, noteText]);
//       setNoteText('');
//       setShowModal(false); // Close the modal after saving
//     } else {
//       alert('Please enter a note.');
//     }
//   };

//   // Toggle between expanded and collapsed note
//   const toggleExpandNote = (index) => {
//     setExpandedNoteIndex(expandedNoteIndex === index ? null : index);
//   };

//   // Pagination logic
//   const indexOfLastNote = currentPage * notesPerPage;
//   const indexOfFirstNote = indexOfLastNote - notesPerPage;
//   const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);

//   const goToNextPage = () => {
//     if (currentPage < Math.ceil(notes.length / notesPerPage)) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const goToPrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div style={styles.container}>

//       {/* Display the list of notes with pagination */}
//       <div style={styles.notesList}>
//         {currentNotes.length > 0 ? (
//           currentNotes.map((note, index) => (
//             <div key={index} style={styles.noteCard}>
//               <div style={styles.noteText}>
//                 {expandedNoteIndex === index + (currentPage - 1) * notesPerPage
//                   ? note
//                   : `${note.split(' ')[0]}...`} {/* Only display the first word */}

//                 <span
//                   style={styles.readMore}
//                   onClick={() => toggleExpandNote(index + (currentPage - 1) * notesPerPage)}
//                   role="button"
//                   tabIndex={0}
//                   onKeyPress={() => toggleExpandNote(index + (currentPage - 1) * notesPerPage)}
//                 >
//                   {expandedNoteIndex === index + (currentPage - 1) * notesPerPage ? ' Read Less' : ' Read More'}
//                 </span>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No notes available.</p>
//         )}
//       </div>

//       {/* Pagination Arrows */}
//       <div style={styles.paginationContainer}>
//         <span
//           style={styles.paginationArrow}
//           onClick={goToPrevPage}
//           role="button"
//           tabIndex={0}
//         >
//           &#9664; {/* Left Arrow */}
//         </span>
//         <span>{currentPage}</span>
//         <span
//           style={styles.paginationArrow}
//           onClick={goToNextPage}
//           role="button"
//           tabIndex={0}
//         >
//           &#9654; {/* Right Arrow */}
//         </span>
//       </div>

//       {/* Floating Action Button */}
//       <div style={styles.fabContainer}>
//         <button onClick={() => setShowModal(true)} style={styles.fab}>
//           +
//         </button>
//       </div>

//       {/* Modal for adding notes */}
//       {showModal && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modal}>
//             <h2 style={styles.modalHeader}>Add Note</h2>
//             <textarea
//               placeholder="Write your note here..."
//               value={noteText}
//               onChange={(e) => setNoteText(e.target.value)}
//               style={styles.textArea}
//             />
//             <div style={styles.modalActions}>
//               <button onClick={handleSaveNote} style={styles.saveButton}>Save</button>
//               <button onClick={() => setShowModal(false)} style={styles.closeButton}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Styling
// const styles = {
//   container: {
//     maxWidth: '600px',
//     margin: '20px auto',
//     padding: '20px',
//     textAlign: 'center',
//     fontFamily: 'Arial, sans-serif',
//     border: '1px solid #ddd',
//     borderRadius: '8px',
//     backgroundColor: '#f9f9f9',
//     position: 'relative',
//   },
//   notesList: {
//     marginBottom: '20px',
//     textAlign: 'left',
//   },
//   noteCard: {
//     backgroundColor: '#fff',
//     border: '1px solid #ddd',
//     borderRadius: '8px',
//     padding: '15px',
//     marginBottom: '15px',
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//   },
//   noteText: {
//     fontSize: '16px',
//     color: '#333',
//     lineHeight: '1.5',
//   },
//   readMore: {
//     color: '#007bff',
//     cursor: 'pointer',
//     marginLeft: '10px',
//     textDecoration: 'underline',
//     fontSize: '14px',
//   },
//   fabContainer: {
//     position: 'fixed',
//     right: '20px',
//     bottom: '20px',
//     zIndex: 1000,
//   },
//   fab: {
//     width: '56px',
//     height: '56px',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '50%',
//     cursor: 'pointer',
//     fontSize: '24px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//   },
//   modalOverlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 999,
//   },
//   modal: {
//     backgroundColor: 'white',
//     padding: '20px',
//     borderRadius: '8px',
//     width: '400px',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//   },
//   modalHeader: {
//     marginBottom: '10px',
//     fontSize: '20px',
//   },
//   textArea: {
//     width: '100%',
//     height: '100px',
//     padding: '10px',
//     borderRadius: '4px',
//     border: '1px solid #ccc',
//     resize: 'none',
//   },
//   modalActions: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginTop: '10px',
//   },
//   saveButton: {
//     padding: '10px 20px',
//     backgroundColor: '#28a745',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   closeButton: {
//     padding: '10px 20px',
//     backgroundColor: '#dc3545',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   },
//   paginationContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: '20px',
//   },
//   paginationArrow: {
//     cursor: 'pointer',
//     fontSize: '24px',
//     margin: '0 10px',
//     userSelect: 'none',
//   },
// };

// export default NotesComponent;
import React, { useState } from 'react';

const NotesComponent = () => {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [expandedNoteIndex, setExpandedNoteIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const notesPerPage = 4; // Limit notes per page

  // Save the new note
  const handleSaveNote = () => {
    if (noteText.trim()) {
      setNotes([...notes, noteText]);
      setNoteText('');
      setShowModal(false); // Close the modal after saving
    } else {
      alert('Please enter a note.');
    }
  };

  // Toggle between expanded and collapsed note
  const toggleExpandNote = (index) => {
    setExpandedNoteIndex(expandedNoteIndex === index ? null : index);
  };

  // Pagination logic
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);

  const goToNextPage = () => {
    if (currentPage < Math.ceil(notes.length / notesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={styles.container}>
      {/* Display the list of notes with pagination */}
      <div style={styles.notesList}>
        {currentNotes.length > 0 ? (
          currentNotes.map((note, index) => (
            <div key={index} style={styles.noteCard}>
              <div style={styles.noteText}>
                {expandedNoteIndex === index + (currentPage - 1) * notesPerPage
                  ? note
                  : `${note.split(' ')[0]}...`} {/* Only display the first word */}

                <span
                  style={styles.readMore}
                  onClick={() => toggleExpandNote(index + (currentPage - 1) * notesPerPage)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={() => toggleExpandNote(index + (currentPage - 1) * notesPerPage)}
                >
                  {expandedNoteIndex === index + (currentPage - 1) * notesPerPage ? ' Read Less' : ' Read More'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No notes available.</p>
        )}
      </div>

      {/* Pagination Arrows */}
      <div style={styles.paginationContainer}>
        <span
          style={styles.paginationArrow}
          onClick={goToPrevPage}
          role="button"
          tabIndex={0}
        >
          &#9664; {/* Left Arrow */}
        </span>
        <span>{currentPage}</span>
        <span
          style={styles.paginationArrow}
          onClick={goToNextPage}
          role="button"
          tabIndex={0}
        >
          &#9654; {/* Right Arrow */}
        </span>
      </div>

      {/* Floating Action Button */}
      <div style={styles.fabContainer}>
        <button onClick={() => setShowModal(true)} style={styles.fab}>
          +
        </button>
      </div>

      {/* Modal for adding notes */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalHeader}>Add Note</h2>
            <textarea
              placeholder="Write your note here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              style={styles.textArea}
            />
            <div style={styles.modalActions}>
              <button onClick={handleSaveNote} style={styles.saveButton}>Save</button>
              <button onClick={() => setShowModal(false)} style={styles.closeButton}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styling
const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  notesList: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  noteCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  noteText: {
    fontSize: '16px',
    color: '#333',
    lineHeight: '1.5',
  },
  readMore: {
    color: '#007bff',
    cursor: 'pointer',
    marginLeft: '10px',
    textDecoration: 'underline',
    fontSize: '14px',
  },
  fabContainer: {
    position: 'fixed',
    right: '30px',  // Adjusted from 20px to 30px
    bottom: '30px', // Adjusted from 20px to 30px
    zIndex: 1000,
  },
  fab: {
    width: '56px',
    height: '56px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  modalHeader: {
    marginBottom: '10px',
    fontSize: '20px',
  },
  textArea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    resize: 'none',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  closeButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  paginationArrow: {
    cursor: 'pointer',
    fontSize: '24px',
    margin: '0 10px',
    userSelect: 'none',
  },
};

export default NotesComponent;
