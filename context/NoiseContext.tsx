import React, { createContext, useContext, useState } from "react";

type NoiseContextType = {
    noiseRemoval: boolean;
    toggleNoiseRemoval: () => void;
};

const NoiseContext = createContext<NoiseContextType | undefined>(undefined);

export const NoiseProvider = ({ children }: { children: React.ReactNode }) => {
    const [noiseRemoval, setNoiseRemoval] = useState(false);

    const toggleNoiseRemoval = () => setNoiseRemoval((prev) => !prev);

    return (
        <NoiseContext.Provider value={{ noiseRemoval, toggleNoiseRemoval }}>
            {children}
        </NoiseContext.Provider>
    );
};

// Hook for usage
export const useNoise = () => {
    const ctx = useContext(NoiseContext);
    if (!ctx) throw new Error("useNoise must be used inside NoiseProvider");
    return ctx;
};
