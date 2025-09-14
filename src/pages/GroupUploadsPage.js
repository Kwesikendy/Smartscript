import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';
import DataTable from '../components/DataTable';
import LoadingOverlay from '../components/LoadingOverlay';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import api from '../api/axios';

export default function GroupUploadsPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, per_page: 10, total: 0, total_pages: 0 });
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [mode, setMode] = useState('images');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const pollRef = useRef(null);

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  useEffect(() => {
    fetchUploads();
  }, [groupId, pagination.page, pagination.per_page]);

  useEffect(() => {
    // Poll while there are uploads processing
    const hasProcessing = uploads.some(u => ['pending','processing','queued'].includes((u.status||'').toLowerCase()));
    if (hasProcessing){
      pollRef.current && clearInterval(pollRef.current);
      pollRef.current = setInterval(()=>{ fetchUploads(false); }, 4000);
    } else if (pollRef.current){
      clearInterval(pollRef.current);
    }
    return () => { if(pollRef.current) clearInterval(pollRef.current); };
  }, [uploads]);

  const fetchGroup = async () => {
    try {
      const res = await api.get(`/groups/${groupId}`);
      const body = res.data;
      setGroup(body.data || body);
    } catch (e) {
      console.error('Failed to fetch group', e);
    }
  };

  const fetchUploads = async (showLoader = true) => {
    try {
      if(showLoader) setLoading(true);
      const params = { page: pagination.page, per_page: pagination.per_page, group_id: groupId };
      const res = await api.get('/uploads', { params });
      const body = res.data;
      let rows = body.data?.uploads || body.uploads || [];
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        rows = rows.filter(u => (
          (u.original_filename || u.filename || '').toLowerCase().includes(q) ||
          (u.mode || '').toLowerCase().includes(q) ||
          (u.status || '').toLowerCase().includes(q)
        ));
      }
      const meta = body.data?.pagination || body.pagination || null;
      if (meta) {
        const total = rows.length;
        const start = (pagination.page - 1) * pagination.per_page;
        setUploads(rows.slice(start, start + pagination.per_page));
        setPagination(prev => ({ ...prev, total, total_pages: Math.ceil(total / prev.per_page) }));
      } else {
        setUploads(rows);
      }
      setError(null);
    } catch (e) {
      console.error('Failed to fetch uploads', e);
      setError('Failed to fetch uploads for this group.');
    } finally {
      if(showLoader) setLoading(false);
    }
  };

  const handleDelete = async (uploadId) => {
    if (!window.confirm('Delete this upload? This will remove all pages.')) return;
    try {
      await api.delete(`/uploads/${uploadId}`);
      fetchUploads();
    } catch (e) {
      console.error('Delete failed', e);
      setError('Failed to delete upload.');
    }
  };

  const handleOpenUpload = () => setIsUploadOpen(true);
  const handleCloseUpload = () => {
    setIsUploadOpen(false);
    setFiles([]);
    setIsSubmitting(false);
  };

  const handleSubmitUpload = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      setError('Please choose at least one file to upload.');
      return;
    }
    try {
      setIsSubmitting(true);
      const form = new FormData();
      // backend CreateUpload expects multipart with files[]
      for (const f of files) form.append('files', f);
  // Use group endpoint; backend will tie to the group's exam automatically
      await api.post(`/groups/${groupId}/uploads?mode=${encodeURIComponent(mode)}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      handleCloseUpload();
      fetchUploads();
    } catch (e) {
      console.error('Upload failed', e);
      setError('Upload failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const columns = [
    {
      key: 'original_filename',
      title: 'File',
      render: (value, row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Upload className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{value || row.filename || 'Upload'}</div>
            <div className="text-xs text-gray-500">Mode: {row.mode}</div>
          </div>
        </div>
      )
    },
    { key: 'status', title: 'Status', render: (v, row) => {
      const status = (v||'').toLowerCase();
      if(['pending','processing','queued'].includes(status)){
        return <span className="inline-flex items-center text-indigo-600"><Loader2 className="h-4 w-4 mr-1 animate-spin"/>Processing</span>;
      }
      if(status === 'completed' || status === 'done' || status === 'success'){
        return <span className="inline-flex items-center text-green-600"><CheckCircle2 className="h-4 w-4 mr-1"/>Done</span>;
      }
      if(status === 'failed' || status === 'error'){
        return <span className="text-red-600">Failed</span>;
      }
      return <span className="capitalize">{v}</span>;
    } },
    { key: 'created_at', title: 'Uploaded', render: (v) => <span>{formatDate(v)}</span> },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/uploads/${row.id}`)}
            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
            title="View"
          >
            <Upload className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
            title="Delete"
          >
            {/* simple X icon using SVG to avoid new imports */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LoadingOverlay isLoading={loading && uploads.length === 0} />
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 2xl:max-w-6xl 3xl:max-w-7xl 4xl:max-w-[1400px] py-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate('/uploads')} className="mr-3 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{group ? group.name : 'Group'} Uploads</h1>
            <p className="text-gray-600">View and manage uploads for this group</p>
          </div>
          <div className="ml-auto">
            <button
              onClick={handleOpenUpload}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <UploadCloud className="h-4 w-4 mr-2" /> Upload scripts
            </button>
          </div>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[220px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search uploads</label>
              <input value={searchTerm} onChange={(e)=>{ setSearchTerm(e.target.value); setPagination(p=>({ ...p, page: 1 })); }} placeholder="Search by file, mode, or status..." className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
          </div>
          <DataTable
            data={uploads}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          />
        </div>

  <Modal isOpen={isUploadOpen} onClose={handleCloseUpload} title="Upload scripts to this group" size="md">
          <form onSubmit={handleSubmitUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="mode" value="images" checked={mode === 'images'} onChange={() => setMode('images')} className="text-indigo-600 border-gray-300" />
                  <span className="ml-2">Images</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="mode" value="pdfs" checked={mode === 'pdfs'} onChange={() => setMode('pdfs')} className="text-indigo-600 border-gray-300" />
                  <span className="ml-2">PDFs</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Files</label>
              <input
                type="file"
                multiple
                accept={mode === 'images' ? 'image/*' : 'application/pdf'}
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
              {files && files.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">{files.length} files selected</p>
              )}
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button type="button" onClick={handleCloseUpload} className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-4 py-2 text-sm rounded-md border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Upload
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
