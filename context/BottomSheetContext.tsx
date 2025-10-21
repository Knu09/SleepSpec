import React, { createContext, useContext, useState } from "react";

interface BottomSheetContextType {
  isVisible: boolean;
  showBottomSheet: () => void;
  hideBottomSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
);

export const BottomSheetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const showBottomSheet = () => setIsVisible(true);
  const hideBottomSheet = () => setIsVisible(false);

  return (
    <BottomSheetContext.Provider
      value={{ isVisible, showBottomSheet, hideBottomSheet }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("error");
  }
  return context;
};
