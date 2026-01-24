import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
    const { teams, activeTeam, setActiveTeam } = useTeam();

    const isActive = (path: string) => location.pathname === path;

    const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                ></div>
            )}

            <aside className={`
                fixed inset-y-0 left-0 w-64 border-r border-[#1c2127] bg-[#0d1218] flex flex-col h-full shrink-0 z-50 transition-transform duration-300 ease-in-out md:static md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <div className="size-8 text-primary">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">Envrypt</span>
                        </div>
                        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    {/* Active Team Selector Trigger */}
                    <div
                        onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                        className="flex items-center justify-between p-3 rounded bg-[#111820] border border-[#1c2127] hover:border-primary/50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center font-bold text-[10px] text-primary">
                                {activeTeam ? getInitials(activeTeam.name) : '??'}
                            </div>
                            <span className="text-sm font-semibold truncate max-w-[120px]">{activeTeam ? activeTeam.name : 'Select Team'}</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-500 text-sm">{isSwitcherOpen ? 'expand_less' : 'unfold_more'}</span>
                    </div>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    <div
                        onClick={() => { navigate('/dashboard'); onClose(); }}
                        className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-all ${isActive('/dashboard')
                            ? 'text-primary bg-primary/5 border-l-2 border-primary'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </div>
                    <div
                        onClick={() => { navigate('/vaults'); onClose(); }}
                        className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-all ${isActive('/vaults')
                            ? 'text-primary bg-primary/5 border-l-2 border-primary'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined">lock</span>
                        <span className="text-sm font-medium">Vaults</span>
                    </div>
                    <div
                        onClick={() => { navigate('/service-tokens'); onClose(); }}
                        className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-all ${isActive('/service-tokens')
                            ? 'text-primary bg-primary/5 border-l-2 border-primary'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined">key_visualizer</span>
                        <span className="text-sm font-medium">Service Tokens</span>
                    </div>
                    <div
                        onClick={() => { navigate('/audit-logs'); onClose(); }}
                        className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-all ${isActive('/audit-logs')
                            ? 'text-primary bg-primary/5 border-l-2 border-primary'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined">history_edu</span>
                        <span className="text-sm font-medium">Audit Log</span>
                    </div>
                </nav>
                <div className="p-4 border-t border-[#1c2127]">
                    <div
                        onClick={() => { navigate('/settings'); onClose(); }}
                        className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-all ${isActive('/settings')
                            ? 'text-primary bg-primary/5 border-l-2 border-primary'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">settings</span>
                        <span className="text-sm font-medium">Settings</span>
                    </div>
                </div>
            </aside>
            {/* Backdrop for Sidebar on Mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Team Switcher Modal - Moved outside aside to prevent transform containment */}
            {isSwitcherOpen && (
                <div className="fixed inset-0 z-[60] flex items-start justify-start pl-4 pt-[80px]">
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-[1px]"
                        onClick={() => setIsSwitcherOpen(false)}
                    ></div>
                    <div className="relative w-64 bg-[#111418] border border-primary/30 rounded-xl shadow-2xl z-50 glow-sm animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-3 border-b border-[#1c2127]">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-sm text-[#9dabb9]">search</span>
                                <input className="w-full bg-[#1c2127] border-none rounded-lg pl-8 py-1.5 text-xs text-white placeholder-[#9dabb9] focus:ring-1 focus:ring-primary outline-none" placeholder="Search teams..." type="text" />
                            </div>
                        </div>
                        <div className="p-2 flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                            <p className="px-3 py-1 text-[10px] font-bold text-[#9dabb9] uppercase tracking-widest">Your Teams</p>
                            {teams.map(team => (
                                <div
                                    key={team.id}
                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer group ${activeTeam?.id === team.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-[#1c2127] border border-transparent'}`}
                                    onClick={() => { setActiveTeam(team); setIsSwitcherOpen(false); }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded flex items-center justify-center font-bold text-xs ${activeTeam?.id === team.id ? 'bg-primary' : 'bg-[#3b4754]'}`}>
                                            {getInitials(team.name)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-medium ${activeTeam?.id === team.id ? '' : 'text-[#9dabb9]'}`}>{team.name}</span>
                                            {activeTeam?.id === team.id && <span className="text-[10px] text-primary">Active Context</span>}
                                        </div>
                                    </div>
                                    {activeTeam?.id === team.id && <span className="material-symbols-outlined text-primary text-lg">check_circle</span>}
                                </div>
                            ))}
                        </div>
                        <div className="h-px bg-[#1c2127] mx-2"></div>
                        <div className="p-2 flex flex-col gap-1">
                            <div onClick={() => { navigate('/create-team'); onClose(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-all cursor-pointer group">
                                <div className="h-8 w-8 rounded bg-[#1c2127] group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-lg">add</span>
                                </div>
                                <span className="text-sm font-medium">Create New Team</span>
                            </div>
                            <div onClick={() => { navigate('/join-team'); onClose(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1c2127] transition-all cursor-pointer group">
                                <div className="h-8 w-8 rounded bg-[#1c2127] flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-lg">group_add</span>
                                </div>
                                <span className="text-sm font-medium text-[#9dabb9]">Join Existing Team</span>
                            </div>
                        </div>
                        <div className="p-3 bg-[#1c2127]/30 rounded-b-xl border-t border-[#1c2127] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                                <span className="text-[10px] text-[#9dabb9] uppercase font-bold tracking-tighter">System Encrypted</span>
                            </div>
                            <span className="text-[10px] text-primary font-bold">V.2.4.0</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
