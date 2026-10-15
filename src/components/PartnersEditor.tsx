import React, { useState, useEffect } from 'react';

interface PartnerItem {
  src: string;
  alt: string;
  altAr?: string;
  desc: string;
  descAr?: string;
}

interface PartnersEditorProps {
  value: string;
  valueAr?: string;
  onSave: (valEn: string, valAr: string) => void;
}
const isDev = typeof window !== 'undefined' && window.location.port === '5173';
const API_URL = isDev ? 'http://localhost:3001/api' : '/api';

export function PartnersEditor({ value, valueAr, onSave }: PartnersEditorProps) {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const enList = value ? JSON.parse(value) : [];
      const arList = valueAr ? JSON.parse(valueAr) : [];
      
      const merged: PartnerItem[] = enList.map((p: any, idx: number) => {
        const ar = arList[idx] || {};
        return {
          src: p.src || ar.src || '',
          alt: p.alt || '',
          altAr: ar.alt || p.altAr || '',
          desc: p.desc || '',
          descAr: ar.desc || p.descAr || '',
        };
      });

      // If arList has more items
      if (arList.length > enList.length) {
        for (let i = enList.length; i < arList.length; i++) {
          merged.push({
            src: arList[i].src || '',
            alt: '',
            altAr: arList[i].alt || '',
            desc: '',
            descAr: arList[i].desc || '',
          });
        }
      }

      setPartners(merged);
    } catch (e) {
      setPartners([]);
    }
  }, [value, valueAr]);

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
    setPartners([...partners, { src: '', alt: 'New Partner', altAr: 'شريك جديد', desc: 'Partner description', descAr: 'وصف الشريك' }]);
  };

  const handleRemove = (index: number) => {
    const newPartners = [...partners];
    newPartners.splice(index, 1);
    setPartners(newPartners);
  };

  const handleChange = (index: number, field: keyof PartnerItem, val: string) => {
    const newPartners = [...partners];
    newPartners[index][field] = val;
    setPartners(newPartners);
  };

  const handleSave = () => {
    const enList = partners.map(p => ({
      src: p.src,
      alt: p.alt,
      desc: p.desc,
    }));

    const arList = partners.map(p => ({
      src: p.src,
      alt: p.altAr || p.alt,
      desc: p.descAr || p.desc,
    }));

    onSave(JSON.stringify(enList), JSON.stringify(arList));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#947e82]/10 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1">Partners List / قائمة الشركاء</label>
          <span className="block text-[10px] font-mono text-[#947e82]/60">home_partners_list</span>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-[#421319] text-[#f5f2e9] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#250f12] transition"
        >
          + Add Partner / إضافة شريك
        </button>
      </div>

      <div className="space-y-6">
        {partners.map((p, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-6 p-5 border border-[#947e82]/20 rounded-xl bg-[#fdfbf7]">
            {/* Logo Column */}
            <div className="w-full md:w-1/4 flex flex-col items-center">
              {p.src ? (
                <div className="relative aspect-video w-full bg-[#1b0b0e] rounded-lg border border-[#421319]/20 flex items-center justify-center p-3">
                  <img src={p.src} alt={p.alt} className="max-h-full max-w-full object-contain filter brightness-0 invert" />
                </div>
              ) : (
                <div className="relative aspect-video w-full bg-[#f5f2e9] rounded-lg border border-dashed border-[#947e82]/40 flex items-center justify-center text-[#947e82] text-xs">
                  No Logo
                </div>
              )}
              <label className="mt-3 block text-xs font-bold text-[#421319] cursor-pointer text-center underline">
                Upload Logo / رفع الشعار
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
            
            {/* Form Fields: English on top, Arabic directly below */}
            <div className="w-full md:w-3/4 flex flex-col gap-4">
              {/* Partner Name Pair */}
              <div>
                <label className="block text-xs font-bold text-[#947e82] mb-1">
                  Partner Name (English)
                </label>
                <input 
                  type="text" 
                  value={p.alt} 
                  onChange={e => handleChange(i, 'alt', e.target.value)} 
                  placeholder="Partner Name (English)"
                  className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2.5 text-sm outline-none focus:border-[#421319]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#421319] mb-1 font-sans">
                  اسم الشريك (بالعربية)
                </label>
                <input 
                  type="text" 
                  dir="rtl"
                  value={p.altAr || ''} 
                  onChange={e => handleChange(i, 'altAr', e.target.value)} 
                  placeholder="اسم الشريك (بالعربية)"
                  className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2.5 text-sm text-right font-sans outline-none focus:border-[#421319]"
                />
              </div>

              {/* Partner Description Pair */}
              <div>
                <label className="block text-xs font-bold text-[#947e82] mb-1">
                  Partner Description (English)
                </label>
                <textarea 
                  value={p.desc} 
                  onChange={e => handleChange(i, 'desc', e.target.value)} 
                  placeholder="Partner Description (English)"
                  className="w-full min-h-[70px] bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2.5 text-sm outline-none focus:border-[#421319]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#421319] mb-1 font-sans">
                  وصف الشريك (بالعربية)
                </label>
                <textarea 
                  dir="rtl"
                  value={p.descAr || ''} 
                  onChange={e => handleChange(i, 'descAr', e.target.value)} 
                  placeholder="وصف الشريك (بالعربية)"
                  className="w-full min-h-[70px] bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2.5 text-sm text-right font-sans outline-none focus:border-[#421319]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => handleRemove(i)} 
                  className="text-red-500 text-xs font-bold hover:underline"
                >
                  Remove Partner / حذف الشريك
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleSave}
        disabled={loading}
        className="mt-6 bg-[#421319] text-[#f5f2e9] px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#250f12] transition"
      >
        {loading ? 'Uploading...' : 'Save All Partners / حفظ جميع الشركاء'}
      </button>
    </div>
  );
}
