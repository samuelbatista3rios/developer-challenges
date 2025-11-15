import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';
import { Machine } from '../../types';

type State = {
  items: Machine[];
  loading: boolean;
  error?: string | null;
};

const initialState: State = { items: [], loading: false, error: null };

export const fetchMachines = createAsyncThunk('machines/fetch', async () => {
  const res = await api.get<Machine[]>('/machines');
  return res.data;
});

export const createMachine = createAsyncThunk('machines/create', async (payload: { name: string; type: 'Pump'|'Fan' }) => {
  const res = await api.post<Machine>('/machines', payload);
  return res.data;
});

const slice = createSlice({
  name: 'machines',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMachines.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchMachines.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
     .addCase(fetchMachines.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Error'; });
    b.addCase(createMachine.fulfilled, (s, a) => { s.items.push(a.payload); });
  },
});

export default slice.reducer;
