"use client"
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import api, { getCsrfToken } from '@/lib/api';
import { Property } from '@/types';

interface PropertyContextType {
  properties: Property[];
  selectedProperty: Property | null;
  fetchProperties: () => Promise<void>;
  fetchPropertyById: (id: string) => Promise<Property | undefined>;
  addProperty: (data: Partial<Property>) => Promise<void>;
  updateProperty: (id: string, data: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<ProviderProps> = ({ children }) => {
  const [state, setState] = useState<{
    properties: Property[];
    selectedProperty: Property | null;
    loading: boolean;
    error: Error | null;
  }>({
    properties: [],
    selectedProperty: null,
    loading: false,
    error: null,
  });

  // Memoized fetch function to prevent unnecessary recreations
  const fetchProperties = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await api.get<{ data: Property[] }>('/properties');
      setState(prev => ({ 
        ...prev, 
        properties: res.data.data,
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error('Failed to fetch properties'),
        loading: false 
      }));
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const fetchPropertyById = useCallback(async (id: string): Promise<Property | undefined> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await api.get<{ data: Property }>(`/properties/${id}`);
      setState(prev => ({ 
        ...prev, 
        selectedProperty: res.data.data,
        loading: false 
      }));
      return res.data.data;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error('Failed to fetch property'),
        loading: false 
      }));
      return undefined;
    }
  }, []);

  const addProperty = useCallback(async (data: Partial<Property>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await api.post<{ data: Property }>('/properties', data);
      setState(prev => ({ 
        ...prev, 
        properties: [res.data.data, ...prev.properties],
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error('Failed to add property'),
        loading: false 
      }));
      throw error; // Re-throw for component-level handling
    }
  }, []);

  const updateProperty = useCallback(async (id: string, data: Partial<Property>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await api.put<{ data: Property }>(`/properties/${id}`, data, {
        headers:{
            "x-csrf-token":localStorage.getItem("csrfToken") || await getCsrfToken()
        },
        withCredentials: true
      });
      setState(prev => ({
        ...prev,
        properties: prev.properties.map(p => 
          p._id === id ? res.data.data : p
        ),
        selectedProperty: prev.selectedProperty?._id === id ? 
          res.data.data : prev.selectedProperty,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error('Failed to update property'),
        loading: false 
      }));
      throw error;
    }
  }, []);

  const deleteProperty = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await api.delete(`/properties/${id}`,{
        headers:{
            "x-csrf-token":localStorage.getItem("csrfToken") || await getCsrfToken()
        },
        withCredentials:true
      });
      setState(prev => ({
        ...prev,
        properties: prev.properties.filter(p => p._id !== id),
        selectedProperty: prev.selectedProperty?._id === id ? 
          null : prev.selectedProperty,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error('Failed to delete property'),
        loading: false 
      }));
      throw error;
    }
  }, []);

  return (
    <PropertyContext.Provider
      value={{
        properties: state.properties,
        selectedProperty: state.selectedProperty,
        fetchProperties,
        fetchPropertyById,
        addProperty,
        updateProperty,
        deleteProperty,
        loading: state.loading,
        error: state.error,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = (): PropertyContextType => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};