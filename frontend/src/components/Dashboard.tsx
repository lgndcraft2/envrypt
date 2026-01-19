import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import HeaderProfileDropdown from './HeaderProfileDropdown';
import { useTeam } from '../contexts/TeamContext';
import { api } from '../lib/api';

const Dashboard: React.FC = () => {
    const { setIsMobileMenuOpen } = useOutletContext<any>();
    const { activeTeam } = useTeam();
    const navigate = useNavigate();
    const [recentLogs, setRecentLogs] = useState<any[]>([]);
    const [stats, setStats] = useState<{active_variables: number, active_members: number} | null>(null);

    useEffect(() => {
        if (activeTeam) {
            // Fetch 5 recent logs
            api.get<any[]>(`/audit-logs?team_id=${activeTeam.id}&limit=5`)
               .then(data => {
                   if (Array.isArray(data)) setRecentLogs(data.slice(0, 5)); 
               })
               .catch(err => console.error("Failed to fetch dashboard logs", err));

            // Fetch Stats
            api.get<any>(`/auth/teams/${activeTeam.id}/stats`)
               .then(data => setStats(data))
               .catch(err => console.error("Failed to fetch stats", err));
        }
    }, [activeTeam]);

    return (
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#111820_0%,_#0a0f14_40%)] relative h-full">
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
                            <span>{activeTeam?.name || 'No Team Selected'}</span>
                            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                            <span className="text-primary">Overview</span>
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-white">Welcome back</h2>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/20 glow-green">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter font-mono">System Operational • v2.4.0</span>
                    </div>
                    <HeaderProfileDropdown />
                </div>
            </header>
            <div className="p-8 space-y-8">
                {/* Stats Grid */}
                {activeTeam ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#111820] border border-[#1c2127] p-5 rounded-lg tech-border hover:border-primary/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Variables</span>
                                <span className="material-symbols-outlined text-teal-400">key</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold font-mono text-white">
                                    {stats ? stats.active_variables : '--'}
                                </span>
                                <span className="text-[10px] text-teal-500 font-mono">ENCRYPTED</span>
                            </div>
                        </div>
                        <div className="bg-[#111820] border border-[#1c2127] p-5 rounded-lg tech-border hover:border-primary/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Members</span>
                                <span className="material-symbols-outlined text-primary">group</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold font-mono text-white">
                                    {stats ? stats.active_members : '--'}
                                </span>
                                <span className="text-xs text-slate-500 font-mono">/ 20 slots</span>
                            </div>
                        </div>
                        <div className="bg-[#111820] border border-[#1c2127] p-5 rounded-lg tech-border hover:border-primary/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vault Health</span>
                                <span className="material-symbols-outlined text-green-500">shield</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold font-mono text-white">100%</span>
                                <span className="text-[10px] text-green-500 font-mono">OPTIMAL</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-500">
                        Please select or create a team to view stats.
                    </div>
                )}

                {/* Activity & Pinned */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Recent Audit Logs</h3>
                            <button onClick={() => navigate('/audit-logs')} className="text-[10px] font-bold text-primary hover:underline uppercase">View Full Log</button>
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
                                    <tbody className="divide-y divide-[#1c2127] font-mono">
                                        {recentLogs.length === 0 ? (
                                            <tr><td colSpan={3} className="px-6 py-4 text-center text-slate-500">No recent activity</td></tr>
                                        ) : (
                                            recentLogs.map((log: any) => (
                                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-2 w-2 rounded-full shadow-[0_0_8px_rgba(19,127,236,0.6)] ${
                                                                log.action === 'REVEALED' ? 'bg-blue-500' : 
                                                                log.action === 'CREATED' ? 'bg-green-500' : 'bg-slate-500'
                                                            }`}></div>
                                                            <div className="flex flex-col">
                                                                <span className="text-slate-300 font-bold">{log.action}</span>
                                                                <span className="text-slate-500 text-[10px] truncate max-w-[200px]">{log.description}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-400">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                         <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">LOGGED</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
