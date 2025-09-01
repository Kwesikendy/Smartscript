import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Eye, RefreshCw, Filter } from 'lucide-react';
import LoadingOverlay from '../components/LoadingOverlay';
import Alert from '../components/Alert';
import api from '../api/axios';

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState('');

  useEffect(() => {
    fetchAnomalies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity]);

  const fetchAnomalies = async () => {
    try {
      setLoading(true);
      const params = {};
      if (severity) params.severity = severity;
      const res = await api.get('/markings/current/anomalies', { params });
      // Fallback: if endpoint not ready, try generic /anomalies
      let items = [];
      if (res.data && res.data.anomalies) {
        items = res.data.anomalies;
      } else if (Array.isArray(res.data)) {
        items = res.data;
      } else {
        try {
          const res2 = await api.get('/anomalies', { params });
          items = res2.data.anomalies || res2.data || [];
        } catch (e2) {
          // if even this fails, show empty
          items = [];
        }
      }
      setAnomalies(items || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch anomalies');
      console.error('Anomalies error:', err);
    } finally {
      setLoading(false);
    }
  };

  const severityBadge = (sev) => {
    const map = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[sev] || 'bg-gray-100 text-gray-600'}`}>{sev||'unknown'}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LoadingOverlay isLoading={loading} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Anomalies</h1>
            <p className="text-sm text-gray-600">Issues that need your attention across uploads and markings</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Filter className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm rounded-md border border-gray-300 bg-white"
              >
                <option value="">All severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <button onClick={fetchAnomalies} className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-white border border-gray-300 hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} className="mb-4" />
        )}

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {anomalies.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-gray-400" />
                </div>
                <p>No anomalies found</p>
              </div>
            ) : (
              anomalies.map((a, idx) => (
                <motion.div
                  key={a.id || idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.02 }}
                  className="p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{a.anomaly_type || a.type || 'Anomaly'}</span>
                          {severityBadge(a.severity)}
                          <span className="text-xs text-gray-500">{a.status || 'open'}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-0.5">{a.description || a.metadata?.description || 'No description'}</p>
                        <div className="mt-1 text-xs text-gray-500">
                          {a.candidate_id && <span>Candidate: {a.candidate_id} • </span>}
                          {a.page_id && <span>Page: {a.page_id} • </span>}
                          {a.mark_job_id && <span>Marking: {a.mark_job_id}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <button className="px-3 py-1.5 rounded-md text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100">View</button>
                      <button className="px-3 py-1.5 rounded-md text-xs bg-green-50 text-green-700 hover:bg-green-100">Resolve</button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
