import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Upload, 
  Eye, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const StatusBadge = ({ status, type = 'general', className = '' }) => {
  const getStatusConfig = (status, type) => {
    // Upload Status
    if (type === 'upload') {
      switch (status?.toLowerCase()) {
        case 'pending':
          return {
            icon: Clock,
            text: 'Upload Pending',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-700',
            iconColor: 'text-gray-500'
          };
        case 'uploading':
          return {
            icon: Loader2,
            text: 'Uploading...',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-700',
            iconColor: 'text-blue-600',
            animate: true
          };
        case 'completed':
          return {
            icon: CheckCircle,
            text: 'Upload Complete',
            bgColor: 'bg-green-100',
            textColor: 'text-green-700',
            iconColor: 'text-green-600'
          };
        case 'failed':
          return {
            icon: XCircle,
            text: 'Upload Failed',
            bgColor: 'bg-red-100',
            textColor: 'text-red-700',
            iconColor: 'text-red-600'
          };
        default:
          return {
            icon: AlertCircle,
            text: 'Unknown Status',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-700',
            iconColor: 'text-gray-500'
          };
      }
    }

    // OCR Status
    if (type === 'ocr') {
      switch (status?.toLowerCase()) {
        case 'pending':
          return {
            icon: Clock,
            text: 'OCR Pending',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-700',
            iconColor: 'text-gray-500'
          };
        case 'processing':
          return {
            icon: Loader2,
            text: 'Processing OCR...',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-700',
            iconColor: 'text-purple-600',
            animate: true
          };
        case 'completed':
          return {
            icon: CheckCircle,
            text: 'OCR Complete',
            bgColor: 'bg-green-100',
            textColor: 'text-green-700',
            iconColor: 'text-green-600'
          };
        case 'failed':
          return {
            icon: XCircle,
            text: 'OCR Failed',
            bgColor: 'bg-red-100',
            textColor: 'text-red-700',
            iconColor: 'text-red-600'
          };
        default:
          return {
            icon: AlertCircle,
            text: 'Unknown Status',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-700',
            iconColor: 'text-gray-500'
          };
      }
    }

    // General Status (fallback for existing status field)
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-700',
          iconColor: 'text-yellow-600'
        };
      case 'processing':
        return {
          icon: Loader2,
          text: 'Processing...',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-600',
          animate: true
        };
      case 'completed':
        return {
          icon: CheckCircle,
          text: 'Completed',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          iconColor: 'text-green-600'
        };
      case 'failed':
        return {
          icon: XCircle,
          text: 'Failed',
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          iconColor: 'text-red-600'
        };
      case 'reviewing':
        return {
          icon: Eye,
          text: 'Under Review',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-700',
          iconColor: 'text-orange-600'
        };
      default:
        return {
          icon: AlertCircle,
          text: status || 'Unknown',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          iconColor: 'text-gray-500'
        };
    }
  };

  const config = getStatusConfig(status, type);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}>
      <Icon 
        className={`w-3 h-3 mr-1 ${config.iconColor} ${config.animate ? 'animate-spin' : ''}`}
      />
      {config.text}
    </span>
  );
};

export default StatusBadge;
