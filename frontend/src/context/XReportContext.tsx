import React, { createContext, useContext, useState, useEffect } from 'react';

type XReportContextType = {
    isZeroed: boolean;
    setIsZeroed: (val: boolean) => void;
};

const XReportContext = createContext<XReportContextType | undefined>(undefined);

export const XReportProvider = ({ children }) => {
    const [isZeroed, setIsZeroedState] = useState<boolean>(() => {
        const saved = localStorage.getItem("isZeroed");
        return saved === "true";
    });

    const setIsZeroed = (val: boolean) => {
        localStorage.setItem("isZeroed", val.toString());
        setIsZeroedState(val);
    };

    useEffect(() => {
        // Optionally sync with storage changes (from other tabs)
        const handler = () => {
            const saved = localStorage.getItem("isZeroed");
            setIsZeroedState(saved === "true");
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    return (
        <XReportContext.Provider value={{ isZeroed, setIsZeroed }}>
            {children}
        </XReportContext.Provider>
    );
};

export const useXReport = (): XReportContextType => {
    const context = useContext(XReportContext);
    if (!context) throw new Error("useXReport must be used within XReportProvider");
    return context;
};
