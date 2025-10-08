// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUserStatus = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                // Try to fetch profile to validate the token
                const res = await api.get('/accounts/profile/');
                setUser(res.data);
            } catch (error) {
                // Token invalid or expired
                logout();
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        checkUserStatus();
    }, []);

    const login = async (phone_number, password) => {
        try {
            const res = await api.post('/accounts/login/', { phone_number, password });
            const { access, refresh } = res.data;
            
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            
            await checkUserStatus(); 
            toast.success("Login successful!");
            return true;
        } catch (error) {
            const errorDetail = error.response?.data?.detail || "Login failed. Check phone or password.";
            toast.error(errorDetail);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        toast.info("Logged out.");
    };

    const contextData = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};