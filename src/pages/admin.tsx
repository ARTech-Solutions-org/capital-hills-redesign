import { useState, useEffect, useRef } from 'react';
import { FadeIn } from '@/components/animations';
import { PartnersEditor } from '@/components/PartnersEditor';
import { GenericListEditor } from '@/components/GenericListEditor';
import { SingleImageEditor } from '@/components/SingleImageEditor';
import { HeroOrbit } from '@/components/HeroOrbit';
import { Eye, EyeOff, Sparkles, Image as ImageIcon, Upload, Orbit, Layers, Sliders } from 'lucide-react';

const isDev = typeof window !== 'undefined' && window.location.port === '5173';
const API_URL = isDev ? 'http://localhost:3001/api' : '/api';

const PRESET_LOGOS = [
  { label: 'La Colina East', value: '/project-logos/la-colina-east.png' },
  { label: 'La Colina West', value: '/project-logos/la-colina-west.png' },
  { label: 'Capital Towers', value: '/project-logos/capital-towers.png' },
  { label: 'Park Yard 1', value: '/project-logos/park-yard-1.png' },
  { label: 'Park Yard 2', value: '/project-logos/park-yard-2.png' },
  { label: 'Win Plaza', value: '/project-logos/win-plaza.png' },
  { label: 'Point 11', value: '/project-logos/point-11.png' },
  { label: 'Point 9', value: '/project-logos/point-9.png' },
  { label: 'Park Point', value: '/project-logos/park-point.png' },
  { label: 'East Point', value: '/project-logos/east-point.png' },
  { label: 'Capital Green', value: '/project-logos/capital-green.png' },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'home' | 'aboutus' | 'contact' | 'global' | 'projects' | 'messages'>('home');
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
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [showOrbitPreview, setShowOrbitPreview] = useState(true);
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingLogo(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const { publicUrl } = await res.json();
      setEditingProject((prev: any) => ({ ...prev, logo: publicUrl }));
    } catch (err) {
      alert('Logo upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleQuickToggleHero = async (p: any) => {
    const nextVal = p.showInHero === false ? true : false;
    const updated = { ...p, showInHero: nextVal };
    setProjects(projects.map(proj => proj.id === p.id ? updated : proj));
    try {
      const res = await fetch(`${API_URL}/projects/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error('Failed to update');
    } catch (e) {
      alert('Failed to update project status');
      fetchData();
    }
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
  const aboutusBlocks = contentBlocks.filter(b => b.id.startsWith('aboutus_'));
  const contactBlocks = contentBlocks.filter(b => b.id.startsWith('contact_'));
  const globalBlocks = contentBlocks.filter(b => b.id.startsWith('global_') || b.id.startsWith('site_') || b.id.startsWith('footer_') || b.id.startsWith('header_'));

  const KNOWN_KEYS: Record<string, { id: string, label: string, group?: string }[]> = {
    home: [
      { id: 'hero_title', label: 'Hero Slogan Line 1 (Invest With)', group: 'Hero' },
      { id: 'hero_title_2', label: 'Hero Slogan Line 2 (Trust)', group: 'Hero' },
      { id: 'hero_title_3', label: 'Hero Slogan Line 3 - Italic Part (Grow)', group: 'Hero' },
      { id: 'hero_title_4', label: 'Hero Slogan Line 3 - Regular Part (With)', group: 'Hero' },
      { id: 'hero_title_5', label: 'Hero Slogan Line 4 (Community)', group: 'Hero' },
      { id: 'hero_subtitle', label: 'Hero Subtitle', group: 'Hero' },
      { id: 'home_hero_bg', label: 'Hero Background Image (Legacy/Optional - Hero uses architectural burgundy Orbit theme)', group: 'Hero' },
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
      { id: 'home_why_eyebrow', label: 'About us Eyebrow', group: 'About us' },
      { id: 'home_why_title_1', label: 'About us Title Line 1', group: 'About us' },
      { id: 'home_why_title_2', label: 'About us Title Line 2 (Italic)', group: 'About us' },
      { id: 'home_why_desc', label: 'About us Description', group: 'About us' },
      { id: 'home_why_list', label: 'About us List', group: 'About us' },
      { id: 'home_reviews_list', label: 'Reviews List', group: 'Reviews' },
      { id: 'home_ticker_list', label: 'Ticker List', group: 'Ticker' },
      { id: 'home_partners_list', label: 'Home Partners List', group: 'Partners' }
    ],
    aboutus: [
      { id: 'aboutus_hero_title', label: 'Hero Title', group: 'Hero' },
      { id: 'aboutus_hero_desc_1', label: 'Hero Description Paragraph 1', group: 'Hero' },
      { id: 'aboutus_hero_desc_2', label: 'Hero Description Paragraph 2', group: 'Hero' },
      { id: 'aboutus_hero_bg', label: 'Hero Background Image', group: 'Hero' },
      { id: 'aboutus_core_title', label: 'Core Values Title', group: 'Core Values' },
      { id: 'aboutus_core_list', label: 'Core Values List', group: 'Core Values' },
      { id: 'aboutus_story_eyebrow', label: 'Story Eyebrow', group: 'Story' },
      { id: 'aboutus_story_title_1', label: 'Story Title Line 1', group: 'Story' },
      { id: 'aboutus_story_title_2', label: 'Story Title Line 2', group: 'Story' },
      { id: 'aboutus_story_title_3', label: 'Story Title Line 3', group: 'Story' },
      { id: 'aboutus_story_p1', label: 'Story Paragraph 1', group: 'Story' },
      { id: 'aboutus_story_p2', label: 'Story Paragraph 2', group: 'Story' },
      { id: 'aboutus_story_p3', label: 'Story Paragraph 3', group: 'Story' },
      { id: 'aboutus_mission_title', label: 'Mission Title', group: 'Mission & Vision' },
      { id: 'aboutus_mission_desc', label: 'Mission Description', group: 'Mission & Vision' },
      { id: 'aboutus_vision_title', label: 'Vision Title', group: 'Mission & Vision' },
      { id: 'aboutus_vision_desc', label: 'Vision Description', group: 'Mission & Vision' },
      { id: 'aboutus_cta_eyebrow', label: 'CTA Eyebrow', group: 'CTA' },
      { id: 'aboutus_cta_title', label: 'CTA Title', group: 'CTA' },
      { id: 'aboutus_categories_list', label: 'Categories List', group: 'Categories' }
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

          if (blockDef.id === 'aboutus_core_list') {
            return <GenericListEditor key={blockDef.id} blockId={blockDef.id} title={blockDef.label} value={value} onSave={(val) => handleSaveContent(blockDef.id, val)} fields={[
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'copy', label: 'Description', type: 'textarea' },
            ]} />;
          }

          if (blockDef.id === 'aboutus_categories_list') {
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
              { name: 'hide', label: 'Hide Review', type: 'checkbox' },
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
              <button onClick={() => setActiveTab('aboutus')} className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'aboutus' ? 'bg-[#421319] text-[#f5f2e9]' : 'text-[#421319] hover:bg-[#421319]/10'}`}>About us Page</button>
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
                {activeTab === 'aboutus' && renderContentTab(aboutusBlocks, 'About us Page Content', 'Edit the pillars and text on the About us page.', 'aboutus_', 'aboutus')}
                {activeTab === 'contact' && renderContentTab(contactBlocks, 'Contact Page Content', 'Edit the contact information and titles.', 'contact_', 'contact')}
                {activeTab === 'global' && renderContentTab(globalBlocks, 'Global Content', 'Edit footer text, header text, and overall site elements.', 'global_', 'global')}

                {activeTab === 'projects' && (
                  <div className="space-y-8">
                    {!editingProject ? (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h2 className="text-2xl font-display text-[#421319]">Manage Projects & Orbit Hero</h2>
                            <p className="text-sm text-[#493337] mt-1">Configure project details and control their circular orbital paths on the homepage Hero.</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setShowOrbitPreview(!showOrbitPreview)}
                              className="border border-[#421319]/20 text-[#421319] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#421319]/5 transition flex items-center gap-2"
                            >
                              <Orbit className="w-4 h-4" />
                              {showOrbitPreview ? 'Hide Orbit Preview' : 'Show Orbit Preview'}
                            </button>
                            <button 
                              onClick={() => setEditingProject({
                                gallery: [],
                                name: '',
                                slug: '',
                                city: '',
                                location: '',
                                product: '',
                                logo: '',
                                showInHero: true,
                                orbitRing: 2,
                                orbitPosition: 0,
                                orbitSpeed: 'normal',
                                orbitDirection: 'clockwise',
                                orbitOpacity: '0.85',
                              })}
                              className="bg-[#421319] text-[#f5f2e9] px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#250f12] transition flex items-center gap-2"
                            >
                              + New Project
                            </button>
                          </div>
                        </div>

                        {/* ─── LIVE ORBIT HERO PREVIEW CARD ─── */}
                        {showOrbitPreview && (
                          <div className="bg-[#1e0b0e] text-[#f5f2e9] rounded-2xl p-6 sm:p-8 shadow-xl border border-[#f5f2e9]/10 relative overflow-hidden">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                              {/* Left: Interactive Orbit Sculpture */}
                              <div className="w-full lg:w-1/2 flex flex-col items-center">
                                <div className="flex items-center justify-between w-full mb-3 px-2">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs uppercase tracking-widest text-[#f5f2e9]/70 font-mono">Live Orbit Preview</span>
                                  </div>
                                  <span className="text-[11px] text-[#f5f2e9]/50 font-mono">
                                    {projects.filter(p => p.showInHero !== false).length} Active in Hero
                                  </span>
                                </div>
                                <div className="relative w-full max-w-[460px] h-[440px] bg-[#170709] rounded-xl border border-[#f5f2e9]/10 flex items-center justify-center overflow-hidden">
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(66,19,25,0.4)_0%,transparent_75%)] pointer-events-none" />
                                  <div className="transform scale-[0.88] origin-center">
                                    <HeroOrbit projects={projects} isPreview={true} />
                                  </div>
                                </div>
                                <p className="text-[11px] text-[#f5f2e9]/50 mt-3 text-center">
                                  Ring 1 (Inner, 135px) &bull; Ring 2 (Middle, 235px) &bull; Ring 3 (Outer, 335px)
                                </p>
                              </div>

                              {/* Right: Quick Orbit Control Board */}
                              <div className="w-full lg:w-1/2 flex flex-col justify-between h-full space-y-4">
                                <div>
                                  <h3 className="text-lg font-display text-[#f5f2e9] mb-1">Orbit Hero Roster</h3>
                                  <p className="text-xs text-[#f5f2e9]/60 leading-relaxed mb-4">
                                    Toggle which projects appear in the Hero orbit. The public homepage updates immediately.
                                  </p>
                                </div>

                                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                                  {projects.map((p) => {
                                    const isActive = p.showInHero !== false;
                                    const ringNum = Number(p.orbitRing) || 2;
                                    const angle = Number(p.orbitPosition) || 0;
                                    return (
                                      <div
                                        key={p.id}
                                        className={`flex items-center justify-between p-3 rounded-lg border transition ${
                                          isActive
                                            ? 'bg-[#291014] border-[#f5f2e9]/15 text-[#f5f2e9]'
                                            : 'bg-[#170709]/60 border-[#f5f2e9]/5 text-[#f5f2e9]/40'
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="w-12 h-7 bg-black/40 rounded flex items-center justify-center p-1 border border-[#f5f2e9]/10 overflow-hidden">
                                            {p.logo ? (
                                              <img
                                                src={p.logo}
                                                alt={p.name}
                                                className="max-h-full max-w-full object-contain filter invert opacity-90"
                                              />
                                            ) : (
                                              <span className="text-[9px] font-mono opacity-50">NO LOGO</span>
                                            )}
                                          </div>
                                          <div>
                                            <p className="text-xs font-bold font-sans tracking-wide leading-tight">{p.name}</p>
                                            <p className="text-[10px] text-[#f5f2e9]/50">
                                              Ring {ringNum} &bull; {angle}&deg; &bull; {p.orbitSpeed || 'normal'}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() => handleQuickToggleHero(p)}
                                            className={`px-3 py-1.5 rounded text-[11px] font-bold tracking-wider uppercase transition flex items-center gap-1.5 ${
                                              isActive
                                                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/40'
                                                : 'bg-white/5 text-[#f5f2e9]/40 border border-white/10 hover:bg-white/10'
                                            }`}
                                          >
                                            {isActive ? (
                                              <>
                                                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                                <span>Active</span>
                                              </>
                                            ) : (
                                              <>
                                                <EyeOff className="w-3.5 h-3.5 opacity-60" />
                                                <span>Hidden</span>
                                              </>
                                            )}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setEditingProject(p)}
                                            className="px-2.5 py-1.5 text-[11px] font-bold text-[#f5f2e9]/70 hover:text-white hover:bg-white/10 rounded transition"
                                          >
                                            Edit
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ─── ALL PROJECTS LIST ─── */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-display text-[#421319]">All Projects ({projects.length})</h3>
                          <div className="grid gap-3">
                            {projects.map((p) => {
                              const isActive = p.showInHero !== false;
                              return (
                                <div key={p.id} className="bg-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#947e82]/10 shadow-sm hover:border-[#421319]/30 transition">
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-10 bg-[#200c0f] rounded-lg flex items-center justify-center p-1.5 border border-[#421319]/10 flex-shrink-0">
                                      {p.logo ? (
                                        <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain filter invert opacity-95" />
                                      ) : (
                                        <span className="text-[9px] text-[#f5f2e9]/60 font-mono">NO LOGO</span>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-bold text-[#421319] leading-tight flex items-center gap-2">
                                        <span>{p.name}</span>
                                        {isActive ? (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                            Hero: Ring {p.orbitRing || 2} ({p.orbitPosition || 0}&deg;)
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
                                            Hero: Hidden
                                          </span>
                                        )}
                                      </p>
                                      <p className="text-xs text-[#947e82] mt-0.5">{p.city} &bull; {p.product}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={() => handleQuickToggleHero(p)}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                        isActive
                                          ? 'bg-[#421319]/10 text-[#421319] hover:bg-[#421319]/20'
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}
                                    >
                                      {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                      <span>{isActive ? 'Hide from Hero' : 'Show in Hero'}</span>
                                    </button>
                                    <button onClick={() => setEditingProject(p)} className="text-sm font-bold text-[#421319] px-3 py-1.5 rounded-lg hover:bg-[#421319]/10 transition">
                                      Edit
                                    </button>
                                    <button onClick={() => handleDeleteProject(p.id)} className="text-sm font-bold text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      /* ─── PROJECT EDIT / CREATE FORM ─── */
                      <div className="bg-white p-8 rounded-xl shadow-sm border border-[#947e82]/10">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                          <div>
                            <h2 className="text-2xl font-display text-[#421319]">{editingProject.id ? 'Edit Project' : 'New Project'}</h2>
                            <p className="text-xs text-[#947e82] mt-0.5">Manage project information, hero orbit behavior, and media.</p>
                          </div>
                          <button onClick={() => setEditingProject(null)} className="text-sm font-bold text-[#947e82] hover:text-[#421319]">Cancel</button>
                        </div>

                        <form onSubmit={handleSaveProject} className="space-y-8">
                          {/* ─── BASIC INFO ─── */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Project Name *</label>
                              <input required type="text" value={editingProject.name} onChange={e => setEditingProject({...editingProject, name: e.target.value, slug: editingProject.id ? editingProject.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})} className="w-full bg-[#f5f2e9] rounded p-3 outline-none focus:ring-2" />
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
                          </div>

                          {/* ─── DEDICATED ORBIT HERO & LOGO SETTINGS ─── */}
                          <div className="border border-[#421319]/15 rounded-2xl p-6 bg-[#fbf9f4] space-y-6">
                            <div className="flex items-center justify-between border-b border-[#421319]/10 pb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#421319] text-[#f5f2e9] flex items-center justify-center">
                                  <Orbit className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-display text-[#421319]">Hero Orbit & Logo Settings</h3>
                                  <p className="text-xs text-[#947e82]">Configure how this project appears in the homepage circular orbit animation.</p>
                                </div>
                              </div>

                              <label className="flex items-center gap-3 cursor-pointer bg-white px-4 py-2 rounded-xl border border-[#421319]/20 shadow-sm hover:border-[#421319] transition">
                                <input
                                  type="checkbox"
                                  checked={editingProject.showInHero !== false}
                                  onChange={e => setEditingProject({ ...editingProject, showInHero: e.target.checked })}
                                  className="w-4 h-4 text-[#421319] rounded cursor-pointer accent-[#421319]"
                                />
                                <span className="text-xs font-bold uppercase tracking-wider text-[#421319]">Show in Hero</span>
                              </label>
                            </div>

                            {/* LOGO SELECTION / UPLOAD */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                              <div className="lg:col-span-1">
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Logo Preview</label>
                                <div className="w-full h-32 bg-[#1e0b0e] rounded-xl flex items-center justify-center p-4 border border-[#f5f2e9]/10 relative overflow-hidden group">
                                  {editingProject.logo ? (
                                    <img
                                      src={editingProject.logo}
                                      alt="Logo Preview"
                                      className="max-h-full max-w-full object-contain filter invert opacity-95 transition group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="text-center">
                                      <ImageIcon className="w-6 h-6 text-[#f5f2e9]/40 mx-auto mb-1" />
                                      <span className="text-[11px] text-[#f5f2e9]/50 font-mono">No logo assigned</span>
                                    </div>
                                  )}
                                  <div className="absolute top-2 left-2 text-[9px] font-mono uppercase bg-black/60 text-[#f5f2e9]/70 px-2 py-0.5 rounded">
                                    Hero Dark Canvas
                                  </div>
                                </div>
                              </div>

                              <div className="lg:col-span-2 space-y-4">
                                <div>
                                  <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Select From Preloaded Logos</label>
                                  <select
                                    value={editingProject.logo || ''}
                                    onChange={e => setEditingProject({ ...editingProject, logo: e.target.value })}
                                    className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-3 text-sm outline-none focus:border-[#421319]"
                                  >
                                    <option value="">-- Choose pre-bundled logo --</option>
                                    {PRESET_LOGOS.map((l) => (
                                      <option key={l.value} value={l.value}>
                                        {l.label} ({l.value})
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                  <div className="w-full">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Or Upload Custom Logo</label>
                                    <label className="flex items-center justify-center gap-2 w-full bg-white border border-[#421319]/25 hover:border-[#421319] text-[#421319] p-3 rounded-lg cursor-pointer text-xs font-bold uppercase tracking-wider transition">
                                      <Upload className="w-4 h-4" />
                                      <span>{uploadingLogo ? 'Uploading to R2...' : 'Upload Image File'}</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                      />
                                    </label>
                                  </div>

                                  <div className="w-full">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Or Custom URL / Path</label>
                                    <input
                                      type="text"
                                      placeholder="/project-logos/example.png"
                                      value={editingProject.logo || ''}
                                      onChange={e => setEditingProject({ ...editingProject, logo: e.target.value })}
                                      className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-3 text-xs outline-none focus:border-[#421319]"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* ORBIT POSITIONING CONTROLS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#421319]/10">
                              {/* Orbit Ring */}
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Orbit Ring</label>
                                <select
                                  value={Number(editingProject.orbitRing) || 2}
                                  onChange={e => setEditingProject({ ...editingProject, orbitRing: parseInt(e.target.value) })}
                                  className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-3 text-sm font-semibold outline-none focus:border-[#421319]"
                                >
                                  <option value={1}>Ring 1 &mdash; Inner Track (135px radius)</option>
                                  <option value={2}>Ring 2 &mdash; Middle Track (235px radius)</option>
                                  <option value={3}>Ring 3 &mdash; Outer Track (335px radius)</option>
                                </select>
                              </div>

                              {/* Orbit Position (Angle) */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82]">
                                    Position Angle
                                  </label>
                                  <span className="font-mono text-xs font-bold text-[#421319]">
                                    {Number(editingProject.orbitPosition) || 0}&deg;
                                  </span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="359"
                                  step="5"
                                  value={Number(editingProject.orbitPosition) || 0}
                                  onChange={e => setEditingProject({ ...editingProject, orbitPosition: parseInt(e.target.value) })}
                                  className="w-full h-2 bg-[#947e82]/20 rounded-lg appearance-none cursor-pointer accent-[#421319]"
                                />
                                <div className="flex justify-between text-[10px] text-[#947e82] font-mono mt-1">
                                  <span>0&deg;</span>
                                  <span>90&deg;</span>
                                  <span>180&deg;</span>
                                  <span>270&deg;</span>
                                  <span>359&deg;</span>
                                </div>
                              </div>

                              {/* Orbit Opacity */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82]">
                                    Logo Opacity
                                  </label>
                                  <span className="font-mono text-xs font-bold text-[#421319]">
                                    {Math.round((Number(editingProject.orbitOpacity) || 0.85) * 100)}%
                                  </span>
                                </div>
                                <input
                                  type="range"
                                  min="0.3"
                                  max="1"
                                  step="0.05"
                                  value={Number(editingProject.orbitOpacity) || 0.85}
                                  onChange={e => setEditingProject({ ...editingProject, orbitOpacity: e.target.value })}
                                  className="w-full h-2 bg-[#947e82]/20 rounded-lg appearance-none cursor-pointer accent-[#421319]"
                                />
                                <div className="flex justify-between text-[10px] text-[#947e82] font-mono mt-1">
                                  <span>30%</span>
                                  <span>Soft (60%)</span>
                                  <span>Clear (85%)</span>
                                  <span>100%</span>
                                </div>
                              </div>

                              {/* Speed */}
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Animation Speed</label>
                                <select
                                  value={editingProject.orbitSpeed || 'normal'}
                                  onChange={e => setEditingProject({ ...editingProject, orbitSpeed: e.target.value })}
                                  className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-3 text-sm outline-none focus:border-[#421319]"
                                >
                                  <option value="slow">Slow & Calm (~180s)</option>
                                  <option value="normal">Normal Architectural (~140s)</option>
                                  <option value="fast">Faster Motion (~90s)</option>
                                </select>
                              </div>

                              {/* Direction */}
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-2">Orbit Direction</label>
                                <select
                                  value={editingProject.orbitDirection || 'clockwise'}
                                  onChange={e => setEditingProject({ ...editingProject, orbitDirection: e.target.value })}
                                  className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-3 text-sm outline-none focus:border-[#421319]"
                                >
                                  <option value="clockwise">Clockwise</option>
                                  <option value="counter-clockwise">Counter-Clockwise</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* ─── GALLERY UPLOAD DIRECTLY IN PROJECT ─── */}
                          <div className="border-t pt-6 mt-4">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-4">Project Gallery Images</label>
                            
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

                          <div>
                            <button type="submit" className="w-full bg-[#421319] text-[#f5f2e9] px-6 py-4 rounded-lg text-lg font-bold hover:bg-[#250f12] transition">
                              Save Project & Orbit Settings
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
                                <p className="text-sm text-[#947e82]">{msg.phone} {msg.email && <span className="mx-2">â€¢</span>} {msg.email}</p>
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
