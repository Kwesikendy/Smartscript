// Status color utilities
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'success':
      return 'text-green-600 bg-green-100';
    case 'in_progress':
    case 'processing':
      return 'text-blue-600 bg-blue-100';
    case 'failed':
    case 'success_with_anomalies':
      return 'text-orange-600 bg-orange-100';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'not_started':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Format status for display
export const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Check if status indicates processing
export const isProcessing = (status) => {
  return ['pending', 'processing', 'queued'].includes(status?.toLowerCase());
};

// Check if status indicates completion
export const isCompleted = (status) => {
  return ['completed', 'success', 'success_with_anomalies'].includes(status?.toLowerCase());
};

// Check if status indicates failure
export const isFailed = (status) => {
  return status?.toLowerCase() === 'failed';
};
