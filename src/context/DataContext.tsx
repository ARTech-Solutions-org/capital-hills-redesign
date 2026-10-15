import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Project, projects as defaultProjects } from '../data/projects';

type ContentMap = Record<string, string>;

export interface RawContentBlock {
  id: string;
  value: string;
  valueAr?: string | null;
  updatedAt?: string;
}

interface DataContextType {
  content: ContentMap;
  contentEn: ContentMap;
  contentAr: ContentMap;
  rawBlocks: RawContentBlock[];
  projects: Project[];
  rawProjects: Project[];
  loading: boolean;
  refresh: () => Promise<void>;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  toggleLang: () => void;
  t: (en: string, ar: string) => string;
}

const DataContext = createContext<DataContextType>({
  content: {},
  contentEn: {},
  contentAr: {},
  rawBlocks: [],
  projects: defaultProjects,
  rawProjects: defaultProjects,
  loading: true,
  refresh: async () => {},
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: (en: string) => en,
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<'en' | 'ar'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('capital_hills_lang');
      if (saved === 'ar' || saved === 'en') return saved;
    }
    return 'en';
  });

  const [rawBlocks, setRawBlocks] = useState<RawContentBlock[]>([]);
  const [rawProjects, setRawProjects] = useState<Project[]>(defaultProjects);
  const [loading, setLoading] = useState(true);

  const setLang = (newLang: 'en' | 'ar') => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('capital_hills_lang', newLang);
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  const t = (en: string, ar: string) => {
    return lang === 'ar' ? (ar || en) : en;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [lang]);

  const fetchData = async () => {
    try {
      const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      const API_URL = isDev && window.location.port !== '3001' ? 'http://localhost:3001/api' : '/api';
      
      const [contentRes, projectsRes] = await Promise.all([
        fetch(`${API_URL}/content?_t=${Date.now()}`, { cache: 'no-store' }),
        fetch(`${API_URL}/projects?_t=${Date.now()}`, { cache: 'no-store' })
      ]);

      if (contentRes.ok) {
        const contentData = await contentRes.json();
        if (Array.isArray(contentData)) {
          setRawBlocks(contentData);
        }
      }
      
      if (projectsRes.ok) {
        const fetched = await projectsRes.json();
        if (Array.isArray(fetched) && fetched.length > 0) {
          setRawProjects(fetched.map((p: any) => ({
            ...p,
            logo: p.logo || `/project-logos/${p.slug}.png`,
            showInHero: p.showInHero !== undefined ? Boolean(p.showInHero) : true,
            orbitRing: Number(p.orbitRing) || 2,
            orbitPosition: Number(p.orbitPosition) || 0,
            orbitSpeed: p.orbitSpeed || 'normal',
            orbitDirection: p.orbitDirection || 'clockwise',
            orbitOpacity: p.orbitOpacity || '0.85',
          })));
        }
      }
    } catch (e) {
      console.error('Failed to fetch dynamic data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Maps for EN and AR
  const { contentEn, contentAr, content } = useMemo(() => {
    const enMap: ContentMap = {};
    const arMap: ContentMap = {};
    const activeMap: ContentMap = {};

    rawBlocks.forEach((item) => {
      const lower = item.id.toLowerCase();
      const valEn = item.value || '';
      const valAr = (item.valueAr && item.valueAr.trim() !== '') ? item.valueAr : valEn;
      const valActive = lang === 'ar' ? valAr : valEn;

      enMap[item.id] = valEn;
      enMap[lower] = valEn;

      arMap[item.id] = valAr;
      arMap[lower] = valAr;

      activeMap[item.id] = valActive;
      activeMap[lower] = valActive;
    });

    return { contentEn: enMap, contentAr: arMap, content: activeMap };
  }, [rawBlocks, lang]);

  // Localized projects
  const projects = useMemo(() => {
    return rawProjects.map((p) => {
      if (lang === 'ar') {
        return {
          ...p,
          name: p.nameAr || p.name,
          city: p.cityAr || p.city,
          location: p.locationAr || p.location,
          product: p.productAr || p.product,
          projectSpace: p.projectSpaceAr || p.projectSpace,
          builtUpArea: p.builtUpAreaAr || p.builtUpArea,
          construction: p.constructionAr || p.construction,
          finishing: p.finishingAr || p.finishing,
          delivery: p.deliveryAr || p.delivery,
          description: p.descriptionAr || p.description,
          brochureUrl: p.brochureUrlAr || p.brochureUrl,
          extraDetails: (p.extraDetailsAr && Object.keys(p.extraDetailsAr).length > 0) ? p.extraDetailsAr : p.extraDetails,
        };
      }
      return p;
    });
  }, [rawProjects, lang]);

  return (
    <DataContext.Provider
      value={{
        content,
        contentEn,
        contentAr,
        rawBlocks,
        projects,
        rawProjects,
        loading,
        refresh: fetchData,
        lang,
        setLang,
        toggleLang,
        t,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
