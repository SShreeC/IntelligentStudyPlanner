import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

export default function FeedbackBox({ onSend }) {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState('');

  const handleSend = () => {
    if (feedback.trim() || rating) {
      onSend?.({ feedback, rating }); // Send both rating and feedback
      setFeedback('');
      setRating('');
    }
  };

  return (
    <div className="mt-4 border-t pt-3">
      <div className="flex items-start gap-2">
        <MessageCircle className="text-blue-600 mt-1" />
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">Was this feature helpful to you?</p>
          
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="mb-2 px-3 py-1.5 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Select your experience --</option>
            <option value="yes">✅ Yes, it was helpful</option>
            <option value="somewhat">🤔 Somewhat helpful</option>
            <option value="no">❌ Not really</option>
          </select>

          <p className="text-sm text-gray-600 mb-1">Any suggestions or thoughts?</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
              title="Send Feedback"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
