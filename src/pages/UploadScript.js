import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import api from '../api/axios';

export default function UploadScript(){
  const [file, setFile] = useState(null);
  const [schemeId, setSchemeId] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setMsg('Select a script file');
    const fd = new FormData();
    fd.append('script', file);
    if (schemeId) fd.append('schemeId', schemeId);
    try {
      setLoading(true);
      setProgress(0);
      await api.post('/upload-script', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          setProgress(pct);
        }
      });
      setMsg('Script uploaded for grading');
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Upload failed');
    } finally { setLoading(false); setProgress(0); }
  };

  return (
    <>
      <NavBar />
      <div className="p-6">
        <h3 className="text-xl mb-4">Upload Student Script</h3>
        <form onSubmit={submit} className="space-y-4 max-w-lg">
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <input placeholder="Scheme ID (optional)" className="border p-2 rounded w-full" value={schemeId} onChange={e => setSchemeId(e.target.value)} />
          <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload for grading'}
          </button>
          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded mt-2 overflow-hidden">
              <div className="h-2 bg-blue-600" style={{ width: `${progress}%` }} />
            </div>
          )}
          {msg && <div className="text-sm text-gray-700">{msg}</div>}
        </form>
      </div>
    </>
  );
}
