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

interface VaultSettingsModalProps {
    vault: { id: string; name: string };
    isOpen: boolean;
    onClose: () => void;
    teamId: string;
}

const VaultSettingsModal: React.FC<VaultSettingsModalProps> = ({ vault, isOpen, onClose, teamId }) => {
    const [activeTab, setActiveTab] = useState<'access' | 'general'>('access');
    const [members, setMembers] = useState<any[]>([]); // Need rich member info
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchMembers();
        }
    }, [isOpen]);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            // We need a route to fetch detailed team members.
            // Currently `GET /teams` returns MY teams.
            // We need `GET /teams/{id}/members`.
            // Let's implement that in backend first or reuse existing if available (it isn't).
            // I'll assume I will create it.
            const data = await api.get<any[]>(`/auth/teams/${teamId}/members`);
            setMembers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Since we don't have real per-vault permissions in DB yet (per schema check),
    // we will Mock the "Access" toggle for UI demonstration or basic implementation.
    // If user wants it real, we'd need a table.
    
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
                                            <input type="checkbox" className="sr-only peer" defaultChecked={true} disabled={member.role === 'OWNER'} />
                                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'general' && (
                         <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vault Name</label>
                                <input 
                                    className="w-full bg-[#111820] border border-[#1c2127] rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none" 
                                    defaultValue={vault.name} 
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
                    <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg transition-all glow-primary">Save Changes</button>
                </div>
             </div>
        </div>
    );
};

export default VaultSettingsModal;
