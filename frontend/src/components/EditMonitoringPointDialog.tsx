import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateMonitoringPoint } from "../features/monitoring/monitoringSlice";
import type { AppDispatch } from "../store";

export default function EditMonitoringPointDialog({
  open,
  onClose,
  monitoringPoint,
}) {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [machineId, setMachineId] = useState("");

  useEffect(() => {
    if (monitoringPoint) {
      setName(monitoringPoint.name);
      setMachineId(monitoringPoint.machineId);
    }
  }, [monitoringPoint]);

  if (!monitoringPoint) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Monitoring Point</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Machine ID"
          value={machineId}
          onChange={(e) => setMachineId(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>

        <Button
          variant="contained"
          onClick={() => {
            dispatch(
              updateMonitoringPoint({
                id: monitoringPoint._id,
                data: { name, machineId },
              })
            );
            onClose();
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
