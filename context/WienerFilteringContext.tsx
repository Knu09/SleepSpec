import React, { createContext, useContext, useState } from "react";

type NoiseContextType = {
    wienerFiltering: boolean;
    toggleWienerFiltering: () => void;
};

const NoiseContext = createContext<NoiseContextType | undefined>(undefined);

export const WienerProvider = ({ children }: { children: React.ReactNode }) => {
    const [wienerFiltering, setNoiseRemoval] = useState(false);

    const toggleWienerFiltering = () => setNoiseRemoval((prev) => !prev);

    return (
        <NoiseContext.Provider
            value={{ wienerFiltering, toggleWienerFiltering }}
        >
            {children}
        </NoiseContext.Provider>
    );
};

// Hook for usage
export const useWienerFiltering = () => {
    const context = useContext(NoiseContext);
    if (!context) {
        throw new Error(
            "useWienerFiltering must be used within a WienerProvider",
        );
    }
    return context;
};
