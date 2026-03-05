import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface Thresholds {
  severity: number;
  sosPriority: number;
  confidence: number;
}

interface RiskRanges {
  zoneA: number;
  zoneB: number;
  zoneC: number;
}

interface Settings {
  thresholds: Thresholds;
  riskRanges: RiskRanges;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => Promise<void>;
  loading: boolean;
}

const defaultSettings: Settings = {
  thresholds: {
    severity: 75,
    sosPriority: 50,
    confidence: 80,
  },
  riskRanges: {
    zoneA: 80,
    zoneB: 60,
    zoneC: 40,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const settingsDoc = doc(db, "config", "thresholds");
    
    // Use onSnapshot for real-time updates across clients
    const unsubscribe = onSnapshot(settingsDoc, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as Settings);
      } else {
        // Initialize with defaults if not exists
        setDoc(settingsDoc, defaultSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching settings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = async (newSettings: Settings) => {
    try {
      const settingsDoc = doc(db, "config", "thresholds");
      await setDoc(settingsDoc, newSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
