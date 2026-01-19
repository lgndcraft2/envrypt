import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import HeaderProfileDropdown from './HeaderProfileDropdown';
import { useTeam } from '../contexts/TeamContext';
import { api } from '../lib/api';

interface LogDetails {
    [key: string]: any;
}

interface LogEntry {
    id: string;
    created_at: string;
    actor_name: string;
    actor_type: 'bot' | 'user' | 'system';
    actor_avatar?: string | null;
    action: string;
    description: string;
    ip_address?: string;
    request_method?: string;
    metadata: LogDetails;
    user_agent?: string;
}

const LogRow: React.FC<{
    log: LogEntry;
    isExpanded: boolean;
    onToggle: () => void;
}> = ({ log, isExpanded, onToggle }) => (
    <>
        <tr
            className={`hover:bg-primary/5 transition-colors group cursor-pointer border-l-2 ${isExpanded ? 'bg-primary/5 border-primary' : 'border-transparent hover:border-primary'}`}
            onClick={onToggle}
        >
            <td className={`px-6 py-4 whitespace-nowrap ${isExpanded ? 'text-slate-400' : 'text-slate-500'}`}>
                {new Date(log.created_at).toLocaleString()}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    {log.actor_type === 'bot' ? (
                        <div className="h-5 w-5 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-500 text-sm">smart_toy</span>
                        </div>
                    ) : (
                        <div className={`h-5 w-5 rounded-full border border-border-color flex items-center justify-center bg-slate-800 ${log.actor_type === 'system' ? 'grayscale' : ''}`}>
                             <span className="text-[10px] text-slate-400 font-bold">{log.actor_name ? log.actor_name.substring(0,1).toUpperCase() : '?'}</span>
                        </div>
                    )}
                    <span className="text-slate-300 font-semibold tracking-tight">{log.actor_name}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${log.action === 'REVEALED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    log.action === 'CREATED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        log.action === 'DELETED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            'bg-slate-500/10 text-slate-500 border-slate-500/20'
                    }`}>
                    {log.action}
                </span>
            </td>
            <td className="px-6 py-4 text-slate-300">
                {log.description}
            </td>
            <td className="px-6 py-4 text-slate-500">
               {log.ip_address && `IP: ${log.ip_address}`} {log.request_method && `• ${log.request_method}`}
            </td>
            <td className="px-4 py-4 text-right">
                <span className={`material-symbols-outlined transition-transform duration-200 ${isExpanded ? 'text-primary rotate-180' : 'text-slate-600 group-hover:text-slate-400'}`}>expand_more</span>
            </td>
        </tr>
        {isExpanded && (
            <tr className="bg-[#111820]/50">
                <td className="p-0" colSpan={6}>
                    <div className="px-12 py-6 border-b border-primary/20 bg-[#0d1218] grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Browser Context</div>
                                <div className="bg-black/40 p-3 rounded border border-[#1c2127] text-slate-400 leading-relaxed font-mono truncate">
                                    {log.user_agent || "Unknown User Agent"}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Session / Meta</div>
                                    <div className="bg-black/40 px-3 py-2 rounded border border-[#1c2127] text-primary font-mono truncate">
                                        {JSON.stringify(log.metadata)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        )}
    </>
);

const AuditLogs: React.FC = () => {
    const { setIsMobileMenuOpen } = useOutletContext<any>();
    const { activeTeam } = useTeam();
    
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [actionFilter, setActionFilter] = useState('All');

    useEffect(() => {
        if (activeTeam) {
            fetchLogs();
        }
    }, [activeTeam, actionFilter]);

    const fetchLogs = async () => {
        if (!activeTeam) return;
        setIsLoading(true);
        try {
            let url = `/audit-logs?team_id=${activeTeam.id}`;
            if (actionFilter !== 'All') {
                url += `&action=${actionFilter}`;
            }
            
            const response = await api.get<any[]>(url);
            const mappedLogs: LogEntry[] = response.map((log: any) => ({
                id: log.id,
                created_at: log.created_at,
                actor_name: log.actor_name || 'Unknown',
                actor_type: log.actor_type || 'user',
                action: log.action,
                description: log.description,
                ip_address: log.ip_address,
                user_agent: log.user_agent,
                metadata: log.metadata || {},
                request_method: 'API'
            }));
            setLogs(mappedLogs);
        } catch (err) {
            console.error('Failed to fetch audit logs:', err);
        } finally {
            setIsLoading(false);
        }
    }

    const toggleLog = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="bg-background-dark font-display text-slate-300 overflow-hidden h-full w-full flex flex-col">
            {/* Sidebar removed from here as it's provided by ProtectedLayout */}

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[radial-gradient(circle_at_top_right,_#111820_0%,_#0a0f14_40%)] relative">
                <div className="scanline"></div>
                <header className="h-20 border-b border-[#1c2127] flex items-center justify-between px-4 md:px-8 shrink-0 relative z-20">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden text-slate-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 mb-0.5 font-mono">
                                <span>{activeTeam?.name || '...'}</span>
                                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                                <span className="text-primary font-bold">Audit Logs</span>
                            </div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Forensic History</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/20 glow-green hidden md:flex">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter font-mono">Real-time Stream Active</span>
                        </div>
                        <HeaderProfileDropdown />
                    </div>
                </header>

                <div className="px-4 md:px-8 py-4 bg-[#0d1218] border-b border-[#1c2127] flex flex-wrap items-center gap-4 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Filters:</span>
                        <div className="relative">
                            <select className="bg-[#111820] border border-[#1c2127] text-xs text-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-primary pl-2 pr-8 py-1.5 appearance-none min-w-[120px] outline-none">
                                <option>Actor: All</option>
                                <option>Sarah J.</option>
                                <option>Robot: CI-Builder</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1.5 text-xs pointer-events-none text-slate-500">expand_more</span>
                        </div>
                        <div className="relative">
                            <select 
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                                className="bg-[#111820] border border-[#1c2127] text-xs text-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-primary pl-2 pr-8 py-1.5 appearance-none min-w-[120px] outline-none"
                            >
                                <option value="All">Action: All</option>
                                <option value="REVEALED">REVEALED</option>
                                <option value="CREATED">CREATED</option>
                                <option value="DELETED">DELETED</option>
                                <option value="JOINED">JOINED</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1.5 text-xs pointer-events-none text-slate-500">expand_more</span>
                        </div>
                        <div className="relative">
                            <select className="bg-[#111820] border border-[#1c2127] text-xs text-slate-300 rounded focus:ring-primary focus:border-primary pl-2 pr-8 py-1.5 appearance-none min-w-[140px] outline-none">
                                <option>Range: Last 24h</option>
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1.5 text-xs pointer-events-none text-slate-500">calendar_today</span>
                        </div>
                    </div>
                    <div className="flex-1 relative min-w-[200px]">
                        <span className="material-symbols-outlined absolute left-3 top-2 text-sm text-slate-500">search</span>
                        <input className="w-full bg-[#111820] border border-[#1c2127] rounded text-xs py-2 pl-9 pr-4 text-slate-300 placeholder-slate-600 focus:ring-1 focus:ring-primary focus:border-primary outline-none" placeholder="Search by IP, Resource, or Description..." type="text" />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-[#1c2127] rounded text-xs font-bold text-slate-300 hover:bg-slate-700 transition-all uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export CSV
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-0">
                    <table className="w-full border-collapse text-xs text-left">
                        <thead className="sticky top-0 bg-[#0d1218] border-b border-[#1c2127] z-10">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter w-48 whitespace-nowrap">Timestamp</th>
                                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter w-48 whitespace-nowrap">Actor</th>
                                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter w-32 whitespace-nowrap">Action</th>
                                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter whitespace-nowrap">Description</th>
                                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-tighter w-56 whitespace-nowrap">Metadata</th>
                                <th className="px-4 py-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1c2127]/50 font-mono">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                         <span className="material-symbols-outlined animate-spin text-primary text-3xl">donut_large</span>
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-500">
                                        No audit logs found for this team.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                <LogRow
                                    key={log.id}
                                    log={log}
                                    isExpanded={expandedId === log.id}
                                    onToggle={() => toggleLog(log.id)}
                                />
                            )))}
                        </tbody>
                    </table>
                </div>

                <footer className="h-10 border-t border-[#1c2127] bg-[#111820] px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-6 text-[10px] font-mono text-slate-500 uppercase">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                            <span>Monitoring 1,429 events/min</span>
                        </div>
                        <div>Storage Usage: 42.1 GB / 500 GB</div>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
                        <div className="flex gap-2">
                            <button className="hover:text-primary transition-colors">FIRST</button>
                            <button className="hover:text-primary transition-colors">PREV</button>
                            <span className="text-slate-300">PAGE 01 OF 142</span>
                            <button className="hover:text-primary transition-colors">NEXT</button>
                            <button className="hover:text-primary transition-colors">LAST</button>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default AuditLogs;
