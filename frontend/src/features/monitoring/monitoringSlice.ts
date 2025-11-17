/* eslint-disable @typescript-eslint/no-unused-vars */

import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/api';
import type { MonitoringPoint } from '../../types';

type FetchParams = { 
  page?: number; 
  limit?: number; 
  sortBy?: string; 
  order?: 'asc' | 'desc' 
};

type FetchResult = {
  data: MonitoringPoint[];
  page: number;
  limit: number;
  total?: number;
};

type State = {
  items: MonitoringPoint[];
  page: number;
  limit: number;
  total?: number;
  loading: boolean;
  error?: string | null;
  lastUpdate: string;
};

type UpdateMonitoringPointData = {
  name?: string;
  machineId?: string;
  sensorModel?: 'TcAg' | 'TcAs' | 'HF+' | null;
};


const loadStateFromStorage = (): State => {
  try {
    const serializedState = localStorage.getItem('monitoringState');
    if (serializedState === null) {
      return {
        items: [],
        page: 1,
        limit: 5,
        loading: false,
        error: null,
        lastUpdate: new Date().toISOString()
      };
    }
    const state = JSON.parse(serializedState);
   
    return {
      ...state,
      limit: 5
    };
  } catch (err) {
    console.warn('Could not load state from localStorage', err);
    return {
      items: [],
      page: 1,
      limit: 5,
      loading: false,
      error: null,
      lastUpdate: new Date().toISOString()
    };
  }
};


const saveStateToStorage = (state: State) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('monitoringState', serializedState);
  } catch (err) {
    console.warn('Could not save state to localStorage', err);
  }
};

const initialState: State = loadStateFromStorage();

export const fetchMonitoringPoints = createAsyncThunk<FetchResult, FetchParams, { rejectValue: string }>(
  'monitoring/fetch',
  async (params: FetchParams = {}, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching monitoring points with params:', params);
      const res = await api.get<{
        data: MonitoringPoint[];
        page: number;
        limit: number;
        total: number;
      }>('/monitoring-points', { params });
      
      console.log('Monitoring points fetched successfully:', {
        count: res.data.data.length,
        page: res.data.page,
        total: res.data.total
      });
      
      return { 
        data: res.data.data, 
        page: res.data.page, 
        limit: res.data.limit,
        total: res.data.total
      };
    } catch (err: unknown) {
      console.error('❌ Error fetching monitoring points:', err);
      const message = err instanceof Error ? err.message : 'Error fetching monitoring points';
      return rejectWithValue(message);
    }
  },
);

export const deleteMonitoringPoint = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('monitoring/delete', async (id: string, { rejectWithValue }) => {
  try {
    console.log('🗑️ Attempting to delete monitoring point:', id);
    const response = await api.delete(`/monitoring-points/${id}`);
    console.log('Monitoring point deleted successfully from backend:', id);
    return id;
  } catch (err: unknown) {
    console.error('❌ Error deleting monitoring point from backend:', err);
    const message = err instanceof Error ? err.message : 'Error deleting monitoring point';
    return rejectWithValue(message);
  }
});

export const updateMonitoringPoint = createAsyncThunk<
  MonitoringPoint,
  { id: string; data: UpdateMonitoringPointData },
  { rejectValue: string }
>('monitoring/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    console.log('🔄 Updating monitoring point:', { id, data });
    const res = await api.patch<MonitoringPoint>(`/monitoring-points/${id}`, data);
    console.log('Monitoring point updated successfully:', res.data);
    return res.data;
  } catch (err: unknown) {
    console.error('❌ Error updating monitoring point:', err);
    const message = err instanceof Error ? err.message : 'Error updating monitoring point';
    return rejectWithValue(message);
  }
});

export const createMonitoringPoint = createAsyncThunk<
  MonitoringPoint,
  { name: string; machineId: string },
  { rejectValue: string }
>('monitoring/create', async (payload, { rejectWithValue }) => {
  try {
    console.log('🔄 Creating monitoring point:', payload);
    const res = await api.post<MonitoringPoint>('/monitoring-points', payload);
    console.log('Monitoring point created successfully:', res.data);
    return res.data;
  } catch (err: unknown) {
    console.error('❌ Error creating monitoring point:', err);
    const message = err instanceof Error ? err.message : 'Error creating monitoring point';
    return rejectWithValue(message);
  }
});

export const assignSensor = createAsyncThunk<
  MonitoringPoint,
  { monitoringPointId: string; sensorModel: 'TcAg' | 'TcAs' | 'HF+' },
  { rejectValue: string }
>('monitoring/assignSensor', async (payload, { rejectWithValue }) => {
  try {
    console.log('🔄 Assigning sensor:', payload);
    const res = await api.post<MonitoringPoint>('/monitoring-points/assign-sensor', payload);
    console.log('Sensor assigned successfully:', res.data);
    return res.data;
  } catch (err: unknown) {
    console.error('❌ Error assigning sensor:', err);
    const message = err instanceof Error ? err.message : 'Error assigning sensor';
    return rejectWithValue(message);
  }
});

const slice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
      state.lastUpdate = new Date().toISOString();
      saveStateToStorage(state);
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.lastUpdate = new Date().toISOString();
      saveStateToStorage(state);
    },
    clearError(state) {
      state.error = null;
      state.lastUpdate = new Date().toISOString();
      saveStateToStorage(state);
    },
   
    addMonitoringPointLocally(state, action: PayloadAction<MonitoringPoint>) {
      if (!Array.isArray(state.items)) {
        state.items = [];
      }
      state.items.unshift(action.payload);
      state.total = (state.total || 0) + 1;
      state.lastUpdate = new Date().toISOString();
      saveStateToStorage(state);
      console.log('Monitoring point added locally:', action.payload._id);
    },
    
    syncWithBackend(state) {
      state.loading = true;
    },
    
    clearStorage(state) {
      state.items = [];
      state.page = 1;
      state.limit = 5;
      state.total = 0;
      state.loading = false;
      state.error = null;
      state.lastUpdate = new Date().toISOString();
      localStorage.removeItem('monitoringState');
      console.log('🗑️ Storage cleared');
    },
    
    forceRefresh(state) {
      state.loading = true;
      state.lastUpdate = new Date().toISOString();
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchMonitoringPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('🔄 Fetching monitoring points...');
      })
      .addCase(fetchMonitoringPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.error = null;
        state.lastUpdate = new Date().toISOString();
        saveStateToStorage(state);
        console.log('Monitoring points loaded:', {
          items: state.items.length,
          page: state.page,
          total: state.total
        });
      })
      .addCase(fetchMonitoringPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? 'Error fetching monitoring points';
        state.lastUpdate = new Date().toISOString();
        saveStateToStorage(state);
        console.error('❌ Failed to fetch monitoring points:', state.error);
      })
     
      .addCase(createMonitoringPoint.pending, (state) => {
        state.error = null;
        console.log('🔄 Creating monitoring point...');
      })
      .addCase(createMonitoringPoint.fulfilled, (state, action) => {
        state.error = null;
        state.lastUpdate = new Date().toISOString();
     
        saveStateToStorage(state);
        console.log('Monitoring point creation confirmed:', action.payload._id);
      })
      .addCase(createMonitoringPoint.rejected, (state, action) => {
        state.error = action.payload ?? action.error.message ?? 'Error creating monitoring point';
        state.lastUpdate = new Date().toISOString();
        saveStateToStorage(state);
        console.error('❌ Failed to create monitoring point:', state.error);
      })
    
      .addCase(deleteMonitoringPoint.pending, (state) => {
        state.error = null;
        console.log('🔄 Deleting monitoring point...');
      })
      .addCase(deleteMonitoringPoint.fulfilled, (state, action) => {
        if (Array.isArray(state.items)) {
          const initialLength = state.items.length;
          state.items = state.items.filter((item) => item._id !== action.payload);
          state.total = Math.max(0, (state.total || 1) - 1);
          console.log('Monitoring point removed from state:', {
            removedId: action.payload,
            before: initialLength,
            after: state.items.length
          });
        }
        if (state.items.length === 0 && state.page > 1) {
          state.page = state.page - 1;
        }
        state.error = null;
        state.lastUpdate = new Date().toISOString();
        saveStateToStorage(state);
        console.log('Monitoring point deletion completed successfully');
      })
      .addCase(deleteMonitoringPoint.rejected, (state, action) => {
        state.error = action.payload ?? action.error.message ?? 'Error deleting monitoring point';
        state.lastUpdate = new Date().toISOString();
        saveStateToStorage(state);
        console.error('❌ Failed to delete monitoring point:', state.error);
      })
      
      .addCase(assignSensor.pending, (state) => {
        state.error = null;
        console.log('🔄 Assigning sensor...');
      })
      .addCase(assignSensor.fulfilled, (state, action) => {
        if (Array.isArray(state.items)) {
          const index = state.items.findIndex((item) => item._id === action.payload._id);
          if (index >= 0) {
            state.items[index] = action.payload;
            console.log('Sensor assigned successfully to:', action.payload._id);
          }
        }
        state.error = null;
        state.lastUpdate = new Date().toISOString();
        saveStateToStorage(state);
      })
      .addCase(assignSensor.rejected, (state, action) => {
        state.error = action.payload ?? action.error.message ?? 'Error assigning sensor';
        state.lastUpdate = new Date().toISOString();
        saveStateToStorage(state);
        console.error('❌ Failed to assign sensor:', state.error);
      })
     
      .addCase(updateMonitoringPoint.pending, (state) => {
        state.error = null;
        console.log('🔄 Updating monitoring point...');
      })
      .addCase(updateMonitoringPoint.fulfilled, (state, action) => {
        if (Array.isArray(state.items)) {
          const index = state.items.findIndex((item) => item._id === action.payload._id);
          if (index >= 0) {
            state.items[index] = action.payload;
            console.log('Monitoring point updated successfully:', action.payload._id);
          }
        }
        state.error = null;
        state.lastUpdate = new Date().toISOString();
        saveStateToStorage(state);
      })
      .addCase(updateMonitoringPoint.rejected, (state, action) => {
        state.error = action.payload ?? action.error.message ?? 'Error updating monitoring point';
        state.lastUpdate = new Date().toISOString();
        saveStateToStorage(state);
        console.error('❌ Failed to update monitoring point:', state.error);
      });
  },
});

export const { 
  setPage, 
  setLimit, 
  clearError, 
  addMonitoringPointLocally, 
  syncWithBackend,
  clearStorage,
  forceRefresh
} = slice.actions;
export default slice.reducer;