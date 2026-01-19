import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import HeaderProfileDropdown from './HeaderProfileDropdown';
import { useTeam } from '../contexts/TeamContext';
import { api } from '../lib/api';

interface ServiceToken {
    id: string;
    name: string;
    scope: string; // READ_ONLY, READ_WRITE, ADMIN
    created_at?: string;
    team_id: string;
    is_active: boolean;
    token_hash: string;
}

const ServiceTokens: React.FC = () => {
    const { setIsMobileMenuOpen } = useOutletContext<any>();
    const { activeTeam } = useTeam();

    const [tokens, setTokens] = useState<ServiceToken[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Create Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createName, setCreateName] = useState('');
    const [createScope, setCreateScope] = useState('READ_ONLY');
    const [isCreating, setIsCreating] = useState(false);

    // Result Modal State
    const [isResultOpen, setIsResultOpen] = useState(false);
    const [newRawToken, setNewRawToken] = useState('');

    useEffect(() => {
        if (activeTeam) {
            fetchTokens();
        } else {
            setTokens([]);
        }
    }, [activeTeam]);

    const fetchTokens = async () => {
        if (!activeTeam) return;
        setIsLoading(true);
        try {
            const data = await api.get<ServiceToken[]>(`/tokens?team_id=${activeTeam.id}`);
            // Sort by created_at desc if available, or name
            setTokens(data);
        } catch (err) {
            console.error('Failed to fetch tokens:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateToken = async () => {
        if (!createName.trim() || !activeTeam) return;
        setIsCreating(true);
        try {
            const result = await api.post<{ raw_token: string }>('/tokens', {
                team_id: activeTeam.id,
                name: createName,
                scope: createScope
            });

            setNewRawToken(result.raw_token);
            setIsCreateOpen(false);
            setCreateName('');
            setIsResultOpen(true);
            fetchTokens();
        } catch (err) {
            console.error('Failed to create token:', err);
            // Handle error
        } finally {
            setIsCreating(false);
        }
    };

    const handleRevoke = async (id: string) => {
        if (!confirm('Are you sure you want to revoke this token? Use will be blocked immediately.')) return;
        try {
            await api.delete(`/tokens/${id}`);
            fetchTokens();
        } catch (err) {
            console.error('Failed to revoke:', err);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(newRawToken);
        // Could show toast
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#111820_0%,_#0a0f14_60%)] h-full relative">
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
                            <span>{activeTeam?.name || '...'}</span>
                            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                            <span className="text-primary">Tokens</span>
                        </div>
                        <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight">Service Tokens</h2>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        disabled={!activeTeam}
                        className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-5 py-2.5 rounded flex items-center gap-2 transition-all glow-primary uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-sm">add_link</span>
                        <span className="hidden md:inline">Generate New Token</span>
                        <span className="md:hidden">New</span>
                    </button>
                    <HeaderProfileDropdown />
                </div>
            </header>

            <div className="p-4 md:p-8">
                {activeTeam ? (
                    isLoading ? (
                        <div className="flex items-center justify-center p-20">
                            <span className="material-symbols-outlined animate-spin text-primary text-3xl">donut_large</span>
                        </div>
                    ) : (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <div className="p-4 border border-[#1c2127] bg-[#111820]/30 rounded tech-border-b">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total Tokens</p>
                                    <p className="text-xl font-mono text-white">{tokens.length}</p>
                                </div>
                                <div className="p-4 border border-[#1c2127] bg-[#111820]/30 rounded tech-border-b">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Active Now</p>
                                    <p className="text-xl font-mono text-green-500">{tokens.filter(t => t.is_active).length}</p>
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
                                                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">Status</th>
                                                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#1c2127]">
                                            {tokens.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                                        No service tokens found. Generate one to access the API programmatically.
                                                    </td>
                                                </tr>
                                            )}
                                            {tokens.map(token => (
                                                <tr key={token.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{token.name}</span>
                                                            <div className="w-fit"><code className="token-prefix">env_live_...</code></div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary font-bold">{token.scope}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${token.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                            {token.is_active ? 'Active' : 'Revoked'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            {token.is_active && (
                                                                <button
                                                                    onClick={() => handleRevoke(token.id)}
                                                                    className="px-3 py-1.5 text-[10px] font-bold border border-red-500/20 text-red-400 rounded hover:bg-red-500/10 transition-colors uppercase tracking-wider"
                                                                >
                                                                    Revoke
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )
                ) : (
                    <div className="p-8 text-center text-slate-500">Please select a team.</div>
                )}
            </div>

            {/* Create Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
                    <div className="max-w-md w-full bg-[#0d1218] border border-[#1c2127] rounded-2xl glow-modal overflow-hidden p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Generate Token</h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">Token Name</label>
                                <input
                                    autoFocus
                                    className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                    value={createName}
                                    onChange={e => setCreateName(e.target.value)}
                                    placeholder="e.g. CI/CD Pipeline"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">Scope</label>
                                <select
                                    className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-2 text-white outline-none"
                                    value={createScope}
                                    onChange={e => setCreateScope(e.target.value)}
                                >
                                    <option value="READ_ONLY">Read Only</option>
                                    <option value="READ_WRITE">Read & Write</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleCreateToken} disabled={isCreating || !createName} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-bold disabled:opacity-50">
                                {isCreating ? 'Generating...' : 'Generate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Result Modal */}
            {isResultOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
                    <div className="max-w-2xl w-full bg-[#0d1218] border border-[#1c2127] rounded-2xl glow-modal overflow-hidden flex flex-col tech-border relative">
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
                        <div className="px-8 mb-6">
                            <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">New Token Value</label>
                            <div className="relative group">
                                <div className="w-full bg-black border border-[#1c2127] rounded-xl p-6 font-mono text-lg text-primary break-all selection:bg-primary selection:text-white">
                                    {newRawToken}
                                </div>
                                <div className="absolute top-3 right-3 cursor-pointer" onClick={copyToClipboard}>
                                    <span className="material-symbols-outlined text-slate-700 text-lg hover:text-primary transition-colors">content_copy</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-8 mb-8">
                            <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">Usage Example (cURL)</label>
                            <div className="w-full bg-[#111820] border border-[#1c2127] rounded-lg p-4 font-mono text-xs text-slate-400 overflow-x-auto relative">
                                <span className="text-purple-400">curl</span> -X GET \<br/>
                                &nbsp;&nbsp;<span className="text-green-400">"{window.location.protocol}//{window.location.hostname}:8000/api/service/vaults/<span className="text-yellow-400">VAULT_ID_OR_NAME</span>/secrets"</span> \<br/>
                                &nbsp;&nbsp;-H <span className="text-blue-400">"Authorization: Bearer {newRawToken}"</span>
                            </div>
                        </div>
                        <div className="px-8 pb-8 flex items-center gap-4">
                            <button onClick={copyToClipboard} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all glow-primary cursor-pointer">
                                <span className="material-symbols-outlined text-lg">content_copy</span>
                                Copy Token
                            </button>
                            <button
                                onClick={() => setIsResultOpen(false)}
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
