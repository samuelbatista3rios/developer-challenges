
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

type Props = { open: boolean; onClose: () => void; onConfirm: () => void; title?: string; description?: string };

const ConfirmDialog: React.FC<Props> = ({ open, onClose, onConfirm, title = 'Confirm', description }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      {description && <Typography>{description}</Typography>}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="contained" color="error" onClick={onConfirm}>Excluir</Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
