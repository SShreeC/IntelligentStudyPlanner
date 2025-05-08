import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const ComingSoonPage = () => {
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const launchDate = new Date('2024-12-31T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });

      if (distance < 0) {
        clearInterval(timer);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted email:', email);
    toast.success('Thanks for subscribing! We\'ll keep you updated.');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 bg-blue-600 md:w-48 flex flex-col justify-center items-center p-6">
            <Calendar className="text-white w-16 h-16 mb-4" />
            <CheckSquare className="text-white w-16 h-16 mb-4" />
            <Clock className="text-white w-16 h-16" />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Coming Soon</div>
            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Study Planner
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500">
              Get ready for the ultimate task management experience. Boost your productivity and stay organized like never before.
            </p>
            
            <div className="mt-8 flex justify-center space-x-4">
              {Object.entries(countdown).map(([unit, value]) => (
                <div key={unit} className="text-center">
                  <div className="text-4xl font-bold text-blue-600">{value}</div>
                  <div className="text-sm uppercase text-gray-500">{unit}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex items-center">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow mr-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                Notify Me
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
