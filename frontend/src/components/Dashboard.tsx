
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import DashboardMetrics from './DashboardMetrics';
import MachineManagement from './MachineManagement';
import MonitoringPointManagement from './MonitoringPointManagement';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Visão Geral
        </Typography>
        <DashboardMetrics />
      </Paper>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { md: '1fr 1fr' } }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Gerenciamento de Máquinas
          </Typography>
          <MachineManagement />
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Gerenciamento de Pontos de Monitoramento
          </Typography>
          <MonitoringPointManagement />
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;