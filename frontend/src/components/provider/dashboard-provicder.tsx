// components/DashboardProvider.tsx
"use client";

import React, { createContext, useContext } from "react";
import { useModel } from "./model-provider";

interface DashboardContextType {
    selectedModel: string;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const { selectedModel } = useModel();

    return (
        <DashboardContext.Provider value={{ selectedModel }}>
            {children}
        </DashboardContext.Provider>
    );
}
