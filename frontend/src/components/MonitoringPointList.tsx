
import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMonitoringPoints } from '../features/monitoring/monitoringSlice';
import { MonitoringPoint } from '../types';

const MonitoringPointList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.monitoring);

  useEffect(() => {
    dispatch(fetchMonitoringPoints({}));
  }, [dispatch]);

  const getMachineName = (machine: MonitoringPoint['machine']): string => {
    if (typeof machine === 'string') return machine;
    return machine?.name || 'Unknown';
  };

  const getMachineType = (machine: MonitoringPoint['machine']): string => {
    if (typeof machine === 'string') return 'Unknown';
    return machine?.type || 'Unknown';
  };

  const getSensorColor = (sensorModel: string | undefined): 'primary' | 'secondary' | 'success' | 'default' => {
    switch (sensorModel) {
      case 'TcAg': return 'primary';
      case 'TcAs': return 'secondary';
      case 'HF+': return 'success';
      default: return 'default';
    }
  };

  const getStatusInfo = (sensorModel: string | undefined): { label: string; color: 'success' | 'default' } => {
    return sensorModel 
      ? { label: "Active", color: "success" as const }
      : { label: "Inactive", color: "default" as const };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Monitoring Points List
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Monitoring Point</TableCell>
              <TableCell>Machine</TableCell>
              <TableCell>Machine Type</TableCell>
              <TableCell>Sensor Model</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No monitoring points found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((point: MonitoringPoint) => {
                const statusInfo = getStatusInfo(point.sensorModel);
                
                return (
                  <TableRow key={point._id} hover>
                    <TableCell>
                      <Typography variant="subtitle1">{point.name}</Typography>
                    </TableCell>
                    <TableCell>{getMachineName(point.machine)}</TableCell>
                    <TableCell>{getMachineType(point.machine)}</TableCell>
                    <TableCell>
                      {point.sensorModel ? (
                        <Chip
                          label={point.sensorModel}
                          color={getSensorColor(point.sensorModel)}
                          size="small"
                        />
                      ) : (
                        <Chip 
                          label="Not assigned" 
                          variant="outlined" 
                          size="small" 
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusInfo.label}
                        color={statusInfo.color}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MonitoringPointList;