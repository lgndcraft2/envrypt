import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import HeaderProfileDropdown from './HeaderProfileDropdown';
import { useNavigate } from 'react-router-dom';

const UserSettings: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'notifications'>('profile');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });
    }, []);

    const renderProfile = () => (
        <div className="max-w-3xl space-y-12 animate-in fade-in duration-500">
            <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="h-1 w-4 bg-primary rounded-full"></span>
                    Public Profile
                </h3>
                <div className="flex items-start gap-8 bg-[#111820]/40 border border-[#1c2127] p-6 rounded-lg">
                    <div className="relative group">
                        <div className="h-24 w-24 rounded-full border-2 border-primary/30 p-1">
                             {/* Use google avatar or initials */}
                             {user?.user_metadata?.avatar_url ? (
                                <img alt="Avatar" className="h-full w-full rounded-full object-cover" src={user.user_metadata.avatar_url} />
                             ) : (
                                <div className="h-full w-full rounded-full bg-slate-700 flex items-center justify-center text-3xl font-bold text-white">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </div>
                             )}
                        </div>
                        <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                                <div className="text-white font-semibold py-2 border-b border-[#1c2127]">{user?.user_metadata?.full_name || 'Not Set'}</div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                                <div className="text-primary font-mono py-2 border-b border-[#1c2127]">{user?.email}</div>
                            </div>
                        </div>
                        <button className="text-xs font-bold text-primary uppercase tracking-widest hover:text-primary/80 flex items-center gap-1 transition-colors">
                            Update profile details <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );

    const renderSecurity = () => (
        <div className="max-w-3xl space-y-12 animate-in fade-in duration-500">
            <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="h-1 w-4 bg-primary rounded-full"></span>
                    Security & Access
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-[#111820]/40 border border-[#1c2127] rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#ef4444]">vibration</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-white">Two-Factor Authentication (2FA)</span>
                                    <span className="px-2 py-0.5 bg-[#ef4444]/20 text-[#ef4444] text-[9px] font-bold uppercase tracking-tighter rounded border border-[#ef4444]/30">Disabled</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account.</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded text-[10px] font-bold uppercase tracking-widest transition-all glow-primary">
                            Setup 2FA
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-[#111820]/40 border border-[#1c2127] rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded bg-slate-800 border border-[#1c2127] flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-400">key</span>
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-white">Password</span>
                                <p className="text-xs text-slate-500 mt-0.5 font-mono italic">Last changed 3 months ago</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold uppercase tracking-widest border border-[#1c2127] transition-all">
                            Change Password
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );

    const renderPreferences = () => (
        <div className="max-w-3xl space-y-12 animate-in fade-in duration-500">
            <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="h-1 w-4 bg-primary rounded-full"></span>
                    Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-[#111820]/40 border border-[#1c2127] rounded-lg space-y-4">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Interface Theme</label>
                        <div className="flex gap-2">
                            <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded border border-primary bg-primary/10 transition-colors">
                                <span className="material-symbols-outlined text-primary">dark_mode</span>
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Dark</span>
                            </button>
                            <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded border border-[#1c2127] hover:border-slate-600 transition-colors opacity-50 cursor-not-allowed">
                                <span className="material-symbols-outlined text-slate-500">light_mode</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Light</span>
                            </button>
                            <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded border border-[#1c2127] hover:border-slate-600 transition-colors opacity-50 cursor-not-allowed">
                                <span className="material-symbols-outlined text-slate-500">desktop_windows</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System</span>
                            </button>
                        </div>
                    </div>
                    <div className="p-6 bg-[#111820]/40 border border-[#1c2127] rounded-lg flex flex-col justify-between">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 block">Code Editor</label>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <span className="text-sm font-semibold text-white">Use Ligatures</span>
                                <p className="text-xs text-slate-500">Enable advanced font features</p>
                            </div>
                            <button className="w-12 h-6 bg-primary rounded-full relative p-1 transition-colors">
                                <div className="h-4 w-4 bg-white rounded-full translate-x-6"></div>
                            </button>
                        </div>
                        <div className="mt-6 pt-4 border-t border-[#1c2127]/50 text-[10px] font-mono text-slate-600 italic">
                            Preview: =&gt; != ===
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return renderProfile();
            case 'security': return renderSecurity();
            case 'preferences': return renderPreferences();
            default: return renderProfile();
        }
    };

    return (
        <div className="bg-background-dark font-display text-slate-300 overflow-hidden h-screen w-full flex flex-col">
            {/* Sidebar removed - provided by layout */}

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[radial-gradient(circle_at_top_right,_#111820_0%,_#0a0f14_40%)]">
                <header className="h-20 border-b border-[#1c2127] flex items-center justify-between px-4 md:px-8 shrink-0 relative">
                    <div className="flex items-center gap-3">
                        <button
                            className="text-slate-400 hover:text-white mr-2"
                            onClick={() => navigate('/dashboard')}
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 mb-0.5 font-mono">
                                <span className="cursor-pointer hover:text-white" onClick={() => navigate('/dashboard')}>Home</span>
                                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                                <span className="text-primary font-bold">User Settings</span>
                            </div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Personal Account</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <HeaderProfileDropdown />
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    <aside className="w-56 border-r border-[#1c2127] bg-[#0a0f14]/50 flex flex-col shrink-0 hidden md:flex">
                        <nav className="p-4 space-y-1">
                            <div
                                onClick={() => navigate('/dashboard')}
                                className="w-full flex items-center px-4 py-2.5 rounded text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer mb-4"
                            >
                                <span className="material-symbols-outlined mr-2 text-lg">west</span>
                                Back to Dashboard
                            </div>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center px-4 py-2.5 rounded text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                    }`}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full flex items-center px-4 py-2.5 rounded text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                    }`}
                            >
                                Security
                            </button>
                            <button
                                onClick={() => setActiveTab('preferences')}
                                className={`w-full flex items-center px-4 py-2.5 rounded text-sm font-medium transition-all ${activeTab === 'preferences' ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                    }`}
                            >
                                Preferences
                            </button>
                            <button
                                className="w-full flex items-center px-4 py-2.5 rounded text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-not-allowed opacity-50"
                            >
                                Notifications
                            </button>
                        </nav>
                    </aside>

                    <div className="flex-1 overflow-auto bg-[#111820]/20 p-4 md:p-8">
                        {renderContent()}
                    </div>
                </div>

                <footer className="h-12 border-t border-[#1c2127] bg-[#111820] px-8 flex items-center justify-between shrink-0 font-mono hidden md:flex">
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                            <span>Security Status: Optimized</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] text-slate-500 uppercase">
                        <span>Session ID: ENV_8829_PX</span>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default UserSettings;
