import {
  Variant,
  DataType,
  coerceNodeId,
  coerceQualifiedName,
  AddVariableOptions,
} from 'node-opcua';

export const variables: AddVariableOptions[] = [
  {
    browseName: coerceQualifiedName('Temperature'),
    nodeId: coerceNodeId('ns=1;s=Temperature'),
    dataType: DataType.Double,
    minimumSamplingInterval: 1000,
    value: {
      get: () =>
        new Variant({
          dataType: DataType.Double,
          value: Math.random() * 100,
        }),
    },
  },
  {
    browseName: coerceQualifiedName('Pressure'),
    nodeId: coerceNodeId('ns=1;s=Pressure'),
    dataType: DataType.Double,
    minimumSamplingInterval: 1000,
    value: {
      get: () =>
        new Variant({
          dataType: DataType.Double,
          value: Math.random() * 200 + 800, // 800-1000 range for pressure
        }),
    },
  },
  {
    browseName: coerceQualifiedName('Humidity'),
    nodeId: coerceNodeId('ns=1;s=Humidity'),
    dataType: DataType.Double,
    minimumSamplingInterval: 1000,
    value: {
      get: () =>
        new Variant({
          dataType: DataType.Double,
          value: Math.random() * 100,
        }),
    },
  },
  {
    browseName: coerceQualifiedName('Voltage'),
    nodeId: coerceNodeId('ns=1;s=Voltage'),
    dataType: DataType.Double,
    minimumSamplingInterval: 1000,
    value: {
      get: () =>
        new Variant({
          dataType: DataType.Double,
          value: Math.random() * 24, // 0-24V range
        }),
    },
  },
  {
    browseName: coerceQualifiedName('Current'),
    nodeId: coerceNodeId('ns=1;s=Current'),
    dataType: DataType.Double,
    minimumSamplingInterval: 1000,
    value: {
      get: () =>
        new Variant({
          dataType: DataType.Double,
          value: Math.random() * 20, // 0-20mA range
        }),
    },
  },
  {
    browseName: coerceQualifiedName('MotorSpeed'),
    nodeId: coerceNodeId('ns=1;s=MotorSpeed'),
    dataType: DataType.Double,
    minimumSamplingInterval: 1000,
    value: {
      get: () =>
        new Variant({
          dataType: DataType.Double,
          value: Math.random() * 3000, // 0-3000 RPM range
        }),
    },
  },
  {
    browseName: coerceQualifiedName('TankLevel'),
    nodeId: coerceNodeId('ns=1;s=TankLevel'),
    dataType: DataType.Double,
    minimumSamplingInterval: 1000,
    value: {
      get: () =>
        new Variant({
          dataType: DataType.Double,
          value: Math.random() * 100, // 0-100% range
        }),
    },
  },
  {
    browseName: coerceQualifiedName('Vibration'),
    nodeId: coerceNodeId('ns=1;s=Vibration'),
    dataType: DataType.Double,
    minimumSamplingInterval: 1000,
    value: {
      get: () =>
        new Variant({
          dataType: DataType.Double,
          value: Math.random() * 10, // 0-10 mm/s range
        }),
    },
  },
  {
    browseName: coerceQualifiedName('PowerFactor'),
    nodeId: coerceNodeId('ns=1;s=PowerFactor'),
    dataType: DataType.Double,
    minimumSamplingInterval: 1000,
    value: {
      get: () =>
        new Variant({
          dataType: DataType.Double,
          value: 0.8 + Math.random() * 0.2, // 0.8-1.0 range
        }),
    },
  },
  {
    browseName: coerceQualifiedName('MachineStatus'),
    nodeId: coerceNodeId('ns=1;s=MachineStatus'),
    dataType: DataType.Boolean,
    minimumSamplingInterval: 1000,
    value: {
      get: () =>
        new Variant({
          dataType: DataType.Boolean,
          value: Math.random() > 0.1, // 90% chance of being true
        }),
    },
  },
];
