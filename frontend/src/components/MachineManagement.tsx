/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMachines, deleteMachine } from '../features/machines/machinesSlice';
import CreateMachineForm from '../features/machines/CreateMachineForm';
import EditMachineDialog from '../features/machines/EditMachineDialog';
import ConfirmDialog from './ConfirmDialog';
import { Machine } from '../types';

const MachineManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.machines);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  const handleEdit = (machine: Machine): void => {
    setSelectedMachine(machine);
    setEditDialogOpen(true);
  };

  const handleDelete = (machine: Machine): void => {
    setSelectedMachine(machine);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = (): void => {
    if (selectedMachine) {
      dispatch(deleteMachine(selectedMachine._id));
      setDeleteDialogOpen(false);
      setSelectedMachine(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Machine Management
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create New Machine
        </Typography>
        <CreateMachineForm onCreated={() => dispatch(fetchMachines())} />
      </Paper>

      <Typography variant="h6" gutterBottom>
        Existing Machines
      </Typography>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 2
        }}
      >
        {items.map((machine) => (
          <Paper sx={{ p: 2, position: 'relative' }} key={machine._id}>
            <Typography variant="h6">{machine.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              Type: {machine.type}
            </Typography>
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <IconButton
                size="small"
                onClick={() => handleEdit(machine)}
                aria-label="edit"
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDelete(machine)}
                aria-label="delete"
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>

      <EditMachineDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        machine={selectedMachine}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Machine"
        description={`Are you sure you want to delete "${selectedMachine?.name}"?`}
      />
    </Box>
  );
};

export default MachineManagement;