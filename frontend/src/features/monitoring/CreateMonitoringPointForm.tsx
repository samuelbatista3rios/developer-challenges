
import React, { useEffect } from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMachines } from '../machines/machinesSlice';
import api from '../../api/api';
import { useSnackbar } from 'notistack';
import { Machine } from '../../types';

type FormValues = { 
  name: string; 
  machineId: string;
};

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  machineId: yup.string().required('Máquina é obrigatória'),
});

interface CreateMonitoringPointFormProps {
  onCreated?: () => void;
}

const CreateMonitoringPointForm: React.FC<CreateMonitoringPointFormProps> = ({ onCreated }) => {
  const dispatch = useAppDispatch();
  const machines = useAppSelector((s) => s.machines.items);
  const { enqueueSnackbar } = useSnackbar();

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', machineId: '' },
  });

  useEffect(() => {
    if (machines.length === 0) dispatch(fetchMachines());
  }, [dispatch, machines.length]);

  const onSubmit = async (data: FormValues): Promise<void> => {
    try {
      await api.post('/monitoring-points', { 
        name: data.name, 
        machineId: data.machineId 
      });
      enqueueSnackbar('Monitoring point criado', { variant: 'success' });
      reset();
      onCreated?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar monitoring point';
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit(onSubmit)} 
      noValidate
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '2fr 1fr auto'
        },
        gap: 2,
        alignItems: 'start'
      }}
    >
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Nome do ponto"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            disabled={isSubmitting}
          />
        )}
      />

      <Controller
        name="machineId"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select
            label="Máquina"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            disabled={isSubmitting}
          >
            <MenuItem value="">Selecione</MenuItem>
            {machines.map((machine: Machine) => (
              <MenuItem key={machine._id} value={machine._id}>
                {machine.name} ({machine.type})
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Button 
        type="submit" 
        variant="contained" 
        disabled={isSubmitting}
        sx={{ height: '56px' }} // Para alinhar com os campos
      >
        {isSubmitting ? 'Criando...' : 'Criar'}
      </Button>
    </Box>
  );
};

export default CreateMonitoringPointForm;