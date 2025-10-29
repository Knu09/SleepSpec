import React, { createContext, useState, useEffect, useContext } from "react";

interface TimerContextType {
    elapsedTime: number;
    startTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
}

const TimerContext = createContext<TimerContextType>({
    elapsedTime: 0,
    startTimer: () => {},
    stopTimer: () => {},
    resetTimer: () => {},
});

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;

        if (running) {
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [running]);

    const startTimer = () => setRunning(true);
    const stopTimer = () => setRunning(false);
    const resetTimer = () => setElapsedTime(0);

    return (
        <TimerContext.Provider
            value={{ elapsedTime, startTimer, stopTimer, resetTimer }}
        >
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);
