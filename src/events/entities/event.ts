import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length, isDate } from 'class-validator';
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(1, 500)
  name: string;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;
}
