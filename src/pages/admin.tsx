import { useState, useEffect, useRef } from 'react';
import { FadeIn } from '@/components/animations';
import { PartnersEditor } from '@/components/PartnersEditor';
import { GenericListEditor } from '@/components/GenericListEditor';
import { SingleImageEditor } from '@/components/SingleImageEditor';

const isDev = typeof window !== 'undefined' && window.location.port === '5173';
const API_URL = isDev ? 'http://localhost:3001/api' : '/api';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'home' | 'whyus' | 'contact' | 'global' | 'projects' | 'messages'>('home');
  useEffect(() => {
    if (activeTab === 'messages' && unreadCount > 0) {
      fetch(`${API_URL}/messages/read`, { method: 'PATCH' }).then(() => {
        setMessages(messages.map(m => ({...m, isRead: true})));
      });
    }
  }, [activeTab]);
  
  const [contentBlocks, setContentBlocks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeSubTabs, setActiveSubTabs] = useState<Record<string, string>>({});

  // For adding new content blocks
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  // For projects
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const unreadCount = messages.filter((m: any) => !m.isRead).length;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contentRes, projectsRes, msgsRes] = await Promise.all([
        fetch(`${API_URL}/content`),
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/messages`)
      ]);
      setContentBlocks(await contentRes.json());
      setProjects(await projectsRes.json());
      if (msgsRes.ok) setMessages(await msgsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (id: string, value: string) => {
    try {
      await fetch(`${API_URL}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value })
      });
      alert('Saved!');
      fetchData();
    } catch (e) {
      alert('Error saving');
    }
  };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      const { publicUrl } = await res.json();
      setUploadedUrl(publicUrl);
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      const newUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (!res.ok) throw new Error('Upload failed');
        const { publicUrl } = await res.json();
        newUrls.push(publicUrl);
      }

      setEditingProject((prev: any) => ({
        ...prev,
        gallery: [...(prev.gallery || []), ...newUrls]
      }));
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeProjectImage = (index: number) => {
    setEditingProject((prev: any) => {
      const g = [...prev.gallery];
      g.splice(index, 1);
      return { ...prev, gallery: g };
    });
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingProject.id ? 'PUT' : 'POST';
      const url = editingProject.id ? `${API_URL}/projects/${editingProject.id}` : `${API_URL}/projects`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
      
      alert('Project saved!');
      setEditingProject(null);
      fetchData();
    } catch (error) {
      alert('Failed to save project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if(!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  // Group content blocks by page
  const homeBlocks = contentBlocks.filter(b => b.id.startsWith('home_') || b.id.startsWith('stat_') || b.id.startsWith('chairman_') || b.id.startsWith('hero_title') || b.id === 'hero_subtitle');
  const whyUsBlocks = contentBlocks.filter(b => b.id.startsWith('whyus_'));
  const contactBlocks = contentBlocks.filter(b => b.id.startsWith('contact_'));
  const globalBlocks = contentBlocks.filter(b => b.id.startsWith('global_') || b.id.startsWith('site_') || b.id.startsWith('footer_') || b.id.startsWith('header_'));

  const KNOWN_KEYS: Record<string, { id: string, label: string, group?: string }[]> = {
    home: [
      { id: 'hero_title', label: 'Hero Title 1', group: 'Hero' },
      { id: 'hero_title_2', label: 'Hero Title 2 (Italic)', group: 'Hero' },
      { id: 'hero_title_3', label: 'Hero Title 3 (Mono)', group: 'Hero' },
      { id: 'hero_subtitle', label: 'Hero Subtitle', group: 'Hero' },
      { id: 'home_hero_bg', label: 'Hero Background Image', group: 'Hero' },
      { id: 'home_cta_bg', label: 'CTA Section Background Image', group: 'CTA' },
      { id: 'home_cta_title', label: 'CTA Title', group: 'CTA' },
      { id: 'home_cta_desc', label: 'CTA Description', group: 'CTA' },
      { id: 'home_chairman_img', label: 'Chairman Photo Image', group: 'Chairman' },
      { id: 'chairman_quote', label: 'Chairman Quote', group: 'Chairman' },
      { id: 'chairman_name_1', label: 'Chairman Name Line 1', group: 'Chairman' },
      { id: 'chairman_name_2', label: 'Chairman Name Line 2', group: 'Chairman' },
      { id: 'chairman_title', label: 'Chairman Title', group: 'Chairman' },
      { id: 'chairman_p1', label: 'Chairman Paragraph 1', group: 'Chairman' },
      { id: 'chairman_p2', label: 'Chairman Paragraph 2', group: 'Chairman' },
      { id: 'chairman_p3', label: 'Chairman Paragraph 3', group: 'Chairman' },
      { id: 'chairman_p4', label: 'Chairman Paragraph 4', group: 'Chairman' },
      { id: 'chairman_stats_list', label: 'Chairman Stats List', group: 'Chairman' },
      { id: 'stat_1_val', label: 'Stat 1 Value', group: 'Stats' },
      { id: 'stat_1_suf', label: 'Stat 1 Suffix', group: 'Stats' },
      { id: 'stat_1_lbl', label: 'Stat 1 Label', group: 'Stats' },
      { id: 'stat_2_val', label: 'Stat 2 Value', group: 'Stats' },
      { id: 'stat_2_suf', label: 'Stat 2 Suffix', group: 'Stats' },
      { id: 'stat_2_lbl', label: 'Stat 2 Label', group: 'Stats' },
      { id: 'stat_3_val', label: 'Stat 3 Value', group: 'Stats' },
      { id: 'stat_3_suf', label: 'Stat 3 Suffix', group: 'Stats' },
      { id: 'stat_3_lbl', label: 'Stat 3 Label', group: 'Stats' },
      { id: 'stat_4_val', label: 'Stat 4 Value', group: 'Stats' },
      { id: 'stat_4_suf', label: 'Stat 4 Suffix', group: 'Stats' },
      { id: 'stat_4_lbl', label: 'Stat 4 Label', group: 'Stats' },
      { id: 'home_why_eyebrow', label: 'Why Us Eyebrow', group: 'Why Us' },
      { id: 'home_why_title_1', label: 'Why Us Title Line 1', group: 'Why Us' },
      { id: 'home_why_title_2', label: 'Why Us Title Line 2 (Italic)', group: 'Why Us' },
      { id: 'home_why_desc', label: 'Why Us Description', group: 'Why Us' },
      { id: 'home_why_list', label: 'Why Us List', group: 'Why Us' },
      { id: 'home_reviews_list', label: 'Reviews List', group: 'Reviews' },
      { id: 'home_ticker_list', label: 'Ticker List', group: 'Ticker' },
      { id: 'home_partners_list', label: 'Home Partners List', group: 'Partners' }
    ],
    whyus: [
      { id: 'whyus_hero_title', label: 'Hero Title', group: 'Hero' },
      { id: 'whyus_hero_desc_1', label: 'Hero Description Paragraph 1', group: 'Hero' },
      { id: 'whyus_hero_desc_2', label: 'Hero Description Paragraph 2', group: 'Hero' },
      { id: 'whyus_hero_bg', label: 'Hero Background Image', group: 'Hero' },
      { id: 'whyus_core_title', label: 'Core Values Title', group: 'Core Values' },
      { id: 'whyus_core_list', label: 'Core Values List', group: 'Core Values' },
      { id: 'whyus_story_eyebrow', label: 'Story Eyebrow', group: 'Story' },
      { id: 'whyus_story_title_1', label: 'Story Title Line 1', group: 'Story' },
      { id: 'whyus_story_title_2', label: 'Story Title Line 2', group: 'Story' },
      { id: 'whyus_story_title_3', label: 'Story Title Line 3', group: 'Story' },
      { id: 'whyus_story_p1', label: 'Story Paragraph 1', group: 'Story' },
      { id: 'whyus_story_p2', label: 'Story Paragraph 2', group: 'Story' },
      { id: 'whyus_story_p3', label: 'Story Paragraph 3', group: 'Story' },
      { id: 'whyus_mission_title', label: 'Mission Title', group: 'Mission & Vision' },
      { id: 'whyus_mission_desc', label: 'Mission Description', group: 'Mission & Vision' },
      { id: 'whyus_vision_title', label: 'Vision Title', group: 'Mission & Vision' },
      { id: 'whyus_vision_desc', label: 'Vision Description', group: 'Mission & Vision' },
      { id: 'whyus_cta_eyebrow', label: 'CTA Eyebrow', group: 'CTA' },
      { id: 'whyus_cta_title', label: 'CTA Title', group: 'CTA' },
      { id: 'whyus_categories_list', label: 'Categories List', group: 'Categories' }
    ],
    contact: [
      { id: 'contact_eyebrow', label: 'Hero Eyebrow', group: 'Hero' },
      { id: 'contact_title_1', label: 'Hero Title 1', group: 'Hero' },
      { id: 'contact_title_2', label: 'Hero Title 2 (Italic)', group: 'Hero' },
      { id: 'contact_desc', label: 'Hero Description', group: 'Hero' },
      { id: 'contact_phone', label: 'Phone Number', group: 'Info' },
      { id: 'contact_email', label: 'Email', group: 'Info' },
      { id: 'contact_address', label: 'Address', group: 'Info' },
      { id: 'contact_map_url', label: 'Google Maps Embed URL', group: 'Info' },
      { id: 'contact_form_eyebrow', label: 'Form Eyebrow', group: 'Form' },
      { id: 'contact_form_title', label: 'Form Title', group: 'Form' },
      { id: 'contact_form_desc', label: 'Form Description', group: 'Form' }
    ],
    global: [
      { id: 'global_footer_desc', label: 'Footer Description', group: 'Footer' },
      { id: 'global_footer_phone', label: 'Footer Phone', group: 'Footer' },
      { id: 'global_footer_email', label: 'Footer Email', group: 'Footer' },
      { id: 'global_logo_full_light', label: 'Main Logo (Light version - for dark backgrounds)', group: 'Logos' },
      { id: 'global_logo_full_maroon', label: 'Main Logo (Maroon version - for light backgrounds)', group: 'Logos' },
      { id: 'global_logo_icon_light', label: 'Icon Logo (Light version)', group: 'Logos' },
      { id: 'global_logo_icon_maroon', label: 'Icon Logo (Maroon version)', group: 'Logos' }
    ]
  };

  const renderContentTab = (blocks: any[], title: string, desc: string, prefix: string, tabKey: string) => {
    // Combine known keys with dynamic blocks from DB to ensure nothing is missing
    const knownForTab = KNOWN_KEYS[tabKey] || [];
    const allBlocks = [...knownForTab];
    
    // Add any dynamically created blocks that aren't in KNOWN_KEYS
    blocks.forEach(b => {
      if (!allBlocks.find(kb => kb.id === b.id)) {
        allBlocks.push({ id: b.id, label: b.id, group: 'Other' });
      }
    });

    // Determine groups
    const groups = Array.from(new Set(allBlocks.map(b => b.group || 'Other')));
    const currentSubTab = activeSubTabs[tabKey] || groups[0] || 'Other';

    const blocksToRender = allBlocks.filter(b => (b.group || 'Other') === currentSubTab);

    return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-display text-[#421319]">{title}</h2>
          <p className="text-sm text-[#493337] mt-1">{desc}</p>
        </div>
      </div>
      
      {/* Sub-tabs navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-[#947e82]/10">
        {groups.map(group => (
          <button 
            key={group}
            onClick={() => setActiveSubTabs(prev => ({ ...prev, [tabKey]: group }))}
            className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${currentSubTab === group ? 'bg-[#421319] text-[#f5f2e9]' : 'text-[#421319] hover:bg-[#421319]/10'}`}
          >
            {group}
          </button>
        ))}
      </div>
      
      {/* Add new block */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#421319]/30 mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-3">New Block Key (Must start with {prefix})</label>
          <input 
            type="text" 
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            placeholder={`${prefix}my_new_text`}
            className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-3 outline-none focus:border-[#421319]"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-3">Value (Text)</label>
          <input 
            type="text" 
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-3 outline-none focus:border-[#421319]"
          />
        </div>
        <button 
          onClick={() => {
            if(newKey && newValue) {
              handleSaveContent(newKey, newValue);
              setNewKey('');
              setNewValue('');
            }
          }}
          className="bg-[#421319] text-[#f5f2e9] px-6 py-3 rounded-lg text-sm font-bold hover:bg-[#250f12] transition h-full w-full md:w-auto"
        >
          + Add Text
        </button>
      </div>

      <div className="grid gap-6">
        {blocksToRender.map((blockDef) => {
          // Find value in DB blocks
          const dbBlock = blocks.find(b => b.id === blockDef.id);
          const value = dbBlock ? dbBlock.value : '';

          if (blockDef.id.startsWith('global_logo_') || blockDef.id.endsWith('_bg') || blockDef.id.endsWith('_img')) {
            return <SingleImageEditor key={blockDef.id} blockId={blockDef.id} title={blockDef.label} value={value} onSave={(val) => handleSaveContent(blockDef.id, val)} />;
          }

          if (blockDef.id === 'home_partners_list') {
            return <PartnersEditor key={blockDef.id} value={value} onSave={(val) => handleSaveContent(blockDef.id, val)} />;
          }

          if (blockDef.id === 'home_why_list') {
            return <GenericListEditor key={blockDef.id} blockId={blockDef.id} title={blockDef.label} value={value} onSave={(val) => handleSaveContent(blockDef.id, val)} fields={[
              { name: 'n', label: 'Number (e.g. 01)', type: 'text' },
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'copy', label: 'Description', type: 'textarea' },
            ]} />;
          }

          if (blockDef.id === 'whyus_core_list') {
            return <GenericListEditor key={blockDef.id} blockId={blockDef.id} title={blockDef.label} value={value} onSave={(val) => handleSaveContent(blockDef.id, val)} fields={[
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'copy', label: 'Description', type: 'textarea' },
            ]} />;
          }

          if (blockDef.id === 'whyus_categories_list') {
            return <GenericListEditor key={blockDef.id} blockId={blockDef.id} title={blockDef.label} value={value} onSave={(val) => handleSaveContent(blockDef.id, val)} fields={[
              { name: 'title', label: 'Category Name', type: 'text' },
              { name: 'subtitle', label: 'Subtitle', type: 'text' },
              { name: 'desc', label: 'Description', type: 'textarea' },
            ]} />;
          }

          if (blockDef.id === 'home_reviews_list') {
            return <GenericListEditor key={blockDef.id} blockId={blockDef.id} title={blockDef.label} value={value} onSave={(val) => handleSaveContent(blockDef.id, val)} fields={[
              { name: 'quote', label: 'Quote', type: 'textarea' },
              { name: 'name', label: 'Name', type: 'text' },
              { name: 'detail', label: 'Detail (e.g. Investor)', type: 'text' },
            ]} />;
          }

          if (blockDef.id === 'chairman_stats_list') {
            return <GenericListEditor key={blockDef.id} blockId={blockDef.id} title={blockDef.label} value={value} onSave={(val) => handleSaveContent(blockDef.id, val)} fields={[
              { name: 'num', label: 'Number Value (e.g. 10+)', type: 'text' },
              { name: 'label', label: 'Label', type: 'text' },
            ]} />;
          }

          if (blockDef.id === 'home_ticker_list') {
            return <GenericListEditor key={blockDef.id} blockId={blockDef.id} title={blockDef.label} value={value} onSave={(val) => handleSaveContent(blockDef.id, val)} fields={[
              { name: 'text', label: 'Ticker Text', type: 'text' },
            ]} />;
          }

          return (
            <div key={blockDef.id} className="bg-white p-6 rounded-xl shadow-sm border border-[#947e82]/10 relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1">{blockDef.label}</label>
              <span className="block text-[10px] font-mono text-[#947e82]/60 mb-3">{blockDef.id}</span>
              <textarea 
                className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-4 min-h-[60px] outline-none focus:border-[#421319]"
                defaultValue={value}
                id={`content_${blockDef.id}`}
              />
              <button 
                onClick={() => {
                  const val = (document.getElementById(`content_${blockDef.id}`) as HTMLTextAreaElement).value;
                  handleSaveContent(blockDef.id, val);
                }}
                className="mt-4 bg-[#421319] text-[#f5f2e9] px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#250f12] transition"
              >
                Save Changes
              </button>
            </div>
          );
        })}
      </div>
    </div>
  )};

  return (
    <main className="min-h-screen bg-[#f5f2e9] pt-12 pb-20 px-6">
      <div className="mx-auto max-w-6xl">
          <FadeIn>
            <h1 className="font-display text-4xl text-[#421319] mb-8">Admin Dashboard</h1>
            
            <div className="flex gap-4 mb-8 border-b border-[#947e82]/20 pb-4 overflow-x-auto">
              <button onClick={() => setActiveTab('home')} className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'home' ? 'bg-[#421319] text-[#f5f2e9]' : 'text-[#421319] hover:bg-[#421319]/10'}`}>Home Page</button>
              <button onClick={() => setActiveTab('whyus')} className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'whyus' ? 'bg-[#421319] text-[#f5f2e9]' : 'text-[#421319] hover:bg-[#421319]/10'}`}>Why Us Page</button>
              <button onClick={() => setActiveTab('contact')} className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'contact' ? 'bg-[#421319] text-[#f5f2e9]' : 'text-[#421319] hover:bg-[#421319]/10'}`}>Contact Page</button>
              <button onClick={() => setActiveTab('global')} className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'global' ? 'bg-[#421319] text-[#f5f2e9]' : 'text-[#421319] hover:bg-[#421319]/10'}`}>Global (Footer/Header)</button>
              <button onClick={() => { setActiveTab('projects'); setEditingProject(null); }} className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'projects' ? 'bg-[#421319] text-[#f5f2e9]' : 'text-[#421319] hover:bg-[#421319]/10'}`}>Projects</button>
              <button onClick={() => setActiveTab('messages')} className={`relative flex items-center text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'messages' ? 'bg-[#421319] text-[#f5f2e9]' : 'text-[#421319] hover:bg-[#421319]/10'}`}>
                  Direct Messages
                  {unreadCount > 0 && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
            </div>

            {loading ? (
              <p>Loading data...</p>
            ) : (
              <div>
                {activeTab === 'home' && renderContentTab(homeBlocks, 'Home Page Content', 'Edit the hero, stats, and text on the Home page.', 'home_', 'home')}
                {activeTab === 'whyus' && renderContentTab(whyUsBlocks, 'Why Us Page Content', 'Edit the pillars and text on the Why Us page.', 'whyus_', 'whyus')}
                {activeTab === 'contact' && renderContentTab(contactBlocks, 'Contact Page Content', 'Edit the contact information and titles.', 'contact_', 'contact')}
                {activeTab === 'global' && renderContentTab(globalBlocks, 'Global Content', 'Edit footer text, header text, and overall site elements.', 'global_', 'global')}

                {activeTab === 'projects' && (
                  <div>
                    {!editingProject ? (
                      <>
                        <div className="flex items-center justify-between mb-8">
                          <h2 className="text-2xl font-display text-[#421319]">Manage Projects</h2>
                          <button 
                            onClick={() => setEditingProject({ gallery: [], name: '', slug: '', city: '', location: '', product: '' })}
                            className="bg-[#421319] text-[#f5f2e9] px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#250f12] transition"
                          >
                            + New Project
                          </button>
                        </div>
                        <div className="grid gap-4 mt-6">
                          {projects.map((p) => (
                            <div key={p.id} className="bg-white p-4 rounded-xl flex items-center justify-between border border-[#947e82]/10">
                              <div>
                                <p className="font-bold text-[#421319]">{p.name}</p>
                                <p className="text-sm text-[#947e82]">{p.city}</p>
                              </div>
                              <div className="flex gap-4">
                                <button onClick={() => setEditingProject(p)} className="text-sm font-bold text-[#421319] underline">Edit</button>
                                <button onClick={() => handleDeleteProject(p.id)} className="text-sm font-bold text-red-600 underline">Delete</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="bg-white p-8 rounded-xl shadow-sm border border-[#947e82]/10">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                          <h2 className="text-2xl font-display text-[#421319]">{editingProject.id ? 'Edit Project' : 'New Project'}</h2>
                          <button onClick={() => setEditingProject(null)} className="text-sm font-bold text-[#947e82] hover:text-[#421319]">Cancel</button>
                        </div>

                        <form onSubmit={handleSaveProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Project Name *</label>
                            <input required type="text" value={editingProject.name} onChange={e => setEditingProject({...editingProject, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})} className="w-full bg-[#f5f2e9] rounded p-3 outline-none focus:ring-2" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Slug (URL friendly) *</label>
                            <input required type="text" value={editingProject.slug} onChange={e => setEditingProject({...editingProject, slug: e.target.value})} className="w-full bg-[#f5f2e9] rounded p-3 outline-none focus:ring-2" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">City *</label>
                            <input required type="text" value={editingProject.city} onChange={e => setEditingProject({...editingProject, city: e.target.value})} className="w-full bg-[#f5f2e9] rounded p-3 outline-none focus:ring-2" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Location *</label>
                            <input required type="text" value={editingProject.location} onChange={e => setEditingProject({...editingProject, location: e.target.value})} className="w-full bg-[#f5f2e9] rounded p-3 outline-none focus:ring-2" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Product Type *</label>
                            <input required type="text" value={editingProject.product} onChange={e => setEditingProject({...editingProject, product: e.target.value})} className="w-full bg-[#f5f2e9] rounded p-3 outline-none focus:ring-2" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Project Space</label>
                            <input type="text" value={editingProject.projectSpace || ''} onChange={e => setEditingProject({...editingProject, projectSpace: e.target.value})} className="w-full bg-[#f5f2e9] rounded p-3 outline-none focus:ring-2" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Built Up Area</label>
                            <input type="text" value={editingProject.builtUpArea || ''} onChange={e => setEditingProject({...editingProject, builtUpArea: e.target.value})} className="w-full bg-[#f5f2e9] rounded p-3 outline-none focus:ring-2" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Construction</label>
                            <input type="text" value={editingProject.construction || ''} onChange={e => setEditingProject({...editingProject, construction: e.target.value})} className="w-full bg-[#f5f2e9] rounded p-3 outline-none focus:ring-2" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Finishing</label>
                            <input type="text" value={editingProject.finishing || ''} onChange={e => setEditingProject({...editingProject, finishing: e.target.value})} className="w-full bg-[#f5f2e9] rounded p-3 outline-none focus:ring-2" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Delivery</label>
                            <input type="text" value={editingProject.delivery || ''} onChange={e => setEditingProject({...editingProject, delivery: e.target.value})} className="w-full bg-[#f5f2e9] rounded p-3 outline-none focus:ring-2" />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Description</label>
                            <textarea value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full min-h-[100px] bg-[#f5f2e9] rounded p-3 outline-none focus:ring-2" />
                          </div>
                          
                          {/* GALLERY UPLOAD DIRECTLY IN PROJECT */}
                          <div className="col-span-1 md:col-span-2 border-t pt-6 mt-4">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-4">Gallery Images</label>
                            
                            {/* Display current images */}
                            {editingProject.gallery && editingProject.gallery.length > 0 && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {editingProject.gallery.map((imgUrl: string, idx: number) => (
                                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-[#947e82]/20 aspect-video">
                                    <img src={imgUrl} alt="Project" className="w-full h-full object-cover" />
                                    <button 
                                      type="button"
                                      onClick={() => removeProjectImage(idx)}
                                      className="absolute inset-0 bg-red-600/80 text-white font-bold opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Direct Upload Button */}
                            <div className="relative overflow-hidden w-full bg-[#f5f2e9] border-2 border-dashed border-[#947e82]/30 p-8 rounded-xl text-center hover:bg-[#947e82]/5 transition cursor-pointer">
                              <input 
                                type="file" 
                                multiple
                                onChange={handleProjectImageUpload} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/*"
                              />
                              <span className="font-bold text-[#421319]">
                                {uploadingImage ? 'Uploading to Cloudflare R2...' : '+ Select Images to Upload'}
                              </span>
                            </div>
                          </div>

                          <div className="col-span-1 md:col-span-2">
                            <button type="submit" className="w-full bg-[#421319] text-[#f5f2e9] px-6 py-4 rounded-lg text-lg font-bold hover:bg-[#250f12] transition mt-6">
                              Save Project
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'messages' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                      <h2 className="font-display text-2xl text-[#421319]">Direct Messages</h2>
                      <p className="text-sm text-[#493337] mt-1">Inquiries received from the contact form.</p>
                    </div>
                    
                    {messages.length === 0 ? (
                      <div className="rounded-2xl border border-[#421319]/10 bg-white p-8 text-center text-[#493337]">
                        No messages yet.
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {messages.map((msg, i) => (
                          <div key={i} className={`rounded-2xl border border-[#421319]/10 p-6 shadow-sm flex flex-col gap-3 ${!msg.isRead ? 'bg-red-50/50' : 'bg-white'}`}>
                            <div className="flex justify-between items-start border-b border-[#421319]/10 pb-3">
                              <div>
                                <h3 className="font-bold text-lg text-[#421319]">{msg.name}</h3>
                                <p className="text-sm text-[#947e82]">{msg.phone} {msg.email && <span className="mx-2">•</span>} {msg.email}</p>
                              </div>
                              <span className="text-xs text-[#947e82] bg-[#f5f2e9] px-2 py-1 rounded">
                                {new Date(msg.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-[#493337] whitespace-pre-line leading-relaxed">
                              {msg.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </FadeIn>
        </div>
      </main>
  );
}
