/* eslint-disable react-hooks/set-state-in-effect */
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
import type { AppDispatch } from "../app/store";
import type { MonitoringPoint } from "../types";

interface EditMonitoringPointDialogProps {
  open: boolean;
  onClose: () => void;
  monitoringPoint: MonitoringPoint | null;
  onSuccess?: () => void;
}

export default function EditMonitoringPointDialog({
  open,
  onClose,
  monitoringPoint,
  onSuccess,
}: EditMonitoringPointDialogProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [machineId, setMachineId] = useState("");

  useEffect(() => {
    if (monitoringPoint) {
      setName(monitoringPoint.name);
      const machineIdValue = typeof monitoringPoint.machine === 'string' 
        ? monitoringPoint.machine 
        : monitoringPoint.machine?._id || '';
      setMachineId(machineIdValue);
    }
  }, [monitoringPoint]);

  const handleSave = () => {
    if (!monitoringPoint) return;

    dispatch(
      updateMonitoringPoint({
        id: monitoringPoint._id,
        data: { name, machineId },
      })
    );
    
    onClose();
    if (onSuccess) {
      onSuccess();
    }
  };

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
          onClick={handleSave}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}