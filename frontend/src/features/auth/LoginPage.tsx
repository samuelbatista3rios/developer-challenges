import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Paper, Typography, Chip, Alert, Collapse, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login } from './authSlice';
import { Cloud, Warning, Info, ExpandMore, ExpandLess } from '@mui/icons-material';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState<string>('user@dynamox.com');
  const [password, setPassword] = useState<string>('123456');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showDeployInfo, setShowDeployInfo] = useState(false);

  // Verificar status do backend
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${backendUrl}/monitoring-points`, {
          method: 'GET',
        });
        
        if (response.status !== 404 && response.status !== 500) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (error) {
        setBackendStatus('offline');
        console.warn('Backend parece estar offline:', error);
      }
    };

    checkBackendStatus();
  }, []);

  const handle = async () => {
    try {
      const action = await dispatch(login({ email, password }));
      if (login.fulfilled.match(action)) {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (token) {
    navigate('/');
    return null;
  }

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  return (
    <Paper sx={{ maxWidth: 420, mx: 'auto', p: 4, mt: 4 }}>
      <Typography variant="h5" mb={2} align="center">
        Dynamox - Login
      </Typography>

      {/* Status do Backend */}
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Chip
          icon={backendStatus === 'online' ? <Cloud /> : <Warning />}
          label={
            backendStatus === 'checking' 
              ? 'Verificando backend...' 
              : backendStatus === 'online' 
              ? 'Backend Online' 
              : 'Backend Offline'
          }
          color={backendStatus === 'online' ? 'success' : backendStatus === 'offline' ? 'error' : 'default'}
          variant="outlined"
        />
        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
          {backendUrl.includes('render.com') ? 'Hospedado no Render.com' : backendUrl}
        </Typography>
      </Box>

      {backendStatus === 'offline' && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          O servidor backend pode estar iniciando. Aguarde alguns instantes.
        </Alert>
      )}

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
        <Button 
          variant="contained" 
          onClick={handle} 
          disabled={loading || backendStatus === 'offline'}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </Box>

      {/* Informações de deploy com nota expandível */}
      <Box sx={{ mt: 3 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            p: 1,
            cursor: 'pointer',
            '&:hover': { backgroundColor: 'grey.50' }
          }}
          onClick={() => setShowDeployInfo(!showDeployInfo)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Info color="info" sx={{ mr: 1 }} />
            <Typography variant="caption" color="text.secondary">
              <strong>Informações de Deploy</strong>
            </Typography>
          </Box>
          <IconButton size="small">
            {showDeployInfo ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Collapse in={showDeployInfo}>
          <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" component="div">
              <strong>Infraestrutura:</strong><br />
              • Frontend: Vercel<br />
              • Backend: Render.com<br />
              • Database: MongoDB Atlas
            </Typography>
            
            <Alert severity="info" sx={{ mt: 1, fontSize: '0.75rem' }}>
              <Typography variant="caption" component="div">
                <strong>⚠️ Nota sobre Deploy (Render.com)</strong><br />
                Se você estiver testando o backend hospedado no Render:<br />
                • Render free-tier hiberna após ~15 minutos sem uso<br />
                • O primeiro acesso fica lento enquanto o servidor "acorda"<br />
                • Esse comportamento é normal da plataforma gratuita
              </Typography>
            </Alert>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default LoginPage;