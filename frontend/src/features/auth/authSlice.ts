
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';

type AuthState = {
  token: string | null;
  loading: boolean;
  error?: string | null;
};

const initialState: AuthState = {
  token: localStorage.getItem('access_token'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  string, 
  { email: string; password: string }, 
  { rejectValue: string } 
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post<{ access_token: string }>('/auth/login', payload);
    return res.data.access_token;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      localStorage.removeItem('access_token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, action) => {
        s.loading = false;
        s.token = action.payload;
        localStorage.setItem('access_token', action.payload);
      })
      .addCase(login.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload ?? 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
