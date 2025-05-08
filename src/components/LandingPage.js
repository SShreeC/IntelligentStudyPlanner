
import React, { useState, useEffect } from 'react';
import { Book, Calendar, Coffee, Droplet, Smile, Users, ChevronRight, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from './NavBar';
import AuthPopup from './AuthPopup';

const LandingPage = () => {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAuthPopup(true);
    }, 5000);

    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeAuthPopup = () => {
    setShowAuthPopup(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-grow pt-16">
        <HeroSection setShowAuthPopup={setShowAuthPopup} />
        <FeaturesSection />
        <ComingSoonSection setShowAuthPopup={setShowAuthPopup} />
      </main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 StudyNotes. All rights reserved.</p>
        </div>
      </footer>
      <AuthPopup show={showAuthPopup} onClose={closeAuthPopup} />
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
const HeroSection = ({ setShowAuthPopup }) => (
  <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20" id="hero">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <motion.h1
            className="text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Elevate Your Study Game
          </motion.h1>
          <motion.p
            className="text-xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Unlock your full potential with StudyNotes - Your all-in-one companion for smarter learning and productivity.
          </motion.p>
          <motion.button
            className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold transition-colors inline-flex items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => setShowAuthPopup(true)}
          >
            Get Started <ChevronRight className="ml-2" />
          </motion.button>
        </div>
        <div className="md:w-1/4 flex justify-right">
          <motion.img
            src={require('../media/task.png')}
            alt="StudyNotes App"
            width="100%"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => {
  const features = [
    { icon: <Book size={48} />, title: "Smart Notes", description: "Organize and annotate your lecture notes effortlessly." },
    { icon: <Calendar size={48} />, title: "Task Scheduler", description: "Plan and prioritize tasks, assignments, and deadlines." },
    { icon: <Droplet size={48} />, title: "Water Intake Tracker", description: "Stay hydrated and track your daily water intake." },
    { icon: <Coffee size={48} />, title: "Focus Timer", description: "Boost productivity with the Pomodoro technique." },
    { icon: <Smile size={48} />, title: "Relaxation Corner", description: "Unwind with music, small games, and breathing exercises." },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, index }) => (
  <motion.div
    className="feature-card bg-white p-8 rounded-xl shadow-lg transition-shadow"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="icon-wrapper mb-6 text-blue-500">{icon}</div>
    <h3 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const ComingSoonSection = ({ setShowAuthPopup }) => (
  <section id="coming-soon" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-4xl font-bold mb-8" style={{color:"white"}}>Exciting Features Coming Soon!</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <ComingSoonFeature icon={<Users size={48} />} title="Group Study Rooms" />
        <ComingSoonFeature icon={<Calendar size={48} />} title="Notes" />
        <ComingSoonFeature icon={<Book size={48} />} title="Flashcard Generator" />
      </div>
      <button
        className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold transition-colors"
        onClick={() => setShowAuthPopup(true)}
      >
        Join the Waitlist
      </button>
    </div>
  </section>
);

const ComingSoonFeature = ({ icon, title }) => (
  <div className="flex flex-col items-center">
    <div className="mb-4 text-white">{icon}</div>
    <h3 className="text-2xl font-semibold">{title}</h3>
  </div>
);

export default LandingPage;