import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.transactions)
  user: User;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'status', nullable: false, default: 'UNPAID' })
  status: string;

  @Column({ name: 'totalAmount', default: 159 })
  totalAmount: number;

  @Column({ name: 'date_created', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ name: 'date_end_time', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateEndTime: Date;

  @Column({ name: 'date_last_updated', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateLastUpdated: Date;

}
