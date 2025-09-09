import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, RefreshCcw } from 'lucide-react';
import api from '../api/axios';
import LoadingOverlay from '../components/LoadingOverlay';
import Alert from '../components/Alert';

export default function UploadDetailPage(){
  const { uploadId } = useParams();
  const navigate = useNavigate();
  const [upload, setUpload] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, [uploadId]);

  async function fetchData(){
    try{
      setLoading(true);
      const ures = await api.get(`/uploads/${uploadId}`);
      const ubody = ures.data;
      setUpload(ubody.data || ubody);
      const pres = await api.get(`/uploads/${uploadId}/pages`, { params: { page: 1, per_page: 100 } });
      const pbody = pres.data;
      const rows = pbody.data?.pages || pbody.pages || [];
      setPages(rows);
      if(rows.length){ selectPage(rows[0]); }
      setError(null);
    }catch(e){
      console.error('Failed to fetch upload detail', e);
      setError('Failed to load upload details.');
    }finally{
      setLoading(false);
    }
  }

  function selectPage(p){
    setSelected(p);
    setOcrText(p.ocr_text || '');
  }

  async function saveOCR(){
    if(!selected) return;
    try{
      setSaving(true);
      await api.patch(`/pages/${selected.id}/ocr`, { ocr_text: ocrText });
      await fetchData();
    }catch(e){
      console.error('Save OCR failed', e);
      setError('Failed to save OCR text.');
    }finally{ setSaving(false); }
  }

  async function redoOCR(){
    if(!selected) return;
    try{
      setSaving(true);
      await api.post(`/pages/${selected.id}/ocr/redo`);
      await fetchData();
    }catch(e){
      console.error('Redo OCR failed', e);
      setError('Failed to redo OCR.');
    }finally{ setSaving(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LoadingOverlay isLoading={loading && !upload} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="mr-3 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Detail</h1>
            <p className="text-gray-600">View page images and OCR text, edit text or redo OCR.</p>
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pages list and image preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Pages</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[60vh] overflow-auto">
              {pages.map(p => (
                <button key={p.id} onClick={() => selectPage(p)} className={`border rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 ${selected && selected.id === p.id ? 'ring-2 ring-indigo-500' : ''}`}>
                  <img src={p.blob_url} alt="page" className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
            {selected && (
              <div className="mt-4">
                <img src={selected.blob_url} alt="selected" className="w-full max-h-[60vh] object-contain bg-gray-50 border rounded" />
              </div>
            )}
          </div>

          {/* OCR editor */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">OCR Text</h2>
              <div className="space-x-2">
                <button onClick={redoOCR} disabled={!selected || saving} className="inline-flex items-center px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50">
                  <RefreshCcw className="h-4 w-4 mr-1" /> Redo OCR
                </button>
                <button onClick={saveOCR} disabled={!selected || saving} className="inline-flex items-center px-3 py-1.5 text-sm rounded-md border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                  Save
                </button>
              </div>
            </div>
            <textarea value={ocrText} onChange={e=>setOcrText(e.target.value)} className="flex-1 min-h-32 border rounded-md p-3 font-mono text-sm" placeholder="OCR text will appear here..." />
          </div>
        </div>
      </div>
    </div>
  );
}
