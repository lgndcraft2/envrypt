import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useTeam } from '../contexts/TeamContext';

const MainLayout: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { teams, activeTeam, isLoading } = useTeam();
    const navigate = useNavigate();

    // Enforce Team Existence
    useEffect(() => {
        if (!isLoading) {
            if (teams.length === 0 || !activeTeam) {
                // If no teams, or no team selected, redirect to get-started (lobby)
                navigate('/get-started');
            }
        }
    }, [teams, activeTeam, isLoading, navigate]);

    if (isLoading) {
         return (
            <div className="flex h-screen w-full items-center justify-center bg-background-dark text-white">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">donut_large</span>
            </div>
        );
    }
    
    // Avoid flash of content if redirecting
    if (teams.length === 0) return null;

    return (
        <div className="bg-background-dark font-display text-white overflow-hidden h-screen w-full relative flex">
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative h-full">
                <Outlet context={{ setIsMobileMenuOpen }} />
            </div>
        </div>
    );
};

export default MainLayout;
