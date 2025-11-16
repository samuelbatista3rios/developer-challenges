
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';
import { Machine } from '../../types';

type State = {
  items: Machine[];
  loading: boolean;
  error?: string | null;
};

const initialState: State = { items: [], loading: false, error: null };

export const fetchMachines = createAsyncThunk<Machine[], void, { rejectValue: string }>(
  'machines/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<Machine[]>('/machines');
      return res.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching machines';
      return rejectWithValue(msg);
    }
  },
);

export const createMachine = createAsyncThunk<Machine, { name: string; type: 'Pump' | 'Fan' }, { rejectValue: string }>(
  'machines/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post<Machine>('/machines', payload);
      return res.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating machine';
      return rejectWithValue(msg);
    }
  },
);

export const updateMachine = createAsyncThunk<
  Machine,
  { id: string; data: Partial<Pick<Machine, 'name' | 'type'>> },
  { rejectValue: string }
>('machines/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.patch<Machine>(`/machines/${id}`, data);
    return res.data;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error updating machine';
    return rejectWithValue(msg);
  }
});

export const deleteMachine = createAsyncThunk<string, string, { rejectValue: string }>(
  'machines/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/machines/${id}`);
      return id;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting machine';
      return rejectWithValue(msg);
    }
  },
);

const slice = createSlice({
  name: 'machines',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchMachines.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchMachines.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? a.error.message ?? 'Error';
      })
      .addCase(createMachine.fulfilled, (s, a) => {
        s.items.push(a.payload);
      })
      .addCase(updateMachine.fulfilled, (s, a) => {
        const idx = s.items.findIndex((it) => it._id === a.payload._id);
        if (idx >= 0) s.items[idx] = a.payload;
      })
      .addCase(deleteMachine.fulfilled, (s, a) => {
        s.items = s.items.filter((it) => it._id !== a.payload);
      });
  },
});

export default slice.reducer;
