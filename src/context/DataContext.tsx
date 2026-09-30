import React, { createContext, useContext, useEffect, useState } from 'react';
import { Project, projects as defaultProjects } from '../data/projects';

type ContentMap = Record<string, string>;

interface DataContextType {
  content: ContentMap;
  projects: Project[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  content: {},
  projects: defaultProjects,
  loading: true,
  refresh: async () => {},
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentMap>({});
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // We will fallback to port 3001 if window.location is 5173
      const isDev = typeof window !== 'undefined' && window.location.port === '5173';
      const API_URL = isDev ? 'http://localhost:3001/api' : '/api';
      
      const [contentRes, projectsRes] = await Promise.all([
        fetch(`${API_URL}/content`),
        fetch(`${API_URL}/projects`)
      ]);

      if (contentRes.ok) {
        const contentData = await contentRes.json();
        const map: ContentMap = {};
        contentData.forEach((item: { id: string, value: string }) => {
          map[item.id] = item.value;
        });
        setContent(map);
      }
      
      if (projectsRes.ok) {
        const fetched = await projectsRes.json();
        if (Array.isArray(fetched) && fetched.length > 0) {
          setProjects(fetched.map((p: any) => ({
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

  return (
    <DataContext.Provider value={{ content, projects, loading, refresh: fetchData }}>
      {children}
    </DataContext.Provider>
  );
};
