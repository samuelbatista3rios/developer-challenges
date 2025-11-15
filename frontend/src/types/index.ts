export type Machine = {
  _id: string;
  name: string;
  type: 'Pump' | 'Fan';
  createdAt?: string;
  updatedAt?: string;
};

export type MonitoringPoint = {
  _id: string;
  name: string;
  machine: Machine | string;
  sensorModel?: 'TcAg' | 'TcAs' | 'HF+';
  createdAt?: string;
  updatedAt?: string;
};
