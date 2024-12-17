"use client";

import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

interface AppProviderProps {
    children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

export default AppProvider;