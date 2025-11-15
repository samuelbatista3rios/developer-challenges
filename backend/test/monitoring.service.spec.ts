/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MonitoringPointsService } from '../src/monitoring-points/monitoring-points.service';
import { MonitoringPoint } from '../src/schemas/monitoring-point.schema';
import { Machine } from '../src/schemas/machine.schema';

// -------- TYPES -------- //
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type MockExec<T> = {
  exec: jest.Mock<Promise<T>, []>;
};

type MockFindChain<T> = {
  find: jest.Mock;
  populate: jest.Mock;
  sort: jest.Mock;
  skip: jest.Mock;
  limit: jest.Mock;
  exec: jest.Mock<Promise<T>, []>;
};

type MockMonitoringPointDoc = {
  _id: string;
  name: string;
  machine: string;
  save: jest.Mock<Promise<MockMonitoringPointDoc>, []>;
};

// -------- MOCKS -------- //

/**
 * Mock do constructor do Mongoose Model
 * precisa funcionar como "new Model()" e fornecer métodos estáticos.
 */
const mockMpSave = jest.fn<Promise<MockMonitoringPointDoc>, []>();

const MockMpModel = jest
  .fn<MockMonitoringPointDoc, [Partial<MockMonitoringPointDoc>]>()
  .mockImplementation((data) => ({
    _id: 'created-id',
    name: data.name ?? '',
    machine: data.machine ?? '',
    save: mockMpSave,
  }));

// Métodos estáticos usados no service.findAll()
(MockMpModel as unknown as MockFindChain<MonitoringPoint[]>).find = jest
  .fn()
  .mockReturnThis();
(MockMpModel as unknown as MockFindChain<MonitoringPoint[]>).populate = jest
  .fn()
  .mockReturnThis();
(MockMpModel as unknown as MockFindChain<MonitoringPoint[]>).sort = jest
  .fn()
  .mockReturnThis();
(MockMpModel as unknown as MockFindChain<MonitoringPoint[]>).skip = jest
  .fn()
  .mockReturnThis();
(MockMpModel as unknown as MockFindChain<MonitoringPoint[]>).limit = jest
  .fn()
  .mockReturnThis();
(MockMpModel as unknown as MockFindChain<MonitoringPoint[]>).exec = jest.fn();

// mock Machine model
const MockMachineModel = {
  findById: jest.fn(),
};

// -------- TEST SUITE -------- //

describe('MonitoringPointsService', () => {
  let service: MonitoringPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitoringPointsService,
        {
          provide: getModelToken(MonitoringPoint.name),
          useValue: MockMpModel,
        },
        {
          provide: getModelToken(Machine.name),
          useValue: MockMachineModel,
        },
      ],
    }).compile();

    service = module.get<MonitoringPointsService>(MonitoringPointsService);

    jest.clearAllMocks();
  });

  // ------------------------------- //
  it('deve listar monitoring points (findAll)', async () => {
    const fakeItems: MonitoringPoint[] = [
      { _id: '1', name: 'MP-1', machine: {} as any } as MonitoringPoint,
    ];

    (
      MockMpModel as unknown as MockFindChain<MonitoringPoint[]>
    ).exec.mockResolvedValueOnce(fakeItems);

    const result = await service.findAll(1, 5, 'name', 'asc');

    expect(result.items.length).toBe(1);
    expect(result.items[0].name).toBe('MP-1');

    expect(
      (MockMpModel as unknown as MockFindChain<MonitoringPoint[]>).find,
    ).toHaveBeenCalled();
  });

  // ------------------------------- //
  it('deve criar um monitoring point', async () => {
    MockMachineModel.findById.mockResolvedValueOnce({ _id: 'mid' });

    mockMpSave.mockResolvedValueOnce({
      _id: 'mpid',
      name: 'Novo MP',
      machine: 'mid',
      save: mockMpSave,
    });

    const populatedResult = {
      _id: 'mpid',
      name: 'Novo MP',
      machine: { _id: 'mid', name: 'Pump A', type: 'Pump' },
    };

    (MockMpModel as any).findById = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(populatedResult),
      }),
    });

    const dto = { name: 'Novo MP', machineId: 'mid' };

    const result = await service.create(dto);

    expect(result.name).toBe('Novo MP');
    expect(result.machine).toBeDefined();
    expect(MockMachineModel.findById).toHaveBeenCalledWith('mid');
    expect(mockMpSave).toHaveBeenCalled();
  });
});
