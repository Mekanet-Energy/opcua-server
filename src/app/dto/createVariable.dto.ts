import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EnumValueType } from 'node-opcua';
import { ValueTypeEnum } from '../enums';

export class CreateVariableDto {
  @ApiProperty({
    description:
      'The browseName of the variable that will be displayed in OPC UA browser',
    example: 'Temperature_Sensor_01',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  browseName: string;

  @ApiProperty({
    description: 'The data type of the variable in OPC UA format',
    example: 'Double',
    enum: ['Double', 'Float', 'Int32', 'String'],
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  dataType: string;

  @ApiProperty({
    description:
      'Custom node ID for the variable in OPC UA format. If not provided, one will be auto-generated',
    example: 'ns=1;s=Temperature_Sensor_01',
    required: false,
    type: String,
  })
  @IsString()
  nodeId: string;

  @ApiProperty({
    description: 'Minimum time interval between samples in milliseconds',
    example: 100,
    minimum: 0,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  minimumSamplingInterval: number;

  @ApiProperty({
    description: 'Minimum value the variable can take',
    example: -50,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  minimum: number;

  @ApiProperty({
    description: 'Maximum value the variable can take',
    example: 150,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  maximum: number;

  @ApiProperty({
    description: 'Type of value generation pattern',
    example: ValueTypeEnum.Random,
    enum: ValueTypeEnum,
    enumName: 'ValueType',
    required: true,
  })
  @IsEnum(EnumValueType)
  @IsNotEmpty()
  valueType: ValueType;
}
