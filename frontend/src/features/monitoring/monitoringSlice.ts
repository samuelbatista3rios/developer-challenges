import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';
import { MonitoringPoint } from '../../types';

type State = {
  items: MonitoringPoint[];
  page: number;
  total?: number;
  loading: boolean;
  error?: string | null;
};

const initialState: State = { items: [], page: 1, loading: false, error: null };

export const fetchMonitoringPoints = createAsyncThunk(
  'monitoring/fetch',
  async (params: { page?: number; limit?: number; sortBy?: string; order?: 'asc'|'desc' }) => {
    const res = await api.get<MonitoringPoint[]>('/monitoring-points', { params });
    return { data: res.data, page: params.page ?? 1 };
  }
);

const slice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMonitoringPoints.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchMonitoringPoints.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.data; s.page = a.payload.page; })
     .addCase(fetchMonitoringPoints.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Error'; });
  },
});

export default slice.reducer;
