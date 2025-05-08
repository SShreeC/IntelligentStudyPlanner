import React, { useState, useEffect } from 'react';

const NotificationComponent = () => {
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderDate, setReminderDate] = useState(''); 
  const [reminder, setReminder] = useState({ title: '', time: '', date: '' });

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
          subscribeUser(registration);
        })
        .catch(error => console.error('Service Worker registration error:', error));
    }
  }, []);

  const subscribeUser = async (registration) => {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BFeTpHrYh9Us0moXwbbzsSxZvVdTx1kjyyt5zgDNyemh4j5wI9BVoIwPc-mrE9dcF5Dj8FXAH1LJ4YnWkNQfXRM'),
    });

    await fetch('http://localhost:5000/save-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    console.log('User is subscribed:', subscription);
  };

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!reminderTitle || !reminderTime || !reminderDate) {
      alert('Please fill in all fields.');
      return;
    }

    const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
    const currentTime = new Date();

    if (reminderDateTime <= currentTime) {
      alert('Please select a future time for the reminder.');
      return;
    }

    setReminder({ title: reminderTitle, time: reminderTime, date: reminderDate });

    await fetch('http://localhost:5000/add-reminder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: reminderTitle, time: reminderTime, date: reminderDate }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert('Reminder added successfully!');

          // Schedule the notification
          const timeDifference = reminderDateTime.getTime() - currentTime.getTime();
          scheduleNotification(timeDifference, reminderTitle);

          // Clear input fields
          setReminderTitle('');
          setReminderTime('');
          setReminderDate('');
        } else {
          alert('Error adding reminder: ' + data.message);
        }
      })
      .catch(error => console.error('Error adding reminder:', error));
  };

  const scheduleNotification = (delay, title) => {
    setTimeout(() => {
      new Notification(title, {
        body: `Reminder: ${title}`,
      });
    }, delay);
  };

  // Get current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Set a Reminder</h1>
      <form onSubmit={handleFormSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter reminder title"
          value={reminderTitle}
          onChange={(e) => setReminderTitle(e.target.value)}
          style={styles.input}
        />
        <input
          type="date"
          value={reminderDate}
          onChange={(e) => setReminderDate(e.target.value)}
          style={styles.input}
        />
        <input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          min={getCurrentTime()}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Set Reminder</button>
      </form>
    </div>
  );
};

// Styling
const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    marginBottom: '20px',
    fontSize: '26px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
};

export default NotificationComponent;
