import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Trophy,
  Award,
  TrendingUp,
  BarChart3,
  FileText,
  Calendar,
  User,
  BookOpen,
  MessageSquare,
  Target
} from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import api from '../services/api';

const CandidateResultsPage = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  
  // State management
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch candidate data
  const fetchCandidate = useCallback(async () => {
    try {
      const response = await api.get(`/results-enhanced/candidate/${candidateId}`);
      setCandidate(response.data);
    } catch (err) {
      console.error('Failed to fetch candidate:', err);
      throw err;
    }
  }, [candidateId]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchCandidate();
      } catch (err) {
        setError('Failed to load candidate results');
        showError('Failed to load candidate results');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchCandidate, showError]);

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchCandidate();
      showSuccess('Results refreshed successfully');
    } catch (err) {
      showError('Failed to refresh results');
    } finally {
      setRefreshing(false);
    }
  };

  // Export results
  const handleExport = async () => {
    try {
      const response = await api.get(`/results-enhanced/candidate/${candidateId}/export`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `candidate-${candidate?.index_number || 'results'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showSuccess('Results exported successfully');
    } catch (err) {
      console.error('Export failed:', err);
      showError('Failed to export results');
    }
  };

  // Get grade color
  const getGradeColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  // Get grade letter
  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 30) return 'D';
    return 'F';
  };

  // Get performance level
  const getPerformanceLevel = (percentage) => {
    if (percentage >= 80) return { level: 'Excellent', color: 'text-green-600', icon: Trophy };
    if (percentage >= 60) return { level: 'Good', color: 'text-blue-600', icon: Award };
    if (percentage >= 40) return { level: 'Average', color: 'text-yellow-600', icon: TrendingUp };
    return { level: 'Needs Improvement', color: 'text-red-600', icon: AlertCircle };
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Results</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/results')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Results
            </button>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h2>
          <p className="text-gray-600 mb-4">This candidate has not been marked yet.</p>
          <button
            onClick={() => navigate('/results')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  const performance = getPerformanceLevel(candidate.percentage);
  const PerformanceIcon = performance.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="h-7 w-7 text-blue-500" />
                  Candidate {candidate.index_number}
                </h1>
                <p className="text-gray-600 mt-1">
                  {candidate.group_name} • Marked on {new Date(candidate.marked_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 shadow-sm border mb-8"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <PerformanceIcon className={`h-8 w-8 ${performance.color}`} />
              <h2 className="text-3xl font-bold text-gray-900">
                {candidate.total_score}/{candidate.max_possible_score}
              </h2>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={`px-4 py-2 rounded-full text-lg font-bold ${getGradeColor(candidate.percentage)}`}>
                {candidate.percentage.toFixed(1)}%
              </div>
              <div className={`px-4 py-2 rounded-full text-lg font-bold ${getGradeColor(candidate.percentage)}`}>
                Grade: {getGradeLetter(candidate.percentage)}
              </div>
            </div>

            <div className={`text-xl font-semibold ${performance.color} mb-4`}>
              {performance.level}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <motion.div 
                className="bg-blue-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${candidate.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              ></motion.div>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {candidate.question_results.length} Questions
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(candidate.marked_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Question Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            Question Breakdown
          </h3>

          {candidate.question_results.map((question, qIdx) => (
            <motion.div
              key={qIdx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + qIdx * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Question {question.question_number}
                </h4>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {question.total_score}/{question.max_score}
                    </div>
                    <div className="text-sm text-gray-600">
                      {question.percentage.toFixed(1)}%
                    </div>
                  </div>
                  <div className={`px-3 py-2 rounded-full font-bold ${getGradeColor(question.percentage)}`}>
                    {getGradeLetter(question.percentage)}
                  </div>
                </div>
              </div>

              {/* Question Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${question.percentage}%` }}
                ></div>
              </div>

              {/* Sub-questions */}
              <div className="space-y-3">
                {question.sub_questions.map((subQ, sqIdx) => (
                  <div key={sqIdx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">
                        {subQ.sub_question}
                      </h5>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {subQ.points_awarded}/{subQ.max_points}
                        </span>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(subQ.percentage)}`}>
                          {subQ.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    {subQ.feedback && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{subQ.feedback}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-xl p-6 shadow-sm border"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Performance Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {candidate.question_results
                  .filter(q => q.percentage >= 70)
                  .map((q, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Question {q.question_number} ({q.percentage.toFixed(1)}%)
                    </li>
                  ))}
                {candidate.question_results.filter(q => q.percentage >= 70).length === 0 && (
                  <li className="text-gray-500">No questions scored above 70%</li>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {candidate.question_results
                  .filter(q => q.percentage < 50)
                  .map((q, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      Question {q.question_number} ({q.percentage.toFixed(1)}%)
                    </li>
                  ))}
                {candidate.question_results.filter(q => q.percentage < 50).length === 0 && (
                  <li className="text-gray-500">All questions scored above 50%</li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CandidateResultsPage;

