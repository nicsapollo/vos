import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Request } from 'src/request/request.entity';
import { TransactionItem } from 'src/transaction-items/transaction-item.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.transactions)
  user: User;

  @OneToMany(() => Request, request => request.transactions)
  requests: Request[];

  @OneToMany(() => TransactionItem, transactionItem => transactionItem.transaction)
  transactionItems: TransactionItem[];

  // @Column({ name: 'userId', nullable: false })
  // userId: number;

  @Column({ name: 'status', nullable: false, default: 'UNPAID' })
  status: string;

  @Column({ name: 'totalAmount', type: 'decimal', precision: 8, scale: 2, default: 0 }) // Adjust precision and scale as needed
  totalAmount: number;

  @Column({ name: 'date_created', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ name: 'date_end_time', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateEndTime: Date;

  @Column({ name: 'date_last_updated', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateLastUpdated: Date;

  transactionItemsAndMenu: any[];

}
