import React, { useState } from 'react';

interface SingleImageEditorProps {
  blockId: string;
  title: string;
  value: string;
  onSave: (val: string) => void;
}
const isDev = typeof window !== 'undefined' && window.location.port === '5173';
const API_URL = isDev ? 'http://localhost:3001/api' : '/api';

export function SingleImageEditor({ blockId, title, value, onSave }: SingleImageEditorProps) {
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(value);

  const handleUploadImage = async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUrl(data.publicUrl);
        onSave(data.publicUrl);
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#947e82]/10 relative">
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1">{title}</label>
          <span className="block text-[10px] font-mono text-[#947e82]/60">{blockId}</span>
        </div>
      </div>
      <div className="w-full max-w-sm">
        {currentUrl ? (
          <div className="relative aspect-video bg-[#f5f2e9] rounded border flex items-center justify-center p-4 mb-4">
            <img src={currentUrl} alt={title} className="max-h-full max-w-full object-contain" />
          </div>
        ) : (
          <div className="relative aspect-video bg-[#f5f2e9] rounded border border-dashed flex items-center justify-center text-[#947e82] text-xs mb-4">
            No Image Set
          </div>
        )}
        <label className="block text-center cursor-pointer bg-[#421319] text-[#f5f2e9] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#250f12] transition">
          {loading ? 'Uploading...' : 'Upload Image'}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            disabled={loading}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleUploadImage(e.target.files[0]);
              }
            }} 
          />
        </label>
        {currentUrl && (
          <div className="mt-2 text-center">
            <button onClick={() => { setCurrentUrl(''); onSave(''); }} className="text-red-500 text-xs font-bold underline">
              Remove Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
