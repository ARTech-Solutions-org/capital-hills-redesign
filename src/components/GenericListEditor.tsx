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
  onSave: (val: string) => void;
}
const isDev = typeof window !== 'undefined' && window.location.port === '5173';
const API_URL = isDev ? 'http://localhost:3001/api' : '/api';

export function GenericListEditor({ blockId, title, fields, value, onSave }: GenericListEditorProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setItems(value ? JSON.parse(value) : []);
    } catch (e) {
      setItems([]);
    }
  }, [value]);

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
    });
    setItems([...items, newItem]);
  };

  const handleRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleChange = (index: number, field: string, val: string) => {
    const newItems = [...items];
    newItems[index][field] = val;
    setItems(newItems);
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
          + Add Item
        </button>
      </div>

      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-4 p-4 border border-[#947e82]/20 rounded-lg">
            {fields.map(f => (
              <div key={f.name} className="w-full">
                {f.type === 'image' ? (
                  <div className="w-full md:w-1/4">
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
                      Upload
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
                ) : f.type === 'textarea' ? (
                  <>
                    <label className="block text-xs font-bold text-[#947e82] mb-2">{f.label}</label>
                    <textarea 
                      value={item[f.name] || ''} 
                      onChange={e => handleChange(i, f.name, e.target.value)} 
                      placeholder={f.label}
                      className="w-full min-h-[80px] bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2 outline-none focus:border-[#421319]"
                    />
                  </>
                ) : f.type === 'checkbox' ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={!!item[f.name]} 
                      onChange={e => handleChange(i, f.name, e.target.checked as any)} 
                      id={`checkbox-${i}-${f.name}`}
                      className="w-4 h-4 text-[#421319] bg-[#f5f2e9] border-[#947e82]/30 rounded focus:ring-[#421319]"
                    />
                    <label htmlFor={`checkbox-${i}-${f.name}`} className="text-sm font-bold text-[#947e82]">{f.label}</label>
                  </div>
                ) : (
                  <>
                    <label className="block text-xs font-bold text-[#947e82] mb-2">{f.label}</label>
                    <input 
                      type="text" 
                      value={item[f.name] || ''} 
                      onChange={e => handleChange(i, f.name, e.target.value)} 
                      placeholder={f.label}
                      className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2 outline-none focus:border-[#421319]"
                    />
                  </>
                )}
              </div>
            ))}
            
            <div className="flex justify-end pt-2 border-t border-[#947e82]/10 mt-2">
              <button onClick={() => handleRemove(i)} className="text-red-500 text-xs font-bold underline">Remove Item</button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-[#947e82]">No items added yet.</p>
        )}
      </div>

      <button 
        onClick={() => onSave(JSON.stringify(items))}
        disabled={loading}
        className="mt-6 bg-[#421319] text-[#f5f2e9] px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#250f12] transition"
      >
        {loading ? 'Uploading...' : 'Save Changes'}
      </button>
    </div>
  );
}
