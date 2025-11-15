import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonitoringPoints } from './monitoringSlice';
import type { RootState } from '../../app/store';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper } from '@mui/material';

const MonitoringPointsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s: RootState) => s.monitoring);

  useEffect(() => {
    dispatch(fetchMonitoringPoints({ page: 1, limit: 5 }) as any);
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" mb={2}>Monitoring Points</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Machine Name</TableCell>
              <TableCell>Machine Type</TableCell>
              <TableCell>Monitoring Point</TableCell>
              <TableCell>Sensor Model</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((mp) => (
              <TableRow key={mp._id}>
                <TableCell>{typeof mp.machine === 'string' ? mp.machine : mp.machine.name}</TableCell>
                <TableCell>{typeof mp.machine === 'string' ? '-' : mp.machine.type}</TableCell>
                <TableCell>{mp.name}</TableCell>
                <TableCell>{mp.sensorModel ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MonitoringPointsPage;
