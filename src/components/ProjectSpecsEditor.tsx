import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';

interface SpecItem {
  id: string;
  keyEn: string;
  keyAr: string;
  valEn: string;
  valAr: string;
}

interface ProjectSpecsEditorProps {
  extraDetails?: Record<string, any>;
  extraDetailsAr?: Record<string, any>;
  onChange: (detailsEn: Record<string, string>, detailsAr: Record<string, string>) => void;
}

export function ProjectSpecsEditor({ extraDetails, extraDetailsAr, onChange }: ProjectSpecsEditorProps) {
  const [items, setItems] = useState<SpecItem[]>(() => {
    return parseEntries(extraDetails, extraDetailsAr);
  });

  useEffect(() => {
    setItems(parseEntries(extraDetails, extraDetailsAr));
  }, [extraDetails, extraDetailsAr]);

  function parseEntries(en?: Record<string, any>, ar?: Record<string, any>): SpecItem[] {
    const enEntries = Object.entries(en || {});
    const arEntries = Object.entries(ar || {});
    const max = Math.max(enEntries.length, arEntries.length);
    const result: SpecItem[] = [];

    for (let i = 0; i < max; i++) {
      const [kEn, vEn] = enEntries[i] || ['', ''];
      const [kAr, vAr] = arEntries[i] || ['', ''];
      result.push({
        id: `spec-${i}-${kEn || kAr}`,
        keyEn: kEn || '',
        keyAr: kAr || '',
        valEn: typeof vEn === 'string' ? vEn : (vEn ? JSON.stringify(vEn) : ''),
        valAr: typeof vAr === 'string' ? vAr : (vAr ? JSON.stringify(vAr) : ''),
      });
    }
    return result;
  }

  const notifyChange = (updated: SpecItem[]) => {
    setItems(updated);
    const detailsEn: Record<string, string> = {};
    const detailsAr: Record<string, string> = {};

    updated.forEach(item => {
      const kEn = item.keyEn.trim();
      const kAr = item.keyAr.trim() || kEn;
      if (kEn) {
        detailsEn[kEn] = item.valEn;
      }
      if (kAr) {
        detailsAr[kAr] = item.valAr || item.valEn;
      }
    });

    onChange(detailsEn, detailsAr);
  };

  const handleAddItem = () => {
    const newItem: SpecItem = {
      id: `spec-new-${Date.now()}`,
      keyEn: '',
      keyAr: '',
      valEn: '',
      valAr: '',
    };
    notifyChange([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    notifyChange(updated);
  };

  const handleFieldChange = (index: number, field: keyof SpecItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    notifyChange(updated);
  };

  return (
    <div className="border border-[#421319]/15 rounded-2xl p-6 bg-[#fbf9f4] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#421319]/10 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#421319] text-[#f5f2e9] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-display text-[#421319]">
              Project Highlights & Specifications / تفاصيل ومواصفات المشروع
            </h3>
            <p className="text-xs text-[#947e82]">
              تعديل وإضافة الخانات والمواصفات الخاصة بالمشروع (مثل: Finishing, Design, Experience, Facility Management).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center justify-center gap-2 bg-[#421319] hover:bg-[#250f12] text-[#f5f2e9] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Spec / إضافة مواصفة</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-xl border border-dashed border-[#947e82]/30 p-6">
          <p className="text-sm font-bold text-[#421319]">No custom specifications added yet</p>
          <p className="text-xs text-[#947e82] mt-1">لا توجد تفاصيل إضافية لهذا المشروع حالياً. اضغط على الزر أعلاه لإضافة أول خانة.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white p-5 rounded-xl border border-[#947e82]/20 shadow-sm space-y-4 relative"
            >
              <div className="flex items-center justify-between border-b border-[#947e82]/10 pb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#421319] bg-[#f5f2e9] px-2.5 py-1 rounded">
                  Specification #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 hover:bg-red-50 px-2.5 py-1 rounded transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  حذف
                </button>
              </div>

              {/* Title / Key Inputs (English above, Arabic below) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Key (EN) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                    Title / Key (EN)
                  </label>
                  <input
                    type="text"
                    value={item.keyEn}
                    onChange={e => handleFieldChange(idx, 'keyEn', e.target.value)}
                    placeholder="e.g. Finishing, Design, Experience"
                    className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2.5 text-sm font-semibold outline-none focus:border-[#421319]"
                  />
                </div>

                {/* Key (AR) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#421319] mb-1 flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                    عنوان المواصفة (عربي)
                  </label>
                  <input
                    dir="rtl"
                    type="text"
                    value={item.keyAr}
                    onChange={e => handleFieldChange(idx, 'keyAr', e.target.value)}
                    placeholder="مثال: التشطيب، التصميم المعماري، التجربة السكنية"
                    className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2.5 text-sm font-semibold text-right font-sans outline-none focus:border-[#421319]"
                  />
                </div>
              </div>

              {/* Value Inputs (English above, Arabic below) */}
              <div className="space-y-3">
                {/* Value (EN) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                    Description / Value (EN)
                  </label>
                  <textarea
                    value={item.valEn}
                    onChange={e => handleFieldChange(idx, 'valEn', e.target.value)}
                    placeholder="Enter detailed English description for this specification..."
                    className="w-full min-h-[60px] bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2.5 text-sm outline-none focus:border-[#421319]"
                  />
                </div>

                {/* Value (AR) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#421319] mb-1 flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                    الوصف بالعربية (عربي)
                  </label>
                  <textarea
                    dir="rtl"
                    value={item.valAr}
                    onChange={e => handleFieldChange(idx, 'valAr', e.target.value)}
                    placeholder="اكتب الوصف التفصيلي بالعربية..."
                    className="w-full min-h-[60px] bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-2.5 text-sm text-right font-sans outline-none focus:border-[#421319]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
