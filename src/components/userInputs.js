import { useState } from 'react';

export default function UserPreferencesForm({ userId }) {
  const [goals, setGoals] = useState([{ subject: '', deadline: '' }]);
  const [learningSpeed, setLearningSpeed] = useState('');
  const [weakSubjects, setWeakSubjects] = useState('');
  const [learningStyle, setLearningStyle] = useState('');
  const [focusLevel, setFocusLevel] = useState(5);

  const handleGoalChange = (index, field, value) => {
    const newGoals = [...goals];
    newGoals[index][field] = value;
    setGoals(newGoals);
  };

  const addGoalField = () => {
    setGoals([...goals, { subject: '', deadline: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const preferences = {
      userId,
      goals,
      learningSpeed,
      weakSubjects: weakSubjects.split(',').map(s => s.trim()),
      learningStyle,
      focusLevel,
      timestamp: new Date().toISOString()
    };

    // Store in localStorage
    localStorage.setItem(`userPrefs_${userId}`, JSON.stringify(preferences));
    alert('Preferences saved successfully!'); console.log(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-700">Your Study Preferences</h2>

      {goals.map((goal, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            placeholder="Subject"
            value={goal.subject}
            onChange={(e) => handleGoalChange(i, 'subject', e.target.value)}
            className="flex-1 p-2 border rounded"
            required
          />
          <input
            type="date"
            value={goal.deadline}
            onChange={(e) => handleGoalChange(i, 'deadline', e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addGoalField}
        className="text-sm text-blue-600 hover:underline"
      >
        + Add Another Goal
      </button>

      <div>
        <label className="block text-sm font-medium mb-1">Learning Speed</label>
        <select
          value={learningSpeed}
          onChange={(e) => setLearningSpeed(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">--Select--</option>
          <option value="slow">Slow</option>
          <option value="medium">Medium</option>
          <option value="fast">Fast</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Weak Subjects</label>
        <input
          type="text"
          placeholder="e.g. Physics, Math"
          value={weakSubjects}
          onChange={(e) => setWeakSubjects(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Learning Style</label>
        <input
          type="text"
          placeholder="e.g. Visual, Auditory, Kinesthetic"
          value={learningStyle}
          onChange={(e) => setLearningStyle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Focus Level (1–10)</label>
        <input
          type="range"
          min="1"
          max="10"
          value={focusLevel}
          onChange={(e) => setFocusLevel(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-sm text-gray-600 mt-1">Your focus: <strong>{focusLevel}</strong>/10</p>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Save Preferences
      </button>
    </form>
  );
}
