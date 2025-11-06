import React, { createContext, useContext, useState, ReactNode } from 'react';

// context data
type NoiseReductionMethod = 'none' | 'wiener' | 'deepfilternet';

interface NoiseReductionContextType {
	noiseReductionMethod: NoiseReductionMethod;
	setNoiseReductionMethod: (method: NoiseReductionMethod) => void;
}

// Create context with a default value
const NoiseReductionContext = createContext<NoiseReductionContextType | undefined>(undefined);

// This is what will hold the actual state.
export const NoiseReductionProvider = ({ children }: { children: ReactNode }) => {
	const [noiseReductionMethod, setNoiseReductionMethod] = useState<NoiseReductionMethod>('none');

	return (
		<NoiseReductionContext.Provider value={{ noiseReductionMethod, setNoiseReductionMethod }}>
			{children}
		</NoiseReductionContext.Provider>
	);
};

// Create a custom hook to easily use the context in other components
export const useNoiseReduction = () => {
	const context = useContext(NoiseReductionContext);
	if (context === undefined) {
		throw new Error('useNoiseReduction must be used within a NoiseReductionProvider');
	}
	return context;
};
