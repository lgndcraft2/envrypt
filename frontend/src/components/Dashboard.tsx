import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Dashboard: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="bg-background-dark font-display text-white overflow-hidden h-screen w-full relative flex">
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#111820_0%,_#0a0f14_40%)] relative">
                <header className="h-20 border-b border-[#1c2127] flex items-center justify-between px-4 md:px-8 shrink-0 gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden text-slate-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">
                                <span>Acme Corp</span>
                                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                                <span className="text-primary">Overview</span>
                            </div>
                            <h2 className="text-lg md:text-xl font-bold text-white">Welcome back, Rose</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/20 glow-green">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter font-mono">System Operational • v2.4.0</span>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-slate-800 border border-[#1c2127] flex items-center justify-center overflow-hidden">
                            <span className="text-xs font-bold">JD</span>
                        </div>
                    </div>
                </header>
                <div className="p-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#111820] border border-[#1c2127] p-5 rounded-lg tech-border hover:border-primary/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Variables</span>
                                <span className="material-symbols-outlined text-teal-400">key</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold font-mono text-white">142</span>
                                <span className="text-[10px] text-teal-500 font-mono">+4 this week</span>
                            </div>
                        </div>
                        <div className="bg-[#111820] border border-[#1c2127] p-5 rounded-lg tech-border hover:border-primary/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Members</span>
                                <span className="material-symbols-outlined text-primary">group</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold font-mono text-white">8</span>
                                <span className="text-xs text-slate-500 font-mono">/ 20 slots</span>
                            </div>
                        </div>
                        <div className="bg-[#111820] border border-[#1c2127] p-5 rounded-lg tech-border hover:border-primary/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vault Health</span>
                                <span className="material-symbols-outlined text-green-500">shield</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold font-mono text-white">98%</span>
                                <span className="text-[10px] text-green-500 font-mono">OPTIMAL</span>
                            </div>
                        </div>
                    </div>
                    {/* Activity & Pinned */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Recent Audit Logs</h3>
                                <button className="text-[10px] font-bold text-primary hover:underline uppercase">View Full Log</button>
                            </div>
                            <div className="bg-[#111820] border border-[#1c2127] rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-900/50 border-b border-[#1c2127]">
                                            <tr>
                                                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter">Activity</th>
                                                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter">Timestamp</th>
                                                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#1c2127]">
                                            <tr className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(19,127,236,0.6)]"></div>
                                                        <span className="text-slate-200">Sarah J. revealed <span className="font-mono text-primary bg-primary/10 px-1 rounded">STRIPE_PROD_KEY</span></span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-500">2023-11-24 14:22:01</td>
                                                <td className="px-6 py-4 text-right"><span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold">SUCCESS</span></td>
                                            </tr>
                                            <tr className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 w-2 rounded-full bg-slate-600"></div>
                                                        <span className="text-slate-200">System updated <span className="font-mono text-slate-400 bg-slate-800 px-1 rounded">AWS_IAM_USER</span></span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-500">2023-11-24 13:45:12</td>
                                                <td className="px-6 py-4 text-right"><span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold">SUCCESS</span></td>
                                            </tr>
                                            <tr className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                                                        <span className="text-slate-200">Alex M. failed access to <span className="font-mono text-orange-400 bg-orange-500/10 px-1 rounded">DB_MASTER_PASS</span></span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-500">2023-11-24 12:10:55</td>
                                                <td className="px-6 py-4 text-right"><span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-bold">DENIED</span></td>
                                            </tr>
                                            <tr className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(19,127,236,0.6)]"></div>
                                                        <span className="text-slate-200">Rose rotated <span className="font-mono text-primary bg-primary/10 px-1 rounded">SENDGRID_API_V3</span></span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-slate-500">2023-11-24 10:05:30</td>
                                                <td className="px-6 py-4 text-right"><span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold">SUCCESS</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Pinned Vaults</h3>
                                <span className="material-symbols-outlined text-slate-500 text-sm">push_pin</span>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-[#111820] border border-[#1c2127] rounded-lg hover:border-primary/40 group cursor-pointer transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded bg-[#1c2127] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined">folder</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">Frontend Prod</span>
                                            <span className="text-[10px] text-slate-500 font-mono">24 SECRETS</span>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-600 group-hover:text-primary text-sm">arrow_forward_ios</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-[#111820] border border-[#1c2127] rounded-lg hover:border-primary/40 group cursor-pointer transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded bg-[#1c2127] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined">folder_shared</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">Backend Staging</span>
                                            <span className="text-[10px] text-slate-500 font-mono">18 SECRETS</span>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-600 group-hover:text-primary text-sm">arrow_forward_ios</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-[#111820] border border-[#1c2127] rounded-lg hover:border-primary/40 group cursor-pointer transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded bg-[#1c2127] flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined">key_visualizer</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">CI/CD Keys</span>
                                            <span className="text-[10px] text-slate-500 font-mono">5 SECRETS</span>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-600 group-hover:text-primary text-sm">arrow_forward_ios</span>
                                </div>
                                <button className="w-full py-3 border border-dashed border-[#1c2127] rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:border-primary hover:text-primary transition-all cursor-pointer">
                                    + Add Pin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
