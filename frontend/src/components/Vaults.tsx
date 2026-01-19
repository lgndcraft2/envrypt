import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import HeaderProfileDropdown from './HeaderProfileDropdown';
import { useTeam } from '../contexts/TeamContext';
import { api } from '../lib/api';

interface Vault {
    id: string;
    name: string;
    description?: string;
    created_at?: string;
    secrets_count?: number; // Not yet implemented in backend, but good for UI
}

const Vaults: React.FC = () => {
    const { setIsMobileMenuOpen } = useOutletContext<any>();
    const { activeTeam } = useTeam();
    const navigate = useNavigate();

    const [vaults, setVaults] = useState<Vault[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateVaultOpen, setIsCreateVaultOpen] = useState(false);

    // Create Vault State
    const [newVaultName, setNewVaultName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (activeTeam) {
            fetchVaults();
        } else {
            setVaults([]);
        }
    }, [activeTeam]);

    const fetchVaults = async () => {
        if (!activeTeam) return;
        setIsLoading(true);
        try {
            const data = await api.get<Vault[]>(`/vaults?team_id=${activeTeam.id}`);
            setVaults(data);
        } catch (err) {
            console.error('Failed to fetch vaults:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateVault = async () => {
        if (!newVaultName.trim() || !activeTeam) return;

        setIsCreating(true);
        try {
            await api.post('/vaults', {
                team_id: activeTeam.id,
                name: newVaultName
            });
            setNewVaultName('');
            setIsCreateVaultOpen(false);
            fetchVaults();
        } catch (err) {
            console.error('Failed to create vault:', err);
            // Handle error (toast/alert)
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#111820_0%,_#0a0f14_60%)] h-full relative">
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
                            <span>{activeTeam?.name || '...'}</span>
                            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                            <span className="text-primary">Vaults</span>
                        </div>
                        <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight">Vaults</h2>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsCreateVaultOpen(true)}
                        disabled={!activeTeam}
                        className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all glow-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Create Vault
                    </button>
                    <HeaderProfileDropdown />
                </div>
            </header>
            <div className="p-8">
                {activeTeam ? (
                    isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <span className="material-symbols-outlined animate-spin text-primary text-4xl">donut_large</span>
                        </div>
                    ) : vaults.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {vaults.map((vault) => (
                                <div
                                    key={vault.id}
                                    onClick={() => navigate(`/vault/${vault.id}`)}
                                    className="group relative bg-[#111820] border border-[#1c2127] p-6 rounded-xl tech-border hover:border-primary/40 transition-all cursor-pointer glow-blue"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                                            <span className="material-symbols-outlined text-2xl">lock</span>
                                        </div>
                                        <button className="text-slate-500 hover:text-white transition-colors">
                                            <span className="material-symbols-outlined">more_horiz</span>
                                        </button>
                                    </div>
                                    <div className="space-y-1 mb-6">
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{vault.name}</h3>
                                        <p className="text-xs text-slate-500 font-medium">{vault.id.substring(0, 8)}...</p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-[#1c2127] pt-4">
                                        <div className="flex flex-col">
                                            <span className="text-xl font-bold font-mono text-white">
                                                {vault.secrets_count !== undefined ? vault.secrets_count : '--'}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-widest text-slate-500">Secrets</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-600">Encrypted</span>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setIsCreateVaultOpen(true)}
                                className="group relative border-2 border-dashed border-[#1c2127] p-6 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center min-h-[220px] cursor-pointer"
                            >
                                <div className="h-12 w-12 rounded-full border border-dashed border-slate-600 flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:border-primary transition-all mb-4">
                                    <span className="material-symbols-outlined text-2xl font-light">add</span>
                                </div>
                                <span className="text-sm font-bold text-slate-500 group-hover:text-primary uppercase tracking-widest">New Vault</span>
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-bold text-white mb-2">No vaults found</h3>
                            <p className="text-slate-500 mb-6">Create your first vault to start storing secrets securely.</p>
                            <button
                                onClick={() => setIsCreateVaultOpen(true)}
                                className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-lg transition-all glow-primary"
                            >
                                Create Vault
                            </button>
                        </div>
                    )
                ) : (
                    <div className="p-8 text-center text-slate-500">
                        Please select a team to manage vaults.
                    </div>
                )}
            </div>

            {/* Create Vault Slide-over */}
            {isCreateVaultOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
                    <div className="w-full max-w-lg bg-[#0d1218] h-full shadow-2xl border-l border-[#1c2127] flex flex-col animate-slide-in">
                        <div className="p-8 pb-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold text-white">Create New Vault</h2>
                                <button
                                    onClick={() => setIsCreateVaultOpen(false)}
                                    className="text-slate-500 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <p className="text-sm text-slate-400">Vaults segregate your secrets by environment or project.</p>
                        </div>
                        <div className="flex-1 overflow-y-auto px-8 custom-scrollbar">
                            <div className="space-y-8 py-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 font-mono">Vault Name</label>
                                    <input
                                        className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-3 text-white focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all outline-none placeholder:text-slate-600"
                                        placeholder="e.g. Production Infrastructure"
                                        type="text"
                                        value={newVaultName}
                                        onChange={(e) => setNewVaultName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreateVault()}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 font-mono">Appearance</label>
                                    <p className="text-xs text-slate-600">Customization coming soon...</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 border-t border-[#1c2127] bg-[#0a0f14]/50">
                            <button
                                onClick={handleCreateVault}
                                disabled={isCreating || !newVaultName.trim()}
                                className="w-full bg-[#14b8a6] hover:bg-teal-600 text-[#0d1218] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all glow-teal disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCreating ? (
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined font-bold">add</span>
                                        Create Vault
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vaults;
