import React, { createContext, useContext, useState, useEffect } from 'react';
import { satelliteClientService } from '../satellite/satellite.service.js';

export interface SharedField {
  id: string;
  field_name: string;
  crop_name: string;
  area_acres: number;
  centroid_lat?: number;
  centroid_lng?: number;
  boundary_coordinates?: Array<{ lat: number; lng: number }>;
}

interface SharedFieldContextValue {
  fields: SharedField[];
  selectedFieldId: string;
  selectedField: SharedField | null;
  setSelectedFieldId: (id: string) => void;
  isLoadingFields: boolean;
  refreshFields: () => Promise<void>;
}

const STORAGE_KEY = 'bf_track4_selected_field_id';

const SharedFieldContext = createContext<SharedFieldContextValue | undefined>(undefined);

export const SharedFieldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fields, setFields] = useState<SharedField[]>([]);
  const [selectedFieldId, setSelectedFieldIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [isLoadingFields, setIsLoadingFields] = useState<boolean>(true);

  const setSelectedFieldId = (id: string) => {
    setSelectedFieldIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore storage error
    }
  };

  const loadFields = async () => {
    try {
      setIsLoadingFields(true);
      const res = await satelliteClientService.getAvailableFields();
      setFields(res);
      if (res.length > 0) {
        setSelectedFieldIdState(prev => {
          if (prev && res.some(f => f.id === prev)) {
            return prev;
          }
          const defaultId = res[0].id;
          try {
            localStorage.setItem(STORAGE_KEY, defaultId);
          } catch {
            // ignore
          }
          return defaultId;
        });
      }
    } catch {
      // ignore error, keep state
    } finally {
      setIsLoadingFields(false);
    }
  };

  useEffect(() => {
    loadFields();
  }, []);

  const selectedField = fields.find(f => f.id === selectedFieldId) || (fields.length > 0 ? fields[0] : null);

  return (
    <SharedFieldContext.Provider
      value={{
        fields,
        selectedFieldId,
        selectedField,
        setSelectedFieldId,
        isLoadingFields,
        refreshFields: loadFields
      }}
    >
      {children}
    </SharedFieldContext.Provider>
  );
};

export const useSharedField = () => {
  const context = useContext(SharedFieldContext);
  if (!context) {
    throw new Error('useSharedField must be used within a SharedFieldProvider');
  }
  return context;
};
