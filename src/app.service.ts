import { OPCUAServer, OPCUAServerOptions } from 'node-opcua';
import { Injectable, Logger } from '@nestjs/common';
import { variables } from './variables';

/**
 * @class AppService
 * @description Main service class for OPC UA server operations
 * @implements Injectable from NestJS for dependency injection
 */
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private server: OPCUAServer;

  /**
   * @private
   * @readonly
   * @description Configuration options for the OPC UA server
   * @type {OPCUAServerOptions}
   */
  private readonly serverConfig: OPCUAServerOptions = {
    port: 4334,
    resourcePath: '/UA/Server',
    buildInfo: {
      productName: 'Node OPCUA Server',
      buildNumber: '1',
      buildDate: new Date(),
    },
  };

  /**
   * @constructor
   * @description Initializes the OPC UA server when service is instantiated
   * @throws {Error} If server initialization fails
   */
  constructor() {
    this.initializeServer().catch((error) => {
      this.logger.error(`Failed to initialize server in constructor: ${error}`);
      throw error;
    });
  }

  /**
   * @private
   * @async
   * @description Initializes the OPC UA server with all necessary configurations and variables
   * @throws {Error} If server initialization or address space setup fails
   */
  private async initializeServer() {
    try {
      this.server = new OPCUAServer(this.serverConfig);

      // Initialize server first
      await this.server.initialize();
      this.logger.log('Server initialized');

      const addressSpace = this.server.engine.addressSpace;
      if (!addressSpace) throw new Error('AddressSpace not initialized');

      /**
       * @description Get namespace for adding nodes
       * @type {Namespace}
       */
      const namespace = addressSpace.getOwnNamespace();

      /**
       * @description Create main device folder structure
       * @type {UAObject}
       */
      const device = namespace.addFolder(addressSpace.rootFolder.objects, {
        browseName: 'MyDevice',
      });

      /**
       * @description Create Simulation folder for holding variables
       * @type {UAObject}
       */
      const simulationFolder = namespace.addFolder(device, {
        browseName: 'Simulation',
        nodeId: 'ns=1;s=Simulation',
      });

      this.logger.log(
        `Adding variables to address space. Total: ${variables.length}`,
      );

      variables.forEach((variable) => {
        namespace.addVariable({
          componentOf: simulationFolder,
          nodeId: variable.nodeId,
          browseName: variable.browseName,
          dataType: variable.dataType,
          minimumSamplingInterval: variable.minimumSamplingInterval,
          value: variable.value,
        });
      });

      /**
       * @description Start server and setup event handlers
       */
      await this.server.start();

      const endpoint = this.server.endpoints[0];
      const endpointUrl = endpoint.endpointDescriptions()[0].endpointUrl;

      this.logger.log(`Server is listening on port ${endpoint.port}`);
      this.logger.log(`Primary endpoint URL: ${endpointUrl}`);

      /**
       * @description Setup event handlers for various server events
       */
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
   * @async
   * @param {number} timeout - Shutdown timeout in milliseconds
   * @returns {Promise<void>}
   * @throws {Error} If shutdown fails
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
