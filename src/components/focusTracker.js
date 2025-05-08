import { useState, useEffect } from "react";
import { TimerIcon } from "lucide-react";

export default function PomodoroFocusTracker() {
  const [secondsLeft, setSecondsLeft] = useState(1500); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");

  useEffect(() => {
    let interval;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const formatTime = (secs) =>
    `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

  const handleStart = () => {
    if (subject && topic) {
      setIsActive(true);
    } else {
      alert("Please enter both Subject and Topic.");
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(1500);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 space-y-4 border border-gray-200">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
        <TimerIcon className="text-blue-500" /> Focus Timer (25 mins)
      </h2>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Enter Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full border p-2 rounded-md"
        />
      </div>

      <div className="flex justify-center items-center text-4xl font-bold text-gray-800">
        {formatTime(secondsLeft)}
      </div>

      <div className="flex gap-4 justify-center">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Reset
          </button>
        )}
      </div>

      {isActive && (
        <div className="text-center text-sm text-gray-500">
          Focused on <span className="font-medium text-blue-600">{subject}</span> - <span className="italic">{topic}</span>
        </div>
      )}
    </div>
  );
}
