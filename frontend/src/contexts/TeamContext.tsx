import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface Team {
    id: string;
    name: string;
    slug: string;
    role?: string;
}

interface TeamContextType {
    teams: Team[];
    activeTeam: Team | null;
    setActiveTeam: (team: Team) => void;
    isLoading: boolean;
    isSwitchingTeam: boolean;
    refreshTeams: () => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [activeTeam, setActiveTeamState] = useState<Team | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSwitchingTeam, setIsSwitchingTeam] = useState(false);

    const setActiveTeam = async (team: Team) => {
        setIsSwitchingTeam(true); // Trigger UI loading state if desired (future impl)
        // Immediate update
        setActiveTeamState(team);
        localStorage.setItem('envrypt_active_team_id', team.id);
        
        // Short artificial delay or wait for next tick could smooth transitions if needed
        // But instant is usually best.
        // We will expose isSwitchingTeam via context if we want global spinner.
        
        // Force navigate to dashboard or refresh certain data??? 
        // For now, React Context propagation is fast. Components listening to activeTeam will re-render.
        // If content lags, components should handle their internal loading based on activeTeam change ID.
        setTimeout(() => setIsSwitchingTeam(false), 300); // Visual feedback duration
    };

    const refreshTeams = async () => {
        try {
            const data = await api.get<Team[]>('/auth/teams');
            setTeams(data);

            if (data.length > 0) {
                // Restore selection or default to first
                const savedId = localStorage.getItem('envrypt_active_team_id');
                const matched = data.find(t => t.id === savedId);
                if (matched) {
                    setActiveTeamState(matched);
                } else {
                    setActiveTeam(data[0]);
                }
            } else {
                setActiveTeamState(null);
            }
        } catch (err) {
            console.error('Failed to fetch teams', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch if we have a session (handled by api.ts throwing if not, but we should be careful)
        // For now, assuming this provider is inside Auth protection or handles 401 gracefully
        refreshTeams();
    }, []);

    return (
        <TeamContext.Provider value={{ teams, activeTeam, setActiveTeam, isLoading, isSwitchingTeam, refreshTeams }}>
            {children}
        </TeamContext.Provider>
    );
};

export const useTeam = () => {
    const context = useContext(TeamContext);
    if (context === undefined) {
        throw new Error('useTeam must be used within a TeamProvider');
    }
    return context;
};
