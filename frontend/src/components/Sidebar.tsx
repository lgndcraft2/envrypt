import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

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
                            <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
                                <span className="material-symbols-outlined text-white font-bold">shield</span>
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
                                AC
                            </div>
                            <span className="text-sm font-semibold">Acme Corp</span>
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
                    <div className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all cursor-pointer">
                        <span className="material-symbols-outlined">history</span>
                        <span className="text-sm font-medium">Audit Log</span>
                    </div>
                </nav>
                <div className="p-4 border-t border-[#1c2127]">
                    <div className="flex items-center gap-3 px-3 py-2 rounded text-slate-400 hover:text-slate-200 transition-all cursor-pointer">
                        <span className="material-symbols-outlined text-lg">settings</span>
                        <span className="text-sm font-medium">Settings</span>
                    </div>
                </div>

                {isSwitcherOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                            onClick={() => setIsSwitcherOpen(false)}
                        ></div>
                        <div className="absolute top-[80px] left-4 w-64 bg-[#111418] border border-primary/30 rounded-xl shadow-2xl z-50 glow-sm">
                            <div className="p-3 border-b border-[#1c2127]">
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-sm text-[#9dabb9]">search</span>
                                    <input className="w-full bg-[#1c2127] border-none rounded-lg pl-8 py-1.5 text-xs text-white placeholder-[#9dabb9] focus:ring-1 focus:ring-primary outline-none" placeholder="Search teams..." type="text" />
                                </div>
                            </div>
                            <div className="p-2 flex flex-col gap-1">
                                <p className="px-3 py-1 text-[10px] font-bold text-[#9dabb9] uppercase tracking-widest">Your Teams</p>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20 cursor-pointer group" onClick={() => setIsSwitcherOpen(false)}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded bg-primary flex items-center justify-center font-bold text-xs">AC</div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">Acme Corp</span>
                                            <span className="text-[10px] text-primary">Active Context</span>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1c2127] cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded bg-[#3b4754] flex items-center justify-center font-bold text-xs">SP</div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-[#9dabb9]">Side Project</span>
                                            <span className="text-[10px] text-[#5b6a79]">Personal Vault</span>
                                        </div>
                                    </div>
                                </div>
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
                    </>
                )}
            </aside>
        </>
    );
};

export default Sidebar;
