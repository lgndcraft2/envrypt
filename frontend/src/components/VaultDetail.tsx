import React, { useState } from 'react';
import Sidebar from './Sidebar';

const VaultDetail: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAddSecretModalOpen, setIsAddSecretModalOpen] = useState(false);

    return (
        <div className="bg-background-dark font-display text-slate-200 overflow-hidden binary-bg h-screen w-full flex">
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#111820_0%,_#0a0f14_60%)] relative">
                {/* Header */}
                <header className="sticky top-0 z-20 bg-[#0a0f14]/80 backdrop-blur-md border-b border-[#1c2127] px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden text-slate-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-0.5 font-mono">
                                <span>Vaults</span>
                                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                                <span className="text-primary">Backend - Production</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-xl md:text-2xl">rocket_launch</span>
                                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Backend - Production</h2>
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20 uppercase">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Encrypted
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block relative w-full max-w-sm">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
                            <input className="w-64 pl-10 pr-4 py-2 bg-[#1c2127] border border-transparent focus:border-primary/50 focus:ring-0 rounded-lg text-sm text-white placeholder-slate-500 transition-all outline-none" placeholder="Search secrets..." type="text" />
                        </div>
                        <button
                            onClick={() => setIsAddSecretModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all whitespace-nowrap glow-primary"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            <span>Add Secret</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="p-4 md:p-8 flex-1">
                    <div className="bg-[#111820] rounded-xl border border-[#1c2127] overflow-hidden shadow-2xl shadow-black/20">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900/40 border-b border-[#1c2127]">
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                            <div className="flex items-center gap-2 cursor-pointer hover:text-slate-300 transition-colors">
                                                Name <span className="material-symbols-outlined text-xs">unfold_more</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Value</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                            <div className="flex items-center gap-2 cursor-pointer hover:text-slate-300 transition-colors">
                                                Last Updated <span className="material-symbols-outlined text-xs">unfold_more</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1c2127]">
                                    {/* Secret Row 1 */}
                                    <tr className="group hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-primary/60 text-lg">key</span>
                                                <span className="font-mono text-sm font-medium tracking-tight text-white">STRIPE_API_KEY</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
                                                <span className="font-mono text-sm text-slate-500 tracking-widest">••••••••••••••••••••</span>
                                                <button className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-primary/20 hover:text-primary transition-all">
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </button>
                                                <button className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-primary/20 hover:text-primary transition-all">
                                                    <span className="material-symbols-outlined text-lg">content_copy</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-300">3h ago</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[10px]">person</span> Rose
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-500 hover:text-primary transition-colors" title="Edit Secret">
                                                    <span className="material-symbols-outlined text-xl">edit_square</span>
                                                </button>
                                                <button className="p-2 text-slate-500 hover:text-primary transition-colors" title="View History">
                                                    <span className="material-symbols-outlined text-xl">history</span>
                                                </button>
                                                <button className="p-2 text-slate-500 hover:text-red-500 transition-colors" title="Delete Secret">
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Secret Row 2 (Revealed Glow State) */}
                                    <tr className="group bg-primary/5 secret-glow transition-all border-y border-primary/40">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-primary text-lg">key</span>
                                                <span className="font-mono text-sm font-bold tracking-tight text-primary">DATABASE_URL</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-sm text-primary tracking-tight font-medium bg-primary/10 px-2 py-0.5 rounded break-all">postgres://u:p@db.prod.internal:5432/main</span>
                                                <button className="size-8 rounded-lg flex items-center justify-center text-primary bg-primary/20 shrink-0">
                                                    <span className="material-symbols-outlined text-lg">visibility_off</span>
                                                </button>
                                                <div className="relative">
                                                    <button className="size-8 rounded-lg flex items-center justify-center text-primary bg-primary/20 shrink-0">
                                                        <span className="material-symbols-outlined text-lg">content_copy</span>
                                                    </button>
                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                                        Copied!
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-300">1d ago</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[10px]">person</span> Alex
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-xl">edit_square</span>
                                                </button>
                                                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-xl">history</span>
                                                </button>
                                                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Secret Row 3 */}
                                    <tr className="group hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-primary/60 text-lg">key</span>
                                                <span className="font-mono text-sm font-medium tracking-tight text-white">AWS_SECRET_ACCESS_KEY</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
                                                <span className="font-mono text-sm text-slate-500 tracking-widest">••••••••••••••••••••</span>
                                                <button className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-primary/20 hover:text-primary transition-all">
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </button>
                                                <button className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-primary/20 hover:text-primary transition-all">
                                                    <span className="material-symbols-outlined text-lg">content_copy</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-300">5m ago</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[10px]">memory</span> System
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-500 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-xl">edit_square</span>
                                                </button>
                                                <button className="p-2 text-slate-500 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-xl">history</span>
                                                </button>
                                                <button className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Secret Row 4 */}
                                    <tr className="group hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-primary/60 text-lg">key</span>
                                                <span className="font-mono text-sm font-medium tracking-tight text-white">SENDGRID_API_KEY</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
                                                <span className="font-mono text-sm text-slate-500 tracking-widest">••••••••••••••••••••</span>
                                                <button className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-primary/20 hover:text-primary transition-all">
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </button>
                                                <button className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-primary/20 hover:text-primary transition-all">
                                                    <span className="material-symbols-outlined text-lg">content_copy</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-300">2d ago</span>
                                                <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[10px]">person</span> Rose
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-500 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-xl">edit_square</span>
                                                </button>
                                                <button className="p-2 text-slate-500 hover:text-primary transition-colors">
                                                    <span className="material-symbols-outlined text-xl">history</span>
                                                </button>
                                                <button className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* Table Footer */}
                            <div className="px-6 py-4 bg-slate-900/30 border-t border-[#1c2127] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-medium text-slate-500">Total 24 Secrets</span>
                                    <div className="h-4 w-px bg-[#1c2127]"></div>
                                    <span className="text-xs font-medium text-slate-500">Showing 1-10</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="size-8 rounded border border-[#1c2127] flex items-center justify-center text-slate-400 hover:bg-white/5 transition-colors">
                                        <span className="material-symbols-outlined text-base">chevron_left</span>
                                    </button>
                                    <button className="size-8 rounded bg-primary text-white text-xs font-bold">1</button>
                                    <button className="size-8 rounded border border-[#1c2127] text-slate-500 text-xs font-medium hover:bg-white/5 transition-colors">2</button>
                                    <button className="size-8 rounded border border-[#1c2127] text-slate-500 text-xs font-medium hover:bg-white/5 transition-colors">3</button>
                                    <button className="size-8 rounded border border-[#1c2127] flex items-center justify-center text-slate-400 hover:bg-white/5 transition-colors">
                                        <span className="material-symbols-outlined text-base">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Float Status */}
                <div className="fixed bottom-6 right-8 bg-[#161b22]/80 backdrop-blur-xl border border-primary/30 rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl z-30">
                    <span className="material-symbols-outlined text-primary text-sm animate-pulse">check_circle</span>
                    <span className="text-[11px] font-bold tracking-widest text-slate-300 uppercase">Live Security Monitoring Active</span>
                    <div className="h-3 w-px bg-slate-700"></div>
                    <span className="text-[11px] font-medium text-slate-500">AES-256-GCM</span>
                </div>
            </main>

            {/* Add Secret Modal */}
            {isAddSecretModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-xl bg-[#0d1218] border border-[#1c2127] rounded-xl overflow-hidden glow-modal flex flex-col tech-border shadow-2xl">
                        <div className="px-6 py-4 border-b border-[#1c2127] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-xl">key_visualizer</span>
                                </div>
                                <h3 className="text-lg font-bold text-white tracking-tight">Add New Secret</h3>
                            </div>
                            <button
                                onClick={() => setIsAddSecretModalOpen(false)}
                                className="p-1 hover:bg-white/5 rounded transition-colors text-slate-500 hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 block">Secret Name</label>
                                <input className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-3 text-sm font-mono text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none" placeholder="e.g., DATABASE_URL" type="text" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 block">Secret Value</label>
                                    <button className="flex items-center gap-1.5 text-[10px] text-primary hover:text-primary/80 transition-colors uppercase font-bold">
                                        <span className="material-symbols-outlined text-sm">visibility_off</span>
                                        Mask Input
                                    </button>
                                </div>
                                <div className="relative group">
                                    <textarea className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-3 text-sm font-mono text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none resize-none" placeholder="Enter sensitive value..." rows={4}></textarea>
                                    <div className="absolute bottom-3 right-3 opacity-20 group-focus-within:opacity-40 pointer-events-none transition-opacity">
                                        <span className="font-mono text-[10px] text-slate-500 select-none">AES-256-GCM</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 block">Target Vault</label>
                                    <div className="relative">
                                        <select className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-3 text-sm font-medium text-white appearance-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none cursor-pointer">
                                            <option>Backend - Production</option>
                                            <option>Staging</option>
                                            <option>Mobile App</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-sm">expand_more</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 block">Description (Optional)</label>
                                    <input className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-3 text-sm font-medium text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary/50 focus:border-primary/50 outline-none" placeholder="Add context..." type="text" />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-5 bg-[#111820]/50 border-t border-[#1c2127] flex items-center justify-end gap-3">
                            <button
                                onClick={() => setIsAddSecretModalOpen(false)}
                                className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsAddSecretModalOpen(false)}
                                className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-6 py-2 rounded-lg transition-all glow-primary uppercase tracking-wider flex items-center gap-2"
                            >
                                Create Secret
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VaultDetail;
