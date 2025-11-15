import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMachines, createMachine } from './machinesSlice';
import type { RootState } from '../../app/store';

const MachinesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s: RootState) => s.machines);
  const [name, setName] = useState('');
  const [type, setType] = useState<'Pump'|'Fan'>('Pump');

  useEffect(() => {
    dispatch(fetchMachines() as any);
  }, [dispatch]);

  const handleCreate = async () => {
    if (!name) return;
    await dispatch(createMachine({ name, type }) as any);
    setName('');
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>Machines</Typography>
      <Paper sx={{ p:2, mb:3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}><TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} fullWidth/></Grid>
          <Grid item xs={3}>
            <TextField select label="Tipo" value={type} onChange={(e) => setType(e.target.value as 'Pump'|'Fan')} SelectProps={{ native: true }}>
              <option value="Pump">Pump</option>
              <option value="Fan">Fan</option>
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" onClick={handleCreate} disabled={loading}>Criar</Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        {items.map((m) => (
          <Grid item key={m._id} xs={12} md={6}>
            <Paper sx={{ p:2 }}>
              <Typography variant="h6">{m.name}</Typography>
              <Typography variant="body2">{m.type}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default MachinesPage;
