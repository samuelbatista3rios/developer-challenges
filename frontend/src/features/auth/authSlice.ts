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

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', payload);
      return res.data.access_token as string;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Login failed');
    }
  }
);

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
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, action) => {
        s.loading = false;
        s.token = action.payload;
        localStorage.setItem('access_token', action.payload);
      })
      .addCase(login.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
