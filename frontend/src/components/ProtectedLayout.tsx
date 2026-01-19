import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { TeamProvider } from '../contexts/TeamContext';
import Sidebar from './Sidebar';

const ProtectedLayout: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/login');
            } else {
                setIsAuthChecking(false);
            }
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    if (isAuthChecking) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background-dark text-white">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">donut_large</span>
            </div>
        );
    }

    return (
        <TeamProvider>
            <Outlet />
        </TeamProvider>
    );
};

export default ProtectedLayout;
