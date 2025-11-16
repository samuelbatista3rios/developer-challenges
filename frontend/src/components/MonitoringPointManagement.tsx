/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
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
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { 
  fetchMonitoringPoints, 
  deleteMonitoringPoint,
  addMonitoringPointLocally 
} from '../features/monitoring/monitoringSlice';
import CreateMonitoringPointDialog from '../features/monitoring/CreateMonitoringPointDialog';
import EditMonitoringPointDialog from '../features/monitoring/EditMonitoringPointDialog';
import ConfirmDialog from './ConfirmDialog';
import { MonitoringPoint } from '../types';

const MonitoringPointManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const monitoringState = useAppSelector((state) => state.monitoring);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] = useState<MonitoringPoint | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Garantir que items seja sempre um array
  const items = Array.isArray(monitoringState.items) ? monitoringState.items : [];

  useEffect(() => {
    console.log("🔄 Carregando pontos de monitoramento...");
    dispatch(fetchMonitoringPoints({}));
  }, [dispatch]);

  const handleEdit = (point: MonitoringPoint): void => {
    setSelectedPoint(point);
    setEditDialogOpen(true);
  };

  const handleDelete = (point: MonitoringPoint): void => {
    setSelectedPoint(point);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (selectedPoint) {
      try {
        console.log("🗑️ Excluindo ponto:", selectedPoint._id);
        await dispatch(deleteMonitoringPoint(selectedPoint._id)).unwrap();
        setDeleteDialogOpen(false);
        setSelectedPoint(null);
        setError(null);
        
        // Recarregar os dados para garantir sincronização
        dispatch(fetchMonitoringPoints({}));
      } catch (err: any) {
        console.error("❌ Erro ao excluir:", err);
        setError(err.message || 'Erro ao excluir ponto de monitoramento');
      }
    }
  };

  const handleCreateSuccess = (newPoint: MonitoringPoint) => {
    console.log("✅ Ponto criado com sucesso:", newPoint);
    setCreateDialogOpen(false);
    // Adicionar localmente e recarregar dados
    dispatch(addMonitoringPointLocally(newPoint));
    dispatch(fetchMonitoringPoints({}));
  };

  const getMachineName = (machine: MonitoringPoint['machine']): string => {
    if (typeof machine === 'string') return machine;
    return machine?.name || 'Unknown';
  };

  const getMachineType = (machine: MonitoringPoint['machine']): string => {
    if (typeof machine === 'string') return 'Unknown';
    return machine?.type || 'Unknown';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Monitoring Point Management
        </Typography>
        <Button
          variant="contained"
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Monitoring Point
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Machine</TableCell>
              <TableCell>Machine Type</TableCell>
              <TableCell>Sensor Model</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monitoringState.loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>Carregando...</Typography>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="textSecondary">
                    Nenhum ponto de monitoramento encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((point: MonitoringPoint) => (
                <TableRow key={point._id} hover>
                  <TableCell>
                    <Typography variant="subtitle1">{point.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      ID: {point._id}
                    </Typography>
                  </TableCell>
                  <TableCell>{getMachineName(point.machine)}</TableCell>
                  <TableCell>{getMachineType(point.machine)}</TableCell>
                  <TableCell>{point.sensorModel || 'Not assigned'}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(point)}
                      aria-label="edit"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(point)}
                      aria-label="delete"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateMonitoringPointDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditMonitoringPointDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        monitoringPoint={selectedPoint}
        onSuccess={() => {
          setEditDialogOpen(false);
          dispatch(fetchMonitoringPoints({}));
        }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Monitoring Point"
        description={`Are you sure you want to delete "${selectedPoint?.name}"? This action cannot be undone.`}
      />
    </Box>
  );
};

export default MonitoringPointManagement;