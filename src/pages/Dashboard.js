import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Users, 
  Quote, 
  Sparkles,
  BookOpen,
  Target,
  Award,
  CheckSquare,
  BarChart3,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatsCard, { UploadsStatsCard, CandidatesStatsCard, MarkedStatsCard } from '../components/StatsCard';
import LoadingOverlay from '../components/LoadingOverlay';
import Alert from '../components/Alert';
import api from '../api/axios';

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

const DashboardCard = ({ icon: Icon, title, description, to, color, delay, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="group"
  >
    {to ? (
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
    ) : (
      <button onClick={onClick} className="block w-full text-left">
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
      </button>
    )}
  </motion.div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuote, setCurrentQuote] = useState(0);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % educationalQuotes.length);
    }, 5000);
    
    fetchDashboardStats();
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      // API sometimes returns { success: true, data: {...} } or raw object
      const payload = response.data && response.data.success ? response.data.data : response.data;
      setStats(payload || {});
      setError(null);
    } catch (err) {
      // If endpoint missing return empty stats silently, but log at debug
      if (err.response && err.response.status === 404) {
        console.debug('Dashboard stats endpoint not implemented (404)');
        setStats({});
      } else {
        setError('Failed to load dashboard statistics');
        console.error('Dashboard stats error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <LoadingOverlay isLoading={loading} />
      
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
              Transform your grading workflow with AI-powered marking. Organize scripts by groups, 
              create marking schemes, and discover insights that elevate education.
            </p>
            {user && (
              <p className="text-lg text-gray-700 mb-4">
                Welcome back, <span className="font-semibold">{user.name}</span>!
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        </div>
      )}

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
          <UploadsStatsCard 
            uploads={stats.total_uploads || 0}
            change={stats.uploads_change}
          />
          <CandidatesStatsCard 
            candidates={stats.total_candidates || 0}
            change={stats.candidates_change}
          />
          <MarkedStatsCard 
            marked={stats.marked_scripts || 0}
            total={stats.total_scripts || 0}
            change={stats.progress_change}
          />
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard
            icon={Upload}
            title="Upload Scripts"
            description="Upload examination scripts organized by groups for AI-powered processing and marking."
            to="/uploads"
            color="from-blue-500 to-blue-600"
            delay={0.1}
          />
          <DashboardCard
            icon={Users}
            title="Manage Groups"
            description="Create and organize groups to categorize your scripts and marking schemes effectively."
            to="/groups"
            color="from-indigo-500 to-indigo-600"
            delay={0.2}
          />
          <DashboardCard
            icon={FileText}
            title="Marking Schemes"
            description="Create and manage marking schemes for different subjects and examination types."
            to="/schemes"
            color="from-purple-500 to-purple-600"
            delay={0.3}
          />
          <DashboardCard
            icon={CheckSquare}
            title="Mark Scripts"
            description="Review and mark uploaded scripts with AI assistance and structured marking schemes."
            onClick={() => navigate('/uploads')}
            color="from-green-500 to-green-600"
            delay={0.4}
          />
          <DashboardCard
            icon={BarChart3}
            title="View Results"
            description="Analyze comprehensive results, export data, and gain insights into performance trends."
            onClick={() => navigate('/uploads')}
            color="from-yellow-500 to-yellow-600"
            delay={0.5}
          />
          <DashboardCard
            icon={Settings}
            title="Settings"
            description="Configure your account preferences, marking criteria, and system settings."
            to="/settings"
            color="from-gray-500 to-gray-600"
            delay={0.6}
          />
        </div>
      </div>

      {/* Recent Activity Section */}
      {stats.recent_uploads && stats.recent_uploads.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="space-y-4">
                  {stats.recent_uploads.slice(0, 5).map((upload, index) => (
                    <div key={upload.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                          <Upload className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{upload.filename}</p>
                          <p className="text-sm text-gray-500">{upload.group_name} • {upload.candidate_count} candidates</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          upload.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          upload.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {upload.status}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(upload.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <button
                    onClick={() => navigate('/uploads')}
                    className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
                  >
                    View all uploads →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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
              <button
                onClick={() => navigate('/uploads/new')}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Upload Scripts Now
              </button>
              <button
                onClick={() => navigate('/groups/new')}
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Create Your First Group
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
