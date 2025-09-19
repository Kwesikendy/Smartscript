import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

const StatusIcon = ({ status, className = "h-4 w-4" }) => {
  const iconProps = { className };
  
  switch (status?.toLowerCase()) {
    case 'completed':
      return <CheckCircle {...iconProps} className={`${className} text-green-500`} />;
    case 'processing':
      return <Loader2 {...iconProps} className={`${className} text-blue-500 animate-spin`} />;
    case 'failed':
      return <XCircle {...iconProps} className={`${className} text-red-500`} />;
    case 'pending':
      return <Clock {...iconProps} className={`${className} text-yellow-500`} />;
    default:
      return <AlertCircle {...iconProps} className={`${className} text-gray-500`} />;
  }
};

export default StatusIcon;
