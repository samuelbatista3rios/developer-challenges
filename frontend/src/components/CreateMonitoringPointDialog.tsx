import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createMonitoringPoint } from "../features/monitoring/monitoringSlice";
import type { AppDispatch } from "../store";

export default function CreateMonitoringPointDialog({ open, onClose }) {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [machineId, setMachineId] = useState("");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Novo Monitoring Point</DialogTitle>
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
            dispatch(createMonitoringPoint({ name, machineId }));
            onClose();
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
