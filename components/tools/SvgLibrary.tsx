import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context';
import { ShapesIcon, BackIcon } from '../Icons';

interface SvgLibraryProps {
  onClose?: () => void;
}

type IconCategory = 'Interface' | 'Arrows' | 'Communication' | 'Media' | 'Development' | 'Weather' | 'Commerce' | 'Devices' | 'Editor';

interface IconDef {
  name: string;
  category: IconCategory;
  path: string;
}

// Comprehensive Icon Dataset (Lucide/Feather style, 24x24, stroke 2)
const iconSet: IconDef[] = [
  // Interface
  { name: 'Home', category: 'Interface', path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Menu', category: 'Interface', path: 'M4 6h16M4 12h16M4 18h16' },
  { name: 'X', category: 'Interface', path: 'M6 18L18 6M6 6l12 12' },
  { name: 'Check', category: 'Interface', path: 'M5 13l4 4L19 7' },
  { name: 'Search', category: 'Interface', path: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { name: 'User', category: 'Interface', path: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z' },
  { name: 'Users', category: 'Interface', path: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.87M23 7a4 4 0 01-4.73 3.5' },
  { name: 'Settings', category: 'Interface', path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { name: 'Bell', category: 'Interface', path: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0' },
  { name: 'Calendar', category: 'Interface', path: 'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 0V2m-14 2V2m0 8h14' },
  { name: 'Trash', category: 'Interface', path: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6' },
  { name: 'Edit', category: 'Interface', path: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z' },
  { name: 'Plus', category: 'Interface', path: 'M12 5v14M5 12h14' },
  { name: 'Minus', category: 'Interface', path: 'M5 12h14' },
  { name: 'Info', category: 'Interface', path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { name: 'Alert', category: 'Interface', path: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01' },
  { name: 'Lock', category: 'Interface', path: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a7 7 0 00-14 0v2' },
  { name: 'Unlock', category: 'Interface', path: 'M7 11V7a5 5 0 0110 0v4M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z' },
  { name: 'Eye', category: 'Interface', path: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z' },
  { name: 'Eye Off', category: 'Interface', path: 'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22' },
  { name: 'Share', category: 'Interface', path: 'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13' },
  { name: 'Link', category: 'Interface', path: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71' },
  { name: 'Download', category: 'Interface', path: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3' },
  { name: 'Upload', category: 'Interface', path: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12' },
  { name: 'Clock', category: 'Interface', path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2' },
  { name: 'Star', category: 'Interface', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { name: 'Heart', category: 'Interface', path: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z' },

  // Arrows
  { name: 'Arrow Right', category: 'Arrows', path: 'M5 12h14M12 5l7 7-7 7' },
  { name: 'Arrow Left', category: 'Arrows', path: 'M19 12H5M12 19l-7-7 7-7' },
  { name: 'Arrow Up', category: 'Arrows', path: 'M12 19V5M5 12l7-7 7 7' },
  { name: 'Arrow Down', category: 'Arrows', path: 'M12 5v14M19 12l-7 7-7-7' },
  { name: 'Chevron Right', category: 'Arrows', path: 'M9 18l6-6-6-6' },
  { name: 'Chevron Left', category: 'Arrows', path: 'M15 18l-6-6 6-6' },
  { name: 'Chevron Up', category: 'Arrows', path: 'M18 15l-6-6-6 6' },
  { name: 'Chevron Down', category: 'Arrows', path: 'M6 9l6 6 6-6' },
  { name: 'Chevrons Right', category: 'Arrows', path: 'M13 17l5-5-5-5M6 17l5-5-5-5' },
  { name: 'Chevrons Left', category: 'Arrows', path: 'M11 17l-5-5 5-5M18 17l-5-5 5-5' },
  { name: 'Refresh', category: 'Arrows', path: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15' },
  { name: 'Rotate CW', category: 'Arrows', path: 'M23 4v6h-6M20.49 15a9 9 0 11-2.12-9.36L23 10' },
  { name: 'Rotate CCW', category: 'Arrows', path: 'M1 4v6h6M3.51 15a9 9 0 102.13-9.36L1 10' },
  { name: 'Undo', category: 'Arrows', path: 'M1 4v6h6M3.51 15a9 9 0 102.13-9.36L1 10' }, // Reusing Rotate CCW visual
  { name: 'External Link', category: 'Arrows', path: 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3' },

  // Communication
  { name: 'Mail', category: 'Communication', path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6' },
  { name: 'Message', category: 'Communication', path: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
  { name: 'Phone', category: 'Communication', path: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.12 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z' },
  { name: 'Send', category: 'Communication', path: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' },
  { name: 'Paperclip', category: 'Communication', path: 'M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48' },
  { name: 'At Sign', category: 'Communication', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' }, // Corrected At Sign visual
  
  // Media
  { name: 'Play', category: 'Media', path: 'M5 3l14 9-14 9V3z' },
  { name: 'Pause', category: 'Media', path: 'M6 4h4v16H6zm8 0h4v16h-4z' },
  { name: 'Stop', category: 'Media', path: 'M5 5h14v14H5z' },
  { name: 'Fast Forward', category: 'Media', path: 'M13 19l9-7-9-7v14zM2 19l9-7-9-7v14z' },
  { name: 'Rewind', category: 'Media', path: 'M11 19l-9-7 9-7v14zM22 19l-9-7 9-7v14z' },
  { name: 'Volume', category: 'Media', path: 'M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14' },
  { name: 'Mute', category: 'Media', path: 'M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6' },
  { name: 'Camera', category: 'Media', path: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 13a4 4 0 100 8 4 4 0 000-8z' },
  { name: 'Image', category: 'Media', path: 'M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 13.5l2.5 3 5-6 5 6M8.5 13.5l-3.5 4.5' },
  { name: 'Video', category: 'Media', path: 'M23 7l-7 5 7 5V7zM14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z' },
  { name: 'Music', category: 'Media', path: 'M9 18V5l12-2v13M9 9l12-2M6 18a3 3 0 100-6 3 3 0 000 6zm12 0a3 3 0 100-6 3 3 0 000 6z' },
  { name: 'Mic', category: 'Media', path: 'M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8' },

  // Development
  { name: 'Code', category: 'Development', path: 'M16 18l6-6-6-6M8 6l-6 6 6 6' },
  { name: 'Terminal', category: 'Development', path: 'M4 17l6-6-6-6M12 19h8' },
  { name: 'Database', category: 'Development', path: 'M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M21 5c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5' },
  { name: 'Server', category: 'Development', path: 'M2 14h20M2 8h20M2 20h20M2 14v6a2 2 0 002 2h16a2 2 0 002-2v-6M2 8v6M2 8V4a2 2 0 002-2h16a2 2 0 002 2v4' },
  { name: 'CPU', category: 'Development', path: 'M4 4h16v16H4zM9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3' },
  { name: 'Git Branch', category: 'Development', path: 'M6 3v12M18 9a9 9 0 01-9 9M6 20a3 3 0 100-6 3 3 0 000 6zm12-12a3 3 0 100-6 3 3 0 000 6z' },
  { name: 'Git Merge', category: 'Development', path: 'M18 15a3 3 0 100 6 3 3 0 000-6zm0 0V9a9 9 0 00-9-9M6 15a3 3 0 100 6 3 3 0 000-6zm0 0V3' },
  { name: 'Bug', category: 'Development', path: 'M12 23V11M8 23v-5M16 23v-5M8 6h8M12 6a4 4 0 00-4 4v5h8v-5a4 4 0 00-4-4zM6 13H2M6 17H2M18 13h4M18 17h4' },

  // Weather
  { name: 'Sun', category: 'Weather', path: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 100-10 5 5 0 000 10z' },
  { name: 'Moon', category: 'Weather', path: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z' },
  { name: 'Cloud', category: 'Weather', path: 'M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z' },
  { name: 'Rain', category: 'Weather', path: 'M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25' },
  { name: 'Lightning', category: 'Weather', path: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  { name: 'Wind', category: 'Weather', path: 'M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2' },

  // Commerce
  { name: 'Shopping Cart', category: 'Commerce', path: 'M9 20a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2zm-7-2h8a2 2 0 001.95-1.57l2.1-9.45H5.25L4.5 3H2v2h1.5l2.8 13.1a2 2 0 001.95 1.9z' },
  { name: 'Credit Card', category: 'Commerce', path: 'M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zM1 10h22M1 14h22' },
  { name: 'Dollar', category: 'Commerce', path: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
  { name: 'Tag', category: 'Commerce', path: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01' },
  { name: 'Briefcase', category: 'Commerce', path: 'M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z' },
  { name: 'Gift', category: 'Commerce', path: 'M20 12v10H4V12M2 7h20v5H2V7zm10 0v15M20 7H4c-1.1 0-2-.9-2-2s.9-2 2-2h16c1.1 0 2 .9 2 2s-.9 2-2 2z' },

  // Devices
  { name: 'Smartphone', category: 'Devices', path: 'M5 2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2zm7 16h.01' },
  { name: 'Tablet', category: 'Devices', path: 'M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm8 16h.01' },
  { name: 'Monitor', category: 'Devices', path: 'M2 3h20v14H2V3zm6 18h8m-4-4v4' },
  { name: 'Laptop', category: 'Devices', path: 'M2 16h20M2 16v-9a2 2 0 012-2h16a2 2 0 012 2v9M1 16h22v2a2 2 0 01-2 2H3a2 2 0 01-2-2v-2z' },
  { name: 'Wifi', category: 'Devices', path: 'M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01' },
  { name: 'Battery', category: 'Devices', path: 'M23 13v-2M1 6v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H3a2 2 0 00-2 2zM5 10v4' },
  { name: 'Bluetooth', category: 'Devices', path: 'M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11' },

  // Editor
  { name: 'Bold', category: 'Editor', path: 'M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z' },
  { name: 'Italic', category: 'Editor', path: 'M19 4h-9M14 20H5M15 4L9 20' },
  { name: 'Underline', category: 'Editor', path: 'M6 3v7a6 6 0 006 6 6 6 0 006-6V3M4 21h16' },
  { name: 'List', category: 'Editor', path: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
  { name: 'Align Left', category: 'Editor', path: 'M17 10H3M21 6H3M21 14H3M17 18H3' },
  { name: 'Align Center', category: 'Editor', path: 'M18 10H6M21 6H3M21 14H3M18 18H6' },
  { name: 'Align Right', category: 'Editor', path: 'M21 10H7M21 6H3M21 14H3M21 18H7' },
  { name: 'Type', category: 'Editor', path: 'M4 7V4h16v3M9 20h6M12 4v16' },
];

export const SvgLibrary: React.FC<SvgLibraryProps> = ({ onClose }) => {
  const { t } = useAppContext();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<IconCategory | 'All'>('All');
  const [mode, setMode] = useState<'copy-svg' | 'copy-jsx' | 'download'>('copy-svg');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(iconSet.map(i => i.category));
    return ['All', ...Array.from(cats)] as (IconCategory | 'All')[];
  }, []);

  const filteredIcons = useMemo(() => {
    return iconSet.filter(icon => {
      const matchesSearch = icon.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || icon.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const handleAction = (icon: typeof iconSet[0]) => {
    // Logic for Downloading File
    if (mode === 'download') {
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n  <path d="${icon.path}" />\n</svg>`;
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${icon.name.toLowerCase().replace(/\s+/g, '-')}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show feedback
      setCopiedId(icon.name);
      setTimeout(() => setCopiedId(null), 1000);
      return;
    }

    // Logic for Copying Text
    let content = '';
    if (mode === 'copy-svg') {
      content = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n  <path d="${icon.path}" />\n</svg>`;
    } else {
      content = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-${icon.name.toLowerCase().replace(/\s+/g, '-')}">\n  <path d="${icon.path}" />\n</svg>`;
    }

    navigator.clipboard.writeText(content);
    setCopiedId(icon.name);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
      
      {/* Header */}
      <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="text-cyan-600 dark:text-cyan-400 p-1.5 bg-cyan-100/50 dark:bg-cyan-900/20 rounded-lg">
            <ShapesIcon className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-wide">
            {t.svgTitle}
          </h2>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-all"
            aria-label="Close"
          >
            <BackIcon className="w-5 h-5 rtl:rotate-180" />
          </button>
        )}
      </div>

      {/* Toolbar & Category Nav */}
      <div className="flex flex-col border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1120]">
         
         {/* Top Controls */}
         <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder={t.svgSearch}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800 dark:text-white"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>

            <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                <button 
                  onClick={() => setMode('copy-svg')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'copy-svg' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' : 'text-slate-500'}`}
                >
                  {t.svgCopySVG}
                </button>
                <button 
                  onClick={() => setMode('copy-jsx')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'copy-jsx' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' : 'text-slate-500'}`}
                >
                  {t.svgCopyJSX}
                </button>
                <button 
                  onClick={() => setMode('download')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'download' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' : 'text-slate-500'}`}
                >
                  {t.svgDownload}
                </button>
            </div>
         </div>

         {/* Categories - Horizontal Scroll */}
         <div className="px-4 pb-3 overflow-x-auto no-scrollbar flex gap-2">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                        activeCategory === cat 
                        ? 'bg-cyan-600 text-white border-cyan-600' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-cyan-300'
                    }`}
                >
                    {cat}
                </button>
            ))}
         </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-[#0F172A]">
         <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {filteredIcons.map((icon, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleAction(icon)}
                  className="group relative flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-lg transition-all aspect-square"
                  title={mode === 'download' ? `Download ${icon.name}.svg` : `Copy ${icon.name}`}
                >
                   {copiedId === icon.name ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyan-50 dark:bg-cyan-900/50 rounded-2xl text-cyan-600 dark:text-cyan-400 animate-fade-in-up">
                         <span className="text-xl mb-1">✓</span>
                         <span className="font-bold text-[10px]">{mode === 'download' ? t.svgDownloaded : t.svgCopied}</span>
                      </div>
                   ) : (
                      <>
                        <svg 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="w-8 h-8 text-slate-600 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"
                        >
                           <path d={icon.path} />
                        </svg>
                        <span className="mt-3 text-[10px] font-medium text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors truncate w-full text-center">
                           {icon.name}
                        </span>
                      </>
                   )}
                </button>
            ))}
         </div>

         {filteredIcons.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 min-h-[200px]">
               <span className="text-4xl mb-2">📦</span>
               <p>{t.svgNoResults}</p>
            </div>
         )}
         
         <div className="mt-8 text-center text-xs text-slate-400">
            {filteredIcons.length} {t.svgIconsCount}
         </div>
      </div>

    </div>
  );
};