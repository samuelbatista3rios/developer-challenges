import React, { useState } from 'react';
import { Box, Button, TextField, Paper, Typography } from '@mui/material';
import { useAppDispatch } from '../../hooks';
import { login } from './authSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s: RootState) => s.auth);
  const [email, setEmail] = useState('user@dynamox.com');
  const [password, setPassword] = useState('123456');

  const handle = async () => {
    const res = await dispatch(login({ email, password }));
    if (login.fulfilled.match(res)) {
      navigate('/');
    }
  };

  return (
    <Paper sx={{ maxWidth: 420, mx: 'auto', p: 4 }}>
      <Typography variant="h5" mb={2}>Entrar</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={handle} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </Box>
    </Paper>
  );
};

export default LoginPage;
