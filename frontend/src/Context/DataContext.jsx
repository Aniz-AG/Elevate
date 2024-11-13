import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const storedUserInfo = Cookies.get('userInfo');
        const token = Cookies.get('accessToken');
        console.log('Stored User Info:', storedUserInfo);
        
        if (storedUserInfo) {
            setLoggedIn(true);
            setUserInfo(JSON.parse(storedUserInfo));
            setAccessToken(token);
        } else {
            setLoggedIn(false);
        }
    }, [loggedIn]);

    const logout = () => {
        setLoggedIn(false);
        setUserInfo(null);
        setAccessToken(null); // Clear accessToken on logout
        Cookies.remove('userInfo');
        Cookies.remove('accessToken');
    };

    return (
        <DataContext.Provider value={{ loggedIn, setLoggedIn, logout, userInfo, setUserInfo, accessToken }}>
            {children}
        </DataContext.Provider>
    );
};