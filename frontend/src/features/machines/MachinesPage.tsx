
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMachines, deleteMachine } from './machinesSlice';
import CreateMachineForm from './CreateMachineForm';
import EditMachineDialog from './EditMachineDialog';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useSnackbar } from 'notistack';
import { Machine } from '../../types';

const MachinesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const machinesState = useAppSelector((s) => s.machines);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Machine | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

 
  const items = Array.isArray(machinesState.items) ? machinesState.items : [];

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  const openEdit = (m: Machine) => {
    setSelected(m);
    setEditOpen(true);
  };

  const openDelete = (id: string) => {
    setToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      await dispatch(deleteMachine(toDelete)).unwrap();
      enqueueSnackbar('Máquina removida', { variant: 'success' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setConfirmOpen(false);
      setToDelete(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>Machines</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <CreateMachineForm onCreated={() => dispatch(fetchMachines())} />
      </Paper>

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
        {items.map((m) => (
          <Paper sx={{ p: 2, position: 'relative' }} key={m._id}>
            <Typography variant="h6">{m.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              Type: {m.type}
            </Typography>
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <IconButton size="small" onClick={() => openEdit(m)}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => openDelete(m._id)}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>

      <EditMachineDialog open={editOpen} onClose={() => setEditOpen(false)} machine={selected} />
      <ConfirmDialog 
        open={confirmOpen} 
        onClose={() => setConfirmOpen(false)} 
        onConfirm={handleConfirmDelete} 
        title="Excluir máquina" 
        description="Deseja realmente excluir esta máquina?" 
      />
    </Box>
  );
};

export default MachinesPage;