import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import HeaderProfileDropdown from './HeaderProfileDropdown';
import { useTeam } from '../contexts/TeamContext';
import { api } from '../lib/api';
import VaultSettingsModal from './VaultSettingsModal';

interface Vault {
    id: string;
    name: string;
    description?: string;
    created_at?: string;
    secrets_count?: number; // Not yet implemented in backend, but good for UI
    color?: string;
    icon?: string;
}

const Vaults: React.FC = () => {
    const { setIsMobileMenuOpen } = useOutletContext<any>();
    const { activeTeam } = useTeam();
    const navigate = useNavigate();

    const role = activeTeam?.role?.toUpperCase();
    const isAdmin = role === 'OWNER' || role === 'ADMIN';

    const [vaults, setVaults] = useState<Vault[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateVaultOpen, setIsCreateVaultOpen] = useState(false);
    
    // Settings Modal State
    const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Create Vault State
    const [newVaultName, setNewVaultName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    
    // Create Vault Form State
    const [newVaultDescription, setNewVaultDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState('teal-accent'); 
    const [selectedIcon, setSelectedIcon] = useState('rocket_launch');
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (activeTeam && isCreateVaultOpen) {
            fetchTeamMembers();
        }
    }, [activeTeam, isCreateVaultOpen]);

    const fetchTeamMembers = async () => {
        if (!activeTeam) return;
        try {
            const data = await api.get<any[]>(`/auth/teams/${activeTeam.id}/members`);
            setTeamMembers(data);
            // Default select all or just current user?
            // Let's select current user by default 
            // We need current user ID... from context or JWT?
            // For now, let's just select everyone as a friendly default or empty
            
            // Actually, best to select "active" members if we knew them.
            // Let's select all initially for easy sharing? Or maybe just user.
            // Select all by default as per request "make the users with access checked on load"
            const allIds = new Set(data.map(m => m.user_id));
            setSelectedMembers(allIds);
        } catch (err) {
            console.error("Failed to fetch team members", err);
        }
    };

    const toggleMember = (userId: string) => {
        const newSelected = new Set(selectedMembers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedMembers(newSelected);
    };

    const vaultColors = [
        { id: 'red-500', bg: 'bg-red-500', ring: 'hover:ring-red-500' },
        { id: 'green-500', bg: 'bg-green-500', ring: 'hover:ring-green-500' },
        { id: 'blue-500', bg: 'bg-blue-500', ring: 'hover:ring-blue-500' },
        { id: 'teal-accent', bg: 'bg-[#14b8a6]', ring: 'ring-[#14b8a6]', shadow: 'shadow-[0_0_10px_rgba(20,184,166,0.4)]' }
    ];

    const vaultIcons = ['rocket_launch', 'shield', 'dns', 'lock'];

    useEffect(() => {
        if (activeTeam) {
            fetchVaults();
        } else {
            setVaults([]);
        }
    }, [activeTeam]);

    const fetchVaults = async (background = false) => {
        if (!activeTeam) return;
        if (!background) setIsLoading(true);
        try {
            const data = await api.get<Vault[]>(`/vaults?team_id=${activeTeam.id}`);
            setVaults(data);
        } catch (err) {
            console.error('Failed to fetch vaults:', err);
        } finally {
            if (!background) setIsLoading(false);
        }
    };

    const handleCreateVault = async () => {
        if (!newVaultName.trim() || !activeTeam) return;

        setIsCreating(true);
        setCreateError(null);
        try {
            await api.post('/vaults', {
                team_id: activeTeam.id,
                name: newVaultName,
                description: newVaultDescription,
                color: selectedColor,
                icon: selectedIcon,
                member_ids: Array.from(selectedMembers)
            });
            setNewVaultName('');
            setNewVaultDescription('');
            setSelectedColor('teal-accent');
            setSelectedIcon('rocket_launch');
            setIsCreateVaultOpen(false);
            fetchVaults();
        } catch (err: any) {
            console.error('Failed to create vault:', err);
            setCreateError(err.message || "Failed to create vault");
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
                    {isAdmin && (
                        <button
                            onClick={() => { setIsCreateVaultOpen(true); setCreateError(null); }}
                            disabled={!activeTeam}
                            className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all glow-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Create Vault
                        </button>
                    )}
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
                            {vaults.map((vault) => {
                                const vColor = vaultColors.find(c => c.id === vault.color) || { id: 'blue-500', bg: 'bg-blue-500', ring: 'hover:ring-blue-500', text: 'text-blue-500', border: 'border-blue-500/20' };
                                // Derive text color and border based on bg color name roughly or map it explicitly in vaultColors
                                let textColor = 'text-blue-500';
                                let borderColor = 'border-blue-500/20';
                                let bgColor = 'bg-blue-500/10';
                                
                                if (vault.color === 'red-500') { textColor = 'text-red-500'; borderColor = 'border-red-500/20'; bgColor = 'bg-red-500/10'; }
                                if (vault.color === 'green-500') { textColor = 'text-green-500'; borderColor = 'border-green-500/20'; bgColor = 'bg-green-500/10'; }
                                if (vault.color === 'teal-accent') { textColor = 'text-[#14b8a6]'; borderColor = 'border-[#14b8a6]/20'; bgColor = 'bg-[#14b8a6]/10'; }

                                return (
                                <div
                                    key={vault.id}
                                    onClick={() => navigate(`/vault/${vault.id}`)}
                                    className="group relative bg-[#111820] border border-[#1c2127] p-6 rounded-xl tech-border hover:border-primary/40 transition-all cursor-pointer glow-blue"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`h-12 w-12 rounded-lg ${bgColor} border ${borderColor} flex items-center justify-center ${textColor}`}>
                                            <span className="material-symbols-outlined text-2xl">{vault.icon || 'lock'}</span>
                                        </div>
                                        {isAdmin && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedVault(vault);
                                                    setIsSettingsOpen(true);
                                                }}
                                                className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded"
                                            >
                                                <span className="material-symbols-outlined">more_horiz</span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-1 mb-6">
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{vault.name}</h3>
                                        {/* Display description if available, else standard fallback or nothing */}
                                        <p className="text-xs text-slate-500 font-medium line-clamp-2 min-h-[32px] overflow-hidden">
                                            {vault.description || <span className="text-slate-700 italic">No description</span>}
                                        </p>
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
                            );
                            })}
                            {isAdmin && (
                                <button
                                    onClick={() => setIsCreateVaultOpen(true)}
                                    className="group relative border-2 border-dashed border-[#1c2127] p-6 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center min-h-[220px] cursor-pointer"
                                >
                                    <div className="h-12 w-12 rounded-full border border-dashed border-slate-600 flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:border-primary transition-all mb-4">
                                        <span className="material-symbols-outlined text-2xl font-light">add</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 group-hover:text-primary uppercase tracking-widest">New Vault</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-bold text-white mb-2">No vaults found</h3>
                            <p className="text-slate-500 mb-6">Ask the admin to create your first vault to start storing secrets securely.</p>
                            {isAdmin && (
                                <button
                                    onClick={() => setIsCreateVaultOpen(true)}
                                    className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-lg transition-all glow-primary"
                                >
                                    Create Vault
                                </button>
                            )}
                        </div>
                    )
                ) : (
                    <div className="p-8 text-center text-slate-500">
                        Please select a team to manage vaults.
                    </div>
                )}
            </div>            
            {/* Vault Settings Modal */}
            {selectedVault && activeTeam && (
                <VaultSettingsModal 
                    vault={selectedVault}
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    teamId={activeTeam.id}
                    onVaultUpdated={() => fetchVaults(true)}
                />
            )}
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
                            {createError && (
                                <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono">
                                    {createError}
                                </div>
                            )}
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
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <span className="text-xs text-slate-400">Accent Color</span>
                                            <div className="flex items-center gap-3">
                                                {vaultColors.map((color) => (
                                                    <button
                                                        key={color.id}
                                                        onClick={() => setSelectedColor(color.id)}
                                                        className={`w-8 h-8 rounded-full ${color.bg} ring-2 ring-offset-2 ring-offset-[#0d1218] transition-all ${selectedColor === color.id ? `ring-[#14b8a6] ${color.shadow || ''}` : `ring-transparent ${color.ring}`}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <span className="text-xs text-slate-400">Vault Icon</span>
                                            <div className="flex items-center gap-3">
                                                {vaultIcons.map((icon) => (
                                                    <button
                                                        key={icon}
                                                        onClick={() => setSelectedIcon(icon)}
                                                        className={`w-8 h-8 flex items-center justify-center rounded border transition-all ${selectedIcon === icon ? 'bg-[#14b8a6]/10 border-[#14b8a6] text-[#14b8a6]' : 'bg-white/5 border-[#1c2127] text-slate-400 hover:text-white hover:border-[#14b8a6]'}`}
                                                    >
                                                        <span className="material-symbols-outlined text-lg">{icon}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 font-mono">Description <span className="text-slate-700 ml-1">(Optional)</span></label>
                                    <textarea
                                        className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-3 text-white focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition-all outline-none placeholder:text-slate-600 resize-none font-sans"
                                        placeholder="What secrets will this vault hold?"
                                        rows={3}
                                        value={newVaultDescription}
                                        onChange={(e) => setNewVaultDescription(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 font-mono">Access Control</label>
                                    <div className="space-y-1">
                                        {teamMembers.map((member) => (
                                            <div key={member.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                                        {(member.full_name || member.email || '?').substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                                                            {member.full_name || member.email?.split('@')[0]}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{member.role}</span>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer"
                                                        checked={selectedMembers.has(member.user_id)}
                                                        onChange={() => toggleMember(member.user_id)}
                                                    />
                                                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#14b8a6] peer-checked:after:bg-white"></div>
                                                </label>
                                            </div>
                                        ))}
                                        {teamMembers.length === 0 && (
                                            <div className="text-center py-4 text-slate-500 text-sm">
                                                No other team members found.
                                            </div>
                                        )}
                                    </div>
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
                            <p className="text-center mt-4 text-[10px] text-slate-600 font-mono uppercase tracking-widest">Initial Audit Log Entry will be created</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vaults;
