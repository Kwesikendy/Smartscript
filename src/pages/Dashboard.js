import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { motion } from 'framer-motion';
import { 
  UploadCloud, 
  FileText, 
  BarChart3, 
  Quote, 
  Sparkles,
  BookOpen,
  Target,
  Award
} from 'lucide-react';

const educationalQuotes = [
  {
    quote: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    author: "Malcolm X"
  },
  {
    quote: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King"
  },
  {
    quote: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "William Butler Yeats"
  },
  {
    quote: "The roots of education are bitter, but the fruit is sweet.",
    author: "Aristotle"
  },
  {
    quote: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin"
  }
];

const DashboardCard = ({ icon: Icon, title, description, to, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="group"
  >
    <Link to={to} className="block">
      <div className={`relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        <div className="p-8">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          <div className="mt-4 flex items-center text-sm font-medium text-gray-500">
            <span className="group-hover:text-gray-700 transition-colors">Get started</span>
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const StatCard = ({ icon: Icon, value, label, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4"
  >
    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % educationalQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
              >
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">AI-Powered Academic Excellence</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Smartscript
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Transform your grading workflow with AI-powered marking. Upload schemes, submit scripts, 
                and discover insights that elevate education.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Quote className="w-8 h-8 text-blue-500 mx-auto mb-4" />
            <blockquote className="text-2xl font-light text-gray-700 italic mb-4">
              "{educationalQuotes[currentQuote].quote}"
            </blockquote>
            <cite className="text-lg font-medium text-gray-600">
              — {educationalQuotes[currentQuote].author}
            </cite>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <StatCard icon={BookOpen} value="10K+" label="Scripts Processed" color="from-blue-500 to-blue-600" />
            <StatCard icon={Target} value="95%" label="Accuracy Rate" color="from-green-500 to-green-600" />
            <StatCard icon={Award} value="50+" label="Institutions" color="from-purple-500 to-purple-600" />
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <DashboardCard
              icon={UploadCloud}
              title="Upload Scheme"
              description="Create and upload marking schemes with AI-powered templates for consistent grading standards."
              to="/upload-scheme"
              color="from-blue-500 to-blue-600"
              delay={0.1}
            />
            <DashboardCard
              icon={FileText}
              title="Upload Script"
              description="Submit student scripts for intelligent OCR processing and automated grading with detailed feedback."
              to="/upload-script"
              color="from-green-500 to-green-600"
              delay={0.2}
            />
            <DashboardCard
              icon={BarChart3}
              title="View Results"
              description="Analyze comprehensive results, export to Excel, and gain insights into student performance trends."
              to="/results"
              color="from-purple-500 to-purple-600"
              delay={0.3}
            />
          </div>
        </div>

        {/* Footer CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Grading?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join thousands of educators who have revolutionized their assessment process with Smartscript's AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/upload-scheme"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Started Now
                </Link>
                <Link
                  to="/results"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  View Demo Results
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
