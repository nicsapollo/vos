import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'status', nullable: false, default: 'UNPAID' })
  status: string;

  @Column({ name: 'totalAmount', default: () => 0 })
  totalAmount: number;

  @Column({ name: 'date_created', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ name: 'date_end_time', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateEndTime: Date;

  @Column({ name: 'date_last_updated', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateLastUpdated: Date;

}
