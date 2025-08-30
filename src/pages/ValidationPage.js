import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Eye, Download, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';
import Alert from '../components/Alert';
import DataTable from '../components/DataTable';
import api from '../api/axios';

export default function ValidationPage() {
  const { uploadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [upload, setUpload] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationSummary, setValidationSummary] = useState({});

  useEffect(() => {
    fetchUploadDetails();
    fetchCandidates();
  }, [uploadId]);

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

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/uploads/${uploadId}/candidates`);
      setCandidates(response.data.candidates || []);
      setValidationSummary(response.data.summary || {});
      setError(null);
    } catch (err) {
      setError('Failed to fetch candidates');
      console.error('Fetch candidates error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateUpload = async () => {
    try {
      setValidating(true);
      await api.post(`/uploads/${uploadId}/validate`);
      setSuccess('Upload validation completed successfully');
      fetchUploadDetails();
      fetchCandidates();
    } catch (err) {
      setError('Validation failed. Please try again.');
      console.error('Validation error:', err);
    } finally {
      setValidating(false);
    }
  };

  const handleApproveUpload = async () => {
    try {
      await api.post(`/uploads/${uploadId}/approve`);
      setSuccess('Upload approved and ready for marking');
      navigate(`/uploads/${uploadId}/mark`);
    } catch (err) {
      setError('Failed to approve upload. Please try again.');
      console.error('Approve error:', err);
    }
  };

  const handleRejectUpload = async () => {
    try {
      await api.post(`/uploads/${uploadId}/reject`);
      setSuccess('Upload rejected. Please fix issues and re-upload.');
      navigate('/uploads');
    } catch (err) {
      setError('Failed to reject upload. Please try again.');
      console.error('Reject error:', err);
    }
  };

  const getValidationStatusIcon = (status) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'invalid':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getValidationStatusBadge = (status) => {
    const statusClasses = {
      valid: 'bg-green-100 text-green-800',
      invalid: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses.pending}`}>
        {getValidationStatusIcon(status)}
        <span className="ml-1">{status}</span>
      </span>
    );
  };

  const columns = [
    {
      key: 'candidate_id',
      title: 'Candidate ID',
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
      key: 'pages_detected',
      title: 'Pages',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-900">{value || 0}</span>
      )
    },
    {
      key: 'validation_status',
      title: 'Status',
      sortable: true,
      render: (value) => getValidationStatusBadge(value)
    },
    {
      key: 'issues_count',
      title: 'Issues',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm text-gray-900">
          {value > 0 ? (
            <span className="text-red-600 font-medium">{value} issues</span>
          ) : (
            <span className="text-green-600">No issues</span>
          )}
        </div>
      )
    },
    {
      key: 'confidence_score',
      title: 'Confidence',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                value >= 90 ? 'bg-green-600' :
                value >= 70 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${value || 0}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-900 whitespace-nowrap">{value || 0}%</span>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/uploads/${uploadId}/candidates/${row.id}`)}
            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {row.has_preview && (
            <button
              onClick={() => window.open(`/api/uploads/${uploadId}/candidates/${row.id}/preview`, '_blank')}
              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
              title="Preview"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  if (loading && !upload) {
    return <LoadingOverlay isLoading={true} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LoadingOverlay isLoading={validating} />
      
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Validate Upload
              </h1>
              <p className="mt-2 text-gray-600">
                Review and validate candidate data before marking
              </p>
            </div>
          </motion.div>

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
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">{getValidationStatusBadge(upload.status)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Candidates</h3>
                  <p className="mt-1 text-sm text-gray-900">{upload.candidate_count || 0}</p>
                </div>
              </div>
            </motion.div>
          )}
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

        {/* Validation Summary */}
        {validationSummary && Object.keys(validationSummary).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{validationSummary.valid || 0}</p>
                  <p className="text-sm text-gray-600">Valid Candidates</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{validationSummary.warnings || 0}</p>
                  <p className="text-sm text-gray-600">Warnings</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{validationSummary.invalid || 0}</p>
                  <p className="text-sm text-gray-600">Invalid Candidates</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <RefreshCw className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{validationSummary.confidence || 0}%</p>
                  <p className="text-sm text-gray-600">Avg Confidence</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          <button
            onClick={handleValidateUpload}
            disabled={validating}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`-ml-1 mr-2 h-5 w-5 ${validating ? 'animate-spin' : ''}`} />
            {validating ? 'Validating...' : 'Re-validate'}
          </button>
          
          {upload?.status === 'validated' && (
            <>
              <button
                onClick={handleApproveUpload}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CheckCircle className="-ml-1 mr-2 h-5 w-5" />
                Approve & Start Marking
              </button>
              <button
                onClick={handleRejectUpload}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <XCircle className="-ml-1 mr-2 h-5 w-5" />
                Reject Upload
              </button>
            </>
          )}
        </motion.div>

        {/* Candidates Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <DataTable
            data={candidates}
            columns={columns}
            loading={loading}
            className="mb-8"
          />
        </motion.div>
      </div>
    </div>
  );
}
