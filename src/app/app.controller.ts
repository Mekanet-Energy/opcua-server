import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiConsumes,
  ApiProduces,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { CreateVariableDto } from './dto/createVariable.dto';
import { UpdateVariableDto } from './dto/updateVariable.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Variable } from './entity/variable.entity';

@ApiTags('OPC UA Variables')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Get all variables',
    description:
      'Retrieves a list of all configured OPC UA variables in the system',
  })
  @ApiProduces('application/json')
  @ApiResponse({
    status: 200,
    description: 'List of all variables retrieved successfully',
    type: [CreateVariableDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occurred while fetching variables',
  })
  @Get()
  async getVariables(): Promise<CreateVariableDto[]> {
    return this.appService.getVariables();
  }

  @ApiOperation({
    summary: 'Get a variable by ID',
    description:
      'Retrieves a specific OPC UA variable by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Unique identifier of the variable',
    example: '123e4567-e89b-12d3-a456-426614174000',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiResponse({
    status: 200,
    description: 'Variable found and returned successfully',
    type: CreateVariableDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Variable with specified ID not found',
  })
  @Get(':id')
  async getVariable(@Param('id') id: string): Promise<CreateVariableDto> {
    return this.appService.getVariable(id);
  }

  @ApiOperation({
    summary: 'Create a new variable',
    description:
      'Creates a new OPC UA variable with the specified configuration',
  })
  @ApiBody({
    type: CreateVariableDto,
    description: 'Variable creation data',
    examples: {
      temperature: {
        value: {
          browseName: 'Temperature',
          dataType: 'Double',
          minimumSamplingInterval: 1000,
          nodeId: 'ns=1;s=Temperature',
          minimum: 0,
          maximum: 100,
          valueType: 'Sinusoid',
        },
        summary: 'Temperature sensor example',
      },
      pressure: {
        value: {
          browseName: 'Pressure',
          dataType: 'Double',
          minimumSamplingInterval: 1000,
          nodeId: 'ns=1;s=Pressure',
          minimum: 0,
          maximum: 1000,
          valueType: 'Random',
        },
        summary: 'Pressure sensor example',
      },
      humidity: {
        value: {
          browseName: 'Humidity',
          dataType: 'Double',
          minimumSamplingInterval: 1000,
          nodeId: 'ns=1;s=Humidity',
          minimum: 0,
          maximum: 100,
          valueType: 'Triangle',
        },
        summary: 'Humidity sensor example',
      },
      voltage: {
        value: {
          browseName: 'Voltage',
          dataType: 'Double',
          minimumSamplingInterval: 1000,
          nodeId: 'ns=1;s=Voltage',
          minimum: 0,
          maximum: 240,
          valueType: 'Square',
        },
        summary: 'Voltage sensor example',
      },
      current: {
        value: {
          browseName: 'Current',
          dataType: 'Double',
          minimumSamplingInterval: 1000,
          nodeId: 'ns=1;s=Current',
          minimum: 0,
          maximum: 100,
          valueType: 'Sinusoid',
        },
        summary: 'Current sensor example',
      },
      motorSpeed: {
        value: {
          browseName: 'MotorSpeed',
          dataType: 'Double',
          minimumSamplingInterval: 1000,
          nodeId: 'ns=1;s=MotorSpeed',
          minimum: 0,
          maximum: 3000,
          valueType: 'Sawtooth',
        },
        summary: 'Motor speed sensor example',
      },
      tankLevel: {
        value: {
          browseName: 'TankLevel',
          dataType: 'Double',
          minimumSamplingInterval: 1000,
          nodeId: 'ns=1;s=TankLevel',
          minimum: 0,
          maximum: 100,
          valueType: 'Random',
        },
        summary: 'Tank level sensor example',
      },
      vibration: {
        value: {
          browseName: 'Vibration',
          dataType: 'Double',
          minimumSamplingInterval: 500,
          nodeId: 'ns=1;s=Vibration',
          minimum: 0,
          maximum: 50,
          valueType: 'Triangle',
        },
        summary: 'Vibration sensor example',
      },
      powerFactor: {
        value: {
          browseName: 'PowerFactor',
          dataType: 'Double',
          minimumSamplingInterval: 1000,
          nodeId: 'ns=1;s=PowerFactor',
          minimum: 0,
          maximum: 1,
          valueType: 'Sinusoid',
        },
        summary: 'Power factor sensor example',
      },
      machineStatus: {
        value: {
          browseName: 'MachineStatus',
          dataType: 'Double',
          minimumSamplingInterval: 1000,
          nodeId: 'ns=1;s=MachineStatus',
          minimum: 0,
          maximum: 1,
          valueType: 'Square',
        },
        summary: 'Machine status indicator example',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Variable created successfully',
    type: CreateVariableDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body or validation failed',
  })
  @Post()
  async createVariable(
    @Body() createVariableDto: CreateVariableDto,
  ): Promise<CreateVariableDto> {
    return this.appService.createVariable(createVariableDto);
  }

  @ApiOperation({
    summary: 'Update a variable',
    description: 'Updates an existing OPC UA variable configuration by its ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Unique identifier of the variable to update',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiBody({
    type: UpdateVariableDto,
    description: 'Variable update data',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Variable updated successfully',
    type: CreateVariableDto,
  })
  @ApiResponse({ status: 404, description: 'Variable to update not found' })
  @ApiResponse({ status: 400, description: 'Invalid update data provided' })
  @Put(':id')
  async updateVariable(
    @Param('id') id: string,
    @Body() updateVariableDto: UpdateVariableDto,
  ) {
    return this.appService.updateVariable(id, updateVariableDto);
  }

  @ApiOperation({
    summary: 'Delete a variable',
    description: 'Removes an OPC UA variable from the system',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Unique identifier of the variable to delete',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiResponse({
    status: 200,
    description: 'Variable deleted successfully',
    type: CreateVariableDto,
  })
  @ApiResponse({ status: 404, description: 'Variable not found' })
  @Delete(':id')
  async deleteVariable(@Param('id') id: string) {
    return this.appService.deleteVariable(id);
  }

  @ApiOperation({
    summary: 'Export database to JSON file',
    description: 'Exports all variable configurations to a JSON file',
    tags: ['Database Operations'],
  })
  @ApiProduces('application/json')
  @ApiResponse({
    status: 200,
    description: 'Database exported successfully',
    content: {
      'application/json': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error occurred while exporting database',
  })
  @Get('db/export') // Changed from 'export' to 'db/export'
  async exportDatabase(@Res() res: Response) {
    const { filename, data } = await this.appService.exportDatabase();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    return res.send(data);
  }

  @ApiOperation({
    summary: 'Import database from JSON file',
    description: 'Imports variable configurations from a JSON file',
    tags: ['Database Operations'],
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'JSON file containing variable configurations',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Database imported successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file format or missing file',
  })
  @ApiResponse({
    status: 500,
    description: 'Error occurred while importing database',
  })
  @Post('db/import')
  @UseInterceptors(FileInterceptor('file'))
  async importDatabase(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file?.buffer) {
        throw new BadRequestException('No file uploaded');
      }

      let parsedData: Variable[];
      try {
        parsedData = JSON.parse(file.buffer.toString('utf-8')) as Variable[];
      } catch {
        throw new BadRequestException('Invalid JSON format');
      }

      await this.appService.importDatabase(parsedData);
      return { message: 'Database imported successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to import database');
    }
  }

  @ApiOperation({
    summary: 'Clear all database records',
    description: 'Removes all variable configurations from the database',
    tags: ['Database Operations'],
  })
  @ApiResponse({
    status: 200,
    description: 'Database cleared successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Error occurred while clearing database',
  })
  @Delete('db/clear') // Changed from 'clear' to 'db/clear'
  async clearDatabase() {
    await this.appService.clearDatabase();
    return { message: 'Database cleared successfully' };
  }
}
