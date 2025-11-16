
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TableSortLabel,
  TableFooter,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import CreateMonitoringPointDialog from "./CreateMonitoringPointDialog";
import {
  fetchMonitoringPoints,
  assignSensor,
  setPage,
  addMonitoringPointLocally,
  clearStorage,
} from "./monitoringSlice";
import EditMonitoringPointDialog from "./EditMonitoringPointDialog";
import { fetchMachines } from "../machines/machinesSlice";
import type { MonitoringPoint } from "../../types";

type Column = {
  id: "machineName" | "machineType" | "mpName" | "sensorModel";
  label: string;
};
const columns: Column[] = [
  { id: "machineName", label: "Machine Name" },
  { id: "machineType", label: "Machine Type" },
  { id: "mpName", label: "Monitoring Point" },
  { id: "sensorModel", label: "Sensor Model" },
];

const MonitoringPointsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, page, limit, loading, total, lastUpdate } = useAppSelector((s) => s.monitoring);
  const [orderBy, setOrderBy] = useState<string>("name");
  const [createOpen, setCreateOpen] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [showDebug, setShowDebug] = useState(false);

  // edit dialog
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editTarget, setEditTarget] = useState<MonitoringPoint | null>(null);

  // assign sensor dialog
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMp, setSelectedMp] = useState<MonitoringPoint | null>(null);
  const [sensorModel, setSensorModel] = useState<"TcAg" | "TcAs" | "HF+" | "">("");

  // Debug detalhado
  useEffect(() => {
    console.log("🔍 MonitoringPointsPage - Estado atual:", {
      items: items?.length || 0,
      page,
      limit,
      loading,
      total,
      lastUpdate,
      hasLocalStorage: !!localStorage.getItem('monitoringState')
    });
    
    // Verificar se há dados no localStorage
    const storedState = localStorage.getItem('monitoringState');
    if (storedState) {
      const parsed = JSON.parse(storedState);
      console.log("💾 Estado no localStorage:", {
        items: parsed.items?.length || 0,
        lastUpdate: parsed.lastUpdate
      });
    }
  }, [items, page, limit, loading, total, lastUpdate]);

  // Carregar dados iniciais
  useEffect(() => {
    console.log("🔄 Initial fetch of monitoring points");
    dispatch(fetchMonitoringPoints({ page: 1, limit: 5, sortBy: orderBy, order }));
  }, [dispatch]);

  // Carregar dados quando mudar página, ordenação ou limite
  useEffect(() => {
    if (page > 0 && limit > 0) {
      console.log("🔄 Fetching with pagination:", { page, limit, orderBy, order });
      dispatch(fetchMonitoringPoints({ page, limit, sortBy: orderBy, order }));
    }
  }, [page, limit, orderBy, order, dispatch]);

  // ensure machines loaded for edit dialog
  const machines = useAppSelector((s) => s.machines.items);
  useEffect(() => {
    if (machines.length === 0) {
      dispatch(fetchMachines());
    }
  }, [dispatch, machines.length]);

  const handleSort = (col: string) => {
    const newOrder = orderBy === col && order === "asc" ? "desc" : "asc";
    setOrderBy(col);
    setOrder(newOrder);
    dispatch(fetchMonitoringPoints({ page: 1, limit: 5, sortBy: col, order: newOrder }));
  };

  const handleOpenAssign = (mp: MonitoringPoint) => {
    setSelectedMp(mp);
    setSensorModel((mp.sensorModel ?? "") as "TcAg" | "TcAs" | "HF+" | "");
    setOpen(true);
  };

  const handleAssign = async () => {
    if (!selectedMp || !sensorModel) return;
    try {
      await dispatch(
        assignSensor({ monitoringPointId: selectedMp._id, sensorModel })
      ).unwrap();
      setOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("❌ Error assigning sensor:", message);
    }
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    const nextPage = newPage + 1;
    dispatch(setPage(nextPage));
  };

  const handleSensorChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value as "TcAg" | "TcAs" | "HF+" | "";
    setSensorModel(value);
  };

  const openEditDialog = (mp: MonitoringPoint) => {
    setEditTarget(mp);
    setEditOpen(true);
  };

  const handleCreateSuccess = (newPoint: MonitoringPoint) => {
    console.log("✅ Create success - adding point locally:", newPoint);
    setCreateOpen(false);
    
    // Adicionar localmente com persistência
    dispatch(addMonitoringPointLocally(newPoint));
  };

  const handleForceRefresh = () => {
    console.log("🔄 Forçando refresh dos dados");
    dispatch(fetchMonitoringPoints({ page, limit: 5, sortBy: orderBy, order }));
  };

  const handleClearStorage = () => {
    console.log("🗑️ Limpando localStorage");
    dispatch(clearStorage());
  };

  // Garantir que items seja sempre um array
  const displayItems = Array.isArray(items) ? items : [];

  // helpers seguros para machine fields
  const machineName = (mp: MonitoringPoint): string => {
    if (!mp.machine) return "—";
    if (typeof mp.machine === "string") return mp.machine;
    return mp.machine?.name ?? "—";
  };
  const machineType = (mp: MonitoringPoint): string => {
    if (!mp.machine) return "—";
    if (typeof mp.machine === "string") return "—";
    return mp.machine?.type ?? "—";
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Monitoring Points</Typography>
        <Box display="flex" gap={1}>
          <Button 
            variant="outlined" 
            onClick={handleForceRefresh}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Refresh'}
          </Button>
          <Button variant="contained" onClick={() => setCreateOpen(true)}>
            Novo Monitoring Point
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={() => setShowDebug(!showDebug)}
          >
            Debug
          </Button>
        </Box>
      </Box>

      {showDebug && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Debug Info:</strong><br />
            Itens no estado: {displayItems.length}<br />
            Página: {page}<br />
            Total: {total || 0}<br />
            Última atualização: {lastUpdate ? new Date(lastUpdate).toLocaleString() : 'Nunca'}<br />
            <Button 
              size="small" 
              onClick={handleClearStorage}
              color="warning"
            >
              Limpar Storage
            </Button>
          </Typography>
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((c) => {
                const sortKey =
                  c.id === "mpName"
                    ? "name"
                    : c.id === "sensorModel"
                    ? "sensorModel"
                    : "machine.name";
                return (
                  <TableCell key={c.id}>
                    <TableSortLabel
                      active={orderBy === sortKey}
                      direction={order}
                      onClick={() => handleSort(sortKey)}
                    >
                      {c.label}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>Carregando...</Typography>
                </TableCell>
              </TableRow>
            ) : displayItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary">
                    Nenhum ponto de monitoramento encontrado
                  </Typography>
                  <Button 
                    variant="text" 
                    onClick={handleForceRefresh}
                    sx={{ mt: 1 }}
                  >
                    Tentar carregar novamente
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              displayItems.map((mp) => (
                <TableRow key={mp._id} hover>
                  <TableCell>{machineName(mp)}</TableCell>
                  <TableCell>{machineType(mp)}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">{mp.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      ID: {mp._id}
                    </Typography>
                  </TableCell>
                  <TableCell>{mp.sensorModel ?? "—"}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => openEditDialog(mp)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button size="small" onClick={() => handleOpenAssign(mp)}>
                      Assign Sensor
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>
                <TablePagination
                  count={total || 0}
                  page={Math.max(0, page - 1)}
                  rowsPerPage={5}
                  onPageChange={handleChangePage}
                  rowsPerPageOptions={[5]}
                  component="div"
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* Assign Sensor Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        aria-labelledby="assign-sensor-dialog-title"
      >
        <DialogTitle id="assign-sensor-dialog-title">Assign Sensor</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="sensor-label">Sensor Model</InputLabel>
            <Select
              labelId="sensor-label"
              value={sensorModel}
              label="Sensor Model"
              onChange={handleSensorChange}
            >
              <MenuItem value="TcAg">TcAg</MenuItem>
              <MenuItem value="TcAs">TcAs</MenuItem>
              <MenuItem value="HF+">HF+</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssign}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Monitoring Point Dialog */}
      <EditMonitoringPointDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        monitoringPoint={editTarget}
        onSuccess={() => {
          setEditOpen(false);
        }}
      />

      {/* Create Monitoring Point Dialog */}
      <CreateMonitoringPointDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </Box>
  );
};

export default MonitoringPointsPage;