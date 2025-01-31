import { OPCUAServer, OPCUAServerOptions, Variant, DataType } from 'node-opcua';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private server: OPCUAServer;
  private readonly serverConfig: OPCUAServerOptions = {
    port: 4334,
    resourcePath: '/UA/Server',
    buildInfo: {
      productName: 'Node OPCUA Server',
      buildNumber: '1',
      buildDate: new Date(),
    },
  };

  constructor() {
    this.initializeServer().catch((error) => {
      this.logger.error(`Failed to initialize server in constructor: ${error}`);
      throw error;
    });
  }

  private async initializeServer() {
    try {
      this.server = new OPCUAServer(this.serverConfig);

      // Initialize server first
      await this.server.initialize();
      this.logger.log('Server initialized');

      const addressSpace = this.server.engine.addressSpace;
      if (!addressSpace) throw new Error('AddressSpace not initialized');

      const namespace = addressSpace.getOwnNamespace();

      // Create device as a folder under Objects folder
      const device = namespace.addFolder(addressSpace.rootFolder.objects, {
        browseName: 'MyDevice',
      });

      // Create Simulation folder under device with proper nodeId format
      const simulationFolder = namespace.addFolder(device, {
        browseName: 'Simulation',
        nodeId: 'ns=1;s=Simulation',
      });

      // Create multiple variables under simulation folder
      namespace.addVariable({
        componentOf: simulationFolder,
        browseName: 'Temperature',
        nodeId: 'ns=1;s=Temperature',
        dataType: 'Double',
        minimumSamplingInterval: 1000,
        value: {
          get: () =>
            new Variant({
              dataType: DataType.Double,
              value: Math.random() * 100,
            }),
        },
      });

      namespace.addVariable({
        componentOf: simulationFolder,
        browseName: 'Pressure',
        nodeId: 'ns=1;s=Pressure',
        dataType: 'Double',
        minimumSamplingInterval: 1000,
        value: {
          get: () =>
            new Variant({
              dataType: DataType.Double,
              value: Math.random() * 200 + 800, // 800-1000 range for pressure
            }),
        },
      });

      namespace.addVariable({
        componentOf: simulationFolder,
        browseName: 'Humidity',
        nodeId: 'ns=1;s=Humidity',
        dataType: 'Double',
        minimumSamplingInterval: 1000,
        value: {
          get: () =>
            new Variant({
              dataType: DataType.Double,
              value: Math.random() * 100, // 0-100 range for humidity percentage
            }),
        },
      });

      namespace.addVariable({
        componentOf: simulationFolder,
        browseName: 'FlowRate',
        nodeId: 'ns=1;s=FlowRate',
        dataType: 'Double',
        minimumSamplingInterval: 1000,
        value: {
          get: () =>
            new Variant({
              dataType: DataType.Double,
              value: Math.random() * 50, // 0-50 range for flow rate
            }),
        },
      });

      namespace.addVariable({
        componentOf: simulationFolder,
        browseName: 'Status',
        nodeId: 'ns=1;s=Status',
        dataType: 'Boolean',
        minimumSamplingInterval: 1000,
        value: {
          get: () =>
            new Variant({
              dataType: DataType.Boolean,
              value: Math.random() > 0.5, // Random boolean value
            }),
        },
      });

      // Start the server after initialization and setup
      await this.server.start();

      const endpoint = this.server.endpoints[0];
      const endpointUrl = endpoint.endpointDescriptions()[0].endpointUrl;

      this.logger.log(`Server is listening on port ${endpoint.port}`);
      this.logger.log(`Primary endpoint URL: ${endpointUrl}`);

      // Add error event handler
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
    } catch (error) {
      this.logger.error(`Failed to initialize OPC UA server: ${error}`);
      throw error;
    }
  }

  /**
   * Gracefully shuts down the OPC UA server
   * @param timeout Shutdown timeout in milliseconds
   * @returns Promise<void>
   */
  async shutdown(timeout = 1000): Promise<void> {
    try {
      await this.server.shutdown(timeout);
      this.logger.log('Server shutdown completed successfully');
    } catch (error) {
      this.logger.error(`Failed to shutdown server: ${error}`);
      throw error;
    }
  }
}
