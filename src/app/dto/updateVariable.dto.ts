import { PartialType } from '@nestjs/swagger';
import { CreateVariableDto } from './createVariable.dto';

export class UpdateVariableDto extends PartialType(CreateVariableDto) {}
