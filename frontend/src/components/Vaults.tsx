import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Vaults: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="bg-background-dark font-display text-slate-200 overflow-hidden binary-bg h-screen w-full flex">
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#111820_0%,_#0a0f14_60%)]">
                <header className="h-20 border-b border-[#1c2127] flex items-center justify-between px-4 md:px-8 shrink-0 gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden text-slate-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 mb-0.5 font-mono">
                                <span>Acme Corp</span>
                                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                                <span className="text-primary">Vaults</span>
                            </div>
                            <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight">Vaults</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all glow-primary cursor-pointer">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Create Vault
                        </button>
                        <div className="h-9 w-9 rounded-full bg-slate-800 border border-[#1c2127] flex items-center justify-center overflow-hidden">
                            <span className="text-xs font-bold">JD</span>
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div className="group relative bg-[#111820] border border-[#1c2127] p-6 rounded-xl tech-border hover:border-primary/40 transition-all cursor-pointer glow-red">
                            <div className="flex justify-between items-start mb-6">
                                <div className="h-12 w-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                    <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                                </div>
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>
                            <div className="space-y-1 mb-6">
                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Backend - Production</h3>
                                <p className="text-xs text-slate-500 font-medium">High availability cluster</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-[#1c2127] pt-4">
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold font-mono text-white">24</span>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Secrets</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-600">Updated 2h ago</span>
                            </div>
                        </div>
                        <div className="group relative bg-[#111820] border border-[#1c2127] p-6 rounded-xl tech-border hover:border-primary/40 transition-all cursor-pointer glow-green">
                            <div className="flex justify-between items-start mb-6">
                                <div className="h-12 w-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                                    <span className="material-symbols-outlined text-2xl">science</span>
                                </div>
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>
                            <div className="space-y-1 mb-6">
                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Staging</h3>
                                <p className="text-xs text-slate-500 font-medium">Integration environment</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-[#1c2127] pt-4">
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold font-mono text-white">18</span>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Secrets</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-600">Updated 5h ago</span>
                            </div>
                        </div>
                        <div className="group relative bg-[#111820] border border-[#1c2127] p-6 rounded-xl tech-border hover:border-primary/40 transition-all cursor-pointer glow-blue">
                            <div className="flex justify-between items-start mb-6">
                                <div className="h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                                    <span className="material-symbols-outlined text-2xl">smartphone</span>
                                </div>
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>
                            <div className="space-y-1 mb-6">
                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Mobile App</h3>
                                <p className="text-xs text-slate-500 font-medium">iOS & Android keys</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-[#1c2127] pt-4">
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold font-mono text-white">5</span>
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Secrets</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-600">Updated 1d ago</span>
                            </div>
                        </div>
                        <button className="group relative border-2 border-dashed border-[#1c2127] p-6 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center min-h-[220px] cursor-pointer">
                            <div className="h-12 w-12 rounded-full border border-dashed border-slate-600 flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:border-primary transition-all mb-4">
                                <span className="material-symbols-outlined text-2xl font-light">add</span>
                            </div>
                            <span className="text-sm font-bold text-slate-500 group-hover:text-primary uppercase tracking-widest">New Vault</span>
                            <div className="absolute inset-0 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity flex items-center justify-center">

                            </div>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Vaults;
