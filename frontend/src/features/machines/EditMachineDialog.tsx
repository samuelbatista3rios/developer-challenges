
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch } from '../../app/hooks';
import { updateMachine } from './machinesSlice';
import { useSnackbar } from 'notistack';

type Props = { open: boolean; onClose: () => void; machine: { _id: string; name: string; type: 'Pump' | 'Fan' } | null };

type FormValues = { name: string; type: 'Pump' | 'Fan' };

const EditMachineDialog: React.FC<Props> = ({ open, onClose, machine }) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: { name: '', type: 'Pump' },
  });

  React.useEffect(() => {
    if (machine) {
      setValue('name', machine.name);
      setValue('type', machine.type);
    } else {
      reset();
    }
  }, [machine, setValue, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!machine) return;
    try {
      await dispatch(updateMachine({ id: machine._id, data })).unwrap();
      enqueueSnackbar('Máquina atualizada', { variant: 'success' });
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Máquina</DialogTitle>
      <DialogContent>
        <form id="edit-machine-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <TextField {...field} label="Nome" fullWidth sx={{ mt: 1 }} />}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Tipo" fullWidth sx={{ mt: 2 }}>
                <MenuItem value="Pump">Pump</MenuItem>
                <MenuItem value="Fan">Fan</MenuItem>
              </TextField>
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" form="edit-machine-form" variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMachineDialog;
