import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box
} from '@mui/material';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
<AppBar position="static">
  <Toolbar>
    <Button 
      color="inherit" 
      onClick={() => navigate('/')}
      variant={location.pathname === '/' ? 'outlined' : 'text'}
      sx={{ 
        fontSize: '1.25rem',
        fontWeight: 'bold',
        textTransform: 'none'
      }}
    >
      DASHBORARD
    </Button>
    
    <Typography sx={{ flexGrow: 1 }}></Typography>
    
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button 
        color="inherit" 
        onClick={() => navigate('/machines')}
        variant={location.pathname === '/machines' ? 'outlined' : 'text'}
      >
        Machines
      </Button>
      
      <Button 
        color="inherit" 
        onClick={() => navigate('/monitoring-points')}
        variant={location.pathname === '/monitoring-points' ? 'outlined' : 'text'}
      >
        Monitoring Points
      </Button>
      
      <Button color="inherit" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  </Toolbar>
</AppBar>

<Container sx={{ mt: 4, mb: 4 }}>
  {children}
</Container>
    </>
  );
};

export default Layout;