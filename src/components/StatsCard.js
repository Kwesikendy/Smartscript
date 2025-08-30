import React from 'react';
import { FileText, Users, BarChart3, CheckSquare, Settings, Upload, Download } from 'lucide-react';

export default function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon: IconComponent,
  iconColor = 'indigo',
  className = ''
}) {
  const iconColorClasses = {
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500'
  };

  const changeColorClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const DefaultIcon = FileText;
  const Icon = IconComponent || DefaultIcon;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`h-12 w-12 rounded-lg ${iconColorClasses[iconColor]} flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="ml-4 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
      {change && (
        <div className="mt-4">
          <div className="flex items-center">
            <span className={`text-sm font-medium ${changeColorClasses[changeType]}`}>
              {changeType === 'positive' && '+'}
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-2">from last period</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Predefined stats components for common use cases
export function UploadsStatsCard({ uploads = 0, change }) {
  return (
    <StatsCard
      title="Total Uploads"
      value={uploads.toLocaleString()}
      change={change}
      icon={Upload}
      iconColor="blue"
    />
  );
}

export function CandidatesStatsCard({ candidates = 0, change }) {
  return (
    <StatsCard
      title="Candidates"
      value={candidates.toLocaleString()}
      change={change}
      icon={Users}
      iconColor="green"
    />
  );
}

export function MarkedStatsCard({ marked = 0, total = 0, change }) {
  const percentage = total > 0 ? Math.round((marked / total) * 100) : 0;
  return (
    <StatsCard
      title="Scripts Marked"
      value={`${marked}/${total} (${percentage}%)`}
      change={change}
      icon={CheckSquare}
      iconColor="indigo"
    />
  );
}

export function ExportsStatsCard({ exports = 0, change }) {
  return (
    <StatsCard
      title="Exports Generated"
      value={exports.toLocaleString()}
      change={change}
      icon={Download}
      iconColor="purple"
    />
  );
}

export function AnalyticsStatsCard({ title, value, change, changeType }) {
  return (
    <StatsCard
      title={title}
      value={value}
      change={change}
      changeType={changeType}
      icon={BarChart3}
      iconColor="yellow"
    />
  );
}
