import React, { useState, useEffect } from 'react';

export interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'checkbox';
}

interface GenericListEditorProps {
  blockId: string;
  title: string;
  fields: FieldDef[];
  value: string;
  valueAr?: string;
  onSave: (valEn: string, valAr: string) => void;
}
const isDev = typeof window !== 'undefined' && window.location.port === '5173';
const API_URL = isDev ? 'http://localhost:3001/api' : '/api';

export function GenericListEditor({ blockId, title, fields, value, valueAr, onSave }: GenericListEditorProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const enList = value ? JSON.parse(value) : [];
      const arList = valueAr ? JSON.parse(valueAr) : [];
      
      const maxLen = Math.max(enList.length, arList.length);
      const merged = [];

      for (let i = 0; i < maxLen; i++) {
        const en = enList[i] || {};
        const ar = arList[i] || {};
        const obj: any = { ...en };

        fields.forEach(f => {
          if (f.type === 'text' || f.type === 'textarea') {
            obj[f.name] = en[f.name] || '';
            obj[`${f.name}Ar`] = ar[f.name] || en[`${f.name}Ar`] || '';
          } else {
            obj[f.name] = en[f.name] !== undefined ? en[f.name] : ar[f.name];
          }
        });

        merged.push(obj);
      }

      setItems(merged);
    } catch (e) {
      setItems([]);
    }
  }, [value, valueAr]);

  const handleUploadImage = async (file: File, index: number, fieldName: string) => {
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
        const newItems = [...items];
        newItems[index][fieldName] = data.publicUrl;
        setItems(newItems);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newItem: any = {};
    fields.forEach(f => {
      newItem[f.name] = '';
      if (f.type === 'text' || f.type === 'textarea') {
        newItem[`${f.name}Ar`] = '';
      }
    });
    setItems([...items, newItem]);
  };

  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleChange = (index: number, field: string, val: any) => {
    const newItems = [...items];
    newItems[index][field] = val;
    setItems(newItems);
  };

  const handleSave = () => {
    const enList = items.map(item => {
      const enItem: any = {};
      fields.forEach(f => {
        enItem[f.name] = item[f.name];
      });
      return enItem;
    });

    const arList = items.map(item => {
      const arItem: any = {};
      fields.forEach(f => {
        if (f.type === 'text' || f.type === 'textarea') {
          arItem[f.name] = item[`${f.name}Ar`] || item[f.name] || '';
        } else {
          arItem[f.name] = item[f.name];
        }
      });
      return arItem;
    });

    onSave(JSON.stringify(enList), JSON.stringify(arList));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#947e82]/10 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1">{title}</label>
          <span className="block text-[10px] font-mono text-[#947e82]/60">{blockId}</span>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-[#421319] text-[#f5f2e9] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#250f12] transition"
        >
          + Add Item / إضافة عنصر
        </button>
      </div>

      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-4 p-5 border border-[#947e82]/20 rounded-xl bg-[#fdfbf7]">
            {fields.map(f => {
              const isNumberOrCode = f.name === 'n' || f.name === 'num';
              
              if (f.type === 'image') {
                return (
                  <div key={f.name} className="w-full md:w-1/3">
                    <label className="block text-xs font-bold text-[#947e82] mb-2">{f.label}</label>
                    {item[f.name] ? (
                      <div className="relative aspect-video bg-[#f5f2e9] rounded border flex items-center justify-center p-2">
                        <img src={item[f.name]} alt="logo" className="max-h-full max-w-full object-contain" />
                      </div>
                    ) : (
                      <div className="relative aspect-video bg-[#f5f2e9] rounded border border-dashed flex items-center justify-center text-[#947e82] text-xs">
                        No Image
                      </div>
                    )}
                    <label className="mt-2 block text-xs font-bold text-[#421319] cursor-pointer underline">
                      Upload Image / رفع صورة
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleUploadImage(e.target.files[0], i, f.name);
                          }
                        }} 
                      />
                    </label>
                  </div>
                );
              }

              if (f.type === 'checkbox') {
                return (
                  <div key={f.name} className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      checked={!!item[f.name]} 
                      onChange={e => handleChange(i, f.name, e.target.checked)} 
                      id={`checkbox-${i}-${f.name}`}
                      className="w-4 h-4 text-[#421319] bg-[#f5f2e9] border-[#947e82]/30 rounded focus:ring-[#421319]"
                    />
                    <label htmlFor={`checkbox-${i}-${f.name}`} className="text-sm font-bold text-[#947e82]">{f.label}</label>
                  </div>
                );
              }

              if (isNumberOrCode) {
                return (
                  <div key={f.name} className="w-full">
                    <label className="block text-xs font-bold text-[#947e82] mb-1">{f.label}</label>
                    <input 
                      type="text" 
                      value={item[f.name] || ''} 
                      onChange={e => handleChange(i, f.name, e.target.value)} 
                      className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2.5 text-sm outline-none focus:border-[#421319]"
                    />
                  </div>
                );
              }

              // Text or Textarea: Render English on top, Arabic directly below it
              return (
                <div key={f.name} className="w-full space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#947e82] mb-1">
                      {f.label} (English)
                    </label>
                    {f.type === 'textarea' ? (
                      <textarea 
                        value={item[f.name] || ''} 
                        onChange={e => handleChange(i, f.name, e.target.value)} 
                        placeholder={`${f.label} (English)`}
                        className="w-full min-h-[70px] bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2.5 text-sm outline-none focus:border-[#421319]"
                      />
                    ) : (
                      <input 
                        type="text" 
                        value={item[f.name] || ''} 
                        onChange={e => handleChange(i, f.name, e.target.value)} 
                        placeholder={`${f.label} (English)`}
                        className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2.5 text-sm outline-none focus:border-[#421319]"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#421319] mb-1 font-sans">
                      {f.label} (بالعربية)
                    </label>
                    {f.type === 'textarea' ? (
                      <textarea 
                        dir="rtl"
                        value={item[`${f.name}Ar`] || ''} 
                        onChange={e => handleChange(i, `${f.name}Ar`, e.target.value)} 
                        placeholder={`${f.label} (بالعربية)`}
                        className="w-full min-h-[70px] bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2.5 text-sm text-right font-sans outline-none focus:border-[#421319]"
                      />
                    ) : (
                      <input 
                        type="text" 
                        dir="rtl"
                        value={item[`${f.name}Ar`] || ''} 
                        onChange={e => handleChange(i, `${f.name}Ar`, e.target.value)} 
                        placeholder={`${f.label} (بالعربية)`}
                        className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2.5 text-sm text-right font-sans outline-none focus:border-[#421319]"
                      />
                    )}
                  </div>
                </div>
              );
            })}
            
            <div className="flex justify-end pt-2 border-t border-[#947e82]/10 mt-1">
              <button 
                onClick={() => handleRemove(i)} 
                className="text-red-500 text-xs font-bold hover:underline"
              >
                Remove Item / حذف العنصر
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-[#947e82]">No items added yet / لا توجد عناصر حالياً.</p>
        )}
      </div>

      <button 
        onClick={handleSave}
        disabled={loading}
        className="mt-6 bg-[#421319] text-[#f5f2e9] px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#250f12] transition"
      >
        {loading ? 'Uploading...' : 'Save Changes / حفظ التعديلات'}
      </button>
    </div>
  );
}
