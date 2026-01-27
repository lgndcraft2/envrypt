// Placeholder for Vault Access:
// Since we don't have a `vault_access` table in the schema inspection yet,
// I am assuming we might need to rely on `team_members` for now or create a mock UI.
// However, the user asked to "set the users that can access a vault".
// This implies granular permissions.
// I will create a VaultSettingsModal component.
// And I will try to implement the UI first.
// I'll need to fetch team members to list them.

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

// In VaultSettingsModal.tsx
interface VaultSettingsModalProps {
    vault: { 
        id: string; 
        name: string; 
        description?: string; 
        color?: string; 
        icon?: string; 
    };
    isOpen: boolean;
    onClose: () => void;
    teamId: string;
    onVaultUpdated?: () => void;
}

const VaultSettingsModal: React.FC<VaultSettingsModalProps> = ({ vault, isOpen, onClose, teamId, onVaultUpdated }) => {
    const [activeTab, setActiveTab] = useState<'access' | 'general'>('access');
    const [members, setMembers] = useState<any[]>([]); 
    const [accessList, setAccessList] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // General Settings State
    const [name, setName] = useState(vault.name);
    const [description, setDescription] = useState(vault.description || '');
    const [color, setColor] = useState(vault.color || 'blue-500');
    const [icon, setIcon] = useState(vault.icon || 'lock');
    
    // Update local state when vault prop changes (e.g. re-opening)
    useEffect(() => {
        if (isOpen) {
            setName(vault.name);
            setDescription(vault.description || '');
            setColor(vault.color || 'blue-500');
            setIcon(vault.icon || 'lock');
            fetchData();
        }
    }, [isOpen, vault]);

    const vaultColors = [
        { id: 'red-500', bg: 'bg-red-500', ring: 'hover:ring-red-500' },
        { id: 'green-500', bg: 'bg-green-500', ring: 'hover:ring-green-500' },
        { id: 'blue-500', bg: 'bg-blue-500', ring: 'hover:ring-blue-500' },
        { id: 'teal-accent', bg: 'bg-[#14b8a6]', ring: 'ring-[#14b8a6]' }
    ];
    const vaultIcons = ['rocket_launch', 'shield', 'dns', 'lock', 'cloud', 'database', 'key'];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            console.log("Fetching vault settings for:", vault.id);
            const [membersData, accessData] = await Promise.all([
                api.get<any[]>(`/auth/teams/${teamId}/members`),
                api.get<string[]>(`/vaults/${vault.id}/access`)
            ]);
            console.log("Members Fetched:", membersData);
            console.log("Access List Fetched:", accessData);

            setMembers(membersData);
            if (Array.isArray(accessData)) {
                setAccessList(new Set(accessData));
            } else {
                console.error("Access Data invalid:", accessData);
            }
        } catch (err) {
            console.error("Fetch Data Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAccess = (userId: string) => {
        const newSet = new Set(accessList);
        if (newSet.has(userId)) {
            newSet.delete(userId);
        } else {
            newSet.add(userId);
        }
        setAccessList(newSet);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (activeTab === 'access') {
                await api.put(`/vaults/${vault.id}/access`, {
                    member_ids: Array.from(accessList)
                });
            } else if (activeTab === 'general') {
                await api.patch(`/vaults/${vault.id}`, { // Using PATCH method we just added
                    name,
                    description,
                    color,
                    icon
                }) as any; // Cast as any or define return type if needed
                
                if (onVaultUpdated) {
                    onVaultUpdated();
                }
            }
            onClose();
        } catch (err) {
            console.error("Failed to save vault settings", err);
        } finally {
            setIsSaving(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
             <div className="w-full max-w-2xl bg-[#0d1218] rounded-2xl shadow-2xl border border-[#1c2127] flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-[#1c2127] flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">Vault Settings</h2>
                        <p className="text-xs text-slate-500 font-mono mt-1">{vault.name}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="flex border-b border-[#1c2127]">
                    <button 
                        onClick={() => setActiveTab('access')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'access' ? 'border-primary text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                        Access Control
                    </button>
                    <button 
                        onClick={() => setActiveTab('general')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'general' ? 'border-primary text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                        General
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {activeTab === 'access' && (
                        <div className="space-y-6">
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1">Access Management</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Control which team members can decipher secrets in this vault. Administrators always have access.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">
                                    <span>User</span>
                                    <span>Access</span>
                                </div>
                                {isLoading ? (
                                    <div className="text-center py-8 text-slate-500">Loading members...</div>
                                ) : members.map(member => (
                                    <div key={member.user_id} className="flex items-center justify-between p-3 rounded-lg bg-[#111820] border border-[#1c2127]">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                                {member.email?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{member.email}</p>
                                                <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{member.role}</span>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={accessList.has(member.user_id)} 
                                                onChange={() => toggleAccess(member.user_id)}
                                                disabled={member.role === 'OWNER'} // Owners typically have implicit access, but can be explicit too
                                            />
                                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'general' && (
                         <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vault Name</label>
                                <input 
                                    className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Appearance</label>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <span className="text-xs text-slate-400">Accent Color</span>
                                        <div className="flex items-center gap-3">
                                            {vaultColors.map((c) => (
                                                <button
                                                    key={c.id}
                                                    onClick={() => setColor(c.id)}
                                                    className={`w-8 h-8 rounded-full ${c.bg} ring-2 ring-offset-2 ring-offset-[#0d1218] transition-all ${color === c.id ? `ring-white` : `ring-transparent ${c.ring}`}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <span className="text-xs text-slate-400">Vault Icon</span>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            {vaultIcons.map((ic) => (
                                                <button
                                                    key={ic}
                                                    onClick={() => setIcon(ic)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded border transition-all ${icon === ic ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-[#1c2127] text-slate-400 hover:text-white'}`}
                                                >
                                                    <span className="material-symbols-outlined text-lg">{ic}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</label>
                                <textarea 
                                    className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none resize-none" 
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Briefly describe what secrets are stored here..."
                                />
                            </div>

                             <div className="pt-4 border-t border-[#1c2127]">
                                <button className="text-red-400 text-sm font-bold hover:text-red-300 flex items-center gap-2">
                                    <span className="material-symbols-outlined">delete</span>
                                    Delete Vault
                                </button>
                             </div>
                         </div>
                    )}
                </div>
                
                <div className="p-6 border-t border-[#1c2127] bg-[#0a0f14]/50 flex justify-end gap-3 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">Cancel</button>
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg transition-all glow-primary flex items-center gap-2"
                    >
                        {isSaving && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                        Save Changes
                    </button>
                </div>
             </div>
        </div>
    );
};

export default VaultSettingsModal;
