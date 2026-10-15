import { useState, useEffect, useRef } from 'react';
import { FadeIn } from '@/components/animations';
import { PartnersEditor } from '@/components/PartnersEditor';
import { GenericListEditor } from '@/components/GenericListEditor';
import { SingleImageEditor } from '@/components/SingleImageEditor';
import { ProjectSpecsEditor } from '@/components/ProjectSpecsEditor';
import { HeroOrbit } from '@/components/HeroOrbit';
import { Eye, EyeOff, Sparkles, Image as ImageIcon, Upload, Orbit, Layers, Sliders, AlertTriangle, RefreshCw, FileText, Trash2, ExternalLink, Calendar, Phone, CheckCircle2, Clock, Copy, Check, Mail, MessageSquare, X } from 'lucide-react';
import NotFound from '@/pages/not-found';

const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_URL = isDev && window.location.port !== '3001' ? 'http://localhost:3001/api' : '/api';
const ADMIN_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY || 'capital2026';

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

const formatArabicDateTime = (dateVal: any) => {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(dateVal);
  }
};

const formatArabicDate = (dateVal: any) => {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(dateVal);
  }
};

const formatArabicTime = (dateVal: any) => {
  if (!dateVal) return '';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(dateVal);
  }
};

export default function Admin() {
  const [isAuthorized] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const passkey = params.get('passkey');
    if (passkey && passkey === ADMIN_PASSKEY) {
      sessionStorage.setItem('admin_passkey', passkey);
      return true;
    }
    return sessionStorage.getItem('admin_passkey') === ADMIN_PASSKEY;
  });

  if (!isAuthorized) {
    return <NotFound />;
  }

  const [activeTab, setActiveTab] = useState<'home' | 'aboutus' | 'contact' | 'global' | 'projects' | 'messages' | 'visits'>('home');
  useEffect(() => {
    if (activeTab === 'messages' && unreadCount > 0) {
      fetch(`${API_URL}/messages/read`, { method: 'PATCH' }).then(() => {
        setMessages(messages.map(m => ({...m, isRead: true})));
      });
    } else if (activeTab === 'visits' && visits.some((v: any) => !v.isRead)) {
      fetch(`${API_URL}/visits/read-all`, { method: 'PATCH' }).then(() => {
        setVisits(visits.map(v => ({ ...v, isRead: true })));
      }).catch(err => {
        console.error('Failed to mark visits as read:', err);
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
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [uploadingBrochureAr, setUploadingBrochureAr] = useState(false);
  const [showOrbitPreview, setShowOrbitPreview] = useState(true);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const unreadCount = messages.filter((m: any) => !m.isRead).length;

  const [visits, setVisits] = useState<any[]>([]);
  const unreadVisitsCount = visits.filter((v: any) => !v.isRead).length;

  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDeleteMessage = async (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة؟ / Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`${API_URL}/messages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      alert('Failed to delete message / تعذر حذف الرسالة');
    }
  };

  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [contentRes, projectsRes, msgsRes, visitsRes] = await Promise.all([
        fetch(`${API_URL}/content?_t=${Date.now()}`, { cache: 'no-store' }),
        fetch(`${API_URL}/projects?_t=${Date.now()}`, { cache: 'no-store' }),
        fetch(`${API_URL}/messages?_t=${Date.now()}`, { cache: 'no-store' }),
        fetch(`${API_URL}/visits?_t=${Date.now()}`, { cache: 'no-store' })
      ]);
      if (!contentRes.ok) throw new Error(`HTTP ${contentRes.status}: تعذر جلب نصوص الموقع`);
      if (!projectsRes.ok) throw new Error(`HTTP ${projectsRes.status}: تعذر جلب المشاريع`);
      setContentBlocks(await contentRes.json());
      setProjects(await projectsRes.json());
      if (msgsRes.ok) setMessages(await msgsRes.json());
      if (visitsRes.ok) setVisits(await visitsRes.json());
      setFetchError(null);
    } catch (e: any) {
      console.error('Fetch admin data error:', e);
      setFetchError(e?.message || 'Failed to connect to API server');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVisitStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_URL}/visits/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Update failed');
      setVisits(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    } catch (e) {
      alert('Failed to update visit status / تعذر تحديث حالة الزيارة');
    }
  };

  const handleDeleteVisit = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الحجز؟ / Are you sure you want to delete this booking?')) return;
    try {
      const res = await fetch(`${API_URL}/visits/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Delete failed');
      setVisits(prev => prev.filter(v => v.id !== id));
    } catch (e) {
      alert('Failed to delete visit / تعذر حذف الحجز');
    }
  };

  const handleSaveContent = async (id: string, value: string, valueAr?: string) => {
    try {
      const res = await fetch(`${API_URL}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value, valueAr })
      });
      if (!res.ok) throw new Error('Save failed');
      alert('Saved successfully! / تم الحفظ بنجاح');
      // Update local state immediately so UI refreshes without relying on network cache
      setContentBlocks(prev => {
        const exists = prev.find(b => b.id === id);
        if (exists) {
          return prev.map(b => b.id === id ? { ...b, value, valueAr } : b);
        }
        return [...prev, { id, value, valueAr }];
      });
      fetchData();
    } catch (e) {
      alert('Error saving: ' + (e instanceof Error ? e.message : 'Network error'));
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

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>, isAr: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (isAr) setUploadingBrochureAr(true);
    else setUploadingBrochure(true);
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
      setEditingProject((prev: any) => ({
        ...prev,
        [isAr ? 'brochureUrlAr' : 'brochureUrl']: publicUrl,
      }));
    } catch (err) {
      alert('Brochure upload failed / فشل رفع ملف البروشور');
    } finally {
      if (isAr) setUploadingBrochureAr(false);
      else setUploadingBrochure(false);
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
      { id: 'aboutus_story_highlight', label: 'Story Highlight Banner (Investments exceeding...)', group: 'Story' },
      { id: 'aboutus_story_p1', label: 'Story Paragraph 1', group: 'Story' },
      { id: 'aboutus_story_p2', label: 'Story Paragraph 2', group: 'Story' },
      { id: 'aboutus_story_p3', label: 'Story Paragraph 3', group: 'Story' },
      { id: 'aboutus_mission_title', label: 'Mission Title', group: 'Mission & Vision' },
      { id: 'aboutus_mission_desc', label: 'Mission Description', group: 'Mission & Vision' },
      { id: 'aboutus_vision_title', label: 'Vision Title', group: 'Mission & Vision' },
      { id: 'aboutus_vision_desc', label: 'Vision Description', group: 'Mission & Vision' },
      { id: 'aboutus_slogan', label: 'Mission/Vision Slogan (Invest With Trust...)', group: 'Mission & Vision' },
      { id: 'aboutus_cta_eyebrow', label: 'CTA Eyebrow', group: 'CTA' },
      { id: 'aboutus_cta_title', label: 'CTA Title', group: 'CTA' },
      { id: 'aboutus_categories_list', label: 'Categories List', group: 'Categories' }
    ],
    contact: [
      { id: 'contact_eyebrow', label: 'Eyebrow (A REAL PERSON IS CLOSE BY)', group: 'Left Panel (Hero & Message)' },
      { id: 'contact_title_1', label: 'Header Title Line 1 (Let\'s make the)', group: 'Left Panel (Hero & Message)' },
      { id: 'contact_title_2', label: 'Header Title Line 2 - Italic (next step feel simple.)', group: 'Left Panel (Hero & Message)' },
      { id: 'contact_desc', label: 'Description Paragraph (Whether you\'re looking for your next home or a strategic investment...)', group: 'Left Panel (Hero & Message)' },
      
      { id: 'contact_call_label', label: 'Call Card Title (Call us)', group: 'Contact Cards' },
      { id: 'contact_phone', label: 'Hotline / Phone Number (16794)', group: 'Contact Cards' },
      
      { id: 'contact_whatsapp_label', label: 'WhatsApp Card Title (WhatsApp)', group: 'Contact Cards' },
      { id: 'contact_whatsapp_desc', label: 'WhatsApp Card Subtitle (Chat with our team)', group: 'Contact Cards' },
      { id: 'contact_whatsapp', label: 'WhatsApp URL (https://wa.me/...)', group: 'Contact Cards' },
      
      { id: 'contact_email_label', label: 'Email Card Title (Email)', group: 'Contact Cards' },
      { id: 'contact_email', label: 'Email Address (hello@capitalhillsdevelopments.eg)', group: 'Contact Cards' },
      
      { id: 'contact_address', label: 'Address (Galleria 40 / Arkan Plaza)', group: 'Info & Map' },
      { id: 'contact_map_url', label: 'Google Maps Embed URL', group: 'Info & Map' },
      
      { id: 'contact_form_eyebrow', label: 'Form Eyebrow (Have a quick question?)', group: 'Right Panel (Form)' },
      { id: 'contact_form_title', label: 'Form Title (We can start there.)', group: 'Right Panel (Form)' },
      { id: 'contact_form_desc', label: 'Form Description (No forms that go into a black hole...)', group: 'Right Panel (Form)' }
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

    // Determine groups with 'All Sections' option
    const rawGroups = Array.from(new Set(allBlocks.map(b => b.group || 'Other')));
    const groups = ['All Sections', ...rawGroups];
    const currentSubTab = activeSubTabs[tabKey] || 'All Sections';

    const blocksToRender = currentSubTab === 'All Sections'
      ? allBlocks
      : allBlocks.filter(b => (b.group || 'Other') === currentSubTab);

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
          // Find value and valueAr in DB blocks
          const dbBlock = blocks.find(b => b.id === blockDef.id);
          const value = dbBlock ? (dbBlock.value || '') : '';
          const valueAr = dbBlock ? (dbBlock.valueAr || '') : '';

          if (blockDef.id.startsWith('global_logo_') || blockDef.id.endsWith('_bg') || blockDef.id.endsWith('_img')) {
            return <SingleImageEditor key={`${blockDef.id}-${value}`} blockId={blockDef.id} title={blockDef.label} value={value} onSave={(val) => handleSaveContent(blockDef.id, val, valueAr)} />;
          }

          if (blockDef.id === 'home_partners_list') {
            return <PartnersEditor key={`${blockDef.id}-${value}-${valueAr}`} value={value} valueAr={valueAr} onSave={(valEn, valAr) => handleSaveContent(blockDef.id, valEn, valAr)} />;
          }

          if (blockDef.id === 'home_why_list') {
            return <GenericListEditor key={`${blockDef.id}-${value}-${valueAr}`} blockId={blockDef.id} title={blockDef.label} value={value} valueAr={valueAr} onSave={(valEn, valAr) => handleSaveContent(blockDef.id, valEn, valAr)} fields={[
              { name: 'n', label: 'Number (e.g. 01)', type: 'text' },
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'copy', label: 'Description', type: 'textarea' },
            ]} />;
          }

          if (blockDef.id === 'aboutus_core_list') {
            return <GenericListEditor key={`${blockDef.id}-${value}-${valueAr}`} blockId={blockDef.id} title={blockDef.label} value={value} valueAr={valueAr} onSave={(valEn, valAr) => handleSaveContent(blockDef.id, valEn, valAr)} fields={[
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'copy', label: 'Description', type: 'textarea' },
            ]} />;
          }

          if (blockDef.id === 'aboutus_categories_list') {
            return <GenericListEditor key={`${blockDef.id}-${value}-${valueAr}`} blockId={blockDef.id} title={blockDef.label} value={value} valueAr={valueAr} onSave={(valEn, valAr) => handleSaveContent(blockDef.id, valEn, valAr)} fields={[
              { name: 'title', label: 'Category Name', type: 'text' },
              { name: 'subtitle', label: 'Subtitle', type: 'text' },
              { name: 'desc', label: 'Description', type: 'textarea' },
            ]} />;
          }

          if (blockDef.id === 'home_reviews_list') {
            return <GenericListEditor key={`${blockDef.id}-${value}-${valueAr}`} blockId={blockDef.id} title={blockDef.label} value={value} valueAr={valueAr} onSave={(valEn, valAr) => handleSaveContent(blockDef.id, valEn, valAr)} fields={[
              { name: 'quote', label: 'Quote', type: 'textarea' },
              { name: 'name', label: 'Name', type: 'text' },
              { name: 'detail', label: 'Detail (e.g. Investor)', type: 'text' },
              { name: 'hide', label: 'Hide Review', type: 'checkbox' },
            ]} />;
          }

          if (blockDef.id === 'chairman_stats_list') {
            return <GenericListEditor key={`${blockDef.id}-${value}-${valueAr}`} blockId={blockDef.id} title={blockDef.label} value={value} valueAr={valueAr} onSave={(valEn, valAr) => handleSaveContent(blockDef.id, valEn, valAr)} fields={[
              { name: 'num', label: 'Number Value (e.g. 10+)', type: 'text' },
              { name: 'label', label: 'Label', type: 'text' },
            ]} />;
          }

          if (blockDef.id === 'home_ticker_list') {
            return <GenericListEditor key={`${blockDef.id}-${value}-${valueAr}`} blockId={blockDef.id} title={blockDef.label} value={value} valueAr={valueAr} onSave={(valEn, valAr) => handleSaveContent(blockDef.id, valEn, valAr)} fields={[
              { name: 'text', label: 'Ticker Text', type: 'text' },
            ]} />;
          }

          return (
            <div key={blockDef.id} className="bg-white p-6 rounded-xl shadow-sm border border-[#947e82]/10 relative space-y-4">
              <div className="flex justify-between items-center border-b border-[#947e82]/10 pb-2">
                <span className="text-sm font-bold text-[#421319]">{blockDef.label}</span>
                <span className="text-[10px] font-mono text-[#947e82]/60 bg-[#f5f2e9] px-2 py-0.5 rounded">{blockDef.id}</span>
              </div>

              {/* English Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                  English Field (EN)
                </label>
                <textarea 
                  key={`en-${blockDef.id}-${value}`}
                  className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-3 min-h-[60px] text-sm outline-none focus:border-[#421319]"
                  defaultValue={value}
                  id={`content_${blockDef.id}_en`}
                  placeholder="Enter English content..."
                />
              </div>

              {/* Arabic Input - DIRECTLY UNDERNEATH */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#421319] mb-1.5 flex items-center gap-1.5 font-sans">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                  الخانة بالعربية (AR)
                </label>
                <textarea 
                  key={`ar-${blockDef.id}-${valueAr}`}
                  dir="rtl"
                  className="w-full bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-3 min-h-[60px] text-sm text-right font-sans outline-none focus:border-[#421319]"
                  defaultValue={valueAr}
                  id={`content_${blockDef.id}_ar`}
                  placeholder="اكتب المحتوى بالعربية..."
                />
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => {
                    const valEn = (document.getElementById(`content_${blockDef.id}_en`) as HTMLTextAreaElement).value;
                    const valAr = (document.getElementById(`content_${blockDef.id}_ar`) as HTMLTextAreaElement).value;
                    handleSaveContent(blockDef.id, valEn, valAr);
                  }}
                  className="bg-[#421319] text-[#f5f2e9] px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#250f12] transition flex items-center gap-2"
                >
                  Save Changes / حفظ التعديلات
                </button>
              </div>
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-4xl text-[#421319]">Admin Dashboard</h1>
            <button 
              onClick={() => {
                sessionStorage.removeItem('admin_passkey');
                window.location.href = '/';
              }}
              className="text-xs font-bold text-[#421319] hover:bg-[#421319]/10 border border-[#421319]/30 px-3 py-1.5 rounded-lg transition"
            >
              Log Out
            </button>
          </div>

          {fetchError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="font-bold text-sm">تعذر الاتصال بسيرفر البيانات المحلي (Backend API Server)</p>
                  <p className="text-xs text-red-600 mt-0.5 font-sans">
                    يرجى التأكد من تشغيل سيرفر الـ API في نافذة تيرمينال منفصلة عبر: <code className="bg-red-100 px-1.5 py-0.5 rounded font-mono font-bold">npm run dev:server</code>
                  </p>
                </div>
              </div>
              <button onClick={fetchData} className="px-3.5 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                <RefreshCw className="w-3.5 h-3.5" /> إعادة المحاولة
              </button>
            </div>
          )}
            
            <div className="flex gap-4 mb-8 border-b border-[#947e82]/20 pb-4 overflow-x-auto">
              <button onClick={() => setActiveTab('home')} className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'home' ? 'bg-[#421319] text-[#f5f2e9]' : 'text-[#421319] hover:bg-[#421319]/10'}`}>Home Page</button>
              <button onClick={() => setActiveTab('aboutus')} className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'aboutus' ? 'bg-[#421319] text-[#f5f2e9]' : 'text-[#421319] hover:bg-[#421319]/10'}`}>About us Page</button>
              <button onClick={() => setActiveTab('contact')} className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'contact' ? 'bg-[#421319] text-[#f5f2e9]' : 'text-[#421319] hover:bg-[#421319]/10'}`}>Contact Page</button>
              <button onClick={() => setActiveTab('global')} className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'global' ? 'bg-[#421319] text-[#f5f2e9]' : 'text-[#421319] hover:bg-[#421319]/10'}`}>Global (Footer/Header)</button>
              <button onClick={() => { setActiveTab('projects'); setEditingProject(null); }} className={`text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'projects' ? 'bg-[#421319] text-[#f5f2e9]' : 'text-[#421319] hover:bg-[#421319]/10'}`}>Projects</button>
              <button onClick={() => setActiveTab('visits')} className={`relative flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition whitespace-nowrap ${activeTab === 'visits' ? 'bg-[#421319] text-[#f5f2e9]' : 'text-[#421319] hover:bg-[#421319]/10'}`}>
                <Calendar className="w-4 h-4" />
                مواعيد الزيارات / Visits
                {unreadVisitsCount > 0 && (
                  <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm">
                    {unreadVisitsCount}
                  </span>
                )}
              </button>
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
                                  Ring 1 (Inner, 220px) &bull; Ring 2 (Outer, 370px)
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
                            {/* Project Name Pair */}
                            <div className="space-y-3 bg-[#fdfbf7] p-4 rounded-xl border border-[#947e82]/20">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1.5 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                                  Project Name (EN) *
                                </label>
                                <input required type="text" value={editingProject.name || ''} onChange={e => setEditingProject({...editingProject, name: e.target.value, slug: editingProject.id ? editingProject.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#421319]" placeholder="e.g. CAPITAL TOWERS" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#421319] mb-1.5 flex items-center gap-1.5 font-sans">
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                                  اسم المشروع (عربي)
                                </label>
                                <input dir="rtl" type="text" value={editingProject.nameAr || ''} onChange={e => setEditingProject({...editingProject, nameAr: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm text-right font-sans outline-none focus:ring-2 focus:ring-[#421319]" placeholder="مثال: كابيتال تاورز" />
                              </div>
                            </div>

                            {/* Slug (URL friendly) */}
                            <div className="bg-[#fdfbf7] p-4 rounded-xl border border-[#947e82]/20 flex flex-col justify-between">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1.5">Slug (URL friendly) *</label>
                                <input required type="text" value={editingProject.slug || ''} onChange={e => setEditingProject({...editingProject, slug: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#421319]" />
                                <span className="text-[11px] text-[#947e82] mt-1.5 block">Used in website URL (e.g. /projects/capital-towers)</span>
                              </div>
                            </div>

                            {/* City Pair */}
                            <div className="space-y-3 bg-[#fdfbf7] p-4 rounded-xl border border-[#947e82]/20">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1.5 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                                  City (EN) *
                                </label>
                                <input required type="text" value={editingProject.city || ''} onChange={e => setEditingProject({...editingProject, city: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#421319]" placeholder="e.g. 6th of October" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#421319] mb-1.5 flex items-center gap-1.5 font-sans">
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                                  المدينة (عربي)
                                </label>
                                <input dir="rtl" type="text" value={editingProject.cityAr || ''} onChange={e => setEditingProject({...editingProject, cityAr: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm text-right font-sans outline-none focus:ring-2 focus:ring-[#421319]" placeholder="مثال: 6 أكتوبر" />
                              </div>
                            </div>

                            {/* Location Pair */}
                            <div className="space-y-3 bg-[#fdfbf7] p-4 rounded-xl border border-[#947e82]/20">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1.5 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                                  Location (EN) *
                                </label>
                                <input required type="text" value={editingProject.location || ''} onChange={e => setEditingProject({...editingProject, location: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#421319]" placeholder="Location details in English" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#421319] mb-1.5 flex items-center gap-1.5 font-sans">
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                                  الموقع (عربي)
                                </label>
                                <input dir="rtl" type="text" value={editingProject.locationAr || ''} onChange={e => setEditingProject({...editingProject, locationAr: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm text-right font-sans outline-none focus:ring-2 focus:ring-[#421319]" placeholder="تفاصيل الموقع بالعربية" />
                              </div>
                            </div>

                            {/* Product Type Pair */}
                            <div className="space-y-3 bg-[#fdfbf7] p-4 rounded-xl border border-[#947e82]/20">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1.5 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                                  Product Type (EN) *
                                </label>
                                <input required type="text" value={editingProject.product || ''} onChange={e => setEditingProject({...editingProject, product: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#421319]" placeholder="e.g. Mixed Use (Commercial – Admin – Medical)" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#421319] mb-1.5 flex items-center gap-1.5 font-sans">
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                                  نوع الاستخدام (عربي)
                                </label>
                                <input dir="rtl" type="text" value={editingProject.productAr || ''} onChange={e => setEditingProject({...editingProject, productAr: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm text-right font-sans outline-none focus:ring-2 focus:ring-[#421319]" placeholder="مثال: متعدد الاستخدامات (تجاري – إداري – طبي)" />
                              </div>
                            </div>

                            {/* Project Space Pair */}
                            <div className="space-y-3 bg-[#fdfbf7] p-4 rounded-xl border border-[#947e82]/20">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1.5 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                                  Project Space (EN)
                                </label>
                                <input type="text" value={editingProject.projectSpace || ''} onChange={e => setEditingProject({...editingProject, projectSpace: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#421319]" placeholder="e.g. 14,000 SQM" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#421319] mb-1.5 flex items-center gap-1.5 font-sans">
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                                  مساحة المشروع (عربي)
                                </label>
                                <input dir="rtl" type="text" value={editingProject.projectSpaceAr || ''} onChange={e => setEditingProject({...editingProject, projectSpaceAr: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm text-right font-sans outline-none focus:ring-2 focus:ring-[#421319]" placeholder="مثال: 14,000 متر مربع" />
                              </div>
                            </div>

                            {/* Built Up Area Pair */}
                            <div className="space-y-3 bg-[#fdfbf7] p-4 rounded-xl border border-[#947e82]/20">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1.5 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                                  Built Up Area (EN)
                                </label>
                                <input type="text" value={editingProject.builtUpArea || ''} onChange={e => setEditingProject({...editingProject, builtUpArea: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#421319]" placeholder="e.g. 21,000 SQM" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#421319] mb-1.5 flex items-center gap-1.5 font-sans">
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                                  المساحة المبنية (عربي)
                                </label>
                                <input dir="rtl" type="text" value={editingProject.builtUpAreaAr || ''} onChange={e => setEditingProject({...editingProject, builtUpAreaAr: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm text-right font-sans outline-none focus:ring-2 focus:ring-[#421319]" placeholder="مثال: 21,000 متر مربع" />
                              </div>
                            </div>

                            {/* Construction Pair */}
                            <div className="space-y-3 bg-[#fdfbf7] p-4 rounded-xl border border-[#947e82]/20">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1.5 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                                  Construction (EN)
                                </label>
                                <input type="text" value={editingProject.construction || ''} onChange={e => setEditingProject({...editingProject, construction: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#421319]" placeholder="e.g. 5 Towers (G+6 & G+8)" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#421319] mb-1.5 flex items-center gap-1.5 font-sans">
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                                  الموقف الإنشائي (عربي)
                                </label>
                                <input dir="rtl" type="text" value={editingProject.constructionAr || ''} onChange={e => setEditingProject({...editingProject, constructionAr: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm text-right font-sans outline-none focus:ring-2 focus:ring-[#421319]" placeholder="مثال: 5 أبراج (أرضي + 6 وأرضي + 8)" />
                              </div>
                            </div>

                            {/* Finishing Pair */}
                            <div className="space-y-3 bg-[#fdfbf7] p-4 rounded-xl border border-[#947e82]/20">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1.5 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                                  Finishing (EN)
                                </label>
                                <input type="text" value={editingProject.finishing || ''} onChange={e => setEditingProject({...editingProject, finishing: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#421319]" placeholder="e.g. Core & Shell / Fully Finished" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#421319] mb-1.5 flex items-center gap-1.5 font-sans">
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                                  نوع التشطيب (عربي)
                                </label>
                                <input dir="rtl" type="text" value={editingProject.finishingAr || ''} onChange={e => setEditingProject({...editingProject, finishingAr: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm text-right font-sans outline-none focus:ring-2 focus:ring-[#421319]" placeholder="مثال: طوب ومحارة / تشطيب كامل بالتكييفات" />
                              </div>
                            </div>

                            {/* Delivery Pair */}
                            <div className="space-y-3 bg-[#fdfbf7] p-4 rounded-xl border border-[#947e82]/20">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1.5 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                                  Delivery (EN)
                                </label>
                                <input type="text" value={editingProject.delivery || ''} onChange={e => setEditingProject({...editingProject, delivery: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#421319]" placeholder="e.g. 4 Years / June 2025" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#421319] mb-1.5 flex items-center gap-1.5 font-sans">
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                                  موعد التسليم (عربي)
                                </label>
                                <input dir="rtl" type="text" value={editingProject.deliveryAr || ''} onChange={e => setEditingProject({...editingProject, deliveryAr: e.target.value})} className="w-full bg-[#f5f2e9] rounded-lg p-2.5 text-sm text-right font-sans outline-none focus:ring-2 focus:ring-[#421319]" placeholder="مثال: خلال 4 سنوات / يونيو 2025" />
                              </div>
                            </div>

                            {/* Description Pair (Full Width) */}
                            <div className="col-span-1 md:col-span-2 space-y-4 bg-[#fdfbf7] p-4 rounded-xl border border-[#947e82]/20">
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#947e82] mb-1.5 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                                  Description (EN)
                                </label>
                                <textarea value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full min-h-[90px] bg-[#f5f2e9] rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-[#421319]" placeholder="Detailed project overview in English..." />
                              </div>
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-[#421319] mb-1.5 flex items-center gap-1.5 font-sans">
                                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                                  الوصف التفصيلي للمشروع (عربي)
                                </label>
                                <textarea dir="rtl" value={editingProject.descriptionAr || ''} onChange={e => setEditingProject({...editingProject, descriptionAr: e.target.value})} className="w-full min-h-[90px] bg-[#f5f2e9] rounded-lg p-3 text-sm text-right font-sans outline-none focus:ring-2 focus:ring-[#421319]" placeholder="وصف تفصيلي شامل للمشروع بالعربية..." />
                              </div>
                            </div>
                          </div>

                          {/* ─── PROJECT HIGHLIGHTS & SPECIFICATIONS (EXTRA DETAILS) ─── */}
                          <ProjectSpecsEditor
                            extraDetails={editingProject.extraDetails}
                            extraDetailsAr={editingProject.extraDetailsAr}
                            onChange={(extraDetails, extraDetailsAr) => {
                              setEditingProject((prev: any) => ({
                                ...prev,
                                extraDetails,
                                extraDetailsAr
                              }));
                            }}
                          />

                          {/* ─── PROJECT BROCHURE (PDF) SECTION ─── */}
                          <div className="border border-[#421319]/15 rounded-2xl p-6 bg-[#fbf9f4] space-y-6">
                            <div className="flex items-center gap-3 border-b border-[#421319]/10 pb-4">
                              <div className="w-10 h-10 rounded-xl bg-[#421319] text-[#f5f2e9] flex items-center justify-center">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-lg font-display text-[#421319]">Project Brochure (PDF) / بروشور المشروع</h3>
                                <p className="text-xs text-[#947e82]">
                                  ارفع ملف البروشور (PDF) ليتمكن الزوار من تحميله مباشرة عند الضغط على زر "تحميل بروشور المشروع" في صفحة تفاصيل المشروع.
                                </p>
                              </div>
                            </div>

                            <div className="space-y-6">
                              {/* English Brochure */}
                              <div className="bg-white p-5 rounded-xl border border-[#947e82]/20 space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="text-xs font-bold uppercase tracking-wider text-[#947e82] flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                                    English Brochure (PDF)
                                  </label>
                                  {editingProject.brochureUrl && (
                                    <div className="flex items-center gap-3">
                                      <a
                                        href={editingProject.brochureUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Preview / معاينة
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() => setEditingProject({ ...editingProject, brochureUrl: '' })}
                                        className="text-xs text-red-600 hover:underline flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md border border-red-200"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        حذف
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                  <input
                                    type="text"
                                    value={editingProject.brochureUrl || ''}
                                    onChange={e => setEditingProject({ ...editingProject, brochureUrl: e.target.value })}
                                    placeholder="Brochure URL / uploads path (e.g. /uploads/sample-brochure.pdf)"
                                    className="flex-1 bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-3 text-xs font-mono outline-none focus:border-[#421319]"
                                  />
                                  <label className="flex items-center justify-center gap-2 bg-[#421319] hover:bg-[#250f12] text-[#f5f2e9] px-5 py-3 rounded-lg cursor-pointer text-xs font-bold uppercase tracking-wider transition shrink-0">
                                    <Upload className="w-4 h-4" />
                                    <span>{uploadingBrochure ? 'Uploading...' : 'Upload PDF File'}</span>
                                    <input
                                      type="file"
                                      accept=".pdf,application/pdf"
                                      onChange={e => handleBrochureUpload(e, false)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>

                              {/* Arabic Brochure */}
                              <div className="bg-white p-5 rounded-xl border border-[#947e82]/20 space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="text-xs font-bold uppercase tracking-wider text-[#421319] flex items-center gap-1.5 font-sans">
                                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                                    بروشور المشروع بالعربية (PDF)
                                  </label>
                                  {editingProject.brochureUrlAr && (
                                    <div className="flex items-center gap-3">
                                      <a
                                        href={editingProject.brochureUrlAr}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        معاينة البروشور العربي
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() => setEditingProject({ ...editingProject, brochureUrlAr: '' })}
                                        className="text-xs text-red-600 hover:underline flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md border border-red-200"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        حذف
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                  <input
                                    dir="ltr"
                                    type="text"
                                    value={editingProject.brochureUrlAr || ''}
                                    onChange={e => setEditingProject({ ...editingProject, brochureUrlAr: e.target.value })}
                                    placeholder="رابط البروشور العربي (اختياري - سيتم استخدام الإنجليزي تلقائياً إذا تُرِك فارغاً)"
                                    className="flex-1 bg-[#f5f2e9] border border-[#947e82]/30 rounded-lg p-3 text-xs font-mono outline-none focus:border-[#421319]"
                                  />
                                  <label className="flex items-center justify-center gap-2 bg-[#421319] hover:bg-[#250f12] text-[#f5f2e9] px-5 py-3 rounded-lg cursor-pointer text-xs font-bold uppercase tracking-wider transition shrink-0 font-sans">
                                    <Upload className="w-4 h-4" />
                                    <span>{uploadingBrochureAr ? 'جاري الرفع...' : 'رفع بروشور عربي PDF'}</span>
                                    <input
                                      type="file"
                                      accept=".pdf,application/pdf"
                                      onChange={e => handleBrochureUpload(e, true)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                                <p className="text-[11px] text-[#947e82] font-sans">
                                  * في حال كان البروشور باللغتين في ملف واحد، يمكنك رفعه في الخانة الإنجليزية فقط وسيعمل تلقائياً لكلا اللغتين.
                                </p>
                              </div>
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
                                      <span>{uploadingLogo ? 'Uploading to Server...' : 'Upload Image File'}</span>
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
                                  <option value={1}>Ring 1 &mdash; Inner Track (220px radius)</option>
                                  <option value={2}>Ring 2 &mdash; Outer Track (370px radius)</option>
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
                                {uploadingImage ? 'Uploading to Server...' : '+ Select Images to Upload'}
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

                {activeTab === 'visits' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-display text-2xl text-[#421319]">حجوزات ومواعيد الزيارات (Visit Bookings)</h2>
                        <p className="text-sm text-[#493337] mt-1">
                          جميع طلبات حجز الزيارات الخاصة بالمشاريع القادمة من الموقع مع بيانات التواصل وتاريخ الزيارة المفضل.
                        </p>
                      </div>
                      <button 
                        onClick={fetchData}
                        className="px-4 py-2 bg-white border border-[#421319]/20 text-[#421319] rounded-lg text-xs font-bold hover:bg-[#421319]/5 transition flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> تحديث البيانات
                      </button>
                    </div>

                    {/* Stats counters */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white p-5 rounded-xl border border-[#421319]/10 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#421319]/10 flex items-center justify-center text-[#421319]">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-[#947e82] font-bold uppercase tracking-wider">إجمالي الزيارات</p>
                          <p className="text-2xl font-display text-[#421319] font-bold mt-0.5">{visits.length}</p>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-xl border border-[#421319]/10 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">قيد الانتظار</p>
                          <p className="text-2xl font-display text-amber-600 font-bold mt-0.5">{visits.filter((v: any) => v.status === 'pending').length}</p>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-xl border border-[#421319]/10 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">مؤكدة / تمت</p>
                          <p className="text-2xl font-display text-emerald-600 font-bold mt-0.5">{visits.filter((v: any) => v.status === 'confirmed' || v.status === 'completed').length}</p>
                        </div>
                      </div>
                    </div>

                    {/* Visits List */}
                    {visits.length === 0 ? (
                      <div className="rounded-2xl border border-[#421319]/10 bg-white p-12 text-center text-[#493337] space-y-3">
                        <Calendar className="w-12 h-12 mx-auto text-[#947e82]/40" />
                        <h3 className="font-display text-xl text-[#421319]">لا توجد طلبات زيارة حتى الآن</h3>
                        <p className="text-sm text-[#947e82] max-w-md mx-auto">
                          عندما يقوم أحد العملاء بالضغط على "احجز زيارة" في أي صفحة مشروع، ستظهر تفاصيل الزيارة والتاريخ المحدد هنا فوراً.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {visits.map((visit: any) => {
                          const statusBg = visit.status === 'confirmed' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : visit.status === 'completed'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : visit.status === 'cancelled'
                            ? 'bg-gray-100 text-gray-500 border-gray-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200';

                          const statusLabel = visit.status === 'confirmed'
                            ? 'تم تأكيد الموعد'
                            : visit.status === 'completed'
                            ? 'تمت الزيارة بنجاح'
                            : visit.status === 'cancelled'
                            ? 'ملغية'
                            : 'قيد الانتظار / جديد';

                          const cleanPhone = (visit.phone || '').replace(/[^0-9]/g, '');

                          return (
                            <div 
                              key={visit.id} 
                              className={`rounded-2xl border p-6 shadow-sm transition ${
                                !visit.isRead ? 'border-amber-300 bg-amber-50/30' : 'border-[#421319]/10 bg-white'
                              }`}
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#421319]/10 pb-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2.5 flex-wrap">
                                    <span className="font-display font-bold text-lg text-[#421319]">{visit.name}</span>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#421319]/10 text-[#421319]">
                                      {visit.projectName || 'زيارة مشروع'}
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBg}`}>
                                      {statusLabel}
                                    </span>
                                    {!visit.isRead && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                                        جديد
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-[#947e82]">
                                    تاريخ طلب الزيارة: {formatArabicDateTime(visit.createdAt)}
                                  </p>
                                </div>

                                {/* Highlighted Visit Date */}
                                <div className="flex items-center gap-3 bg-[#f5f2e9] px-4 py-2.5 rounded-xl border border-[#947e82]/20 shrink-0">
                                  <Calendar className="w-5 h-5 text-[#421319]" />
                                  <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#947e82]">موعد الزيارة المحدد</p>
                                    <p className="text-base font-bold text-[#421319] font-mono">{visit.visitDate}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                                {/* Contact buttons */}
                                <div className="flex items-center gap-3 flex-wrap">
                                  <a 
                                    href={`tel:${visit.phone}`}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#421319] text-[#f5f2e9] text-xs font-bold hover:bg-[#250f12] transition"
                                  >
                                    <Phone className="w-3.5 h-3.5" /> اتصال: {visit.phone}
                                  </a>
                                  <a 
                                    href={`https://wa.me/${cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                                  >
                                    واتساب
                                  </a>
                                </div>

                                {/* Status actions */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  {visit.status !== 'confirmed' && (
                                    <button 
                                      onClick={() => handleUpdateVisitStatus(visit.id, 'confirmed')}
                                      className="px-3 py-1.5 rounded-lg border border-emerald-600 text-emerald-700 bg-emerald-50 text-xs font-bold hover:bg-emerald-100 transition"
                                    >
                                      تأكيد الموعد ✓
                                    </button>
                                  )}
                                  {visit.status !== 'completed' && (
                                    <button 
                                      onClick={() => handleUpdateVisitStatus(visit.id, 'completed')}
                                      className="px-3 py-1.5 rounded-lg border border-blue-600 text-blue-700 bg-blue-50 text-xs font-bold hover:bg-blue-100 transition"
                                    >
                                      تمت الزيارة
                                    </button>
                                  )}
                                  {visit.status !== 'cancelled' && (
                                    <button 
                                      onClick={() => handleUpdateVisitStatus(visit.id, 'cancelled')}
                                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 bg-gray-50 text-xs font-bold hover:bg-gray-100 transition"
                                    >
                                      إلغاء
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleDeleteVisit(visit.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="حذف الحجز"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'messages' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-display text-2xl text-[#421319]">رسائل واستفسارات التواصل (Direct Messages)</h2>
                        <p className="text-sm text-[#493337] mt-1">الرسائل الواردة من نموذج صفحة Contact. اضغط على أي رسالة لفتحها في نافذة منبثقة ونسخ بيانات العميل.</p>
                      </div>
                      <button 
                        onClick={fetchData}
                        className="px-4 py-2 bg-white border border-[#421319]/20 text-[#421319] rounded-lg text-xs font-bold hover:bg-[#421319]/5 transition flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> تحديث الرسائل
                      </button>
                    </div>
                    
                    {messages.length === 0 ? (
                      <div className="rounded-2xl border border-[#421319]/10 bg-white p-12 text-center text-[#493337] space-y-3">
                        <MessageSquare className="w-12 h-12 mx-auto text-[#947e82]/40" />
                        <h3 className="font-display text-xl text-[#421319]">لا توجد رسائل واردة حتى الآن</h3>
                        <p className="text-sm text-[#947e82]">
                          عند إرسال أي استفسار من صفحة التواصل، سيظهر هنا فوراً.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {messages.map((msg, i) => (
                          <div 
                            key={msg.id || i} 
                            onClick={() => setSelectedMessage(msg)}
                            className={`rounded-2xl border p-6 shadow-sm flex flex-col gap-3 transition cursor-pointer hover:border-[#421319]/40 hover:shadow-md group relative ${
                              !msg.isRead ? 'bg-amber-50/40 border-amber-300' : 'bg-white border-[#421319]/10'
                            }`}
                          >
                            <div className="flex justify-between items-start border-b border-[#421319]/10 pb-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-bold text-lg text-[#421319] group-hover:text-[#250f12] transition flex items-center gap-2">
                                    {msg.name}
                                  </h3>
                                  {!msg.isRead && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                                      جديد
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-[#947e82] flex-wrap font-sans">
                                  <span className="font-mono font-medium text-[#421319] bg-[#f5f2e9] px-2 py-0.5 rounded flex items-center gap-1">
                                    <Phone size={11} /> {msg.phone}
                                  </span>
                                  {msg.email && (
                                    <span className="font-medium text-[#421319] bg-[#f5f2e9] px-2 py-0.5 rounded flex items-center gap-1">
                                      <Mail size={11} /> {msg.email}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-[#947e82] bg-[#f5f2e9] px-2.5 py-1 rounded-full">
                                  {formatArabicDate(msg.createdAt)}
                                </span>
                                <button
                                  onClick={(e) => handleDeleteMessage(msg.id, e)}
                                  className="p-1.5 text-[#947e82] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="حذف الرسالة"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <p className="text-sm text-[#493337] whitespace-pre-line leading-relaxed line-clamp-2">
                              {msg.message}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-[#421319]/05 text-xs text-[#947e82]">
                              <span className="text-[#421319] font-bold inline-flex items-center gap-1 group-hover:underline">
                                🔍 انقر لعرض الرسالة كاملة ونسخ الهاتف أو الإيميل
                              </span>
                              <span className="text-[11px] opacity-70">
                                {formatArabicTime(msg.createdAt)}
                              </span>
                            </div>
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

        {/* ─── POPUP MODAL FOR SELECTED MESSAGE ─── */}
        {selectedMessage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
            onClick={() => setSelectedMessage(null)}
            role="dialog"
            aria-modal="true"
          >
            <div 
              className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#421319]/10 relative my-8 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedMessage(null)}
                className="absolute right-5 top-5 rtl:right-auto rtl:left-5 grid h-9 w-9 place-items-center rounded-full bg-[#f5f2e9] text-[#421319] hover:bg-[#421319] hover:text-white transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="border-b border-[#421319]/10 pb-5 mb-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#421319]"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#947e82]">تفاصيل الاستفسار / Message Details</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-[#421319]">{selectedMessage.name}</h2>
                <p className="text-xs text-[#947e82] mt-1 font-sans">
                  تاريخ الاستلام: {formatArabicDateTime(selectedMessage.createdAt)}
                </p>
              </div>

              {/* Contact Details Cards with Copy Buttons */}
              <div className="space-y-4 mb-6">
                {/* Phone Card */}
                <div className="bg-[#f5f2e9] p-4 rounded-xl border border-[#947e82]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#947e82] block">رقم الهاتف / Phone Number</span>
                    <p className="text-lg font-bold text-[#421319] font-mono select-all tracking-wide">{selectedMessage.phone}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedMessage.phone, 'phone')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                        copiedField === 'phone'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-[#421319]/20 text-[#421319] hover:bg-[#421319] hover:text-white'
                      }`}
                    >
                      {copiedField === 'phone' ? (
                        <>
                          <Check size={14} /> تم النسخ!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> نسخ الرقم
                        </>
                      )}
                    </button>

                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#421319] text-[#f5f2e9] text-xs font-bold hover:bg-[#250f12] transition"
                    >
                      <Phone size={13} /> اتصال
                    </a>

                    {selectedMessage.phone && (
                      <a
                        href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '').startsWith('0') ? '2' + selectedMessage.phone.replace(/[^0-9]/g, '') : selectedMessage.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                      >
                        واتساب
                      </a>
                    )}
                  </div>
                </div>

                {/* Email Card (if available) */}
                {selectedMessage.email && (
                  <div className="bg-[#f5f2e9] p-4 rounded-xl border border-[#947e82]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 overflow-hidden">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#947e82] block">البريد الإلكتروني / Email Address</span>
                      <p className="text-base font-bold text-[#421319] font-mono select-all truncate">{selectedMessage.email}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedMessage.email, 'email')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                          copiedField === 'email'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-[#421319]/20 text-[#421319] hover:bg-[#421319] hover:text-white'
                        }`}
                      >
                        {copiedField === 'email' ? (
                          <>
                            <Check size={14} /> تم النسخ!
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> نسخ الإيميل
                          </>
                        )}
                      </button>

                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#421319] text-[#f5f2e9] text-xs font-bold hover:bg-[#250f12] transition"
                      >
                        <Mail size={13} /> إرسال إيميل
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Body */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#947e82] flex items-center gap-1.5">
                    <MessageSquare size={14} /> نص الرسالة بالكامل:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedMessage.message, 'message')}
                    className={`text-xs font-bold inline-flex items-center gap-1 transition ${
                      copiedField === 'message' ? 'text-emerald-600' : 'text-[#421319] hover:underline'
                    }`}
                  >
                    {copiedField === 'message' ? (
                      <>
                        <Check size={13} /> تم نسخ النص!
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> نسخ نص الرسالة
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-[#f5f2e9]/70 border border-[#947e82]/20 rounded-xl p-5 text-sm md:text-base leading-relaxed text-[#421319] whitespace-pre-line select-all max-h-[260px] overflow-y-auto font-sans shadow-inner">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between border-t border-[#421319]/10 pt-4">
                <button
                  type="button"
                  onClick={(e) => handleDeleteMessage(selectedMessage.id, e)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold transition"
                >
                  <Trash2 size={15} /> حذف الرسالة
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-6 py-2 rounded-lg bg-[#421319] text-[#f5f2e9] text-xs font-bold hover:bg-[#250f12] transition"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
  );
}
