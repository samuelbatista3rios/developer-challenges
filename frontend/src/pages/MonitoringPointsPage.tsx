import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Typography,
  TableFooter,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  fetchMonitoringPoints,
  deleteMonitoringPoint,
  assignSensor,
  setPage,
} from "../features/monitoring/monitoringSlice";
import { useEffect, useState } from "react";
import EditMonitoringPointDialog from "../components/EditMonitoringPointDialog";
import CreateMonitoringPointDialog from "../components/CreateMonitoringPointDialog";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";

export default function MonitoringPointsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { items, page, limit, total, loading } = useSelector(
    (s: RootState) => s.monitoring
  );

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState("name");

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);

  const [createOpen, setCreateOpen] = useState(false);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<any>(null);
  const [sensorModel, setSensorModel] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  useEffect(() => {
    dispatch(
      fetchMonitoringPoints({
        page,
        limit,
        sortBy: orderBy,
        order,
      })
    );
  }, [dispatch, page, orderBy, order]);

  const handleSort = (key: string) => {
    setOrder(order === "asc" ? "desc" : "asc");
    setOrderBy(key);
  };

  const columns = [
    { id: "machine", label: "Machine" },
    { id: "mpName", label: "Monitoring Point" },
    { id: "sensorModel", label: "Sensor Model" },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Monitoring Points</Typography>

        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          Novo Monitoring Point
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c.id}>
                  <TableSortLabel
                    active={orderBy === c.id}
                    direction={order}
                    onClick={() => handleSort(c.id)}
                  >
                    {c.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum dado
                </TableCell>
              </TableRow>
            ) : (
              items.map((mp) => (
                <TableRow key={mp._id}>
                  <TableCell>{mp.machineId}</TableCell>
                  <TableCell>{mp.name}</TableCell>
                  <TableCell>{mp.sensorModel ?? "—"}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => {
                        setEditTarget(mp);
                        setEditOpen(true);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      onClick={() => {
                        setAssignTarget(mp);
                        setAssignOpen(true);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Assign Sensor
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      onClick={() => {
                        setDeleteTarget(mp);
                        setDeleteOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                count={total ?? -1}
                page={page - 1}
                onPageChange={(e, p) => dispatch(setPage(p + 1))}
                rowsPerPage={limit}
                rowsPerPageOptions={[limit]}
                labelDisplayedRows={() => `Page ${page}`}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* Assign Sensor */}
      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)}>
        <DialogTitle>Assign Sensor</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Sensor Model</InputLabel>
            <Select
              label="Sensor Model"
              value={sensorModel}
              onChange={(e) => setSensorModel(e.target.value)}
            >
              <MenuItem value="TcAg">TcAg</MenuItem>
              <MenuItem value="TcAs">TcAs</MenuItem>
              <MenuItem value="HF+">HF+</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(
                assignSensor({
                  monitoringPointId: assignTarget._id,
                  sensorModel,
                })
              );
              setAssignOpen(false);
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      <EditMonitoringPointDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        monitoringPoint={editTarget}
      />

      <CreateMonitoringPointDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        target={deleteTarget}
        onConfirm={(id) => dispatch(deleteMonitoringPoint(id))}
      />
    </Box>
  );
}
