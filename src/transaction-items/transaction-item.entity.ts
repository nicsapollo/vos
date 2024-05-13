import { Transaction } from 'src/transactions/transaction.entity';
import { Request } from 'src/request/request.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Menu } from 'src/menu/menu.entity';

@Entity()
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction, transaction => transaction.transactionItems)
  transaction: Transaction;

  @ManyToOne(() => Request, request => request.transactionItems)
  request: Request;

  // @OneToOne(() => Menu, menu => menu.transactionItem)
  // @JoinColumn() // Specify that this entity owns the relationship
  // menu: Menu;

  @Column({ name: 'menuId', nullable: true })
  menuId: number;

  @Column({ nullable: false, default: "HOUR" })
  itemType: string;

  @Column({ nullable: false, default: "UNPAID" })
  status: string;

  @Column({ name: 'quantity', nullable: false })
  quantity: number;

  @Column({ name: 'amount', type: 'decimal', precision: 8, scale: 2, default: 0 }) // Adjust precision and scale as needed
  amount: number;

  @Column({ name: 'date_created', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({ name: 'date_last_updated', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateLastUpdated: Date;

}
