
import React from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from '../../app/hooks';
import { createMachine } from './machinesSlice';
import { useSnackbar } from 'notistack';
import { Machine } from '../../types';

type FormValues = { 
  name: string; 
  type: Machine['type']; 
};

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  type: yup.string().oneOf(['Pump', 'Fan'] as const).required('Tipo é obrigatório'),
});

interface CreateMachineFormProps {
  onCreated?: () => void;
}

const CreateMachineForm: React.FC<CreateMachineFormProps> = ({ onCreated }) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', type: 'Pump' },
  });

  const onSubmit = async (data: FormValues): Promise<void> => {
    try {
      await dispatch(createMachine(data)).unwrap();
      enqueueSnackbar('Machine criada', { variant: 'success' });
      reset();
      onCreated?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao criar máquina';
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
            label="Nome"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            disabled={isSubmitting}
          />
        )}
      />

      <Controller
        name="type"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select
            label="Tipo"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            disabled={isSubmitting}
          >
            <MenuItem value="Pump">Pump</MenuItem>
            <MenuItem value="Fan">Fan</MenuItem>
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

export default CreateMachineForm;