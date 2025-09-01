import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Users, 
  BookOpen,
  Target,
  Award,
  CheckSquare,
  BarChart3,
  Settings
} from 'lucide-react';
import { UploadsStatsCard, CandidatesStatsCard, MarkedStatsCard } from '../components/StatsCard';
import LoadingOverlay from '../components/LoadingOverlay';
import Alert from '../components/Alert';
import api from '../api/axios';

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
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  fetchDashboardStats();
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

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Overview</h1>
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

      {/* Quick Actions Toolbar */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-2xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
            <button
              onClick={() => navigate('/uploads')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <Upload className="w-4 h-4" /> Upload Scripts
            </button>
            <button
              onClick={() => navigate('/groups')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              <Users className="w-4 h-4" /> New Group
            </button>
            <button
              onClick={() => navigate('/schemes')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <FileText className="w-4 h-4" /> New Scheme
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-sm text-gray-600">Shortcuts:</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 text-xs rounded-md bg-gray-100 text-gray-700">U to Upload</span>
                <span className="px-2.5 py-1 text-xs rounded-md bg-gray-100 text-gray-700">G for Groups</span>
                <span className="px-2.5 py-1 text-xs rounded-md bg-gray-100 text-gray-700">S for Schemes</span>
              </div>
            </div>
          </div>
        </div>
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

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Marking Accuracy</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.accuracy ?? 98}%</p>
            <p className="text-sm text-gray-500">Last 7 days</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Processing Queue</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.queue_size ?? 0}</p>
            <p className="text-sm text-gray-500">Jobs awaiting action</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-800">Active Exams</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.active_exams ?? 0}</p>
            <p className="text-sm text-gray-500">Currently in progress</p>
          </div>
        </div>

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

  {/* Removed non-dashboard CTA section */}
    </div>
  );
}
