
import React, { useState } from 'react';
import './CV.css';
import { toast } from 'react-toastify';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker'; // Import TimePicker
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

const EndTimeInputCard = ({ onAddEndTimes, onAddSubject, onDone, userId }) => {
  // State for end times
  const [endTimes, setEndTimes] = useState({
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  });

  // State for subject input
  const [subject, setSubject] = useState('');

  const handleTimeChange = (day, newValue) => {
    // Format time to hh:mm and set it in state
    const formattedTime = newValue ? dayjs(newValue).format('HH:mm') : null;
    setEndTimes((prevEndTimes) => ({
      ...prevEndTimes,
      [day]: formattedTime,
    }));
  };

  const handleAddEndTimes = async () => {
    if (Object.values(endTimes).every((time) => time)) {
      try {
        const response = await fetch('http://localhost:5000/end/addEndTime', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ endTimes, userId }), // endTimes already in hh:mm format
        });

        const result = await response.json();

        if (response.ok) {
          onAddEndTimes(result);
          setEndTimes({
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null,
            sunday: null,
          });
          toast.success('End times added successfully!');
        } else if (response.status === 409) {
          toast.error('End times already exist. Please update them instead.');
        } else {
          toast.error(result.message || 'Error adding end times. Please try again.');
        }
      } catch (error) {
        toast.error('Failed to add end times. Server error.');
      }
    } else {
      toast.error('Please enter end times for all days of the week.');
    }
  };

  const handleAddSubject = async () => {
    if (subject) {
      try {
        const response = await fetch('http://localhost:5000/task/subjects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ subject, userId }),
        });

        const result = await response.json();

        if (response.ok) {
          onAddSubject(result);
          setSubject('');
          toast.success('Subject added successfully!');
        } else if (response.status === 409) {
          toast.error('You have already added this subject.');
        } else {
          toast.error(result.message || 'Error adding subject. Please try again.');
        }
      } catch (error) {
        toast.error('Failed to add subject. Server error.');
      }
    } else {
      toast.error('Please enter a subject.');
    }
  };

  return (
    <div className="end-time-input-card" >
      {/* Subject Input Section */}
      <div className="subject-input-container">
        <input
          className='input input-bordered'
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject"
        />
        <button className='btn btn-outline btn-info' onClick={handleAddSubject}>Add Subject</button>
      </div>

      {/* Horizontal Bar */}
      <hr style={{ margin: '20px 0' }} />

      {/* Time Picker Inputs */}
      <div className="end-time-input-container">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {Object.keys(endTimes).map((day) => (
            <div key={day} className="day-input">
              <TimePicker
                label={`End time for ${day.charAt(0).toUpperCase() + day.slice(1)}`}
                value={endTimes[day] ? dayjs(`2022-01-01T${endTimes[day]}`) : null} // Set a dummy date for correct display
                onChange={(newValue) => handleTimeChange(day, newValue)}
                slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }} // Updated to use slotProps for MUI v6.0
              />
            </div>
          ))}
        </LocalizationProvider>
        <button className='btn btn-outline btn-info' onClick={handleAddEndTimes}>Add End Times</button>
      </div>

      {/* Done Button */}
      <div style={{ marginTop: '20px' }}>
        <button className='btn btn-outline btn-success' onClick={onDone}>Next</button>
      </div>
    </div>
  );
};

export default EndTimeInputCard;
