import { Transaction } from 'src/transactions/transaction.entity';
import { TransactionItem } from 'src/transaction-items/transaction-item.entity';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.requests)
  user: User;

  @ManyToOne(() => Transaction, transaction => transaction.requests)
  transactions: Transaction;

  @OneToOne(() => TransactionItem, transactionItem => transactionItem.request)
  transactionItem: TransactionItem;

  @Column({ name: 'name', nullable: true, default:"" })
  name: string;

  @Column({ name: 'request_type', nullable: false, default:"" })
  requestType: string;

  @Column({ name: 'description', default:"" })
  description: string;

  @Column({ name: 'remarks', default:"" })
  remarks: string;

  @Column({ name: 'hours', default: 0 })
  hours: number;

  @Column({ name: 'status', default: "PENDING" })
  status: string;

  @Column({ name: 'date_created', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ name: 'date_last_updated', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateLastUpdated: Date;

  // @Column({ nullable: false, default: true })
  // image: boolean;
}
