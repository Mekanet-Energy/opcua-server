import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Variable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  browseName: string;

  @Column()
  dataType: string;

  @Column({ unique: true })
  nodeId: string;

  @Column()
  minimumSamplingInterval: number;

  @Column()
  minimum: number;

  @Column()
  maximum: number;

  @Column()
  valueType: ValueType;
}
