import 'dotenv/config';
import mongoose from 'mongoose';
import { MachineSchema } from '../schemas/machine.schema';
import { MonitoringPointSchema } from '../schemas/monitoring-point.schema';

async function run() {
  const uri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/dynamox';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for seeding');

  const MachineModel = mongoose.model('Machine', MachineSchema);
  const MpModel = mongoose.model('MonitoringPoint', MonitoringPointSchema);

  await MpModel.deleteMany({});
  await MachineModel.deleteMany({});

  console.log(' Cleaned up existing data');

  const pump = await MachineModel.create({ name: 'Pump A', type: 'Pump' });
  const fan = await MachineModel.create({ name: 'Fan X', type: 'Fan' });

  await MpModel.create({ name: 'MP-1', machine: pump._id });
  await MpModel.create({ name: 'MP-2', machine: pump._id });
  await MpModel.create({ name: 'MP-3', machine: fan._id });
  await MpModel.create({ name: 'MP-4', machine: fan._id });

  console.log('Seeding finished successfully!');
  await mongoose.disconnect();
  console.log(' Disconnected from MongoDB');
}

run().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
