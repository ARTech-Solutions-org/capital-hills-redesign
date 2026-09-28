import React, { useState, useEffect } from 'react';

interface Partner {
  src: string;
  alt: string;
  desc: string;
}

interface PartnersEditorProps {
  value: string;
  onSave: (val: string) => void;
}
const isDev = typeof window !== 'undefined' && window.location.port === '5173';
const API_URL = isDev ? 'http://localhost:3001/api' : '/api';

export function PartnersEditor({ value, onSave }: PartnersEditorProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setPartners(value ? JSON.parse(value) : []);
    } catch (e) {
      setPartners([]);
    }
  }, [value]);

  const handleUploadImage = async (file: File, index: number) => {
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
        const newPartners = [...partners];
        newPartners[index].src = data.publicUrl;
        setPartners(newPartners);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setPartners([...partners, { src: '', alt: 'New Partner', desc: 'Partner description' }]);
  };

  const handleRemove = (index: number) => {
    const newPartners = [...partners];
    newPartners.splice(index, 1);
    setPartners(newPartners);
  };

  const handleChange = (index: number, field: keyof Partner, val: string) => {
    const newPartners = [...partners];
    newPartners[index][field] = val;
    setPartners(newPartners);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#947e82]/10 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1">Partners List</label>
          <span className="block text-[10px] font-mono text-[#947e82]/60">home_partners_list</span>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-[#421319] text-[#f5f2e9] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#250f12] transition"
        >
          + Add Partner
        </button>
      </div>

      <div className="space-y-6">
        {partners.map((p, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border border-[#947e82]/20 rounded-lg">
            <div className="w-full md:w-1/4">
              {p.src ? (
                <div className="relative aspect-video bg-[#f5f2e9] rounded border flex items-center justify-center p-2">
                  <img src={p.src} alt="logo" className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="relative aspect-video bg-[#f5f2e9] rounded border border-dashed flex items-center justify-center text-[#947e82] text-xs">
                  No Image
                </div>
              )}
              <label className="mt-2 block text-xs font-bold text-[#421319] cursor-pointer text-center underline">
                Upload Logo
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleUploadImage(e.target.files[0], i);
                    }
                  }} 
                />
              </label>
            </div>
            
            <div className="w-full md:w-3/4 flex flex-col gap-3">
              <input 
                type="text" 
                value={p.alt} 
                onChange={e => handleChange(i, 'alt', e.target.value)} 
                placeholder="Partner Name"
                className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2 outline-none focus:border-[#421319]"
              />
              <textarea 
                value={p.desc} 
                onChange={e => handleChange(i, 'desc', e.target.value)} 
                placeholder="Partner Description"
                className="w-full h-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2 outline-none focus:border-[#421319]"
              />
              <div className="flex justify-end">
                <button onClick={() => handleRemove(i)} className="text-red-500 text-xs font-bold underline">Remove Partner</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onSave(JSON.stringify(partners))}
        disabled={loading}
        className="mt-6 bg-[#421319] text-[#f5f2e9] px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#250f12] transition"
      >
        {loading ? 'Uploading...' : 'Save Changes'}
      </button>
    </div>
  );
}
