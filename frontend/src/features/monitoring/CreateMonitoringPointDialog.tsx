
import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createMonitoringPoint } from './monitoringSlice';
import { useSnackbar } from 'notistack';
import { MonitoringPoint } from '../../types';

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  machineId: yup.string().required('Máquina é obrigatória'),
}).required();

type FormValues = yup.InferType<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (newPoint: MonitoringPoint) => void;
};

const CreateMonitoringPointDialog: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const machines = useAppSelector((s) => s.machines.items);
  const { enqueueSnackbar } = useSnackbar();

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', machineId: '' },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("🔄 Creating monitoring point:", data);
      const result = await dispatch(createMonitoringPoint({ 
        name: data.name, 
        machineId: data.machineId 
      })).unwrap();
      
      console.log("Monitoring point created successfully:", result);
      enqueueSnackbar('Monitoring point criado com sucesso', { variant: 'success' });
      reset();
      onClose();
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error("❌ Error creating monitoring point:", err);
      const msg = err instanceof Error ? err.message : 'Erro ao criar monitoring point';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

 
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSubmit)(e).catch(err => {
      console.error('Form submission error:', err);
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      aria-labelledby="create-monitoring-point-dialog-title"
      disableEnforceFocus
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="create-monitoring-point-dialog-title">
        Novo Monitoring Point
      </DialogTitle>
      <DialogContent>
        <form 
          id="create-mp-form" 
          onSubmit={handleFormSubmit}
          noValidate
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField 
                {...field} 
                label="Nome" 
                fullWidth 
                margin="normal" 
                error={!!fieldState.error} 
                helperText={fieldState.error?.message}
                disabled={isSubmitting}
                autoFocus
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
                margin="normal" 
                error={!!fieldState.error} 
                helperText={fieldState.error?.message}
                disabled={isSubmitting}
              >
                <MenuItem value="">Selecione</MenuItem>
                {machines.map((m) => (
                  <MenuItem key={m._id} value={m._id}>
                    {m.name} ({m.type})
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          form="create-mp-form" 
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Criando...' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateMonitoringPointDialog;