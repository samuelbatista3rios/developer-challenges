
import React, { useState } from 'react';
import { Box, Button, TextField, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login } from './authSlice';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState<string>('user@dynamox.com');
  const [password, setPassword] = useState<string>('123456');

  const handle = async () => {
    try {
      const action = await dispatch(login({ email, password }));
      if (login.fulfilled.match(action)) {
        navigate('/');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  if (token) {
    navigate('/');
    return null;
  }

  return (
    <Paper sx={{ maxWidth: 420, mx: 'auto', p: 4 }}>
      <Typography variant="h5" mb={2}>
        Entrar
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={handle} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </Box>
    </Paper>
  );
};

export default LoginPage;
