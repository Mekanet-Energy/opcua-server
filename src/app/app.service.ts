import {
  coerceNodeId,
  coerceQualifiedName,
  OPCUAServer,
  OPCUAServerOptions,
  Variant,
} from 'node-opcua';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Variable } from './entity/variable.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { CreateVariableDto } from './dto/createVariable.dto';
import { UpdateVariableDto } from './dto/updateVariable.dto';
import { Namespace, UAObject } from 'node-opcua';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private server: OPCUAServer;

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(Variable)
    private variableRepository: Repository<Variable>,
  ) {
    this.initializeServer().catch((error) => {
      this.logger.error(`Failed to initialize server in constructor: ${error}`);
      throw error;
    });
  }

  async reInitializeServer(): Promise<void> {
    try {
      await this.shutdown();
      await this.initializeServer();
      this.logger.log('Server reinitialized successfully');
    } catch (error) {
      this.logger.error(`Failed to reinitialize server: ${error}`);
      throw error;
    }
  }

  async getVariables(): Promise<CreateVariableDto[]> {
    const variables = await this.variableRepository.find();
    return variables;
  }

  async getVariable(id: string): Promise<CreateVariableDto> {
    const variable = await this.variableRepository.findOne({
      where: { id },
    });
    if (!variable) {
      throw new NotFoundException(`Variable with ID ${id} not found`);
    }
    return variable;
  }

  async createVariable(
    createVariableDto: CreateVariableDto,
  ): Promise<CreateVariableDto> {
    // Check for existing variable with same browseName
    const existingByBrowseName = await this.variableRepository.findOne({
      where: { browseName: createVariableDto.browseName },
    });

    if (existingByBrowseName) {
      throw new ConflictException(
        `Variable with browseName "${createVariableDto.browseName}" already exists`,
      );
    }

    // Check for existing variable with same nodeId if provided
    if (createVariableDto.nodeId) {
      const existingByNodeId = await this.variableRepository.findOne({
        where: { nodeId: createVariableDto.nodeId },
      });

      if (existingByNodeId) {
        throw new ConflictException(
          `Variable with nodeId "${createVariableDto.nodeId}" already exists`,
        );
      }
    }

    const variable = this.variableRepository.create({
      browseName: createVariableDto.browseName,
      dataType: createVariableDto.dataType,
      nodeId:
        createVariableDto.nodeId || `ns=1;s=${createVariableDto.browseName}`,
      minimumSamplingInterval: createVariableDto.minimumSamplingInterval,
      minimum: createVariableDto.minimum,
      maximum: createVariableDto.maximum,
      valueType: createVariableDto.valueType,
    });
    const savedVariable = await this.variableRepository.save(variable);
    await this.reInitializeServer();
    return savedVariable;
  }

  async updateVariable(id: string, updateVariableDto: UpdateVariableDto) {
    const variable = await this.variableRepository.findOne({
      where: { id },
    });
    if (!variable) {
      throw new NotFoundException(`Variable with ID ${id} not found`);
    }

    // Check for conflicts with browseName if it's being updated
    if (updateVariableDto.browseName) {
      const existingByBrowseName = await this.variableRepository.findOne({
        where: {
          browseName: updateVariableDto.browseName,
          id: Not(id), // Exclude current variable from check
        },
      });

      if (existingByBrowseName) {
        throw new ConflictException(
          `Variable with browseName "${updateVariableDto.browseName}" already exists`,
        );
      }
    }

    // Check for conflicts with nodeId if it's being updated
    if (updateVariableDto.nodeId) {
      const existingByNodeId = await this.variableRepository.findOne({
        where: {
          nodeId: updateVariableDto.nodeId,
          id: Not(id), // Exclude current variable from check
        },
      });

      if (existingByNodeId) {
        throw new ConflictException(
          `Variable with nodeId "${updateVariableDto.nodeId}" already exists`,
        );
      }
    }

    const updatedVariable = await this.variableRepository.save({
      ...variable,
      ...updateVariableDto,
    });
    await this.reInitializeServer();
    return updatedVariable;
  }

  async deleteVariable(id: string): Promise<void> {
    await this.variableRepository.delete(id);
    await this.reInitializeServer();
  }

  private readonly serverConfig: OPCUAServerOptions = {
    port: 4334,
    resourcePath: '/UA/Server',
    buildInfo: {
      productName: 'Node OPCUA Server',
      buildNumber: '1',
      buildDate: new Date(),
    },
  };

  private async initializeServer(): Promise<void> {
    try {
      this.server = new OPCUAServer(this.serverConfig);

      await this.server.initialize();
      this.logger.log('Server initialized');

      const addressSpace = this.server.engine.addressSpace;
      if (!addressSpace) throw new Error('AddressSpace not initialized');

      const namespace: Namespace = addressSpace.getOwnNamespace();

      const device: UAObject = namespace.addFolder(
        addressSpace.rootFolder.objects,
        {
          browseName: 'MyDevice',
        },
      );

      const simulationFolder: UAObject = namespace.addFolder(device, {
        browseName: 'Simulation',
        nodeId: 'ns=1;s=Simulation',
      });
      const variables = await this.getVariables();

      this.logger.log(
        `Adding variables to address space. Total: ${variables.length}`,
      );

      variables.forEach((variable) => {
        const newVariable = namespace.addVariable({
          componentOf: simulationFolder,
          browseName: coerceQualifiedName(variable.browseName),
          nodeId: coerceNodeId(variable.nodeId),
          dataType: variable.dataType,
          minimumSamplingInterval: variable.minimumSamplingInterval,
          accessLevel: 'CurrentRead', // Okuma iznini açıkça belirtiyoruz
          userAccessLevel: 'CurrentRead', // Kullanıcı okuma iznini açıkça belirtiyoruz
        });

        if (newVariable.bindVariable) {
          const valueBinding = {
            get: () => {
              const min = variable.minimum ?? 0;
              const max = variable.maximum ?? 100;
              let value: number | boolean;

              // Handle boolean data type specifically
              if (variable.dataType === 'Boolean') {
                value = this.generateBooleanValue();
              } else {
                // Handle numeric values as before
                switch (variable.valueType) {
                  case 'Random':
                    value = this.generateRandomValue(min, max);
                    break;
                  case 'Sawtooth':
                    value = this.generateSawtoothValue(min, max);
                    break;
                  case 'Sinusoid':
                    value = this.generateSinusoidValue(min, max);
                    break;
                  case 'Square':
                    value = this.generateSquareValue(min, max);
                    break;
                  case 'Triangle':
                    value = this.generateTriangleValue(min, max);
                    break;
                  default:
                    value = min;
                }
              }

              return new Variant({
                dataType: variable.dataType,
                value: value,
              });
            },
          };

          newVariable.bindVariable(valueBinding);
        }
      });

      await this.server.start();

      const endpoint = this.server.endpoints[0];
      const endpointUrl = endpoint.endpointDescriptions()[0].endpointUrl;

      this.logger.log(`Server is listening on port ${endpoint.port}`);
      this.logger.log(`Primary endpoint URL: ${endpointUrl}`);
      this.server.on('error', (err) => {
        this.logger.error(`Server error: ${err}`);
      });
      this.server.on('post_initialize', () => {
        this.logger.log('Server initialized successfully');
      });
      this.server.on('newChannel', (channel) => {
        this.logger.log(`New channel established - ID: ${channel.channelId}`);
      });
      this.server.on('close', () => {
        this.logger.log('Server closed');
      });
      this.server.on('post_shutdown', () => {
        this.logger.log('Server shutdown completed');
      });
      this.server.on('serverError', (err) => {
        this.logger.error(`Server error: ${err}`);
      });
    } catch (error) {
      this.logger.error(`Failed to initialize OPC UA server: ${error}`);
      throw error;
    }
  }

  async shutdown(): Promise<void> {
    try {
      await this.server.shutdown();
      this.logger.log('Server shutdown completed successfully');
    } catch (error) {
      this.logger.error(`Failed to shutdown server: ${error}`);
      throw error;
    }
  }

  generateRandomValue(min: number = 0, max: number = 100): number {
    return Math.random() * (max - min) + min;
  }

  generateSawtoothValue(min: number, max: number): number {
    const amplitude = (max - min) / 2;
    const offset = min + amplitude;
    const phase = Date.now() / 1000; // Current time in seconds
    return ((2 * amplitude) / Math.PI) * Math.atan(Math.tan(phase)) + offset;
  }

  generateSinusoidValue(min: number, max: number): number {
    const amplitude = (max - min) / 2;
    const offset = min + amplitude;
    const phase = Date.now() / 1000;
    return amplitude * Math.sin(phase) + offset;
  }

  generateSquareValue(min: number, max: number): number {
    const phase = Date.now() / 1000;
    return Math.sin(phase) >= 0 ? max : min;
  }

  generateTriangleValue(min: number, max: number): number {
    const amplitude = (max - min) / 2;
    const offset = min + amplitude;
    const phase = Date.now() / 1000;
    return ((2 * amplitude) / Math.PI) * Math.asin(Math.sin(phase)) + offset;
  }

  // Add this new method for boolean value generation
  generateBooleanValue(): boolean {
    return Math.random() < 0.5;
  }

  async exportDatabase() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.json`;

    try {
      const repository = this.dataSource.getRepository('Variable');
      const variables = await repository.find();
      return {
        filename,
        data: variables,
      };
    } catch (error) {
      throw new Error(`Database export failed: ${error}`);
    }
  }

  async importDatabase(data: Variable[]) {
    try {
      await this.clearDatabase();
      await this.variableRepository.save(data);
      await this.reInitializeServer();
    } catch (error) {
      throw new Error(`Database import failed: ${error}`);
    }
  }

  async clearDatabase(): Promise<void> {
    try {
      await this.variableRepository.clear();
      await this.reInitializeServer();
    } catch (error) {
      throw new Error(`Failed to clear database: ${error}`);
    }
  }
}
