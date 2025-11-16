
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  Sensors
} from '@mui/icons-material';
import { useAppSelector } from '../app/hooks';

const DashboardMetrics: React.FC = () => {
  const machines = useAppSelector((state) => state.machines.items);
  const monitoringState = useAppSelector((state) => state.monitoring);
  
 
  const monitoringPoints = Array.isArray(monitoringState.items) ? monitoringState.items : [];

  const metrics = [
    {
      title: 'Total Machines',
      value: machines.length,
      icon: <Sensors sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      trend: 'up' as const
    },
    {
      title: 'Monitoring Points',
      value: monitoringPoints.length,
      icon: <Sensors sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      trend: 'up' as const
    },
    {
      title: 'Active Sensors',
      value: monitoringPoints.filter(mp => mp?.sensorModel).length,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      trend: 'up' as const
    },
    {
      title: 'Points without Sensors',
      value: monitoringPoints.filter(mp => !mp?.sensorModel).length,
      icon: <Warning sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      trend: 'down' as const
    }
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)'
        },
        gap: 3,
        width: '100%'
      }}
    >
      {metrics.map((metric, index) => (
        <Paper
          key={index}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: 140,
            background: `linear-gradient(135deg, ${metric.color}20, ${metric.color}40)`,
            border: `1px solid ${metric.color}30`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography color="textSecondary" gutterBottom variant="overline">
                {metric.title}
              </Typography>
              <Typography variant="h4" component="div">
                {metric.value}
              </Typography>
            </Box>
            <Box sx={{ color: metric.color }}>
              {metric.icon}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            {metric.trend === 'up' ? (
              <TrendingUp sx={{ color: '#2e7d32', mr: 1 }} />
            ) : (
              <TrendingDown sx={{ color: '#d32f2f', mr: 1 }} />
            )}
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {metric.trend === 'up' ? 'Positive' : 'Needs attention'}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default DashboardMetrics;