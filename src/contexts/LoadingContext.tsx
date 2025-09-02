"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Loading Context Interface
interface LoadingContextType {
  isLoading: boolean;
  setOverlayLoading: (loading: boolean) => void;
  loadingText: string;
  setLoadingText: (text: string) => void;
}

// Create Loading Context
const LoadingContext = createContext<LoadingContextType | false>(false);

// Custom Hook
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

// Loading Provider Component
interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");

  const setOverlayLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setOverlayLoading,
        loadingText,
        setLoadingText,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
