
import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MonitoringPoint } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateMonitoringPoint } from './monitoringSlice';
import { useSnackbar } from 'notistack';


const schema = yup
  .object({
    name: yup.string().required('Nome é obrigatório'),
    machineId: yup.string().required('Máquina é obrigatória'),
    sensorModel: yup
      .string()
      .oneOf(['', 'TcAg', 'TcAs', 'HF+'] as const, 'Sensor inválido')
      .defined(), 
  })
  .required();


type FormValues = yup.InferType<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  monitoringPoint: MonitoringPoint | null;
  onSuccess?: () => void;
};

const EditMonitoringPointDialog: React.FC<Props> = ({ open, onClose, monitoringPoint, onSuccess }) => {
  const dispatch = useAppDispatch();
  const machines = useAppSelector((s) => s.machines.items);
  const { enqueueSnackbar } = useSnackbar();

  const { control, handleSubmit, reset, setValue, watch } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', machineId: '', sensorModel: '' },
  });

  useEffect(() => {
    if (monitoringPoint) {
      setValue('name', monitoringPoint.name);
      const mid = typeof monitoringPoint.machine === 'string' ? monitoringPoint.machine : (monitoringPoint.machine?._id ?? '');
      setValue('machineId', mid);
      setValue('sensorModel', (monitoringPoint.sensorModel ?? '') as FormValues['sensorModel']);
    } else {
      reset();
    }
  }, [monitoringPoint, setValue, reset]);

 
  const selectedMachineId = watch('machineId');
  const selectedMachine = machines.find((m) => m._id === selectedMachineId);
  const isPump = selectedMachine?.type === 'Pump';

  const onSubmit = async (data: FormValues) => {
    if (isPump && (data.sensorModel === 'TcAg' || data.sensorModel === 'TcAs')) {
      enqueueSnackbar('TcAg / TcAs não são permitidos para máquinas do tipo Pump', { variant: 'error' });
      return;
    }
    if (!monitoringPoint) return;

    try {
      await dispatch(
        updateMonitoringPoint({
          id: monitoringPoint._id,
          data: {
            name: data.name,
            machineId: data.machineId,
            sensorModel: data.sensorModel === '' ? null : (data.sensorModel as 'TcAg' | 'TcAs' | 'HF+'),
          },
        }),
      ).unwrap();

      enqueueSnackbar('Monitoring point atualizado', { variant: 'success' });
      onClose();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Monitoring Point</DialogTitle>
      <DialogContent>
        <form id="edit-mp-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField {...field} label="Nome" fullWidth margin="normal" error={!!fieldState.error} helperText={fieldState.error?.message} />
            )}
          />

          <Controller
            name="machineId"
            control={control}
            render={({ field, fieldState }) => (
              <TextField {...field} select label="Máquina" fullWidth margin="normal" error={!!fieldState.error} helperText={fieldState.error?.message}>
                <MenuItem value="">Selecione</MenuItem>
                {machines.map((m) => (
                  <MenuItem key={m._id} value={m._id}>
                    {m.name} ({m.type})
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="sensorModel"
            control={control}
            render={({ field }) => (
              <TextField select label="Sensor Model" fullWidth margin="normal" {...field}>
                <MenuItem value="">Nenhum</MenuItem>
                <MenuItem value="TcAg" disabled={isPump}>
                  TcAg
                </MenuItem>
                <MenuItem value="TcAs" disabled={isPump}>
                  TcAs
                </MenuItem>
                <MenuItem value="HF+">HF+</MenuItem>
              </TextField>
            )}
          />
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" form="edit-mp-form" variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMonitoringPointDialog;