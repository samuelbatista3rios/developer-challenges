import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  Typography,
} from "@mui/material";

export default function DeleteConfirmDialog({
  open,
  onClose,
  target,
  onConfirm,
}) {
  if (!target) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar remoção</DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja remover:
          <strong> {target.name} </strong>?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => {
            onConfirm(target._id);
            onClose();
          }}
        >
          Remover
        </Button>
      </DialogActions>
    </Dialog>
  );
}
