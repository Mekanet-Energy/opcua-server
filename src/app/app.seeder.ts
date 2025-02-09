import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variable } from './entity/variable.entity';
import { randomUUID } from 'crypto';
import { ValueTypeEnum } from './enums';

const InitialVariables: Variable[] = [
  {
    id: randomUUID(),
    browseName: 'Temperature',
    nodeId: 'ns=1;s=Temperature',
    dataType: 'Double',
    minimumSamplingInterval: 100,
    minimum: -50,
    maximum: 100,
    valueType: ValueTypeEnum.Triangle,
  },
  {
    id: randomUUID(),
    browseName: 'Pressure',
    nodeId: 'ns=1;s=Pressure',
    dataType: 'Double',
    minimumSamplingInterval: 100,
    minimum: 0,
    maximum: 200,
    valueType: ValueTypeEnum.Random,
  },
  {
    id: randomUUID(),
    browseName: 'Humidity',
    nodeId: 'ns=1;s=Humidity',
    dataType: 'Double',
    minimumSamplingInterval: 100,
    minimum: 0,
    maximum: 100,
    valueType: ValueTypeEnum.Square,
  },
  {
    id: randomUUID(),
    browseName: 'FlowRate',
    nodeId: 'ns=1;s=FlowRate',
    dataType: 'Double',
    minimumSamplingInterval: 100,
    minimum: 0,
    maximum: 500,
    valueType: ValueTypeEnum.Random,
  },
  {
    id: randomUUID(),
    browseName: 'TankLevel',
    nodeId: 'ns=1;s=TankLevel',
    dataType: 'Double',
    minimumSamplingInterval: 200,
    minimum: 0,
    maximum: 1000,
    valueType: ValueTypeEnum.Triangle,
  },
  {
    id: randomUUID(),
    browseName: 'MotorSpeed',
    nodeId: 'ns=1;s=MotorSpeed',
    dataType: 'Double',
    minimumSamplingInterval: 50,
    minimum: 0,
    maximum: 3000,
    valueType: ValueTypeEnum.Sawtooth,
  },
  {
    id: randomUUID(),
    browseName: 'PowerConsumption',
    nodeId: 'ns=1;s=PowerConsumption',
    dataType: 'Double',
    minimumSamplingInterval: 500,
    minimum: 0,
    maximum: 10000,
    valueType: ValueTypeEnum.Random,
  },
  {
    id: randomUUID(),
    browseName: 'DeviceStatus',
    nodeId: 'ns=1;s=DeviceStatus',
    dataType: 'Boolean',
    minimumSamplingInterval: 1000,
    minimum: 0,
    maximum: 1,
    valueType: ValueTypeEnum.Random,
  },
  {
    id: randomUUID(),
    browseName: 'Vibration',
    nodeId: 'ns=1;s=Vibration',
    dataType: 'Double',
    minimumSamplingInterval: 50,
    minimum: 0,
    maximum: 100,
    valueType: ValueTypeEnum.Triangle,
  },
  {
    id: randomUUID(),
    browseName: 'pH',
    nodeId: 'ns=1;s=pH',
    dataType: 'Double',
    minimumSamplingInterval: 200,
    minimum: 0,
    maximum: 14,
    valueType: ValueTypeEnum.Random,
  },
  {
    id: randomUUID(),
    browseName: 'BeltSpeed',
    nodeId: 'ns=1;s=BeltSpeed',
    dataType: 'Double',
    minimumSamplingInterval: 100,
    minimum: 0,
    maximum: 50,
    valueType: ValueTypeEnum.Triangle,
  },
  {
    id: randomUUID(),
    browseName: 'MaintenanceRequired',
    nodeId: 'ns=1;s=MaintenanceRequired',
    dataType: 'Boolean',
    minimumSamplingInterval: 5000,
    minimum: 0,
    maximum: 1,
    valueType: ValueTypeEnum.Random,
  },
  {
    id: randomUUID(),
    browseName: 'OilPressure',
    nodeId: 'ns=1;s=OilPressure',
    dataType: 'Double',
    minimumSamplingInterval: 200,
    minimum: 0,
    maximum: 150,
    valueType: ValueTypeEnum.Triangle,
  },
  {
    id: randomUUID(),
    browseName: 'AirQuality',
    nodeId: 'ns=1;s=AirQuality',
    dataType: 'Double',
    minimumSamplingInterval: 1000,
    minimum: 0,
    maximum: 500,
    valueType: ValueTypeEnum.Random,
  },
  {
    id: randomUUID(),
    browseName: 'BearingTemperature',
    nodeId: 'ns=1;s=BearingTemperature',
    dataType: 'Double',
    minimumSamplingInterval: 100,
    minimum: 0,
    maximum: 120,
    valueType: ValueTypeEnum.Sawtooth,
  },
  {
    id: randomUUID(),
    browseName: 'CoolingWaterFlow',
    nodeId: 'ns=1;s=CoolingWaterFlow',
    dataType: 'Double',
    minimumSamplingInterval: 150,
    minimum: 0,
    maximum: 100,
    valueType: ValueTypeEnum.Square,
  },
  {
    id: randomUUID(),
    browseName: 'BatteryLevel',
    nodeId: 'ns=1;s=BatteryLevel',
    dataType: 'Double',
    minimumSamplingInterval: 1000,
    minimum: 0,
    maximum: 100,
    valueType: ValueTypeEnum.Triangle,
  },
  {
    id: randomUUID(),
    browseName: 'EmergencyStop',
    nodeId: 'ns=1;s=EmergencyStop',
    dataType: 'Boolean',
    minimumSamplingInterval: 50,
    minimum: 0,
    maximum: 1,
    valueType: ValueTypeEnum.Random,
  },
  {
    id: randomUUID(),
    browseName: 'ProductionRate',
    nodeId: 'ns=1;s=ProductionRate',
    dataType: 'Double',
    minimumSamplingInterval: 500,
    minimum: 0,
    maximum: 1000,
    valueType: ValueTypeEnum.Sawtooth,
  },
  {
    id: randomUUID(),
    browseName: 'ConveyorSpeed',
    nodeId: 'ns=1;s=ConveyorSpeed',
    dataType: 'Double',
    minimumSamplingInterval: 200,
    minimum: 0,
    maximum: 30,
    valueType: ValueTypeEnum.Triangle,
  },
];

@Injectable()
export class VariableSeeder implements OnModuleInit {
  private readonly logger = new Logger(VariableSeeder.name);

  constructor(
    @InjectRepository(Variable)
    private readonly variableRepository: Repository<Variable>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    try {
      this.logger.log('Starting variable seeding...');

      for (const variable of InitialVariables) {
        const existingVariable = await this.variableRepository.findOne({
          where: { nodeId: variable.nodeId },
        });

        if (!existingVariable) {
          await this.variableRepository.save(variable);
          this.logger.log(`Seeded variable: ${variable.browseName}`);
        }
      }

      this.logger.log('Variable seeding completed successfully');
    } catch (error) {
      this.logger.error(`Error during Variable seeding: ${error}`);
      throw error;
    }
  }
}
