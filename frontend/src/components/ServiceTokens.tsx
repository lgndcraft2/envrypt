import React, { useState } from 'react';
import Sidebar from './Sidebar';

const ServiceTokens: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

    return (
        <div className="bg-background-dark font-display text-slate-200 overflow-hidden binary-bg h-screen w-full flex">
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#111820_0%,_#0a0f14_60%)] relative">
                <header className="h-20 border-b border-[#1c2127] flex items-center justify-between px-4 md:px-8 shrink-0 bg-[#0a0f14]/80 backdrop-blur-md sticky top-0 z-20 gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden text-slate-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-0.5 font-mono">
                                <span>Access Management</span>
                                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                                <span className="text-primary">Tokens</span>
                            </div>
                            <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight">Service Tokens</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsGenerateModalOpen(true)}
                            className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-5 py-2.5 rounded flex items-center gap-2 transition-all glow-primary uppercase tracking-wider"
                        >
                            <span className="material-symbols-outlined text-sm">add_link</span>
                            <span className="hidden md:inline">Generate New Token</span>
                            <span className="md:hidden">New</span>
                        </button>
                        <div className="h-9 w-9 rounded bg-slate-800 border border-[#1c2127] flex items-center justify-center overflow-hidden">
                            <span className="text-xs font-bold">JD</span>
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 border border-[#1c2127] bg-[#111820]/30 rounded tech-border-b">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total Tokens</p>
                            <p className="text-xl font-mono text-white">12</p>
                        </div>
                        <div className="p-4 border border-[#1c2127] bg-[#111820]/30 rounded tech-border-b">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Active Now</p>
                            <p className="text-xl font-mono text-green-500">8</p>
                        </div>
                        <div className="p-4 border border-[#1c2127] bg-[#111820]/30 rounded tech-border-b">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Rotated (24h)</p>
                            <p className="text-xl font-mono text-primary">3</p>
                        </div>
                        <div className="p-4 border border-[#1c2127] bg-[#111820]/30 rounded tech-border-b">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Revoked (7d)</p>
                            <p className="text-xl font-mono text-red-400">2</p>
                        </div>
                    </div>

                    {/* Tokens Table */}
                    <div className="bg-[#111820] border border-[#1c2127] rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#1c2127] bg-slate-900/40">
                                        <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">Token Name</th>
                                        <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">Scope</th>
                                        <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">Last Used</th>
                                        <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1c2127]">
                                    <tr className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">GitHub Actions - Production</span>
                                                <div className="w-fit"><code className="token-prefix">env_live_p83...9x2</code></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary font-bold">READ: Production</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                                <span className="text-xs font-mono text-slate-300">2 mins ago</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-tighter">Active</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button className="px-3 py-1.5 text-[10px] font-bold border border-[#1c2127] rounded hover:bg-slate-800 transition-colors uppercase tracking-wider">Roll</button>
                                                <button className="px-3 py-1.5 text-[10px] font-bold border border-red-500/20 text-red-400 rounded hover:bg-red-500/10 transition-colors uppercase tracking-wider">Revoke</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">Vercel - Staging Deployment</span>
                                                <div className="w-fit"><code className="token-prefix">env_test_a11...4k0</code></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 flex-wrap">
                                                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400 font-bold">WRITE: Staging</span>
                                                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400 font-bold">READ: Global</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                                <span className="text-xs font-mono text-slate-300">14 mins ago</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-tighter">Active</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button className="px-3 py-1.5 text-[10px] font-bold border border-[#1c2127] rounded hover:bg-slate-800 transition-colors uppercase tracking-wider">Roll</button>
                                                <button className="px-3 py-1.5 text-[10px] font-bold border border-red-500/20 text-red-400 rounded hover:bg-red-500/10 transition-colors uppercase tracking-wider">Revoke</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors group opacity-70">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">Internal Analytics Scraper</span>
                                                <div className="w-fit"><code className="token-prefix">env_live_z99...d21</code></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/5 text-[10px] font-mono text-slate-400 font-bold">READ: Analytics</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-slate-600"></div>
                                                <span className="text-xs font-mono text-slate-500">6 days ago</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-tighter">Inactive</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button className="px-3 py-1.5 text-[10px] font-bold border border-[#1c2127] rounded hover:bg-slate-800 transition-colors uppercase tracking-wider">Roll</button>
                                                <button className="px-3 py-1.5 text-[10px] font-bold border border-red-500/20 text-red-400 rounded hover:bg-red-500/10 transition-colors uppercase tracking-wider">Revoke</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">Terraform Backend</span>
                                                <div className="w-fit"><code className="token-prefix">env_live_q31...0m7</code></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-500 font-bold">ADMIN: Infrastructure</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                                <span className="text-xs font-mono text-slate-300">Just now</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-tighter">Active</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button className="px-3 py-1.5 text-[10px] font-bold border border-[#1c2127] rounded hover:bg-slate-800 transition-colors uppercase tracking-wider">Roll</button>
                                                <button className="px-3 py-1.5 text-[10px] font-bold border border-red-500/20 text-red-400 rounded hover:bg-red-500/10 transition-colors uppercase tracking-wider">Revoke</button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-[#1c2127] bg-slate-900/20 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Showing 1-4 of 12 Service Tokens</span>
                            <div className="flex gap-2">
                                <button className="p-1 text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                                </button>
                                <button className="p-1 text-slate-500 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Generation Modal */}
            {isGenerateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
                    <div className="max-w-2xl w-full bg-[#0d1218] border border-[#1c2127] rounded-2xl glow-modal overflow-hidden flex flex-col tech-border relative">
                        {/* Tech border element is simulated via CSS class but might need explicit extra elements if CSS pseudo doesn't work perfectly in this context, but we added it to index.css */}
                        <div className="px-8 pt-8 pb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 bg-green-500/10 border border-green-500/20 rounded flex items-center justify-center text-green-500">
                                    <span className="material-symbols-outlined">check_circle</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">Token Generated Successfully</h3>
                                    <p className="text-slate-400 text-sm">Your new service token is ready to use.</p>
                                </div>
                            </div>
                        </div>
                        <div className="mx-8 mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
                            <span className="material-symbols-outlined text-amber-500 mt-0.5">warning</span>
                            <p className="text-amber-200 text-sm leading-relaxed font-medium">
                                Copy this now. We do not store this token, so you will never see it again. If you lose it, you'll need to regenerate a new one.
                            </p>
                        </div>
                        <div className="px-8 mb-8">
                            <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">New Token Value</label>
                            <div className="relative group">
                                <div className="w-full bg-black border border-[#1c2127] rounded-xl p-6 font-mono text-lg text-primary break-all selection:bg-primary selection:text-white">
                                    env_live_9823489234_xk92_v91m_5v7z_9921_pq2l_0101
                                </div>
                                <div className="absolute top-3 right-3">
                                    <span className="material-symbols-outlined text-slate-700 text-lg">content_copy</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-8 pb-8 flex items-center gap-4">
                            <button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all glow-primary cursor-pointer">
                                <span className="material-symbols-outlined text-lg">content_copy</span>
                                Copy Token
                            </button>
                            <button
                                onClick={() => setIsGenerateModalOpen(false)}
                                className="px-8 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-all border border-[#1c2127] cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceTokens;
