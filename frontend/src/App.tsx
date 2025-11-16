
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import LoginPage from './features/auth/LoginPage';
import MachinesPage from './features/machines/MachinesPage';
import MonitoringPointsPage from './features/monitoring/MonitoringPointsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiDialog: {
      defaultProps: {
        disableEnforceFocus: true, 
        disableScrollLock: true,   
      },
    },
    MuiModal: {
      defaultProps: {
        disableEnforceFocus: true,
      },
    },
  },
});

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      autoHideDuration={3000}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/machines" element={
            <ProtectedRoute>
              <Layout>
                <MachinesPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/monitoring-points" element={
            <ProtectedRoute>
              <Layout>
                <MonitoringPointsPage />
              </Layout>
            </ProtectedRoute>
          } />

         
          <Route path="*" element={
            <ProtectedRoute>
              <Layout>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '50vh',
                  flexDirection: 'column'
                }}>
                  <h1>404 - Página não encontrada</h1>
                  <p>A página que você está procurando não existe.</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  </ThemeProvider>
);

export default App;