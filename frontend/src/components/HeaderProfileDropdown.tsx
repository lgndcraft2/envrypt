import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const HeaderProfileDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string>('Loading...');
    const [userInitial, setUserInitial] = useState<string>('?');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && user.email) {
                setUserEmail(user.email);
                setUserInitial(user.email.charAt(0).toUpperCase());
            }
        };
        fetchUser();
    }, []);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNavigate = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/auth'); // Redirect to auth page after logout
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-9 w-9 rounded-full bg-slate-800 border border-[#1c2127] flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
            >
                {/* Fallback avatar with initial if no image is available (common in Supabase auth if no metadata) */}
                <div className="text-white font-medium text-sm">{userInitial}</div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#111820] border border-[#1c2127] rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-[#1c2127]">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate" title={userEmail}>{userEmail}</p>
                    </div>
                    <div className="py-1">
                        <button
                            onClick={() => handleNavigate('/profile')}
                            className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-[#1c2127] hover:text-white transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">person</span>
                            Your Profile
                        </button>
                    </div>
                    <div className="border-t border-[#1c2127] py-1">
                        <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-[#1c2127] hover:text-red-300 transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">logout</span>
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderProfileDropdown;
