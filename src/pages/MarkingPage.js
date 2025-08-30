import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckSquare, Save, SkipForward, AlertCircle, FileText, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';
import Alert from '../components/Alert';
import api from '../api/axios';

export default function MarkingPage() {
  const { uploadId, candidateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [upload, setUpload] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [markingScheme, setMarkingScheme] = useState(null);
  const [marks, setMarks] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => {
    fetchMarkingData();
  }, [uploadId, candidateId]);

  useEffect(() => {
    if (autoSave && Object.keys(marks).length > 0) {
      const saveTimer = setTimeout(() => {
        handleSaveMarks(false);
      }, 2000);
      return () => clearTimeout(saveTimer);
    }
  }, [marks, autoSave]);

  const fetchMarkingData = async () => {
    try {
      setLoading(true);
      
      // Fetch upload details
      const uploadResponse = await api.get(`/uploads/${uploadId}`);
      setUpload(uploadResponse.data);

      // Fetch candidate details
      const candidateResponse = await api.get(`/uploads/${uploadId}/candidates/${candidateId}`);
      setCandidate(candidateResponse.data);

      // Fetch marking scheme
      const schemeResponse = await api.get(`/marking-schemes/${uploadResponse.data.marking_scheme_id}`);
      setMarkingScheme(schemeResponse.data);

      // Fetch existing marks if any
      try {
        const marksResponse = await api.get(`/uploads/${uploadId}/candidates/${candidateId}/marks`);
        setMarks(marksResponse.data.marks || {});
      } catch (err) {
        // No existing marks, start fresh
        setMarks({});
      }

      setError(null);
    } catch (err) {
      setError('Failed to load marking data');
      console.error('Fetch marking data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMarks = async (showMessage = true) => {
    try {
      setSaving(true);
      await api.post(`/uploads/${uploadId}/candidates/${candidateId}/marks`, {
        marks,
        auto_save: !showMessage
      });
      
      if (showMessage) {
        setSuccess('Marks saved successfully');
      }
      setError(null);
    } catch (err) {
      setError('Failed to save marks');
      console.error('Save marks error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkChange = (questionId, value) => {
    setMarks(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        score: parseFloat(value) || 0,
        marked_at: new Date().toISOString(),
        marked_by: user.id
      }
    }));
  };

  const handleCommentChange = (questionId, comment) => {
    setMarks(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        comment: comment,
        marked_at: new Date().toISOString(),
        marked_by: user.id
      }
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (markingScheme?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleCompleteMarking = async () => {
    try {
      await handleSaveMarks(false);
      await api.post(`/uploads/${uploadId}/candidates/${candidateId}/complete`);
      setSuccess('Marking completed successfully');
      navigate(`/uploads/${uploadId}/results`);
    } catch (err) {
      setError('Failed to complete marking');
      console.error('Complete marking error:', err);
    }
  };

  const handleSkipCandidate = () => {
    navigate(`/uploads/${uploadId}/mark`);
  };

  const getTotalMarks = () => {
    return Object.values(marks).reduce((total, mark) => total + (mark.score || 0), 0);
  };

  const getTotalPossibleMarks = () => {
    return markingScheme?.questions?.reduce((total, q) => total + (q.max_marks || 0), 0) || 0;
  };

  const getProgressPercentage = () => {
    const totalQuestions = markingScheme?.questions?.length || 0;
    const markedQuestions = Object.keys(marks).length;
    return totalQuestions > 0 ? Math.round((markedQuestions / totalQuestions) * 100) : 0;
  };

  if (loading) {
    return <LoadingOverlay isLoading={true} />;
  }

  const currentQuestion = markingScheme?.questions?.[currentQuestionIndex];
  const currentMark = marks[currentQuestion?.id] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LoadingOverlay isLoading={saving} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/uploads/${uploadId}`)}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Marking Script
                </h1>
                <p className="mt-2 text-gray-600">
                  Mark candidate responses according to the marking scheme
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Progress</p>
                <p className="text-lg font-semibold text-gray-900">{getProgressPercentage()}%</p>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Upload and Candidate Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Upload</h3>
                  <p className="text-sm text-gray-500">{upload?.filename}</p>
                  <p className="text-sm text-gray-500">{upload?.group_name}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Candidate</h3>
                  <p className="text-sm text-gray-500">{candidate?.candidate_id}</p>
                  <p className="text-sm text-gray-500">{candidate?.candidate_name || 'Unknown'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <CheckSquare className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Score</h3>
                  <p className="text-sm text-gray-500">
                    {getTotalMarks()} / {getTotalPossibleMarks()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {getTotalPossibleMarks() > 0 
                      ? Math.round((getTotalMarks() / getTotalPossibleMarks()) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Error/Success Alerts */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}
        
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
            className="mb-6"
          />
        )}

        {/* Main Marking Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Question {currentQuestionIndex + 1} of {markingScheme?.questions?.length || 0}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex >= (markingScheme?.questions?.length || 0) - 1}
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>

              {currentQuestion && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Question Text</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {currentQuestion.text || 'No question text available'}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Marking Criteria</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Max Marks:</strong> {currentQuestion.max_marks}
                      </p>
                      {currentQuestion.marking_criteria && (
                        <div className="mt-2">
                          <p className="text-sm text-blue-900 font-medium">Criteria:</p>
                          <p className="text-sm text-blue-800 mt-1">
                            {currentQuestion.marking_criteria}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {currentQuestion.sample_answers && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Sample Answers</h3>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-800">
                          {currentQuestion.sample_answers}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Answer & Marking Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Student Answer & Marking</h2>

              {/* Student Answer Display */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Student Answer</h3>
                <div className="bg-gray-50 p-4 rounded-lg min-h-32">
                  {candidate?.answers?.[currentQuestion?.id] ? (
                    <p className="text-gray-700">
                      {candidate.answers[currentQuestion.id]}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">
                      Answer not yet extracted or not available
                    </p>
                  )}
                </div>
              </div>

              {/* Marking Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marks (out of {currentQuestion?.max_marks || 0})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={currentQuestion?.max_marks || 0}
                    step="0.5"
                    value={currentMark.score || ''}
                    onChange={(e) => handleMarkChange(currentQuestion?.id, e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter marks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments (optional)
                  </label>
                  <textarea
                    rows={4}
                    value={currentMark.comment || ''}
                    onChange={(e) => handleCommentChange(currentQuestion?.id, e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Add feedback or comments for this answer..."
                  />
                </div>

                {/* Auto-save indicator */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                      className="mr-2"
                    />
                    Auto-save enabled
                  </div>
                  {saving && (
                    <span className="text-blue-600">Saving...</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4 mt-8 justify-center"
        >
          <button
            onClick={() => handleSaveMarks(true)}
            disabled={saving}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="-ml-1 mr-2 h-5 w-5" />
            Save Progress
          </button>
          
          <button
            onClick={handleCompleteMarking}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <CheckSquare className="-ml-1 mr-2 h-5 w-5" />
            Complete Marking
          </button>
          
          <button
            onClick={handleSkipCandidate}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <SkipForward className="-ml-1 mr-2 h-5 w-5" />
            Skip & Mark Later
          </button>
        </motion.div>
      </div>
    </div>
  );
}
