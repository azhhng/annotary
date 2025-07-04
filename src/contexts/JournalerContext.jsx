import { createContext, useContext } from 'react';
import { useJournaler as useJournalerHook } from '../hooks/useJournaler';

const JournalerContext = createContext();

export const JournalerProvider = ({ children }) => {
  const journalerData = useJournalerHook();
  return (
    <JournalerContext.Provider value={journalerData}>
      {children}
    </JournalerContext.Provider>
  );
};

export const useJournaler = () => {
  const context = useContext(JournalerContext);
  if (!context) {
    throw new Error('useJournaler must be used within a JournalerProvider');
  }
  return context;
};