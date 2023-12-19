import { IsString, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  readonly name: string;

  @IsDateString()
  readonly startDate: string;

  @IsDateString()
  readonly endDate: string;
}
