import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Eye, BarChart3, ArrowLeft, Filter, Search, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/DataTable';
import StatsCard from '../components/StatsCard';
import LoadingOverlay from '../components/LoadingOverlay';
import Alert from '../components/Alert';
import api from '../api/axios';

export default function ResultsPage() {
  const { uploadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [upload, setUpload] = useState(null);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sortField, setSortField] = useState('total_score');
  const [sortDirection, setSortDirection] = useState('desc');
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  });

  useEffect(() => {
    fetchUploadDetails();
    fetchResults();
    fetchStats();
  }, [uploadId, pagination.page, searchTerm, gradeFilter, sortField, sortDirection]);

  const fetchUploadDetails = async () => {
    try {
      const response = await api.get(`/uploads/${uploadId}`);
      setUpload(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch upload details');
      console.error('Fetch upload error:', err);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        search: searchTerm,
        grade: gradeFilter !== 'all' ? gradeFilter : undefined,
        sort_field: sortField,
        sort_direction: sortDirection
      };

      const response = await api.get(`/uploads/${uploadId}/results`, { params });
      setResults(response.data.results || []);
      setPagination(response.data.pagination || pagination);
      setError(null);
    } catch (err) {
      setError('Failed to fetch results');
      console.error('Fetch results error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(`/uploads/${uploadId}/stats`);
      setStats(response.data);
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  };

  const handleExportResults = async (format = 'xlsx') => {
    try {
      const response = await api.get(`/uploads/${uploadId}/export`, {
        params: { format },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${upload?.filename}_results.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export results. Please try again.');
    }
  };

  const handleViewCandidate = (candidate) => {
    navigate(`/uploads/${uploadId}/candidates/${candidate.id}`);
  };

  const getGradeBadge = (grade, percentage) => {
    const gradeColors = {
      'A': 'bg-green-100 text-green-800',
      'B': 'bg-blue-100 text-blue-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800'
    };

    const color = gradeColors[grade] || 'bg-gray-100 text-gray-800';

    return (
      <div className="flex items-center space-x-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
          {grade}
        </span>
        <span className="text-sm text-gray-500">{percentage}%</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      key: 'rank',
      title: 'Rank',
      sortable: true,
      render: (value, row, index) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {index + 1}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'candidate_id',
      title: 'Candidate',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-600">
                {value?.substring(0, 2)?.toUpperCase() || 'ID'}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.candidate_name || 'Unknown'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'total_score',
      title: 'Score',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm text-gray-900">
          <div className="font-medium">{value} / {row.total_possible}</div>
          <div className="text-gray-500">
            {row.total_possible > 0 ? Math.round((value / row.total_possible) * 100) : 0}%
          </div>
        </div>
      )
    },
    {
      key: 'grade',
      title: 'Grade',
      sortable: true,
      render: (value, row) => {
        const percentage = row.total_possible > 0 
          ? Math.round((row.total_score / row.total_possible) * 100) 
          : 0;
        return getGradeBadge(value, percentage);
      }
    },
    {
      key: 'questions_completed',
      title: 'Progress',
      render: (value, row) => {
        const progress = row.total_questions > 0 
          ? Math.round((value / row.total_questions) * 100) 
          : 0;
        return (
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-900 whitespace-nowrap">
              {value}/{row.total_questions}
            </span>
          </div>
        );
      }
    },
    {
      key: 'marked_at',
      title: 'Completed',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {value ? formatDate(value) : 'Not completed'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewCandidate(row)}
            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(`/uploads/${uploadId}/candidates/${row.id}/marking`)}
            className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
            title="Review Marking"
          >
            <FileText className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading && !upload) {
    return <LoadingOverlay isLoading={true} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LoadingOverlay isLoading={loading && results.length === 0} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center mb-4"
          >
            <button
              onClick={() => navigate('/uploads')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Results & Analytics
              </h1>
              <p className="mt-2 text-gray-600">
                View candidate performance and export results
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleExportResults('xlsx')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Download className="-ml-1 mr-2 h-5 w-5" />
                Export Excel
              </button>
              <button
                onClick={() => handleExportResults('csv')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Download className="-ml-1 mr-2 h-5 w-5" />
                Export CSV
              </button>
            </div>
          </motion.div>

          {/* Upload Info */}
          {upload && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">File Name</h3>
                  <p className="mt-1 text-sm text-gray-900">{upload.filename}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Group</h3>
                  <p className="mt-1 text-sm text-gray-900">{upload.group_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Candidates</h3>
                  <p className="mt-1 text-sm text-gray-900">{upload.candidate_count || 0}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Completion</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {upload.candidate_count > 0 
                      ? Math.round(((stats.completed_candidates || 0) / upload.candidate_count) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            title="Average Score"
            value={`${stats.average_score || 0}%`}
            change={stats.score_trend}
            icon={BarChart3}
            iconColor="blue"
          />
          <StatsCard
            title="Pass Rate"
            value={`${stats.pass_rate || 0}%`}
            change={stats.pass_trend}
            icon={BarChart3}
            iconColor="green"
          />
          <StatsCard
            title="Highest Score"
            value={`${stats.highest_score || 0}%`}
            icon={BarChart3}
            iconColor="yellow"
          />
          <StatsCard
            title="Completed"
            value={`${stats.completed_candidates || 0}/${stats.total_candidates || 0}`}
            icon={BarChart3}
            iconColor="purple"
          />
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Candidates
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by candidate ID or name..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Grade
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="all">All Grades</option>
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                  <option value="D">Grade D</option>
                  <option value="F">Grade F</option>
                </select>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setGradeFilter('all');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <DataTable
            data={results}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            onSort={(field, direction) => {
              setSortField(field);
              setSortDirection(direction);
            }}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </motion.div>
      </div>
    </div>
  );
}
