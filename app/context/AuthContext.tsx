"use client"

// AuthContext.js
import { authenticate } from '@/services/api';

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
    setIsAdmin: (boolean: boolean)=> {},
    isAdmin: null,
    name: null as string | null,
    balance: null,
    fetchUserData: async () => {}
});

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAdmin, setIsAdmin] = useState<any>(null);
    const [name, setName] = useState<string | null>(null);
    const [balance, setBalance] = useState<any>(null);


    const fetchUserData = async () => {
        console.log('fetching user data');
        const userData = await authenticate();
    

        if (!userData.success) {
            setIsAdmin(false);
            return;
        }

        setIsAdmin(userData.data.account.booleans.isAdmin);
        setName(`${userData.data.account.user.name} ${userData.data.account.user.surname}`);
        setBalance(userData.data.account.finances.balance);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <AuthContext.Provider value={{ fetchUserData ,isAdmin, setIsAdmin, name, balance }}>
            {children}
        </AuthContext.Provider>
    );
};